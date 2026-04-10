import { NextResponse } from "next/server";

import {
  findInvoiceForGoCardlessPayload,
  linkInvoiceProviderReferences,
  recordInvoicePayment,
  updateInvoiceStatus,
} from "@/lib/invoices-store";
import {
  getPaymentProviderEvent,
  upsertPaymentProviderEventLog,
} from "@/lib/payment-provider-events";
import { getAppSettings } from "@/lib/settings-store";
import { verifyGoCardlessSignature } from "@/lib/webhook-signatures";

type GoCardlessWebhookEvent = {
  id?: string;
  action?: string;
  resource_type?: string;
  details?: {
    origin?: string;
    description?: string;
  };
  links?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

type GoCardlessWebhookBody = {
  events?: GoCardlessWebhookEvent[];
};

function getStringValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

export async function POST(request: Request) {
  const signature = request.headers.get("webhook-signature") || "";
  const payload = await request.text();
  const settings = await getAppSettings();
  const secret = settings.gocardlessWebhookSecret;

  if (!secret || !signature || !verifyGoCardlessSignature(payload, signature, secret)) {
    await upsertPaymentProviderEventLog({
      provider: "gocardless",
      eventId: "unknown",
      eventType: "unknown",
      status: "invalid_signature",
      payload,
      receivedAt: new Date().toISOString(),
      failureReason: "Signature verification failed.",
    });

    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const body = JSON.parse(payload) as GoCardlessWebhookBody;
  const events = body.events ?? [];

  for (const event of events) {
    const eventId = event.id || "unknown";
    const eventType = event.action || "unknown";
    const existing = await getPaymentProviderEvent("gocardless", eventId);

    if (existing?.status === "processed") {
      continue;
    }

    await upsertPaymentProviderEventLog({
      provider: "gocardless",
      eventId,
      eventType,
      status: "received",
      payload: JSON.stringify(event),
      receivedAt: new Date().toISOString(),
    });

    const metadata = event.metadata ?? {};
    const invoice = await findInvoiceForGoCardlessPayload({
      invoiceId: getStringValue(metadata.invoiceId),
      invoiceNumber: getStringValue(metadata.invoiceNumber),
      gocardlessPaymentId:
        getStringValue(event.links?.payment) || getStringValue(event.links?.subscription),
    });

    if (!invoice) {
      await upsertPaymentProviderEventLog({
        provider: "gocardless",
        eventId,
        eventType,
        status: "ignored",
        payload: JSON.stringify(event),
        receivedAt: existing?.receivedAt || new Date().toISOString(),
        processedAt: new Date().toISOString(),
        failureReason: "No matching local invoice found.",
      });
      continue;
    }

    const paymentReference =
      getStringValue(event.links?.payment) || getStringValue(event.links?.subscription);

    if (paymentReference) {
      await linkInvoiceProviderReferences(invoice.invoiceId, {
        gocardlessPaymentId: paymentReference,
      });
    }

    if (eventType === "payment_confirmed") {
      await recordInvoicePayment(invoice.invoiceId, invoice.balanceDue);
    } else if (eventType === "payment_failed" || eventType === "payment_cancelled") {
      await updateInvoiceStatus(invoice.invoiceId, "unpaid");
    } else if (eventType === "subscription_created" || eventType === "mandate_created") {
      await upsertPaymentProviderEventLog({
        provider: "gocardless",
        eventId,
        eventType,
        status: "ignored",
        invoiceId: invoice.invoiceId,
        payload: JSON.stringify(event),
        receivedAt: existing?.receivedAt || new Date().toISOString(),
        processedAt: new Date().toISOString(),
        failureReason: "Recorded but does not directly change invoice status.",
      });
      continue;
    } else if (eventType === "subscription_cancelled") {
      await updateInvoiceStatus(invoice.invoiceId, "cancelled");
    } else {
      await upsertPaymentProviderEventLog({
        provider: "gocardless",
        eventId,
        eventType,
        status: "ignored",
        invoiceId: invoice.invoiceId,
        payload: JSON.stringify(event),
        receivedAt: existing?.receivedAt || new Date().toISOString(),
        processedAt: new Date().toISOString(),
        failureReason: "Event type not handled.",
      });
      continue;
    }

    await upsertPaymentProviderEventLog({
      provider: "gocardless",
      eventId,
      eventType,
      status: "processed",
      invoiceId: invoice.invoiceId,
      payload: JSON.stringify(event),
      receivedAt: existing?.receivedAt || new Date().toISOString(),
      processedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ received: true });
}
