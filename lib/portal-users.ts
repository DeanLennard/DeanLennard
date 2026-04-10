import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getDatabase } from "@/lib/mongodb";

export type PortalUserRole = "owner" | "member";

export type PortalUserRecord = {
  portalUserId: string;
  clientId: string;
  email: string;
  normalizedEmail: string;
  role: PortalUserRole;
  active: boolean;
  invitedAt?: string;
  lastMagicLinkSentAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
};

function getPortalUsersCollection() {
  return getDatabase().then((db) =>
    db.collection<PortalUserRecord>("portal_users")
  );
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePortalUserRecord(record: PortalUserRecord) {
  return {
    ...record,
    role: record.role ?? "owner",
    active: record.active ?? true,
  } satisfies PortalUserRecord;
}

export async function createPortalUser(input: {
  clientId: string;
  email: string;
  role?: PortalUserRole;
}) {
  const collection = await getPortalUsersCollection();
  const normalizedEmail = normalizeEmail(input.email);

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  const existing = await collection.findOne({
    normalizedEmail,
    clientId: input.clientId,
  });

  if (existing) {
    throw new Error("A portal user with that email already exists for this client.");
  }

  const now = new Date().toISOString();
  const record: PortalUserRecord = {
    portalUserId: new ObjectId().toHexString(),
    clientId: input.clientId,
    email: input.email.trim(),
    normalizedEmail,
    role: input.role ?? "owner",
    active: true,
    invitedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

  await createActivityLog({
    entityType: "client",
    entityId: input.clientId,
    actionType: "portal_user_created",
    description: `Portal access added for ${record.email}.`,
    metadata: {
      portalUserId: record.portalUserId,
      role: record.role,
    },
  });

  return normalizePortalUserRecord(record);
}

export async function listPortalUsersByClientId(clientId: string) {
  const collection = await getPortalUsersCollection();
  const records = await collection.find({ clientId }).sort({ createdAt: -1 }).toArray();
  return records.map(normalizePortalUserRecord);
}

export async function getPortalUserByEmail(email: string) {
  const collection = await getPortalUsersCollection();
  const record = await collection.findOne({
    normalizedEmail: normalizeEmail(email),
    active: true,
  });

  return record ? normalizePortalUserRecord(record) : null;
}

export async function getPortalUserById(portalUserId: string) {
  const collection = await getPortalUsersCollection();
  const record = await collection.findOne({
    portalUserId,
    active: true,
  });

  return record ? normalizePortalUserRecord(record) : null;
}

export async function markPortalMagicLinkSent(portalUserId: string) {
  const collection = await getPortalUsersCollection();
  const now = new Date().toISOString();

  await collection.updateOne(
    { portalUserId },
    {
      $set: {
        lastMagicLinkSentAt: now,
        updatedAt: now,
      },
    }
  );
}

export async function markPortalUserLoggedIn(portalUserId: string) {
  const collection = await getPortalUsersCollection();
  const now = new Date().toISOString();

  await collection.updateOne(
    { portalUserId },
    {
      $set: {
        lastLoginAt: now,
        updatedAt: now,
      },
    }
  );
}
