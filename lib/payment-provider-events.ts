import { getDatabase } from "@/lib/mongodb";

export type PaymentProvider = "stripe" | "gocardless";

export type PaymentProviderEventLogRecord = {
  provider: PaymentProvider;
  eventId: string;
  eventType: string;
  status: "received" | "processed" | "ignored" | "failed" | "invalid_signature";
  invoiceId?: string;
  payload: string;
  receivedAt: string;
  processedAt?: string;
  failureReason?: string;
};

function getPaymentProviderEventsCollection() {
  return getDatabase().then((db) =>
    db.collection<PaymentProviderEventLogRecord>("payment_provider_events")
  );
}

export async function getPaymentProviderEvent(
  provider: PaymentProvider,
  eventId: string
) {
  const collection = await getPaymentProviderEventsCollection();
  return collection.findOne({ provider, eventId });
}

export async function upsertPaymentProviderEventLog(
  input: PaymentProviderEventLogRecord
) {
  const collection = await getPaymentProviderEventsCollection();

  await collection.updateOne(
    { provider: input.provider, eventId: input.eventId },
    {
      $set: input,
    },
    { upsert: true }
  );
}

export async function listPaymentProviderEvents(filters?: {
  provider?: PaymentProvider | "all";
  status?: PaymentProviderEventLogRecord["status"] | "all";
}) {
  const collection = await getPaymentProviderEventsCollection();
  const query: Record<string, unknown> = {};

  if (filters?.provider && filters.provider !== "all") {
    query.provider = filters.provider;
  }

  if (filters?.status && filters.status !== "all") {
    query.status = filters.status;
  }

  return collection.find(query).sort({ receivedAt: -1 }).limit(100).toArray();
}
