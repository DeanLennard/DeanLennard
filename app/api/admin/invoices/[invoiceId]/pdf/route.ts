import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getClientById } from "@/lib/clients-store";
import { saveGeneratedDocument } from "@/lib/document-storage";
import { generateInvoicePdf } from "@/lib/pdf-documents";
import {
  getInvoiceById,
  updateInvoiceDocumentPath,
} from "@/lib/invoices-store";
import { getAppSettings } from "@/lib/settings-store";

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
  const invoice = await getInvoiceById(invoiceId);

  if (!invoice) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/invoices"), 303);
  }

  const [settings, customer] = await Promise.all([
    getAppSettings(),
    getClientById(invoice.customerId),
  ]);

  const bankInstructions = [
    invoice.bankDetailsSnapshot?.accountName
      ? `Account name: ${invoice.bankDetailsSnapshot.accountName}`
      : "",
    invoice.bankDetailsSnapshot?.sortCode
      ? `Sort code: ${invoice.bankDetailsSnapshot.sortCode}`
      : "",
    invoice.bankDetailsSnapshot?.accountNumber
      ? `Account number: ${invoice.bankDetailsSnapshot.accountNumber}`
      : "",
    invoice.bankDetailsSnapshot?.paymentReferenceInstructions || "",
  ]
    .filter(Boolean)
    .join("\n");

  const pdfBytes = generateInvoicePdf({
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    paidDate: invoice.paidDate,
    businessName: settings.businessName,
    businessAddress: settings.registeredAddress,
    companyNumber: settings.companyNumber,
    vatNumber: settings.vatNumber,
    customerName: customer?.businessName || invoice.customerId,
    customerAddress: customer?.billingAddress || customer?.address,
    notes: invoice.notes,
    footerNotes: invoice.footerNotes,
    bankInstructions,
    currency: invoice.currency,
    taxAmount: invoice.taxAmount,
    subtotal: invoice.subtotal,
    total: invoice.total,
    amountPaid: invoice.amountPaid,
    balanceDue: invoice.balanceDue,
    lineItems: invoice.lineItems,
  });

  const pdfPath = await saveGeneratedDocument({
    kind: "invoices",
    fileName: `${invoice.invoiceNumber}.pdf`,
    bytes: pdfBytes,
  });

  await updateInvoiceDocumentPath(invoice.invoiceId, pdfPath);

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/invoices/${invoice.invoiceId}`),
    303
  );
}
