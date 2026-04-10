import { getClientById } from "@/lib/clients-store";
import { saveGeneratedDocument } from "@/lib/document-storage";
import { generateInvoicePdf, generateQuotePdf } from "@/lib/pdf-documents";
import {
  getInvoiceById,
  updateInvoiceDocumentPath,
} from "@/lib/invoices-store";
import { getQuoteById, updateQuoteDocumentPath } from "@/lib/quotes-store";
import { getAppSettings } from "@/lib/settings-store";

export async function ensureQuotePdfPath(quoteId: string) {
  const quote = await getQuoteById(quoteId);

  if (!quote) {
    throw new Error("Quote not found.");
  }

  if (quote.pdfPath) {
    return {
      quote,
      pdfPath: quote.pdfPath,
    };
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

  return {
    quote: {
      ...quote,
      pdfPath,
    },
    pdfPath,
  };
}

export async function ensureInvoicePdfPath(invoiceId: string) {
  const invoice = await getInvoiceById(invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  if (invoice.pdfPath) {
    return {
      invoice,
      pdfPath: invoice.pdfPath,
    };
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
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
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
    lineItems: invoice.lineItems,
  });

  const pdfPath = await saveGeneratedDocument({
    kind: "invoices",
    fileName: `${invoice.invoiceNumber}.pdf`,
    bytes: pdfBytes,
  });

  await updateInvoiceDocumentPath(invoice.invoiceId, pdfPath);

  return {
    invoice: {
      ...invoice,
      pdfPath,
    },
    pdfPath,
  };
}
