import { readFile } from "node:fs/promises";
import path from "node:path";

import { createActivityLog } from "@/lib/activity-log";
import { getClientById } from "@/lib/clients-store";
import { formatDisplayDate } from "@/lib/date-format";
import { ensureInvoicePdfPath } from "@/lib/document-generation";
import { createEmailLog } from "@/lib/email-logs-store";
import {
  buildInvoiceEmailTemplate,
  buildOverdueInvoiceEmailTemplate,
  buildPaymentConfirmationEmailTemplate,
  buildRecurringInvoiceCreatedEmailTemplate,
} from "@/lib/email-templates";
import { getInvoiceById, updateInvoiceStatus } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { toBase64 } from "@/lib/payment-provider-clients";
import { buildPublicInvoiceUrl } from "@/lib/public-invoice-links";
import { toPublicUrl } from "@/lib/public-site";
import { sendResendEmail } from "@/lib/resend-email";

export type InvoiceEmailTemplateType =
  | "invoice_sent"
  | "invoice_overdue_reminder"
  | "invoice_payment_confirmation"
  | "recurring_invoice_created";

function buildEmailSubject(template: InvoiceEmailTemplateType, invoiceNumber: string) {
  switch (template) {
    case "invoice_overdue_reminder":
      return `Reminder: invoice ${invoiceNumber} is overdue`;
    case "invoice_payment_confirmation":
      return `Payment received for invoice ${invoiceNumber}`;
    case "recurring_invoice_created":
      return `Recurring invoice ${invoiceNumber} from Outbreak LTD`;
    default:
      return `Invoice ${invoiceNumber} from Outbreak LTD`;
  }
}

export async function sendInvoiceEmailTemplate(
  invoiceId: string,
  template: InvoiceEmailTemplateType
) {
  const invoice = await getInvoiceById(invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  const customer = await getClientById(invoice.customerId);

  if (!customer?.email) {
    throw new Error("Missing customer email.");
  }

  const ensured = await ensureInvoicePdfPath(invoice.invoiceId);
  const hostedInvoiceUrl = buildPublicInvoiceUrl(invoice.invoiceId);
  const pdfUrl = toPublicUrl(ensured.pdfPath);
  const attachments = [
    {
      fileName: `${ensured.invoice.invoiceNumber}.pdf`,
      contentBase64: toBase64(
        await readFile(path.join(process.cwd(), "public", ensured.pdfPath.replace(/^\//, "")))
      ),
      contentType: "application/pdf",
    },
  ];

  const subject = buildEmailSubject(template, invoice.invoiceNumber);
  const html =
    template === "invoice_overdue_reminder"
      ? buildOverdueInvoiceEmailTemplate({
          recipientName: customer.contactName || customer.businessName,
          invoiceNumber: invoice.invoiceNumber,
          total: formatMoney(invoice.balanceDue, invoice.currency),
          dueDate: formatDisplayDate(invoice.dueDate),
          viewInvoiceHref: hostedInvoiceUrl,
          paymentHref: invoice.stripeHostedInvoiceUrl || invoice.gocardlessPaymentUrl,
        })
      : template === "invoice_payment_confirmation"
        ? buildPaymentConfirmationEmailTemplate({
            recipientName: customer.contactName || customer.businessName,
            invoiceNumber: invoice.invoiceNumber,
            totalPaid: formatMoney(invoice.amountPaid || invoice.total, invoice.currency),
            paidDate: invoice.paidDate ? formatDisplayDate(invoice.paidDate) : undefined,
            viewInvoiceHref: hostedInvoiceUrl,
            pdfHref: pdfUrl,
          })
        : template === "recurring_invoice_created"
          ? buildRecurringInvoiceCreatedEmailTemplate({
              recipientName: customer.contactName || customer.businessName,
              invoiceNumber: invoice.invoiceNumber,
              total: formatMoney(invoice.total, invoice.currency),
              dueDate: formatDisplayDate(invoice.dueDate),
              viewInvoiceHref: hostedInvoiceUrl,
              paymentHref: invoice.stripeHostedInvoiceUrl || invoice.gocardlessPaymentUrl,
              pdfHref: pdfUrl,
            })
          : buildInvoiceEmailTemplate({
              recipientName: customer.contactName || customer.businessName,
              invoiceNumber: invoice.invoiceNumber,
              total: formatMoney(invoice.total, invoice.currency),
              dueDate: formatDisplayDate(invoice.dueDate),
              viewInvoiceHref: hostedInvoiceUrl,
              paymentHref: invoice.stripeHostedInvoiceUrl || invoice.gocardlessPaymentUrl,
              pdfHref: pdfUrl,
            });

  try {
    const result = await sendResendEmail({
      to: customer.email,
      subject,
      html,
      attachments,
    });

    await createEmailLog({
      entityType: "invoice",
      entityId: invoice.invoiceId,
      recipient: customer.email,
      subject,
      templateUsed: template,
      deliveryStatus: "sent",
      provider: "resend",
      providerMessageId: result.id,
    });

    if (template === "invoice_sent" && invoice.status === "draft") {
      await updateInvoiceStatus(invoice.invoiceId, "sent");
    }

    await createActivityLog({
      entityType: "invoice",
      entityId: invoice.invoiceId,
      actionType: "invoice_emailed",
      description: `Invoice ${invoice.invoiceNumber} email sent to ${customer.email}.`,
      metadata: {
        template,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email send failed.";
    await createEmailLog({
      entityType: "invoice",
      entityId: invoice.invoiceId,
      recipient: customer.email,
      subject,
      templateUsed: template,
      deliveryStatus: "failed",
      provider: "resend",
      failureReason: message,
    });
    throw error;
  }
}
