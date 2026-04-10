import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createQuote, getQuoteById } from "@/lib/quotes-store";

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

  const duplicate = await createQuote({
    customerId: quote.customerId,
    leadId: quote.leadId,
    title: `${quote.title} Copy`,
    summary: quote.summary,
    scopeOfWork: quote.scopeOfWork,
    exclusions: quote.exclusions,
    paymentTerms: quote.paymentTerms,
    notes: quote.notes,
    expiryDate: quote.expiryDate,
    autoCreateProjectOnAcceptance: quote.autoCreateProjectOnAcceptance,
    autoCreateInvoiceOnAcceptance: quote.autoCreateInvoiceOnAcceptance,
    lineItems: quote.lineItems.map((item) => ({
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/quotes/${duplicate.quoteId}`),
    303
  );
}
