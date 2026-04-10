import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getAuditById } from "@/lib/audit-store";
import { getClientById, listClients, type ClientRecord } from "@/lib/clients-store";
import { getDatabase } from "@/lib/mongodb";
import { reserveNextQuoteNumber } from "@/lib/settings-store";

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

export type QuoteLineItem = {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  sortOrder: number;
};

export type QuoteRecord = {
  quoteId: string;
  customerId?: string;
  leadId?: string;
  projectId?: string;
  quoteNumber: string;
  status: QuoteStatus;
  issueDate: string;
  expiryDate?: string;
  title: string;
  summary?: string;
  scopeOfWork?: string;
  exclusions?: string;
  paymentTerms?: string;
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  lineItems: QuoteLineItem[];
  pdfPath?: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  autoCreateProjectOnAcceptance?: boolean;
  autoCreateInvoiceOnAcceptance?: boolean;
  createdAt: string;
  updatedAt: string;
};

function getQuotesCollection() {
  return getDatabase().then((db) => db.collection<QuoteRecord>("quotes"));
}

function normalizeQuoteRecord(record: QuoteRecord) {
  return {
    ...record,
    status: record.status ?? "draft",
    currency: record.currency ?? "GBP",
    lineItems: record.lineItems ?? [],
  } satisfies QuoteRecord;
}

export async function generateNextQuoteNumber() {
  return reserveNextQuoteNumber();
}

