import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getDatabase } from "@/lib/mongodb";
import { createTask } from "@/lib/tasks-store";

export type RepeatingTaskFrequencyType =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "custom";

export type RepeatingTaskTemplateRecord = {
  templateId: string;
  customerId?: string;
  projectId?: string;
  title: string;
  description?: string;
  defaultPriority: "low" | "medium" | "high" | "urgent";
  estimatedMinutes?: number;
  frequencyType: RepeatingTaskFrequencyType;
  frequencyInterval: number;
  nextRunAt: string;
  lastRunAt?: string;
  active: boolean;
  taskStatusOnCreate: "todo" | "in_progress" | "review" | "done";
  autoCreateEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

function getRepeatingTaskTemplatesCollection() {
  return getDatabase().then((db) =>
    db.collection<RepeatingTaskTemplateRecord>("repeating_task_templates")
  );
}

function normalizeTemplateRecord(record: RepeatingTaskTemplateRecord) {
  return {
    ...record,
    defaultPriority: record.defaultPriority ?? "medium",
    frequencyType: record.frequencyType ?? "monthly",
    frequencyInterval: record.frequencyInterval ?? 1,
    active: record.active ?? true,
    taskStatusOnCreate: record.taskStatusOnCreate ?? "todo",
    autoCreateEnabled: record.autoCreateEnabled ?? true,
  } satisfies RepeatingTaskTemplateRecord;
}

function addInterval(dateString: string, frequencyType: RepeatingTaskFrequencyType, interval: number) {
  const date = new Date(`${dateString}T00:00:00Z`);

  switch (frequencyType) {
    case "daily":
      date.setUTCDate(date.getUTCDate() + interval);
      break;
    case "weekly":
      date.setUTCDate(date.getUTCDate() + interval * 7);
      break;
    case "monthly":
      date.setUTCMonth(date.getUTCMonth() + interval);
      break;
    case "quarterly":
      date.setUTCMonth(date.getUTCMonth() + interval * 3);
      break;
    case "yearly":
      date.setUTCFullYear(date.getUTCFullYear() + interval);
      break;
    case "custom":
      date.setUTCDate(date.getUTCDate() + interval);
      break;
  }

  return date.toISOString().slice(0, 10);
}

export async function createRepeatingTaskTemplate(input: {
  customerId?: string;
  projectId?: string;
  title: string;
  description?: string;
  defaultPriority?: "low" | "medium" | "high" | "urgent";
  estimatedMinutes?: number;
  frequencyType?: RepeatingTaskFrequencyType;
  frequencyInterval?: number;
  nextRunAt: string;
  active?: boolean;
  taskStatusOnCreate?: "todo" | "in_progress" | "review" | "done";
  autoCreateEnabled?: boolean;
}) {
  const collection = await getRepeatingTaskTemplatesCollection();
  const now = new Date().toISOString();
  const templateId = new ObjectId().toHexString();

  const record: RepeatingTaskTemplateRecord = {
    templateId,
    customerId: input.customerId || undefined,
    projectId: input.projectId || undefined,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    defaultPriority: input.defaultPriority ?? "medium",
    estimatedMinutes: input.estimatedMinutes,
    frequencyType: input.frequencyType ?? "monthly",
    frequencyInterval: input.frequencyInterval ?? 1,
    nextRunAt: input.nextRunAt,
    active: input.active ?? true,
    taskStatusOnCreate: input.taskStatusOnCreate ?? "todo",
    autoCreateEnabled: input.autoCreateEnabled ?? true,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

  await createActivityLog({
    entityType: "repeating_task_template",
    entityId: templateId,
    actionType: "repeating_task_template_created",
    description: `Repeating task template ${record.title} created.`,
    metadata: {
      customerId: record.customerId ?? null,
      projectId: record.projectId ?? null,
    },
  });

  return normalizeTemplateRecord(record);
}

export async function listRepeatingTaskTemplates(filters?: {
  customerId?: string;
  projectId?: string;
  activeOnly?: boolean;
}) {
  const collection = await getRepeatingTaskTemplatesCollection();
  const query: Record<string, unknown> = {};

  if (filters?.customerId) {
    query.customerId = filters.customerId;
  }

  if (filters?.projectId) {
    query.projectId = filters.projectId;
  }

  if (filters?.activeOnly) {
    query.active = true;
  }

  const records = await collection.find(query).sort({ nextRunAt: 1, createdAt: -1 }).toArray();
  return records.map(normalizeTemplateRecord);
}

export async function listDueRepeatingTaskTemplates(referenceDate = new Date().toISOString().slice(0, 10)) {
  const collection = await getRepeatingTaskTemplatesCollection();
  const records = await collection
    .find({
      active: true,
      autoCreateEnabled: true,
      nextRunAt: { $lte: referenceDate },
    })
    .sort({ nextRunAt: 1 })
    .toArray();

  return records.map(normalizeTemplateRecord);
}

export async function updateRepeatingTaskTemplateStatus(
  templateId: string,
  input: { active?: boolean; autoCreateEnabled?: boolean }
) {
  const collection = await getRepeatingTaskTemplatesCollection();
  await collection.updateOne(
    { templateId },
    {
      $set: {
        ...("active" in input ? { active: input.active } : {}),
        ...("autoCreateEnabled" in input
          ? { autoCreateEnabled: input.autoCreateEnabled }
          : {}),
        updatedAt: new Date().toISOString(),
      },
    }
  );
}

export async function runDueRepeatingTaskTemplates(referenceDate = new Date().toISOString().slice(0, 10)) {
  const collection = await getRepeatingTaskTemplatesCollection();
  const dueTemplates = await listDueRepeatingTaskTemplates(referenceDate);
  let createdCount = 0;

  for (const template of dueTemplates) {
    await createTask({
      projectId: template.projectId,
      customerId: template.customerId,
      title: template.title,
      description: template.description,
      status: template.taskStatusOnCreate,
      priority: template.defaultPriority,
      estimatedMinutes: template.estimatedMinutes,
      scheduledDate: template.nextRunAt,
      billable: false,
      labels: ["Recurring"],
    });

    const nextRunAt = addInterval(
      template.nextRunAt,
      template.frequencyType,
      template.frequencyInterval
    );

    await collection.updateOne(
      { templateId: template.templateId },
      {
        $set: {
          lastRunAt: template.nextRunAt,
          nextRunAt,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    await createActivityLog({
      entityType: "repeating_task_template",
      entityId: template.templateId,
      actionType: "repeating_task_generated",
      description: `Recurring task generated from template ${template.title}.`,
      metadata: {
        customerId: template.customerId ?? null,
        projectId: template.projectId ?? null,
      },
    });

    createdCount += 1;
  }

  return createdCount;
}
