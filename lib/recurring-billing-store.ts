import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import {
  createInvoice,
  linkInvoiceProviderReferences,
  type InvoicePaymentMethod,
  updateInvoiceStatus,
} from "@/lib/invoices-store";
import { getDatabase } from "@/lib/mongodb";
import {
  createGoCardlessBillingRequestForInvoice,
  createStripeInvoiceForLocalInvoice,
} from "@/lib/payment-provider-clients";
import { sendInvoiceEmailTemplate } from "@/lib/invoice-email";
import { getAppSettings } from "@/lib/settings-store";

export type RecurringBillingProvider = "stripe" | "gocardless" | "manual";
export type RecurringBillingFrequency = "weekly" | "monthly" | "quarterly" | "yearly";
export type RecurringBillingStatus = "active" | "paused" | "cancelled";
export type CarePlanTier = "basic" | "standard" | "growth" | "custom";

export type RecurringInvoiceLineItemTemplate = {
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;
};

export type RecurringInvoiceScheduleRecord = {
  scheduleId: string;
  customerId: string;
  projectId?: string;
  title: string;
  status: RecurringBillingStatus;
  billingProvider: RecurringBillingProvider;
  frequency: RecurringBillingFrequency;
  intervalCount: number;
  nextInvoiceDate: string;
  lastInvoiceDate?: string;
  amount: number;
  currency: string;
  taxRate: number;
  paymentTermsDays: number;
  lineItemsTemplate: RecurringInvoiceLineItemTemplate[];
  autoSend: boolean;
  autoCollect: boolean;
  carePlanTier: CarePlanTier;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

function getRecurringInvoiceSchedulesCollection() {
  return getDatabase().then((db) =>
    db.collection<RecurringInvoiceScheduleRecord>("recurring_invoice_schedules")
  );
}

function normalizeSchedule(record: RecurringInvoiceScheduleRecord) {
  return {
    ...record,
    status: record.status ?? "active",
    billingProvider: record.billingProvider ?? "manual",
    frequency: record.frequency ?? "monthly",
    intervalCount: record.intervalCount ?? 1,
    currency: record.currency ?? "GBP",
    taxRate: record.taxRate ?? 0,
    paymentTermsDays: record.paymentTermsDays ?? 14,
    lineItemsTemplate: record.lineItemsTemplate ?? [],
    autoSend: record.autoSend ?? false,
    autoCollect: record.autoCollect ?? false,
    carePlanTier: record.carePlanTier ?? "custom",
  } satisfies RecurringInvoiceScheduleRecord;
}

function addRecurringInterval(
  dateString: string,
  frequency: RecurringBillingFrequency,
  intervalCount: number
) {
  const date = new Date(`${dateString}T00:00:00Z`);

  switch (frequency) {
    case "weekly":
      date.setUTCDate(date.getUTCDate() + intervalCount * 7);
      break;
    case "monthly":
      date.setUTCMonth(date.getUTCMonth() + intervalCount);
      break;
    case "quarterly":
      date.setUTCMonth(date.getUTCMonth() + intervalCount * 3);
      break;
    case "yearly":
      date.setUTCFullYear(date.getUTCFullYear() + intervalCount);
      break;
  }

  return date.toISOString().slice(0, 10);
}

export async function createRecurringInvoiceSchedule(input: {
  customerId: string;
  projectId?: string;
  title: string;
  status?: RecurringBillingStatus;
  billingProvider?: RecurringBillingProvider;
  frequency?: RecurringBillingFrequency;
  intervalCount?: number;
  nextInvoiceDate: string;
  amount: number;
  currency?: string;
  taxRate?: number;
  paymentTermsDays?: number;
  lineItemsTemplate?: RecurringInvoiceLineItemTemplate[];
  autoSend?: boolean;
  autoCollect?: boolean;
  carePlanTier?: CarePlanTier;
  notes?: string;
}) {
  const collection = await getRecurringInvoiceSchedulesCollection();
  const settings = await getAppSettings();
  const now = new Date().toISOString();
  const scheduleId = new ObjectId().toHexString();

  const record: RecurringInvoiceScheduleRecord = {
    scheduleId,
    customerId: input.customerId,
    projectId: input.projectId || undefined,
    title: input.title.trim(),
    status: input.status ?? "active",
    billingProvider: input.billingProvider ?? "manual",
    frequency: input.frequency ?? "monthly",
    intervalCount: input.intervalCount ?? 1,
    nextInvoiceDate: input.nextInvoiceDate,
    amount: input.amount,
    currency: input.currency || settings.defaultCurrency,
    taxRate: input.taxRate ?? 0,
    paymentTermsDays: input.paymentTermsDays ?? settings.defaultPaymentTerms,
    lineItemsTemplate:
      input.lineItemsTemplate && input.lineItemsTemplate.length > 0
        ? input.lineItemsTemplate
        : [
            {
              title: input.title.trim(),
              quantity: 1,
              unitPrice: input.amount,
            },
          ],
    autoSend: input.autoSend ?? false,
    autoCollect: input.autoCollect ?? false,
    carePlanTier: input.carePlanTier ?? "custom",
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

  await createActivityLog({
    entityType: "recurring_schedule",
    entityId: scheduleId,
    actionType: "recurring_schedule_created",
    description: `Recurring schedule ${record.title} created.`,
    metadata: {
      customerId: record.customerId,
      projectId: record.projectId ?? null,
      billingProvider: record.billingProvider,
    },
  });

  return normalizeSchedule(record);
}

export async function listRecurringInvoiceSchedules(filters?: {
  customerId?: string;
  projectId?: string;
  status?: RecurringBillingStatus | "all";
}) {
  const collection = await getRecurringInvoiceSchedulesCollection();
  const query: Record<string, unknown> = {};

  if (filters?.customerId) {
    query.customerId = filters.customerId;
  }

  if (filters?.projectId) {
    query.projectId = filters.projectId;
  }

  if (filters?.status && filters.status !== "all") {
    query.status = filters.status;
  }

  const records = await collection
    .find(query)
    .sort({ nextInvoiceDate: 1, createdAt: -1 })
    .toArray();

  return records.map(normalizeSchedule);
}

export async function getRecurringInvoiceScheduleById(scheduleId: string) {
  const collection = await getRecurringInvoiceSchedulesCollection();
  const record = await collection.findOne({ scheduleId });
  return record ? normalizeSchedule(record) : null;
}

export async function listDueRecurringInvoiceSchedules(referenceDate = new Date().toISOString().slice(0, 10)) {
  const collection = await getRecurringInvoiceSchedulesCollection();
  const records = await collection
    .find({
      status: "active",
      nextInvoiceDate: { $lte: referenceDate },
    })
    .sort({ nextInvoiceDate: 1 })
    .toArray();

  return records.map(normalizeSchedule);
}

export async function updateRecurringInvoiceScheduleStatus(
  scheduleId: string,
  status: RecurringBillingStatus
) {
  const collection = await getRecurringInvoiceSchedulesCollection();
  await collection.updateOne(
    { scheduleId },
    {
      $set: {
        status,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  await createActivityLog({
    entityType: "recurring_schedule",
    entityId: scheduleId,
    actionType: "recurring_schedule_status_updated",
    description: `Recurring schedule status changed to ${status}.`,
    metadata: {
      status,
    },
  });
}

async function createProviderBillingForRecurringInvoice(
  schedule: RecurringInvoiceScheduleRecord,
  invoice: Awaited<ReturnType<typeof createInvoice>>
) {
  try {
    if (schedule.autoCollect && schedule.billingProvider === "stripe") {
      const stripeResult = await createStripeInvoiceForLocalInvoice({
        clientId: schedule.customerId,
        invoiceId: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        description: schedule.notes || schedule.title,
        dueDate: invoice.dueDate,
        currency: invoice.currency,
        lineItems: invoice.lineItems,
      });

      await linkInvoiceProviderReferences(invoice.invoiceId, {
        stripeInvoiceId: stripeResult.stripeInvoiceId,
        stripeHostedInvoiceUrl: stripeResult.hostedInvoiceUrl,
      });
      await updateInvoiceStatus(invoice.invoiceId, "sent");
    }

    if (schedule.autoCollect && schedule.billingProvider === "gocardless") {
      const gocardlessResult = await createGoCardlessBillingRequestForInvoice({
        clientId: schedule.customerId,
        invoiceId: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        description: schedule.notes || schedule.title,
        total: invoice.total,
        currency: invoice.currency,
      });

      await linkInvoiceProviderReferences(invoice.invoiceId, {
        gocardlessBillingRequestId: gocardlessResult.billingRequestId,
        gocardlessPaymentUrl: gocardlessResult.paymentUrl,
      });
      await updateInvoiceStatus(invoice.invoiceId, "sent");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Automatic provider creation failed.";
    await createActivityLog({
      entityType: "invoice",
      entityId: invoice.invoiceId,
      actionType: "provider_sync_failed",
      description: `Automatic provider billing failed for ${invoice.invoiceNumber}.`,
      metadata: {
        scheduleId: schedule.scheduleId,
        error: message,
      },
    });
    throw error;
  }
}

export async function generateInvoiceForRecurringSchedule(
  scheduleId: string,
  options?: {
    sendEmail?: boolean;
    referenceDate?: string;
    advanceSchedule?: boolean;
  }
) {
  const collection = await getRecurringInvoiceSchedulesCollection();
  const schedule = await getRecurringInvoiceScheduleById(scheduleId);

  if (!schedule) {
    throw new Error("Recurring schedule not found.");
  }

  const issueDate = options?.referenceDate ?? schedule.nextInvoiceDate;
  const invoice = await createInvoice({
    customerId: schedule.customerId,
    projectId: schedule.projectId,
    recurringScheduleId: schedule.scheduleId,
    dueDate: new Date(
      new Date(`${issueDate}T00:00:00Z`).getTime() +
        schedule.paymentTermsDays * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(0, 10),
    currency: schedule.currency,
    taxRate: schedule.taxRate,
    paymentMethod:
      (schedule.billingProvider === "manual"
        ? "manual"
        : schedule.billingProvider) as InvoicePaymentMethod,
    notes: schedule.notes,
    lineItems: schedule.lineItemsTemplate,
  });

  let providerSyncError: string | null = null;

  if (schedule.autoCollect) {
    try {
      await createProviderBillingForRecurringInvoice(schedule, invoice);
    } catch (error) {
      providerSyncError =
        error instanceof Error ? error.message : "Automatic provider creation failed.";
    }
  }

  if (options?.advanceSchedule !== false) {
    const nextInvoiceDate = addRecurringInterval(
      schedule.nextInvoiceDate,
      schedule.frequency,
      schedule.intervalCount
    );

    await collection.updateOne(
      { scheduleId: schedule.scheduleId },
      {
        $set: {
          lastInvoiceDate: schedule.nextInvoiceDate,
          nextInvoiceDate,
          updatedAt: new Date().toISOString(),
        },
      }
    );
  }

  await createActivityLog({
    entityType: "recurring_schedule",
    entityId: schedule.scheduleId,
    actionType: "recurring_invoice_generated",
    description: `Recurring invoice generated for ${schedule.title}.`,
    metadata: {
      invoiceId: invoice.invoiceId,
      customerId: schedule.customerId,
      projectId: schedule.projectId ?? null,
    },
  });

  if (options?.sendEmail ?? schedule.autoSend) {
    try {
      await sendInvoiceEmailTemplate(invoice.invoiceId, "recurring_invoice_created");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Recurring invoice email failed.";
      await createActivityLog({
        entityType: "invoice",
        entityId: invoice.invoiceId,
        actionType: "invoice_email_failed",
        description: `Recurring invoice email failed for ${invoice.invoiceNumber}.`,
        metadata: {
          scheduleId: schedule.scheduleId,
          error: message,
        },
      });
    }
  }

  return {
    invoice,
    providerSyncError,
  };
}

export async function runDueRecurringInvoices(
  referenceDate = new Date().toISOString().slice(0, 10)
) {
  const dueSchedules = await listDueRecurringInvoiceSchedules(referenceDate);
  let createdCount = 0;

  for (const schedule of dueSchedules) {
    await generateInvoiceForRecurringSchedule(schedule.scheduleId, {
      referenceDate,
      advanceSchedule: true,
    });
    createdCount += 1;
  }

  return createdCount;
}
