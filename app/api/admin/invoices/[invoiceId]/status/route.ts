import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  type InvoiceStatus,
  updateInvoiceStatus,
} from "@/lib/invoices-store";

const validStatuses: InvoiceStatus[] = [
  "draft",
  "sent",
  "unpaid",
  "partially_paid",
  "paid",
  "overdue",
  "cancelled",
  "refunded",
];

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
  const status = String(formData.get("status") ?? "").trim() as InvoiceStatus;

  if (!validStatuses.includes(status)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/invoices/${invoiceId}?error=invalid-status`),
      303
    );
  }

  await updateInvoiceStatus(invoiceId, status);

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/invoices/${invoiceId}`),
    303
  );
}
