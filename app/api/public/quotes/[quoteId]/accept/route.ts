import { NextResponse } from "next/server";

import { createActivityLog } from "@/lib/activity-log";
import { createInvoiceFromQuote, getInvoiceBySourceQuoteId } from "@/lib/invoices-store";
import { createProjectFromQuote, getProjectByQuoteId } from "@/lib/projects-store";
import { verifyPublicQuoteToken } from "@/lib/public-quote-links";
import { getQuoteById, updateQuoteStatus } from "@/lib/quotes-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  const { quoteId } = await params;
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "").trim();

  if (!verifyPublicQuoteToken(quoteId, token)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const quote = await getQuoteById(quoteId);

  if (!quote) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (quote.status !== "accepted") {
    await updateQuoteStatus(quote.quoteId, "accepted");

    await createActivityLog({
      entityType: "quote",
      entityId: quote.quoteId,
      actionType: "quote_accepted_public",
      actor: "customer",
      description: `Quote ${quote.quoteNumber} approved from the hosted quote page.`,
    });
  }

  if (quote.customerId && quote.autoCreateProjectOnAcceptance) {
    await createProjectFromQuote(quote.quoteId);
  }

  if (quote.customerId && quote.autoCreateInvoiceOnAcceptance) {
    const existingInvoice = await getInvoiceBySourceQuoteId(quote.quoteId);

    if (!existingInvoice) {
      await createInvoiceFromQuote(quote.quoteId);
    }
  }

  const linkedProject = await getProjectByQuoteId(quote.quoteId);
  const responseUrl = new URL(`/quote/${quote.quoteId}`, request.url);
  responseUrl.searchParams.set("token", token);
  responseUrl.searchParams.set("accepted", "1");

  if (linkedProject) {
    responseUrl.searchParams.set("projectCreated", "1");
  }

  return NextResponse.redirect(responseUrl, 303);
}
