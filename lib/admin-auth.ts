import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getApprovedAdminUserByUsername } from "@/lib/admin-users";

const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "";
const ADMIN_SESSION_COOKIE = "outbreak_admin_session";

function ensureAdminConfig() {
  if (!ADMIN_SESSION_SECRET) {
    throw new Error(
      "Missing admin session environment variable. Set ADMIN_SESSION_SECRET."
    );
  }
}

function signValue(value: string) {
  return createHmac("sha256", ADMIN_SESSION_SECRET).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminSessionValue(username: string) {
  ensureAdminConfig();
  const payload = username.trim().toLowerCase();
  return `${payload}.${signValue(payload)}`;
}

export function isAdminSessionSignatureValid(
  sessionValue: string | undefined
) {
  ensureAdminConfig();

  if (!sessionValue) {
    return false;
  }

  const [payload, signature] = sessionValue.split(".");
  if (!payload || !signature) {
    return false;
  }

  return safeEqual(signature, signValue(payload));
}

export async function isAdminSessionValueValid(
  sessionValue: string | undefined
) {
  if (!isAdminSessionSignatureValid(sessionValue)) {
    return false;
  }

  const [payload] = sessionValue!.split(".");

  const user = await getApprovedAdminUserByUsername(payload);
  return Boolean(user);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return isAdminSessionValueValid(sessionValue);
}

export async function requireAdminAuthentication() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }
}

export function getAdminSessionCookieName() {
  return ADMIN_SESSION_COOKIE;
}

export async function shouldDisableAnalyticsForAdminSession() {
  try {
    const cookieStore = await cookies();
    const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    return isAdminSessionSignatureValid(sessionValue);
  } catch {
    return false;
  }
}
