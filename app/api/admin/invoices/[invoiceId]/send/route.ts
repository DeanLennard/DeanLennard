import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendInvoiceEmailTemplate } from "@/lib/invoice-email";

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

  try {
    await sendInvoiceEmailTemplate(invoiceId, "invoice_sent");
  } catch (error) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/invoices/${invoiceId}?error=${encodeURIComponent(error instanceof Error ? error.message : "email-failed")}`),
      303
    );
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/invoices/${invoiceId}`),
    303
  );
}
