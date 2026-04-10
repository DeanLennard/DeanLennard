import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createActivityLog } from "@/lib/activity-log";
import { getClientById } from "@/lib/clients-store";
import { createEmailLog } from "@/lib/email-logs-store";
import { toBase64 } from "@/lib/payment-provider-clients";
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
    const attachments =
      quote.pdfPath
        ? [
            {
              fileName: `${quote.quoteNumber}.pdf`,
              contentBase64: toBase64(
                await readFile(path.join(process.cwd(), "public", quote.pdfPath.replace(/^\//, "")))
              ),
              contentType: "application/pdf",
            },
          ]
        : undefined;

    const result = await sendResendEmail({
      to: customer.email,
      subject: `Quote ${quote.quoteNumber} from Outbreak LTD`,
      html: `<p>Hello ${customer.contactName || customer.businessName},</p><p>Please find quote <strong>${quote.quoteNumber}</strong> attached.</p><p>Total: ${quote.currency} ${quote.total.toFixed(2)}</p><p>Kind regards,<br />Dean Lennard</p>`,
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
