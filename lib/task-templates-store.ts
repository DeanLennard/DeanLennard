import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getDatabase } from "@/lib/mongodb";
import type { TaskPriority } from "@/lib/tasks-store";

export type SavedTaskTemplateTask = {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  estimatedMinutes?: number;
  labels: string[];
};

export type TaskTemplateRecord = {
  templateId: string;
  name: string;
  description?: string;
  tasks: SavedTaskTemplateTask[];
  createdAt: string;
  updatedAt: string;
};

function getTaskTemplatesCollection() {
  return getDatabase().then((db) =>
    db.collection<TaskTemplateRecord>("task_templates")
  );
}

function normalizeTaskTemplate(record: TaskTemplateRecord) {
  return {
    ...record,
    tasks: record.tasks ?? [],
  } satisfies TaskTemplateRecord;
}

export async function createTaskTemplate(input: {
  name: string;
  description?: string;
  tasks?: Array<{
    title: string;
    description?: string;
    priority: TaskPriority;
    estimatedMinutes?: number;
    labels?: string[];
  }>;
}) {
  const collection = await getTaskTemplatesCollection();
  const templateId = new ObjectId().toHexString();
  const now = new Date().toISOString();
  const record: TaskTemplateRecord = {
    templateId,
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    tasks:
      input.tasks
        ?.filter((task) => task.title.trim())
        .map((task) => ({
          id: new ObjectId().toHexString(),
          title: task.title.trim(),
          description: task.description?.trim() || undefined,
          priority: task.priority,
          estimatedMinutes: task.estimatedMinutes,
          labels: task.labels ?? [],
        })) ?? [],
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);
  await createActivityLog({
    entityType: "task_template",
    entityId: templateId,
    actionType: "task_template_created",
    description: `Task template ${record.name} created.`,
  });

  return normalizeTaskTemplate(record);
}

export async function listTaskTemplates(search = "") {
  const collection = await getTaskTemplatesCollection();
  const query: Record<string, unknown> = {};

  if (search.trim()) {
    query.$or = [
      { templateId: search.trim() },
      { name: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
    ];
  }

  const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return records.map(normalizeTaskTemplate);
}

export async function getTaskTemplateById(templateId: string) {
  const collection = await getTaskTemplatesCollection();
  const record = await collection.findOne({ templateId });
  return record ? normalizeTaskTemplate(record) : null;
}
