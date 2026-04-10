import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { recordInvoicePayment } from "@/lib/invoices-store";

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
  const formData = await request.formData();
  const amount = Number(formData.get("amount") ?? "0");
  const paidDate = String(formData.get("paidDate") ?? "").trim() || undefined;

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/invoices/${invoiceId}?error=invalid-payment`),
      303
    );
  }

  await recordInvoicePayment(invoiceId, amount, paidDate);

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/invoices/${invoiceId}`),
    303
  );
}
