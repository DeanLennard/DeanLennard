import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getAuditById } from "@/lib/audit-store";
import { getClientById } from "@/lib/clients-store";
import { getDatabase } from "@/lib/mongodb";
import { getProjectById } from "@/lib/projects-store";
import { getQuoteById } from "@/lib/quotes-store";
import {
  getAppSettings,
  getBankDetailsSnapshot,
  reserveNextInvoiceNumber,
  type BankDetailsSnapshot,
} from "@/lib/settings-store";

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "unpaid"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled"
  | "refunded";

export type InvoicePaymentMethod =
  | "stripe"
  | "gocardless"
  | "bank_transfer"
  | "manual";

export type InvoiceLineItem = {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
  sortOrder: number;
};

export type InvoiceRecord = {
  invoiceId: string;
  customerId: string;
  projectId?: string;
  sourceQuoteId?: string;
  recurringScheduleId?: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod: InvoicePaymentMethod;
  stripeInvoiceId?: string;
  stripeHostedInvoiceUrl?: string;
  gocardlessPaymentId?: string;
  gocardlessBillingRequestId?: string;
  gocardlessPaymentUrl?: string;
  pdfPath?: string;
  notes?: string;
  footerNotes?: string;
  bankDetailsSnapshot?: BankDetailsSnapshot;
  sentAt?: string;
  lineItems: InvoiceLineItem[];
  createdAt: string;
  updatedAt: string;
};

function getInvoicesCollection() {
  return getDatabase().then((db) => db.collection<InvoiceRecord>("invoices"));
}

function calculateInvoiceTotals(lineItems: InvoiceLineItem[], taxRate: number) {
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return {
    subtotal,
    taxAmount,
    total,
  };
}

function normalizeInvoiceRecord(record: InvoiceRecord) {
  const amountPaid = record.amountPaid ?? 0;
  const balanceDue = Math.max((record.total ?? 0) - amountPaid, 0);

  return {
    ...record,
    status: record.status ?? "draft",
    currency: record.currency ?? "GBP",
    taxRate: record.taxRate ?? 0,
    taxAmount: record.taxAmount ?? 0,
    amountPaid,
    balanceDue,
    paymentMethod: record.paymentMethod ?? "bank_transfer",
    lineItems: record.lineItems ?? [],
  } satisfies InvoiceRecord;
}

async function syncProjectRevenue(projectId: string) {
  const db = await getDatabase();
  const project = await db.collection("projects").findOne({ projectId });

  if (!project) {
    return;
  }

  const invoices = await db
    .collection<InvoiceRecord>("invoices")
    .find({ projectId })
    .toArray();

  const actualRevenue = invoices.reduce((sum, invoice) => {
    if (invoice.status === "paid") {
      return sum + (invoice.total ?? 0);
    }

    if (invoice.status === "partially_paid") {
      return sum + (invoice.amountPaid ?? 0);
    }

    return sum;
  }, 0);

  const actualCost = Number(project.actualCost ?? 0);
  const grossProfit = actualRevenue - actualCost;
  const grossMarginPercent =
    actualRevenue > 0 ? (grossProfit / actualRevenue) * 100 : 0;

  await db.collection("projects").updateOne(
    { projectId },
    {
      $set: {
        actualRevenue,
        grossProfit,
        grossMarginPercent,
        updatedAt: new Date().toISOString(),
      },
    }
  );
}

async function refreshOverdueInvoice(record: InvoiceRecord) {
  if (!["sent", "unpaid", "partially_paid"].includes(record.status)) {
    return normalizeInvoiceRecord(record);
  }

  const dueAt = new Date(`${record.dueDate}T23:59:59Z`).getTime();
  if (Number.isNaN(dueAt) || dueAt >= Date.now()) {
    return normalizeInvoiceRecord(record);
  }

  const collection = await getInvoicesCollection();
  await collection.updateOne(
    { invoiceId: record.invoiceId },
    {
      $set: {
        status: "overdue",
        updatedAt: new Date().toISOString(),
      },
    }
  );

  return normalizeInvoiceRecord({
    ...record,
    status: "overdue",
    updatedAt: new Date().toISOString(),
  });
}

export async function listInvoices({
  search = "",
  status,
}: {
  search?: string;
  status?: InvoiceStatus | "all";
} = {}) {
  const collection = await getInvoicesCollection();
  const query: Record<string, unknown> = {};

  if (status && status !== "all") {
    query.status = status;
  }

  if (search.trim()) {
    query.$or = [
      { invoiceId: search.trim() },
      { invoiceNumber: { $regex: search.trim(), $options: "i" } },
      { customerId: search.trim() },
      { projectId: search.trim() },
    ];
  }

  const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return Promise.all(records.map(refreshOverdueInvoice));
}

