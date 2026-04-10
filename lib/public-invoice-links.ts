import { createHmac, timingSafeEqual } from "node:crypto";

import { getPublicSiteUrl } from "@/lib/public-site";

const PUBLIC_INVOICE_LINK_SECRET =
  process.env.PUBLIC_INVOICE_LINK_SECRET?.trim() ||
  process.env.ADMIN_SESSION_SECRET?.trim() ||
  "";

const DEFAULT_LINK_TTL_DAYS = 90;

function ensureInvoiceLinkSecret() {
  if (!PUBLIC_INVOICE_LINK_SECRET) {
    throw new Error(
      "Missing public invoice link secret. Set PUBLIC_INVOICE_LINK_SECRET or ADMIN_SESSION_SECRET."
    );
  }
}

function createSignature(invoiceId: string, expiresAt: number) {
  ensureInvoiceLinkSecret();

  return createHmac("sha256", PUBLIC_INVOICE_LINK_SECRET)
    .update(`${invoiceId}:${expiresAt}`)
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

export function createPublicInvoiceToken(
  invoiceId: string,
  expiresAt = Date.now() + DEFAULT_LINK_TTL_DAYS * 24 * 60 * 60 * 1000
) {
  const normalizedExpiry = Math.floor(expiresAt / 1000);
  return `${normalizedExpiry}.${createSignature(invoiceId, normalizedExpiry)}`;
}

export function verifyPublicInvoiceToken(invoiceId: string, token: string | undefined) {
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

  return safeEqual(signature, createSignature(invoiceId, expiresAt));
}

export function buildPublicInvoiceUrl(invoiceId: string) {
  const token = createPublicInvoiceToken(invoiceId);
  const url = new URL(`/invoice/${invoiceId}`, getPublicSiteUrl());
  url.searchParams.set("token", token);
  return url.toString();
}
