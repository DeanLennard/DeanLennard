import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getPortalUserByEmail } from "@/lib/portal-users";

const PORTAL_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "";
const PORTAL_SESSION_COOKIE = "outbreak_portal_session";

function ensurePortalConfig() {
  if (!PORTAL_SESSION_SECRET) {
    throw new Error("Missing admin session environment variable. Set ADMIN_SESSION_SECRET.");
  }
}

function signValue(value: string) {
  return createHmac("sha256", PORTAL_SESSION_SECRET).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createPortalSessionValue(email: string) {
  ensurePortalConfig();
  const payload = email.trim().toLowerCase();
  return `${payload}.${signValue(payload)}`;
}

function parsePortalSessionValue(sessionValue: string | undefined) {
  if (!sessionValue) {
    return null;
  }

  const separatorIndex = sessionValue.lastIndexOf(".");

  if (separatorIndex <= 0 || separatorIndex === sessionValue.length - 1) {
    return null;
  }

  return {
    payload: sessionValue.slice(0, separatorIndex),
    signature: sessionValue.slice(separatorIndex + 1),
  };
}

function isPortalSessionSignatureValid(sessionValue: string | undefined) {
  ensurePortalConfig();

  const parsed = parsePortalSessionValue(sessionValue);

  if (!parsed) {
    return false;
  }

  return safeEqual(parsed.signature, signValue(parsed.payload));
}

export async function getAuthenticatedPortalUser() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;

  if (!sessionValue || !isPortalSessionSignatureValid(sessionValue)) {
    return null;
  }

  const parsed = parsePortalSessionValue(sessionValue);

  if (!parsed) {
    return null;
  }

  return getPortalUserByEmail(parsed.payload);
}

export async function requirePortalAuthentication() {
  const user = await getAuthenticatedPortalUser();

  if (!user) {
    redirect("/portal/login");
  }

  return user;
}

export function getPortalSessionCookieName() {
  return PORTAL_SESSION_COOKIE;
}
