import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { getDatabase } from "@/lib/mongodb";

export type AdminUserRecord = {
  username: string;
  normalizedUsername: string;
  passwordHash: string;
  salt: string;
  approved: boolean;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
};

function getAdminUsersCollection() {
  return getDatabase().then((db) =>
    db.collection<AdminUserRecord>("admin_users")
  );
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function registerAdminUser(username: string, password: string) {
  const trimmedUsername = username.trim();
  const normalizedUsername = normalizeUsername(username);

  if (!trimmedUsername || !password.trim()) {
    throw new Error("Username and password are required.");
  }

  const collection = await getAdminUsersCollection();
  const existing = await collection.findOne({ normalizedUsername });

  if (existing) {
    throw new Error("An admin account with that username already exists.");
  }

  const now = new Date().toISOString();
  const salt = randomBytes(16).toString("hex");
  const record: AdminUserRecord = {
    username: trimmedUsername,
    normalizedUsername,
    passwordHash: hashPassword(password, salt),
    salt,
    approved: false,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);
}

export async function validateAdminLogin(username: string, password: string) {
  const normalizedUsername = normalizeUsername(username);
  const collection = await getAdminUsersCollection();
  const user = await collection.findOne({ normalizedUsername });

  if (!user) {
    return {
      status: "invalid" as const,
    };
  }

  const passwordHash = hashPassword(password, user.salt);
  if (!safeEqual(passwordHash, user.passwordHash)) {
    return {
      status: "invalid" as const,
    };
  }

  if (!user.approved) {
    return {
      status: "pending" as const,
      user,
    };
  }

  return {
    status: "success" as const,
    user,
  };
}

export async function getApprovedAdminUserByUsername(username: string) {
  const collection = await getAdminUsersCollection();
  return collection.findOne({
    normalizedUsername: normalizeUsername(username),
    approved: true,
  });
}
