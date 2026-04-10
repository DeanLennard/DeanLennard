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

export async function listRecentActivity(limit = 10) {
  const collection = await getActivityCollection();
  return collection.find({}).sort({ timestamp: -1 }).limit(limit).toArray();
}
