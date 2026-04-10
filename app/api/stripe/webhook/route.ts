import { NextResponse } from "next/server";

import {
  findInvoiceForStripePayload,
  linkInvoiceProviderReferences,
  recordInvoicePayment,
  updateInvoiceStatus,
} from "@/lib/invoices-store";
import {
  getPaymentProviderEvent,
  upsertPaymentProviderEventLog,
} from "@/lib/payment-provider-events";
import { getAppSettings } from "@/lib/settings-store";
import { verifyStripeSignature } from "@/lib/webhook-signatures";

type StripeEventEnvelope = {
  id?: string;
  type?: string;
  data?: {
    object?: Record<string, unknown>;
  };
};

function getStringValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function getMetadataValue(
  source: Record<string, unknown> | undefined,
  key: string
) {
  const metadata = source?.metadata;

  if (!metadata || typeof metadata !== "object") {
    return undefined;
  }

  return getStringValue((metadata as Record<string, unknown>)[key]);
}

function getNumericValue(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();
  const settings = await getAppSettings();
  const secret = settings.stripeWebhookSecret;

  if (!secret || !signature || !verifyStripeSignature(payload, signature, secret)) {
    let eventId = "unknown";
    let eventType = "unknown";

    try {
      const parsed = JSON.parse(payload) as StripeEventEnvelope;
      eventId = parsed.id || eventId;
      eventType = parsed.type || eventType;
    } catch {
      // Keep fallback values for invalid payloads.
    }

    await upsertPaymentProviderEventLog({
      provider: "stripe",
      eventId,
      eventType,
      status: "invalid_signature",
      payload,
      receivedAt: new Date().toISOString(),
      failureReason: "Signature verification failed.",
    });

    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(payload) as StripeEventEnvelope;
  const eventId = event.id || "unknown";
  const eventType = event.type || "unknown";
  const existing = await getPaymentProviderEvent("stripe", eventId);

  if (existing?.status === "processed") {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const object = (event.data?.object ?? {}) as Record<string, unknown>;
  const nestedInvoiceReference = getStringValue(object.invoice);
  const stripeInvoiceId =
    eventType.startsWith("invoice.") ? getStringValue(object.id) : nestedInvoiceReference;
  const metadataInvoiceId = getMetadataValue(object, "invoiceId");
  const metadataInvoiceNumber = getMetadataValue(object, "invoiceNumber");
  const eventInvoiceNumber =
    getStringValue(object.number) || getStringValue(object.invoice_number);

  await upsertPaymentProviderEventLog({
    provider: "stripe",
    eventId,
    eventType,
    status: "received",
    payload,
    receivedAt: new Date().toISOString(),
  });

  const invoice = await findInvoiceForStripePayload({
    invoiceId: metadataInvoiceId,
    invoiceNumber: metadataInvoiceNumber || eventInvoiceNumber,
    stripeInvoiceId,
  });

  if (!invoice) {
    await upsertPaymentProviderEventLog({
      provider: "stripe",
      eventId,
      eventType,
      status: "ignored",
      payload,
      receivedAt: existing?.receivedAt || new Date().toISOString(),
      processedAt: new Date().toISOString(),
      failureReason: "No matching local invoice found.",
    });

    return NextResponse.json({ received: true, ignored: true });
  }

  if (stripeInvoiceId) {
    await linkInvoiceProviderReferences(invoice.invoiceId, { stripeInvoiceId });
  }

  if (eventType === "invoice.finalized") {
    await updateInvoiceStatus(invoice.invoiceId, "sent");
  } else if (eventType === "invoice.paid") {
    const amountPaid =
      getNumericValue(object.amount_paid) !== undefined
        ? (getNumericValue(object.amount_paid) ?? 0) / 100
        : invoice.balanceDue;
    const statusTransitions =
      object.status_transitions &&
      typeof object.status_transitions === "object"
        ? (object.status_transitions as Record<string, unknown>)
        : undefined;
    const paidAtTimestamp = getNumericValue(statusTransitions?.paid_at);
    const paidDate = paidAtTimestamp
      ? new Date(paidAtTimestamp * 1000).toISOString().slice(0, 10)
      : undefined;
    await recordInvoicePayment(invoice.invoiceId, amountPaid, paidDate);
  } else if (eventType === "invoice.payment_failed") {
    await updateInvoiceStatus(invoice.invoiceId, "unpaid");
  } else if (eventType === "charge.refunded") {
    await updateInvoiceStatus(invoice.invoiceId, "refunded");
  } else {
    await upsertPaymentProviderEventLog({
      provider: "stripe",
      eventId,
      eventType,
      status: "ignored",
      invoiceId: invoice.invoiceId,
      payload,
      receivedAt: existing?.receivedAt || new Date().toISOString(),
      processedAt: new Date().toISOString(),
      failureReason: "Event type not handled.",
    });

    return NextResponse.json({ received: true, ignored: true });
  }

  await upsertPaymentProviderEventLog({
    provider: "stripe",
    eventId,
    eventType,
    status: "processed",
    invoiceId: invoice.invoiceId,
    payload,
    receivedAt: existing?.receivedAt || new Date().toISOString(),
    processedAt: new Date().toISOString(),
  });

  return NextResponse.json({ received: true });
}
