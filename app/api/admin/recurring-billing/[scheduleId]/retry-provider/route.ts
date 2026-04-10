import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getRecurringInvoiceScheduleById,
} from "@/lib/recurring-billing-store";
import {
  linkInvoiceProviderReferences,
  listInvoicesByRecurringScheduleId,
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
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { scheduleId } = await params;
  const schedule = await getRecurringInvoiceScheduleById(scheduleId);

  if (!schedule) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/recurring-billing?error=recurring-schedule-not-found"),
      303
    );
  }

  const invoices = await listInvoicesByRecurringScheduleId(scheduleId);
  const invoice = invoices.find((item) =>
    ["draft", "sent", "unpaid", "partially_paid", "overdue"].includes(item.status)
  );

  if (!invoice) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/recurring-billing?error=no-retryable-invoice"),
      303
    );
  }

  try {
    if (schedule.billingProvider === "stripe") {
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
    } else if (schedule.billingProvider === "gocardless") {
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
    } else {
      return NextResponse.redirect(
        toAbsoluteRedirect(request, "/admin/recurring-billing?error=manual-schedules-have-no-provider-retry"),
        303
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "provider-retry-failed";
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/recurring-billing?error=${encodeURIComponent(message)}`),
      303
    );
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, "/admin/recurring-billing?saved=provider-retry"),
    303
  );
}
