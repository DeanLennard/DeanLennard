import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import type { AuditIntentType } from "@/lib/audit-intents";
import { getDatabase } from "@/lib/mongodb";
import type { WebsiteGrowthAuditResult } from "@/lib/website-growth-audit";

export type LeadStatus =
  | "new"
  | "reviewed"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost"
  | "archived";
export type LeadLostReason =
  | "no_budget"
  | "no_response"
  | "not_a_fit"
  | "chose_competitor"
  | "duplicate"
  | "spam"
  | "other";
export type LeadQualificationFit = "strong" | "medium" | "weak";

type StoredAuditIntent = {
  type: AuditIntentType;
  at: string;
};

export type AuditTrafficMetadata = {
  sourcePage?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
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
  traffic?: AuditTrafficMetadata;
  leadStatus: LeadStatus;
  lostReason?: LeadLostReason;
  lostReasonNotes?: string;
  qualificationBudget?: string;
  qualificationTimeline?: string;
  qualificationFit?: LeadQualificationFit;
  qualificationNotes?: string;
  convertedClientId?: string;
  createdAt: string;
  updatedAt: string;
};

type CreateAuditInput = {
  url: string;
  businessName?: string;
  location?: string;
  result: WebsiteGrowthAuditResult;
  traffic?: AuditTrafficMetadata;
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
    qualificationBudget: record.qualificationBudget?.trim() || undefined,
    qualificationTimeline: record.qualificationTimeline?.trim() || undefined,
    qualificationFit: record.qualificationFit ?? undefined,
    qualificationNotes: record.qualificationNotes?.trim() || undefined,
  } satisfies StoredAuditRecord;
}

export async function createStoredAudit({
  url,
  businessName,
  location,
  result,
  traffic,
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
    traffic,
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

  if (leadStatus !== "lost") {
    update.$unset = {
      ...(update.$unset ?? {}),
      lostReason: "",
      lostReasonNotes: "",
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
    lostReason?: LeadLostReason;
    lostReasonNotes?: string;
    qualificationBudget?: string;
    qualificationTimeline?: string;
    qualificationFit?: LeadQualificationFit;
    qualificationNotes?: string;
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
      lostReason:
        input.leadStatus === "lost" ? input.lostReason ?? "other" : undefined,
      lostReasonNotes:
        input.leadStatus === "lost"
          ? input.lostReasonNotes?.trim() || undefined
          : undefined,
      qualificationBudget: input.qualificationBudget?.trim() || undefined,
      qualificationTimeline: input.qualificationTimeline?.trim() || undefined,
      qualificationFit: input.qualificationFit || undefined,
      qualificationNotes: input.qualificationNotes?.trim() || undefined,
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

  if (input.leadStatus !== "lost") {
    update.$unset = {
      ...(update.$unset ?? {}),
      lostReason: "",
      lostReasonNotes: "",
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
      lostReason: input.leadStatus === "lost" ? input.lostReason ?? "other" : null,
      qualificationFit: input.qualificationFit ?? null,
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
