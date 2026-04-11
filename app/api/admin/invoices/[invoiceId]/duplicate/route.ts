import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { duplicateInvoice } from "@/lib/invoices-store";

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
    const duplicate = await duplicateInvoice(invoiceId);
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/invoices/${duplicate.invoiceId}`),
      303
    );
  } catch {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/invoices/${invoiceId}?error=duplicate-failed`),
      303
    );
  }
}