export async function createQuote(input: {
  customerId?: string;
  leadId?: string;
  title: string;
  summary?: string;
  scopeOfWork?: string;
  exclusions?: string;
  paymentTerms?: string;
  notes?: string;
  expiryDate?: string;
  autoCreateProjectOnAcceptance?: boolean;
  autoCreateInvoiceOnAcceptance?: boolean;
  lineItems: Array<{
    title: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }>;
}) {
  const collection = await getQuotesCollection();
  const now = new Date().toISOString();
  const issueDate = now.slice(0, 10);
  const quoteId = new ObjectId().toHexString();
  const quoteNumber = await generateNextQuoteNumber();
  const lineItems = input.lineItems
    .filter((item) => item.title.trim())
    .map((item, index) => ({
      id: new ObjectId().toHexString(),
      title: item.title.trim(),
      description: item.description?.trim() || undefined,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
      sortOrder: index,
    }));

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const record: QuoteRecord = {
    quoteId,
    customerId: input.customerId || undefined,
    leadId: input.leadId || undefined,
    quoteNumber,
    status: "draft",
    issueDate,
    expiryDate: input.expiryDate || undefined,
    title: input.title.trim(),
    summary: input.summary?.trim() || undefined,
    scopeOfWork: input.scopeOfWork?.trim() || undefined,
    exclusions: input.exclusions?.trim() || undefined,
    paymentTerms: input.paymentTerms?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    subtotal,
    tax: 0,
    total: subtotal,
    currency: "GBP",
    lineItems,
    autoCreateProjectOnAcceptance: input.autoCreateProjectOnAcceptance ?? true,
    autoCreateInvoiceOnAcceptance: input.autoCreateInvoiceOnAcceptance ?? false,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

  await createActivityLog({
    entityType: "quote",
    entityId: quoteId,
    actionType: "quote_created",
    description: `Quote ${quoteNumber} created.`,
    metadata: {
      customerId: input.customerId || null,
      leadId: input.leadId || null,
    },
  });

  if (input.customerId) {
    await createActivityLog({
      entityType: "client",
      entityId: input.customerId,
      actionType: "quote_created",
      description: `Quote ${quoteNumber} created for this client.`,
      metadata: {
        quoteId,
      },
    });
  }

  if (input.leadId) {
    await createActivityLog({
      entityType: "lead",
      entityId: input.leadId,
      actionType: "quote_created",
      description: `Quote ${quoteNumber} created from this lead.`,
      metadata: {
        quoteId,
      },
    });
  }

  return normalizeQuoteRecord(record);
}

export async function listQuotes(search = "") {
  const collection = await getQuotesCollection();
  const query: Record<string, unknown> = {};

  if (search.trim()) {
    query.$or = [
      { quoteId: search.trim() },
      { quoteNumber: { $regex: search.trim(), $options: "i" } },
      { title: { $regex: search.trim(), $options: "i" } },
      { customerId: search.trim() },
      { leadId: search.trim() },
    ];
  }

  const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return records.map(normalizeQuoteRecord);
}

export async function getQuoteById(quoteId: string) {
  const collection = await getQuotesCollection();
  const record = await collection.findOne({ quoteId });
  return record ? normalizeQuoteRecord(record) : null;
}

export async function updateQuoteStatus(quoteId: string, status: QuoteStatus) {
  const collection = await getQuotesCollection();
  const existing = await collection.findOne({ quoteId });
  if (!existing) {
    throw new Error("Quote not found.");
  }

  const now = new Date().toISOString();
  const update: {
    $set: Partial<QuoteRecord>;
  } = {
    $set: {
      status,
      updatedAt: now,
    },
  };

  if (status === "sent") {
    update.$set.sentAt = now;
  }

  if (status === "accepted") {
    update.$set.acceptedAt = now;
  }

  if (status === "rejected") {
    update.$set.rejectedAt = now;
  }

  await collection.updateOne({ quoteId }, update);

  await createActivityLog({
    entityType: "quote",
    entityId: quoteId,
    actionType: "quote_status_updated",
    description: `Quote status changed to ${status}.`,
    metadata: {
      status,
    },
  });

  if (existing.customerId) {
    await createActivityLog({
      entityType: "client",
      entityId: existing.customerId,
      actionType: "quote_status_updated",
      description: `Quote ${existing.quoteNumber} changed to ${status}.`,
      metadata: {
        quoteId,
        status,
      },
    });
  }

  if (existing.leadId) {
    await createActivityLog({
      entityType: "lead",
      entityId: existing.leadId,
      actionType: "quote_status_updated",
      description: `Quote ${existing.quoteNumber} changed to ${status}.`,
      metadata: {
        quoteId,
        status,
      },
    });
  }
}

export async function updateQuoteDocumentPath(quoteId: string, pdfPath: string) {
  const collection = await getQuotesCollection();
  await collection.updateOne(
    { quoteId },
    {
      $set: {
        pdfPath,
        updatedAt: new Date().toISOString(),
      },
    }
  );
}

export async function linkProjectToQuote(quoteId: string, projectId: string) {
  const collection = await getQuotesCollection();
  await collection.updateOne(
    { quoteId },
    {
      $set: {
        projectId,
        updatedAt: new Date().toISOString(),
      },
    }
  );
}

export async function updateQuote(
  quoteId: string,
  input: {
    customerId?: string;
    leadId?: string;
    title: string;
    summary?: string;
    scopeOfWork?: string;
    exclusions?: string;
    paymentTerms?: string;
    notes?: string;
    expiryDate?: string;
    autoCreateProjectOnAcceptance?: boolean;
    autoCreateInvoiceOnAcceptance?: boolean;
    lineItems: Array<{
      title: string;
      description?: string;
      quantity: number;
      unitPrice: number;
    }>;
  }
) {
  const collection = await getQuotesCollection();
  const existing = await collection.findOne({ quoteId });

  if (!existing) {
    throw new Error("Quote not found.");
  }

  const lineItems = input.lineItems
    .filter((item) => item.title.trim())
    .map((item, index) => ({
      id: new ObjectId().toHexString(),
      title: item.title.trim(),
      description: item.description?.trim() || undefined,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
      sortOrder: index,
    }));

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const now = new Date().toISOString();

  await collection.updateOne(
    { quoteId },
    {
      $set: {
        customerId: input.customerId || undefined,
        leadId: input.leadId || undefined,
        title: input.title.trim(),
        summary: input.summary?.trim() || undefined,
        scopeOfWork: input.scopeOfWork?.trim() || undefined,
        exclusions: input.exclusions?.trim() || undefined,
        paymentTerms: input.paymentTerms?.trim() || undefined,
        notes: input.notes?.trim() || undefined,
        expiryDate: input.expiryDate || undefined,
        lineItems,
        subtotal,
        total: subtotal,
        autoCreateProjectOnAcceptance: input.autoCreateProjectOnAcceptance ?? true,
        autoCreateInvoiceOnAcceptance: input.autoCreateInvoiceOnAcceptance ?? false,
        updatedAt: now,
      },
    }
  );

  await createActivityLog({
    entityType: "quote",
    entityId: quoteId,
    actionType: "quote_updated",
    description: `Quote ${existing.quoteNumber} updated.`,
  });

  if (existing.customerId) {
    await createActivityLog({
      entityType: "client",
      entityId: existing.customerId,
      actionType: "quote_updated",
      description: `Quote ${existing.quoteNumber} updated.`,
      metadata: {
        quoteId,
      },
    });
  }

  if (existing.leadId) {
    await createActivityLog({
      entityType: "lead",
      entityId: existing.leadId,
      actionType: "quote_updated",
      description: `Quote ${existing.quoteNumber} updated.`,
      metadata: {
        quoteId,
      },
    });
  }
}

export async function getQuoteContext({
  customerId,
  leadId,
}: {
  customerId?: string;
  leadId?: string;
}) {
  let customer: ClientRecord | null = null;
  let lead = null;

  if (customerId) {
    customer = await getClientById(customerId);
  }

  if (leadId) {
    lead = await getAuditById(leadId);
  }

  if (!customer && lead?.convertedClientId) {
    customer = await getClientById(lead.convertedClientId);
  }

  return {
    customer,
    lead,
    allClients: await listClients(),
  };
}
