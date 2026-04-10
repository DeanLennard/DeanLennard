import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getClientById } from "@/lib/clients-store";
import { saveGeneratedDocument } from "@/lib/document-storage";
import { generateQuotePdf } from "@/lib/pdf-documents";
import { getQuoteById, updateQuoteDocumentPath } from "@/lib/quotes-store";
import { getAppSettings } from "@/lib/settings-store";

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

  const [settings, customer] = await Promise.all([
    getAppSettings(),
    quote.customerId ? getClientById(quote.customerId) : Promise.resolve(null),
  ]);

  const pdfBytes = generateQuotePdf({
    quoteNumber: quote.quoteNumber,
    issueDate: quote.issueDate,
    expiryDate: quote.expiryDate,
    businessName: settings.businessName,
    businessAddress: settings.registeredAddress,
    customerName: customer?.businessName || "Prospective client",
    customerAddress: customer?.billingAddress || customer?.address,
    title: quote.title,
    summary: quote.summary,
    scopeOfWork: quote.scopeOfWork,
    exclusions: quote.exclusions,
    paymentTerms: quote.paymentTerms,
    notes: quote.notes,
    currency: quote.currency,
    lineItems: quote.lineItems,
    subtotal: quote.subtotal,
    total: quote.total,
  });

  const pdfPath = await saveGeneratedDocument({
    kind: "quotes",
    fileName: `${quote.quoteNumber}.pdf`,
    bytes: pdfBytes,
  });

  await updateQuoteDocumentPath(quote.quoteId, pdfPath);

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/quotes/${quote.quoteId}`),
    303
  );
}
