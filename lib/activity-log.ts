import { ObjectId } from "mongodb";

import { getDatabase } from "@/lib/mongodb";

export type ActivityLogRecord = {
  id: string;
  entityType: string;
  entityId: string;
  actionType: string;
  description: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean | null>;
};

function getActivityCollection() {
  return getDatabase().then((db) =>
    db.collection<ActivityLogRecord>("activity_logs")
  );
}

export async function createActivityLog({
  entityType,
  entityId,
  actionType,
  description,
  actor = "admin",
  metadata,
}: {
  entityType: string;
  entityId: string;
  actionType: string;
  description: string;
  actor?: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  const collection = await getActivityCollection();

  await collection.insertOne({
    id: new ObjectId().toHexString(),
    entityType,
    entityId,
    actionType,
    description,
    actor,
    timestamp: new Date().toISOString(),
    metadata,
  });
}

export async function listActivityLogsByEntity(entityType: string, entityId: string) {
  const collection = await getActivityCollection();
  return collection
    .find({ entityType, entityId })
    .sort({ timestamp: -1 })
    .toArray();
}

export async function listActivityLogsByEntityPage(
  entityType: string,
  entityId: string,
  input?: { offset?: number; limit?: number }
) {
  const collection = await getActivityCollection();
  const offset = Math.max(0, input?.offset ?? 0);
  const limit = Math.max(1, Math.min(50, input?.limit ?? 10));
  const query = { entityType, entityId };

  const [items, total] = await Promise.all([
    collection.find(query).sort({ timestamp: -1 }).skip(offset).limit(limit).toArray(),
    collection.countDocuments(query),
  ]);

  return {
    items,
    total,
    hasMore: offset + items.length < total,
    nextOffset: offset + items.length,
  };
}

export async function listRecentActivity(limit = 10) {
  const collection = await getActivityCollection();
  return collection.find({}).sort({ timestamp: -1 }).limit(limit).toArray();
}

export async function hasActivityLogRecord(input: {
  entityType: string;
  entityId: string;
  actionType: string;
  since?: string;
}) {
  const collection = await getActivityCollection();
  const query: Record<string, unknown> = {
    entityType: input.entityType,
    entityId: input.entityId,
    actionType: input.actionType,
  };

  if (input.since) {
    query.timestamp = { $gte: input.since };
  }

  const record = await collection.findOne(query);
  return Boolean(record);
}