export async function listInvoicesByClientId(customerId: string) {
  const collection = await getInvoicesCollection();
  const records = await collection.find({ customerId }).sort({ createdAt: -1 }).toArray();
  return Promise.all(records.map(refreshOverdueInvoice));
}

export async function listInvoicesByProjectId(projectId: string) {
  const collection = await getInvoicesCollection();
  const records = await collection.find({ projectId }).sort({ createdAt: -1 }).toArray();
  return Promise.all(records.map(refreshOverdueInvoice));
}

export async function getInvoiceById(invoiceId: string) {
  const collection = await getInvoicesCollection();
  const record = await collection.findOne({ invoiceId });
  return record ? refreshOverdueInvoice(record) : null;
}

export async function getInvoiceByInvoiceNumber(invoiceNumber: string) {
  const collection = await getInvoicesCollection();
  const record = await collection.findOne({ invoiceNumber });
  return record ? refreshOverdueInvoice(record) : null;
}

export async function findInvoiceForStripePayload(input: {
  invoiceId?: string;
  invoiceNumber?: string;
  stripeInvoiceId?: string;
}) {
  const collection = await getInvoicesCollection();

  if (input.invoiceId) {
    const byId = await collection.findOne({ invoiceId: input.invoiceId });
    if (byId) {
      return refreshOverdueInvoice(byId);
    }
  }

  if (input.stripeInvoiceId) {
    const byStripeId = await collection.findOne({
      stripeInvoiceId: input.stripeInvoiceId,
    });
    if (byStripeId) {
      return refreshOverdueInvoice(byStripeId);
    }
  }

  if (input.invoiceNumber) {
    const byNumber = await collection.findOne({
      invoiceNumber: input.invoiceNumber,
    });
    if (byNumber) {
      return refreshOverdueInvoice(byNumber);
    }
  }

  return null;
}

export async function findInvoiceForGoCardlessPayload(input: {
  invoiceId?: string;
  invoiceNumber?: string;
  gocardlessPaymentId?: string;
}) {
  const collection = await getInvoicesCollection();

  if (input.invoiceId) {
    const byId = await collection.findOne({ invoiceId: input.invoiceId });
    if (byId) {
      return refreshOverdueInvoice(byId);
    }
  }

  if (input.gocardlessPaymentId) {
    const byGoCardlessId = await collection.findOne({
      gocardlessPaymentId: input.gocardlessPaymentId,
    });
    if (byGoCardlessId) {
      return refreshOverdueInvoice(byGoCardlessId);
    }
  }

  if (input.invoiceNumber) {
    const byNumber = await collection.findOne({
      invoiceNumber: input.invoiceNumber,
    });
    if (byNumber) {
      return refreshOverdueInvoice(byNumber);
    }
  }

  return null;
}

export async function linkInvoiceProviderReferences(
  invoiceId: string,
  input: {
    stripeInvoiceId?: string;
    stripeHostedInvoiceUrl?: string;
    gocardlessPaymentId?: string;
    gocardlessBillingRequestId?: string;
    gocardlessPaymentUrl?: string;
  }
) {
  const collection = await getInvoicesCollection();

  await collection.updateOne(
    { invoiceId },
    {
      $set: {
        ...(input.stripeInvoiceId ? { stripeInvoiceId: input.stripeInvoiceId } : {}),
        ...(input.stripeHostedInvoiceUrl
          ? { stripeHostedInvoiceUrl: input.stripeHostedInvoiceUrl }
          : {}),
        ...(input.gocardlessPaymentId
          ? { gocardlessPaymentId: input.gocardlessPaymentId }
          : {}),
        ...(input.gocardlessBillingRequestId
          ? { gocardlessBillingRequestId: input.gocardlessBillingRequestId }
          : {}),
        ...(input.gocardlessPaymentUrl
          ? { gocardlessPaymentUrl: input.gocardlessPaymentUrl }
          : {}),
        updatedAt: new Date().toISOString(),
      },
    }
  );
}

export async function updateInvoiceDocumentPath(invoiceId: string, pdfPath: string) {
  const collection = await getInvoicesCollection();
  await collection.updateOne(
    { invoiceId },
    {
      $set: {
        pdfPath,
        updatedAt: new Date().toISOString(),
      },
    }
  );
}

