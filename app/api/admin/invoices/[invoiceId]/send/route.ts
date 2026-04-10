import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createActivityLog } from "@/lib/activity-log";
import { getClientById } from "@/lib/clients-store";
import { formatDisplayDate } from "@/lib/date-format";
import { ensureInvoicePdfPath } from "@/lib/document-generation";
import { createEmailLog } from "@/lib/email-logs-store";
import { buildInvoiceEmailTemplate } from "@/lib/email-templates";
import { getInvoiceById, updateInvoiceStatus } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { toBase64 } from "@/lib/payment-provider-clients";
import { buildPublicInvoiceUrl } from "@/lib/public-invoice-links";
import { toPublicUrl } from "@/lib/public-site";
import { sendResendEmail } from "@/lib/resend-email";

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

  const customer = await getClientById(invoice.customerId);

  if (!customer?.email) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/invoices/${invoice.invoiceId}?error=missing-email`),
      303
    );
  }

  try {
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

    const result = await sendResendEmail({
      to: customer.email,
      subject: `Invoice ${invoice.invoiceNumber} from Outbreak LTD`,
      html: buildInvoiceEmailTemplate({
        recipientName: customer.contactName || customer.businessName,
        invoiceNumber: invoice.invoiceNumber,
        total: formatMoney(invoice.total, invoice.currency),
        dueDate: formatDisplayDate(invoice.dueDate),
        viewInvoiceHref: hostedInvoiceUrl,
        paymentHref: invoice.stripeHostedInvoiceUrl || invoice.gocardlessPaymentUrl,
        pdfHref: pdfUrl,
      }),
      attachments,
    });

    await createEmailLog({
      entityType: "invoice",
      entityId: invoice.invoiceId,
      recipient: customer.email,
      subject: `Invoice ${invoice.invoiceNumber} from Outbreak LTD`,
      templateUsed: "invoice_sent",
      deliveryStatus: "sent",
      provider: "resend",
      providerMessageId: result.id,
    });

    if (invoice.status === "draft") {
      await updateInvoiceStatus(invoice.invoiceId, "sent");
    }

    await createActivityLog({
      entityType: "invoice",
      entityId: invoice.invoiceId,
      actionType: "invoice_emailed",
      description: `Invoice ${invoice.invoiceNumber} emailed to ${customer.email}.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email send failed.";
    await createEmailLog({
      entityType: "invoice",
      entityId: invoice.invoiceId,
      recipient: customer.email,
      subject: `Invoice ${invoice.invoiceNumber} from Outbreak LTD`,
      templateUsed: "invoice_sent",
      deliveryStatus: "failed",
      provider: "resend",
      failureReason: message,
    });

    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/invoices/${invoice.invoiceId}?error=email-failed`),
      303
    );
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/invoices/${invoice.invoiceId}`),
    303
  );
}
