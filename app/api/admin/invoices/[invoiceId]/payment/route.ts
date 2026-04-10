import path from "node:path";
import { randomUUID } from "node:crypto";
import { saveGeneratedDocument } from "@/lib/document-storage";
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
  const reconciliationReference =
    String(formData.get("reconciliationReference") ?? "").trim() || undefined;
  const reconciliationNotes =
    String(formData.get("reconciliationNotes") ?? "").trim() || undefined;
  const attachment = formData.get("reconciliationAttachment");

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/invoices/${invoiceId}?error=invalid-payment`),
      303
    );
  }

  let reconciliationAttachmentPath: string | undefined;

  if (attachment instanceof File && attachment.size > 0) {
    const fileBuffer = new Uint8Array(await attachment.arrayBuffer());
    const extension = path.extname(attachment.name || "") || ".bin";
    reconciliationAttachmentPath = await saveGeneratedDocument({
      kind: "reconciliation",
      fileName: `${invoiceId}-${randomUUID()}${extension}`,
      bytes: fileBuffer,
    });
  }

  await recordInvoicePayment(invoiceId, amount, paidDate, {
    reconciliationReference,
    reconciliationNotes,
    reconciliationAttachmentPath,
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/invoices/${invoiceId}`),
    303
  );
}