function buildInvoiceLineItems(
  input: Array<{
    title: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>
) {
  return input
    .filter((item) => item.title.trim())
    .map((item, index) => ({
      id: new ObjectId().toHexString(),
      title: item.title.trim(),
      description: item.description?.trim() || undefined,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
      taxRate: item.taxRate,
      sortOrder: index,
    }));
}

export async function createInvoice(input: {
  customerId: string;
  projectId?: string;
  sourceQuoteId?: string;
  recurringScheduleId?: string;
  dueDate?: string;
  currency?: string;
  taxRate?: number;
  paymentMethod?: InvoicePaymentMethod;
  notes?: string;
  footerNotes?: string;
  lineItems: Array<{
    title: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
}) {
  const collection = await getInvoicesCollection();
  const settings = await getAppSettings();
  const now = new Date().toISOString();
  const issueDate = now.slice(0, 10);
  const dueDate =
    input.dueDate ||
    new Date(Date.now() + settings.defaultPaymentTerms * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
  const lineItems = buildInvoiceLineItems(input.lineItems);
  const taxRate = input.taxRate ?? 0;
  const totals = calculateInvoiceTotals(lineItems, taxRate);
  const invoiceId = new ObjectId().toHexString();
  const invoiceNumber = await reserveNextInvoiceNumber();
  const paymentMethod = input.paymentMethod ?? "bank_transfer";
  const bankDetailsSnapshot =
    paymentMethod === "bank_transfer" ? await getBankDetailsSnapshot() : undefined;

  const record: InvoiceRecord = {
    invoiceId,
    customerId: input.customerId,
    projectId: input.projectId || undefined,
    sourceQuoteId: input.sourceQuoteId || undefined,
    recurringScheduleId: input.recurringScheduleId || undefined,
    invoiceNumber,
    status: "draft",
    issueDate,
    dueDate,
    currency: input.currency || settings.defaultCurrency,
    subtotal: totals.subtotal,
    taxRate,
    taxAmount: totals.taxAmount,
    total: totals.total,
    amountPaid: 0,
    balanceDue: totals.total,
    paymentMethod,
    notes: input.notes?.trim() || settings.invoiceDefaultNotes || undefined,
    footerNotes:
      input.footerNotes?.trim() || settings.invoiceDefaultFooterText || undefined,
    bankDetailsSnapshot,
    lineItems,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

  await createActivityLog({
    entityType: "invoice",
    entityId: invoiceId,
    actionType: "invoice_created",
    description: `Invoice ${invoiceNumber} created.`,
    metadata: {
      customerId: record.customerId,
      projectId: record.projectId ?? null,
      sourceQuoteId: record.sourceQuoteId ?? null,
    },
  });

  await createActivityLog({
    entityType: "client",
    entityId: record.customerId,
    actionType: "invoice_created",
    description: `Invoice ${invoiceNumber} created for this client.`,
    metadata: {
      invoiceId,
      projectId: record.projectId ?? null,
    },
  });

  if (record.projectId) {
    await createActivityLog({
      entityType: "project",
      entityId: record.projectId,
      actionType: "invoice_created",
      description: `Invoice ${invoiceNumber} created for this project.`,
      metadata: {
        invoiceId,
      },
    });
  }

  if (record.sourceQuoteId) {
    await createActivityLog({
      entityType: "quote",
      entityId: record.sourceQuoteId,
      actionType: "invoice_created",
      description: `Invoice ${invoiceNumber} created from this quote.`,
      metadata: {
        invoiceId,
      },
    });
  }

  return normalizeInvoiceRecord(record);
}

export async function createInvoiceFromQuote(quoteId: string) {
  const quote = await getQuoteById(quoteId);
  if (!quote) {
    throw new Error("Quote not found.");
  }

  if (!quote.customerId) {
    throw new Error("Quote must be linked to a client before creating an invoice.");
  }

  return createInvoice({
    customerId: quote.customerId,
    projectId: quote.projectId,
    sourceQuoteId: quote.quoteId,
    currency: quote.currency,
    notes: quote.notes,
    lineItems: quote.lineItems.map((item) => ({
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  });
}

export async function getInvoiceContext({
  customerId,
  projectId,
  quoteId,
}: {
  customerId?: string;
  projectId?: string;
  quoteId?: string;
}) {
  const [customer, project, quote, settings] = await Promise.all([
    customerId ? getClientById(customerId) : null,
    projectId ? getProjectById(projectId) : null,
    quoteId ? getQuoteById(quoteId) : null,
    getAppSettings(),
  ]);

  const resolvedCustomer =
    customer ||
    (project?.customerId ? await getClientById(project.customerId) : null) ||
    (quote?.customerId ? await getClientById(quote.customerId) : null);

  const resolvedProject =
    project || (quote?.projectId ? await getProjectById(quote.projectId) : null);

  return {
    customer: resolvedCustomer,
    project: resolvedProject,
    quote,
    settings,
  };
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  const collection = await getInvoicesCollection();
  const existing = await collection.findOne({ invoiceId });

  if (!existing) {
    throw new Error("Invoice not found.");
  }

  const now = new Date().toISOString();
  const update: { $set: Partial<InvoiceRecord> } = {
    $set: {
      status,
      updatedAt: now,
    },
  };

  if (status === "sent") {
    update.$set.sentAt = now;
  }

  if (status === "paid") {
    update.$set.amountPaid = existing.total;
    update.$set.balanceDue = 0;
    update.$set.paidDate = now.slice(0, 10);
  }

  if (status === "unpaid") {
    update.$set.amountPaid = 0;
    update.$set.balanceDue = existing.total;
    update.$set.paidDate = undefined;
  }

  await collection.updateOne({ invoiceId }, update);

  await createActivityLog({
    entityType: "invoice",
    entityId: invoiceId,
    actionType: "invoice_status_updated",
    description: `Invoice ${existing.invoiceNumber} changed to ${status}.`,
    metadata: {
      status,
    },
  });

  await createActivityLog({
    entityType: "client",
    entityId: existing.customerId,
    actionType: "invoice_status_updated",
    description: `Invoice ${existing.invoiceNumber} changed to ${status}.`,
    metadata: {
      invoiceId,
      status,
    },
  });

  if (existing.projectId) {
    await createActivityLog({
      entityType: "project",
      entityId: existing.projectId,
      actionType: "invoice_status_updated",
      description: `Invoice ${existing.invoiceNumber} changed to ${status}.`,
      metadata: {
        invoiceId,
        status,
      },
    });
    await syncProjectRevenue(existing.projectId);
  }
}

export async function recordInvoicePayment(
  invoiceId: string,
  amount: number,
  paidDate?: string
) {
  const collection = await getInvoicesCollection();
  const existing = await collection.findOne({ invoiceId });

  if (!existing) {
    throw new Error("Invoice not found.");
  }

  const safeAmount = Math.max(amount, 0);
  const amountPaid = Math.min((existing.amountPaid ?? 0) + safeAmount, existing.total);
  const balanceDue = Math.max(existing.total - amountPaid, 0);
  const status: InvoiceStatus =
    balanceDue <= 0 ? "paid" : amountPaid > 0 ? "partially_paid" : "unpaid";
  const resolvedPaidDate =
    balanceDue <= 0
      ? paidDate || new Date().toISOString().slice(0, 10)
      : undefined;

  await collection.updateOne(
    { invoiceId },
    {
      $set: {
        amountPaid,
        balanceDue,
        status,
        paidDate: resolvedPaidDate,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  await createActivityLog({
    entityType: "invoice",
    entityId: invoiceId,
    actionType: "invoice_payment_recorded",
    description: `Payment of ${safeAmount.toFixed(2)} recorded against ${existing.invoiceNumber}.`,
    metadata: {
      amount: safeAmount,
      balanceDue,
      status,
    },
  });

  await createActivityLog({
    entityType: "client",
    entityId: existing.customerId,
    actionType: "invoice_payment_recorded",
    description: `Payment recorded against invoice ${existing.invoiceNumber}.`,
    metadata: {
      invoiceId,
      amount: safeAmount,
      status,
    },
  });

  if (existing.projectId) {
    await syncProjectRevenue(existing.projectId);
  }
}

export async function getInvoiceLinkedContext(invoice: InvoiceRecord) {
  const [customer, project, quote, lead] = await Promise.all([
    getClientById(invoice.customerId),
    invoice.projectId ? getProjectById(invoice.projectId) : null,
    invoice.sourceQuoteId ? getQuoteById(invoice.sourceQuoteId) : null,
    invoice.sourceQuoteId
      ? getQuoteById(invoice.sourceQuoteId).then((linkedQuote) =>
          linkedQuote?.leadId ? getAuditById(linkedQuote.leadId) : null
        )
      : null,
  ]);

  return {
    customer,
    project,
    quote,
    lead,
  };
}
