import { createHmac, timingSafeEqual } from "node:crypto";

import { getPublicSiteUrl } from "@/lib/public-site";

const PUBLIC_QUOTE_LINK_SECRET =
  process.env.PUBLIC_QUOTE_LINK_SECRET?.trim() ||
  process.env.ADMIN_SESSION_SECRET?.trim() ||
  "";

const DEFAULT_LINK_TTL_DAYS = 90;

function ensureQuoteLinkSecret() {
  if (!PUBLIC_QUOTE_LINK_SECRET) {
    throw new Error(
      "Missing public quote link secret. Set PUBLIC_QUOTE_LINK_SECRET or ADMIN_SESSION_SECRET."
    );
  }
}

function createSignature(quoteId: string, expiresAt: number) {
  ensureQuoteLinkSecret();

  return createHmac("sha256", PUBLIC_QUOTE_LINK_SECRET)
    .update(`${quoteId}:${expiresAt}`)
    .digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createPublicQuoteToken(
  quoteId: string,
  expiresAt = Date.now() + DEFAULT_LINK_TTL_DAYS * 24 * 60 * 60 * 1000
) {
  const normalizedExpiry = Math.floor(expiresAt / 1000);
  return `${normalizedExpiry}.${createSignature(quoteId, normalizedExpiry)}`;
}

export function verifyPublicQuoteToken(quoteId: string, token: string | undefined) {
  if (!token) {
    return false;
  }

  const [expiresAtValue, signature] = token.split(".");

  if (!expiresAtValue || !signature) {
    return false;
  }

  const expiresAt = Number(expiresAtValue);

  if (!Number.isFinite(expiresAt)) {
    return false;
  }

  if (expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }

  return safeEqual(signature, createSignature(quoteId, expiresAt));
}

export function buildPublicQuoteUrl(quoteId: string) {
  const token = createPublicQuoteToken(quoteId);
  const url = new URL(`/quote/${quoteId}`, getPublicSiteUrl());
  url.searchParams.set("token", token);
  return url.toString();
}
