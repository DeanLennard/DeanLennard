import { ObjectId } from "mongodb";

import { getDatabase } from "@/lib/mongodb";

export type EmailLogRecord = {
  id: string;
  entityType: "quote" | "invoice";
  entityId: string;
  recipient: string;
  subject: string;
  templateUsed: string;
  deliveryStatus: "sent" | "failed";
  provider: "resend";
  providerMessageId?: string;
  sentAt: string;
  failureReason?: string;
};

function getEmailLogsCollection() {
  return getDatabase().then((db) => db.collection<EmailLogRecord>("email_logs"));
}

export async function createEmailLog(input: Omit<EmailLogRecord, "id" | "sentAt">) {
  const collection = await getEmailLogsCollection();
  const record: EmailLogRecord = {
    id: new ObjectId().toHexString(),
    sentAt: new Date().toISOString(),
    ...input,
  };

  await collection.insertOne(record);
  return record;
}

export async function listEmailLogsByEntity(entityType: "quote" | "invoice", entityId: string) {
  const collection = await getEmailLogsCollection();
  return collection.find({ entityType, entityId }).sort({ sentAt: -1 }).toArray();
}
