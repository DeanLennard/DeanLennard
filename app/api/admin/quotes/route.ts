import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createQuote } from "@/lib/quotes-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

function getLineItems(formData: FormData) {
  const titles = formData.getAll("lineItemTitle");
  const descriptions = formData.getAll("lineItemDescription");
  const quantities = formData.getAll("lineItemQuantity");
  const unitPrices = formData.getAll("lineItemUnitPrice");

  return titles
    .map((rawTitle, index) => {
      const title = String(rawTitle ?? "").trim();
      const description = String(descriptions[index] ?? "").trim();
      const quantity = Number(quantities[index] ?? "0");
      const unitPrice = Number(unitPrices[index] ?? "0");

      return {
        title,
        description,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
      };
    })
    .filter((item) => item.title);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const formData = await request.formData();
  const customerId = String(formData.get("customerId") ?? "").trim();
  const leadId = String(formData.get("leadId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/quotes/new?error=missing-title"),
      303
    );
  }

  const quote = await createQuote({
    customerId: customerId || undefined,
    leadId: leadId || undefined,
    title,
    summary: String(formData.get("summary") ?? ""),
    scopeOfWork: String(formData.get("scopeOfWork") ?? ""),
    exclusions: String(formData.get("exclusions") ?? ""),
    paymentTerms: String(formData.get("paymentTerms") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    expiryDate: String(formData.get("expiryDate") ?? "").trim() || undefined,
    autoCreateProjectOnAcceptance:
      formData.get("autoCreateProjectOnAcceptance") === "on",
    autoCreateInvoiceOnAcceptance:
      formData.get("autoCreateInvoiceOnAcceptance") === "on",
    lineItems: getLineItems(formData),
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/quotes/${quote.quoteId}`),
    303
  );
}
