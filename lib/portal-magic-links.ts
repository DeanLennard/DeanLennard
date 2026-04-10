import { createHash, randomBytes } from "node:crypto";

import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getClientById } from "@/lib/clients-store";
import { buildPortalMagicLinkEmailTemplate } from "@/lib/email-templates";
import { createEmailLog } from "@/lib/email-logs-store";
import { getDatabase } from "@/lib/mongodb";
import { sendResendEmail } from "@/lib/resend-email";
import {
  getPortalUserByEmail,
  markPortalMagicLinkSent,
  type PortalUserRecord,
} from "@/lib/portal-users";
import { getPublicSiteUrl } from "@/lib/public-site";

const PORTAL_MAGIC_LINK_TTL_MINUTES = 30;

export type PortalMagicLinkRecord = {
  magicLinkId: string;
  portalUserId: string;
  clientId: string;
  email: string;
  tokenHash: string;
  expiresAt: string;
  consumedAt?: string;
  createdAt: string;
};

function getPortalMagicLinksCollection() {
  return getDatabase().then((db) =>
    db.collection<PortalMagicLinkRecord>("portal_magic_links")
  );
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function buildPortalMagicLinkUrl(token: string) {
  return new URL(
    `/api/portal/magic-link?token=${encodeURIComponent(token)}`,
    getPublicSiteUrl()
  ).toString();
}

async function createPortalMagicLink(portalUser: PortalUserRecord) {
  const collection = await getPortalMagicLinksCollection();
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const createdAt = now.toISOString();
  const expiresAt = new Date(
    now.getTime() + PORTAL_MAGIC_LINK_TTL_MINUTES * 60 * 1000
  ).toISOString();

  await collection.insertOne({
    magicLinkId: new ObjectId().toHexString(),
    portalUserId: portalUser.portalUserId,
    clientId: portalUser.clientId,
    email: portalUser.email,
    tokenHash: hashToken(token),
    expiresAt,
    createdAt,
  });

  return {
    token,
    expiresAt,
    url: buildPortalMagicLinkUrl(token),
  };
}

export async function sendPortalMagicLink(email: string) {
  const portalUser = await getPortalUserByEmail(email);

  if (!portalUser) {
    return { status: "ignored" as const };
  }

  const client = await getClientById(portalUser.clientId);
  const magicLink = await createPortalMagicLink(portalUser);
  const subject = `Your secure sign-in link for the ${client?.businessName || "client"} portal`;
  const html = buildPortalMagicLinkEmailTemplate({
    recipientName: client?.contactName || client?.businessName || portalUser.email,
    businessName: client?.businessName || "your account",
    magicLinkHref: magicLink.url,
    expiryMinutes: PORTAL_MAGIC_LINK_TTL_MINUTES,
  });

  const result = await sendResendEmail({
    to: portalUser.email,
    subject,
    html,
  });

  await markPortalMagicLinkSent(portalUser.portalUserId);

  await createEmailLog({
    entityType: "client",
    entityId: portalUser.clientId,
    recipient: portalUser.email,
    subject,
    templateUsed: "portal_magic_link",
    deliveryStatus: "sent",
    provider: "resend",
    providerMessageId: result.id,
  });

  await createActivityLog({
    entityType: "client",
    entityId: portalUser.clientId,
    actionType: "portal_magic_link_sent",
    description: `Portal sign-in link sent to ${portalUser.email}.`,
    metadata: {
      portalUserId: portalUser.portalUserId,
    },
  });

  return {
    status: "sent" as const,
    portalUser,
  };
}

export async function consumePortalMagicLink(token: string) {
  const collection = await getPortalMagicLinksCollection();
  const record = await collection.findOne({
    tokenHash: hashToken(token),
  });

  if (!record) {
    return null;
  }

  if (record.consumedAt) {
    return null;
  }

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return null;
  }

  await collection.updateOne(
    { magicLinkId: record.magicLinkId },
    {
      $set: {
        consumedAt: new Date().toISOString(),
      },
    }
  );

  const portalUser = await getPortalUserByEmail(record.email);

  if (!portalUser || portalUser.portalUserId !== record.portalUserId) {
    return null;
  }

  return portalUser;
}
