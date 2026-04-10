import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createInvoice, createInvoiceFromQuote } from "@/lib/invoices-store";

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
  const projectId = String(formData.get("projectId") ?? "").trim();
  const quoteId = String(formData.get("quoteId") ?? "").trim();

  if (quoteId && !customerId && getLineItems(formData).length === 0) {
    const invoice = await createInvoiceFromQuote(quoteId);
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/invoices/${invoice.invoiceId}`),
      303
    );
  }

  if (!customerId) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/invoices/new?error=missing-customer"),
      303
    );
  }

  const invoice = await createInvoice({
    customerId,
    projectId: projectId || undefined,
    sourceQuoteId: quoteId || undefined,
    dueDate: String(formData.get("dueDate") ?? "").trim() || undefined,
    currency: String(formData.get("currency") ?? "").trim() || undefined,
    taxRate: Number(formData.get("taxRate") ?? "0"),
    paymentMethod:
      (String(formData.get("paymentMethod") ?? "").trim() as
        | "stripe"
        | "gocardless"
        | "bank_transfer"
        | "manual") || "bank_transfer",
    notes: String(formData.get("notes") ?? ""),
    footerNotes: String(formData.get("footerNotes") ?? ""),
    lineItems: getLineItems(formData),
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/invoices/${invoice.invoiceId}`),
    303
  );
}
