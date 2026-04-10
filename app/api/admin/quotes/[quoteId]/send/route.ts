import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createActivityLog } from "@/lib/activity-log";
import { getClientById } from "@/lib/clients-store";
import { formatDisplayDate } from "@/lib/date-format";
import { ensureQuotePdfPath } from "@/lib/document-generation";
import { createEmailLog } from "@/lib/email-logs-store";
import { buildQuoteEmailTemplate } from "@/lib/email-templates";
import { formatMoney } from "@/lib/money-format";
import { toBase64 } from "@/lib/payment-provider-clients";
import { buildPublicQuoteUrl } from "@/lib/public-quote-links";
import { toPublicUrl } from "@/lib/public-site";
import { getQuoteById, updateQuoteStatus } from "@/lib/quotes-store";
import { sendResendEmail } from "@/lib/resend-email";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { quoteId } = await params;
  const quote = await getQuoteById(quoteId);

  if (!quote) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/quotes"), 303);
  }

  const customer = quote.customerId ? await getClientById(quote.customerId) : null;

  if (!customer?.email) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/quotes/${quote.quoteId}?error=missing-email`),
      303
    );
  }

  try {
    const ensured = await ensureQuotePdfPath(quote.quoteId);
    const attachments = [
      {
        fileName: `${ensured.quote.quoteNumber}.pdf`,
        contentBase64: toBase64(
          await readFile(path.join(process.cwd(), "public", ensured.pdfPath.replace(/^\//, "")))
        ),
        contentType: "application/pdf",
      },
    ];

    const result = await sendResendEmail({
      to: customer.email,
      subject: `Quote ${quote.quoteNumber} from Outbreak LTD`,
      html: buildQuoteEmailTemplate({
        recipientName: customer.contactName || customer.businessName,
        quoteNumber: quote.quoteNumber,
        total: formatMoney(quote.total, quote.currency),
        expiryDate: quote.expiryDate ? formatDisplayDate(quote.expiryDate) : undefined,
        viewQuoteHref: buildPublicQuoteUrl(quote.quoteId),
        pdfHref: toPublicUrl(ensured.pdfPath),
      }),
      attachments,
    });

    await createEmailLog({
      entityType: "quote",
      entityId: quote.quoteId,
      recipient: customer.email,
      subject: `Quote ${quote.quoteNumber} from Outbreak LTD`,
      templateUsed: "quote_sent",
      deliveryStatus: "sent",
      provider: "resend",
      providerMessageId: result.id,
    });

    await updateQuoteStatus(quote.quoteId, "sent");

    await createActivityLog({
      entityType: "quote",
      entityId: quote.quoteId,
      actionType: "quote_emailed",
      description: `Quote ${quote.quoteNumber} emailed to ${customer.email}.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email send failed.";
    await createEmailLog({
      entityType: "quote",
      entityId: quote.quoteId,
      recipient: customer.email,
      subject: `Quote ${quote.quoteNumber} from Outbreak LTD`,
      templateUsed: "quote_sent",
      deliveryStatus: "failed",
      provider: "resend",
      failureReason: message,
    });

    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/quotes/${quote.quoteId}?error=email-failed`),
      303
    );
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/quotes/${quote.quoteId}`),
    303
  );
}
