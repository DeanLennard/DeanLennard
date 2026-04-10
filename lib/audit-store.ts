import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import type { AuditIntentType } from "@/lib/audit-intents";
import { getDatabase } from "@/lib/mongodb";
import type { WebsiteGrowthAuditResult } from "@/lib/website-growth-audit";

export type LeadStatus = "new" | "contacted" | "converted" | "lost";

type StoredAuditIntent = {
  type: AuditIntentType;
  at: string;
};

export type StoredAuditRecord = {
  auditId: string;
  url: string;
  normalizedUrl: string;
  businessName?: string;
  location?: string;
  checkedAt: string;
  checkedPages: string[];
  crawlLimit: number;
  crawlLimitReached: boolean;
  scores: WebsiteGrowthAuditResult["scores"];
  issues: WebsiteGrowthAuditResult["issues"];
  goodSignals: string[];
  followUpConsent: boolean;
  consentedAt?: string;
  intents: StoredAuditIntent[];
  leadStatus: LeadStatus;
  convertedClientId?: string;
  createdAt: string;
  updatedAt: string;
};

type CreateAuditInput = {
  url: string;
  businessName?: string;
  location?: string;
  result: WebsiteGrowthAuditResult;
};

type AuditListFilter = "all" | "consented" | "not_consented";
type LeadListFilter = "all" | LeadStatus;

function getAuditCollection() {
  return getDatabase().then((db) => db.collection<StoredAuditRecord>("audits"));
}

function normalizeAuditRecord(record: StoredAuditRecord) {
  return {
    ...record,
    leadStatus: record.leadStatus ?? "new",
  } satisfies StoredAuditRecord;
}

export async function createStoredAudit({
  url,
  businessName,
  location,
  result,
}: CreateAuditInput) {
  const collection = await getAuditCollection();
  const now = new Date().toISOString();
  const auditId = new ObjectId().toHexString();

  const record: StoredAuditRecord = {
    auditId,
    url,
    normalizedUrl: result.normalizedUrl,
    businessName: businessName?.trim() || undefined,
    location: location?.trim() || undefined,
    checkedAt: result.checkedAt,
    checkedPages: result.checkedPages,
    crawlLimit: result.crawlLimit,
    crawlLimitReached: result.crawlLimitReached,
    scores: result.scores,
    issues: result.issues,
    goodSignals: result.goodSignals,
    followUpConsent: false,
    intents: [],
    leadStatus: "new",
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);
  await createActivityLog({
    entityType: "lead",
    entityId: auditId,
    actionType: "lead_created",
    description: `Website audit captured for ${result.normalizedUrl}.`,
  });

  return auditId;
}

export async function recordAuditIntent(
  auditId: string,
  intentType: AuditIntentType
) {
  const collection = await getAuditCollection();
  const now = new Date().toISOString();

  await collection.updateOne(
    { auditId },
    {
      $set: {
        followUpConsent: true,
        consentedAt: now,
        updatedAt: now,
      },
      $push: {
        intents: {
          type: intentType,
          at: now,
        } as StoredAuditIntent,
      },
    }
  );
}

export async function getAuditById(auditId: string) {
  const collection = await getAuditCollection();
  const record = await collection.findOne({ auditId });
  return record ? normalizeAuditRecord(record) : null;
}

export async function listAudits({
  filter = "all",
  search = "",
}: {
  filter?: AuditListFilter;
  search?: string;
}) {
  const collection = await getAuditCollection();
  const query: Record<string, unknown> = {};

  if (filter === "consented") {
    query.followUpConsent = true;
  }

  if (filter === "not_consented") {
    query.followUpConsent = false;
  }

  if (search.trim()) {
    query.$or = [
      { auditId: search.trim() },
      { normalizedUrl: { $regex: search.trim(), $options: "i" } },
      { url: { $regex: search.trim(), $options: "i" } },
      { businessName: { $regex: search.trim(), $options: "i" } },
      { location: { $regex: search.trim(), $options: "i" } },
    ];
  }

  const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return records.map(normalizeAuditRecord);
}

export async function updateLeadStatus(auditId: string, leadStatus: LeadStatus) {
  const collection = await getAuditCollection();
  const now = new Date().toISOString();
  const update: {
    $set: Partial<StoredAuditRecord>;
    $unset?: Record<string, "" | 1>;
  } = {
    $set: {
      leadStatus,
      updatedAt: now,
    },
  };

  if (leadStatus !== "converted") {
    update.$unset = {
      convertedClientId: "",
    };
  }

  await collection.updateOne({ auditId }, update);
  await createActivityLog({
    entityType: "lead",
    entityId: auditId,
    actionType: "lead_status_updated",
    description: `Lead status changed to ${leadStatus}.`,
    metadata: {
      leadStatus,
    },
  });
}

export async function updateLeadDetails(
  auditId: string,
  input: {
    businessName?: string;
    location?: string;
    leadStatus: LeadStatus;
    followUpConsent: boolean;
  }
) {
  const collection = await getAuditCollection();
  const existing = await collection.findOne({ auditId });

  if (!existing) {
    throw new Error("Lead not found.");
  }

  const now = new Date().toISOString();
  const update: {
    $set: Partial<StoredAuditRecord>;
    $unset?: Record<string, "" | 1>;
  } = {
    $set: {
      businessName: input.businessName?.trim() || undefined,
      location: input.location?.trim() || undefined,
      leadStatus: input.leadStatus,
      followUpConsent: input.followUpConsent,
      consentedAt: input.followUpConsent ? existing.consentedAt ?? now : undefined,
      updatedAt: now,
    },
  };

  if (!input.followUpConsent) {
    update.$unset = {
      ...(update.$unset ?? {}),
      consentedAt: "",
    };
  }

  if (input.leadStatus !== "converted") {
    update.$unset = {
      ...(update.$unset ?? {}),
      convertedClientId: "",
    };
  }

  await collection.updateOne({ auditId }, update);

  await createActivityLog({
    entityType: "lead",
    entityId: auditId,
    actionType: "lead_updated",
    description: "Lead details updated.",
    metadata: {
      leadStatus: input.leadStatus,
      followUpConsent: input.followUpConsent,
    },
  });
}

export async function markAuditConverted(auditId: string, clientId: string) {
  const collection = await getAuditCollection();
  const now = new Date().toISOString();

  await collection.updateOne(
    { auditId },
    {
      $set: {
        leadStatus: "converted",
        convertedClientId: clientId,
        updatedAt: now,
      },
    }
  );
  await createActivityLog({
    entityType: "lead",
    entityId: auditId,
    actionType: "lead_converted",
    description: `Lead converted to client ${clientId}.`,
    metadata: {
      clientId,
    },
  });
}

export async function listLeads({
  filter = "all",
  search = "",
}: {
  filter?: LeadListFilter;
  search?: string;
}) {
  const collection = await getAuditCollection();
  const query: Record<string, unknown> = {};

  if (filter === "new") {
    query.$or = [{ leadStatus: "new" }, { leadStatus: { $exists: false } }];
  } else if (filter !== "all") {
    query.leadStatus = filter;
  }

  if (search.trim()) {
    const searchConditions = [
      { auditId: search.trim() },
      { normalizedUrl: { $regex: search.trim(), $options: "i" } },
      { url: { $regex: search.trim(), $options: "i" } },
      { businessName: { $regex: search.trim(), $options: "i" } },
      { location: { $regex: search.trim(), $options: "i" } },
    ];

    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: searchConditions }];
      delete query.$or;
    } else {
      query.$or = searchConditions;
    }
  }

  const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return records.map(normalizeAuditRecord);
}
