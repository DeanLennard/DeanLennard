import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getDatabase } from "@/lib/mongodb";
import type { StoredAuditRecord } from "@/lib/audit-store";

export type ClientStatus = "lead" | "active" | "inactive" | "archived";
export type CarePlanStatus = "none" | "active" | "paused" | "cancelled";

export type ClientRecord = {
  clientId: string;
  status: ClientStatus;
  businessName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  billingAddress?: string;
  companyNumber?: string;
  vatNumber?: string;
  notes?: string;
  tags: string[];
  acquisitionSource?: string;
  sourceAuditId?: string;
  defaultCurrency: string;
  defaultPaymentTerms: number;
  defaultHourlyInternalCost?: number;
  carePlanStatus: CarePlanStatus;
  stripeCustomerId?: string;
  gocardlessCustomerId?: string;
  gocardlessMandateId?: string;
  createdAt: string;
  updatedAt: string;
};

function getClientsCollection() {
  return getDatabase().then((db) => db.collection<ClientRecord>("clients"));
}

function normalizeClientRecord(record: ClientRecord) {
  return {
    ...record,
    status: record.status ?? "active",
    tags: record.tags ?? [],
    defaultCurrency: record.defaultCurrency ?? "GBP",
    defaultPaymentTerms: record.defaultPaymentTerms ?? 14,
    carePlanStatus: record.carePlanStatus ?? "none",
  } satisfies ClientRecord;
}

export async function createClientFromAudit(audit: StoredAuditRecord) {
  const collection = await getClientsCollection();
  const now = new Date().toISOString();
  const clientId = new ObjectId().toHexString();

  const existing = await collection.findOne({
    sourceAuditId: audit.auditId,
  });

  if (existing) {
    return existing;
  }

  const record: ClientRecord = {
    clientId,
    status: "active",
    businessName: audit.businessName || audit.normalizedUrl,
    website: audit.normalizedUrl,
    sourceAuditId: audit.auditId,
    notes:
      audit.issues.length > 0
        ? `Audit created from Website Growth Check. Top issue: ${audit.issues[0]?.message ?? "No issues recorded."}`
        : "Audit created from Website Growth Check with no priority issues recorded.",
    tags: [],
    acquisitionSource: "website_growth_check",
    defaultCurrency: "GBP",
    defaultPaymentTerms: 14,
    carePlanStatus: "none",
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);
  await createActivityLog({
    entityType: "client",
    entityId: clientId,
    actionType: "client_created",
    description: `Client created from audit ${audit.auditId}.`,
    metadata: {
      sourceAuditId: audit.auditId,
    },
  });
  return normalizeClientRecord(record);
}

export async function createCustomerManually(input: {
  businessName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  notes?: string;
}) {
  const collection = await getClientsCollection();
  const now = new Date().toISOString();
  const clientId = new ObjectId().toHexString();

  const record: ClientRecord = {
    clientId,
    status: "active",
    businessName: input.businessName.trim(),
    contactName: input.contactName?.trim() || undefined,
    email: input.email?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    website: input.website?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    tags: [],
    acquisitionSource: "manual",
    defaultCurrency: "GBP",
    defaultPaymentTerms: 14,
    carePlanStatus: "none",
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);
  await createActivityLog({
    entityType: "client",
    entityId: clientId,
    actionType: "client_created",
    description: "Client created manually.",
  });

  return normalizeClientRecord(record);
}

export async function listClients(search = "") {
  const collection = await getClientsCollection();
  const query: Record<string, unknown> = {};

  if (search.trim()) {
    query.$or = [
      { clientId: search.trim() },
      { businessName: { $regex: search.trim(), $options: "i" } },
      { website: { $regex: search.trim(), $options: "i" } },
      { email: { $regex: search.trim(), $options: "i" } },
    ];
  }

  const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return records.map(normalizeClientRecord);
}

export async function getClientById(clientId: string) {
  const collection = await getClientsCollection();
  const record = await collection.findOne({ clientId });
  return record ? normalizeClientRecord(record) : null;
}

export async function updateClient(
  clientId: string,
  input: {
    status: ClientStatus;
    businessName: string;
    contactName?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    billingAddress?: string;
    companyNumber?: string;
    vatNumber?: string;
    notes?: string;
    tags?: string[];
    acquisitionSource?: string;
    defaultCurrency?: string;
    defaultPaymentTerms?: number;
    defaultHourlyInternalCost?: number;
    carePlanStatus: CarePlanStatus;
    stripeCustomerId?: string;
    gocardlessCustomerId?: string;
    gocardlessMandateId?: string;
  }
) {
  const collection = await getClientsCollection();
  const existing = await collection.findOne({ clientId });

  if (!existing) {
    throw new Error("Client not found.");
  }

  const now = new Date().toISOString();

  await collection.updateOne(
    { clientId },
    {
      $set: {
        status: input.status,
        businessName: input.businessName.trim(),
        contactName: input.contactName?.trim() || undefined,
        email: input.email?.trim() || undefined,
        phone: input.phone?.trim() || undefined,
        website: input.website?.trim() || undefined,
        address: input.address?.trim() || undefined,
        billingAddress: input.billingAddress?.trim() || undefined,
        companyNumber: input.companyNumber?.trim() || undefined,
        vatNumber: input.vatNumber?.trim() || undefined,
        notes: input.notes?.trim() || undefined,
        tags: input.tags ?? [],
        acquisitionSource: input.acquisitionSource?.trim() || undefined,
        defaultCurrency: input.defaultCurrency?.trim() || "GBP",
        defaultPaymentTerms: input.defaultPaymentTerms ?? 14,
        defaultHourlyInternalCost: input.defaultHourlyInternalCost,
        carePlanStatus: input.carePlanStatus,
        stripeCustomerId: input.stripeCustomerId?.trim() || undefined,
        gocardlessCustomerId: input.gocardlessCustomerId?.trim() || undefined,
        gocardlessMandateId: input.gocardlessMandateId?.trim() || undefined,
        updatedAt: now,
      },
    }
  );

  await createActivityLog({
    entityType: "client",
    entityId: clientId,
    actionType: "client_updated",
    description: "Client details updated.",
  });
}
