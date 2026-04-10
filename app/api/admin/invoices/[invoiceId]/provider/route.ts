import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createActivityLog } from "@/lib/activity-log";
import {
  getInvoiceById,
  linkInvoiceProviderReferences,
  updateInvoiceStatus,
} from "@/lib/invoices-store";
import {
  createGoCardlessBillingRequestForInvoice,
  createStripeInvoiceForLocalInvoice,
  removeStripeInvoice,
} from "@/lib/payment-provider-clients";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { invoiceId } = await params;
  const invoice = await getInvoiceById(invoiceId);

  if (!invoice) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/invoices"), 303);
  }

  const formData = await request.formData();
  const provider = String(formData.get("provider") ?? "").trim();

  try {
    if (provider === "stripe") {
      if (invoice.stripeInvoiceId) {
        await removeStripeInvoice(invoice.stripeInvoiceId);
      }

      const result = await createStripeInvoiceForLocalInvoice({
        clientId: invoice.customerId,
        invoiceId: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        description: invoice.notes || invoice.invoiceNumber,
        dueDate: invoice.dueDate,
        currency: invoice.currency,
        lineItems: invoice.lineItems,
      });

      await linkInvoiceProviderReferences(invoice.invoiceId, {
        stripeInvoiceId: result.stripeInvoiceId,
        stripeHostedInvoiceUrl: result.hostedInvoiceUrl,
      });
      await updateInvoiceStatus(invoice.invoiceId, "sent");
      await createActivityLog({
        entityType: "invoice",
        entityId: invoice.invoiceId,
        actionType: "stripe_invoice_created",
        description: `Stripe invoice created for ${invoice.invoiceNumber}.`,
      });
    } else if (provider === "gocardless") {
      if (invoice.gocardlessBillingRequestId) {
        return NextResponse.redirect(
          toAbsoluteRedirect(request, `/admin/invoices/${invoice.invoiceId}`),
          303
        );
      }

      const result = await createGoCardlessBillingRequestForInvoice({
        clientId: invoice.customerId,
        invoiceId: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        description: invoice.notes || invoice.invoiceNumber,
        total: invoice.total,
        currency: invoice.currency,
      });

      await linkInvoiceProviderReferences(invoice.invoiceId, {
        gocardlessBillingRequestId: result.billingRequestId,
        gocardlessPaymentUrl: result.paymentUrl,
      });
      await updateInvoiceStatus(invoice.invoiceId, "sent");
      await createActivityLog({
        entityType: "invoice",
        entityId: invoice.invoiceId,
        actionType: "gocardless_billing_request_created",
        description: `GoCardless billing request created for ${invoice.invoiceNumber}.`,
      });
    } else {
      return NextResponse.redirect(
        toAbsoluteRedirect(request, `/admin/invoices/${invoice.invoiceId}?error=invalid-provider`),
        303
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Provider sync failed.";
    return NextResponse.redirect(
      toAbsoluteRedirect(
        request,
        `/admin/invoices/${invoice.invoiceId}?error=${encodeURIComponent(message)}`
      ),
      303
    );
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/invoices/${invoice.invoiceId}`),
    303
  );
}
