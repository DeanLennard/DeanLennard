import { ObjectId } from "mongodb";

import type { AuditIntentType } from "@/lib/audit-intents";
import { getDatabase } from "@/lib/mongodb";
import type { WebsiteGrowthAuditResult } from "@/lib/website-growth-audit";

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

function getAuditCollection() {
  return getDatabase().then((db) => db.collection<StoredAuditRecord>("audits"));
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
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

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
  return collection.findOne({ auditId });
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

  return collection.find(query).sort({ createdAt: -1 }).toArray();
}
