import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getClientById } from "@/lib/clients-store";
import { getDatabase } from "@/lib/mongodb";
import { getProjectById, recalculateProjectCostsFromTasks } from "@/lib/projects-store";
import { getTaskById, recalculateTaskTotalsFromTimeEntries } from "@/lib/tasks-store";

export type TimeEntryRecord = {
  id: string;
  taskId: string;
  projectId?: string;
  customerId?: string;
  entryDate: string;
  durationMinutes: number;
  description?: string;
  internalHourlyRate: number;
  costAmount: number;
  billable: boolean;
  createdAt: string;
};

function getTimeEntriesCollection() {
  return getDatabase().then((db) => db.collection<TimeEntryRecord>("time_entries"));
}

export function calculateTimeEntryCost(durationMinutes: number, internalHourlyRate: number) {
  return (durationMinutes / 60) * internalHourlyRate;
}

export async function addTimeEntry(input: {
  taskId: string;
  entryDate: string;
  durationMinutes: number;
  description?: string;
  internalHourlyRate: number;
  billable: boolean;
}) {
  const task = await getTaskById(input.taskId);

  if (!task) {
    throw new Error("Task not found.");
  }

  const project = task.projectId ? await getProjectById(task.projectId) : null;
  const resolvedCustomerId = task.customerId ?? project?.customerId;
  const client = resolvedCustomerId ? await getClientById(resolvedCustomerId) : null;
  const derivedHourlyRate =
    input.internalHourlyRate > 0
      ? input.internalHourlyRate
      : client?.defaultHourlyInternalCost ?? 0;

  const now = new Date().toISOString();
  const record: TimeEntryRecord = {
    id: new ObjectId().toHexString(),
    taskId: task.taskId,
    projectId: task.projectId,
    customerId: resolvedCustomerId,
    entryDate: input.entryDate,
    durationMinutes: input.durationMinutes,
    description: input.description?.trim() || undefined,
    internalHourlyRate: derivedHourlyRate,
    costAmount: calculateTimeEntryCost(input.durationMinutes, derivedHourlyRate),
    billable: input.billable,
    createdAt: now,
  };

  const collection = await getTimeEntriesCollection();
  await collection.insertOne(record);

  await recalculateTaskTotalsFromTimeEntries(task.taskId);

  if (task.projectId) {
    await recalculateProjectCostsFromTasks(task.projectId);
  }

  await createActivityLog({
    entityType: "task",
    entityId: task.taskId,
    actionType: "time_entry_added",
    description: `Time entry added for ${input.durationMinutes} minutes.`,
    metadata: {
      projectId: task.projectId ?? null,
      costAmount: record.costAmount,
    },
  });

  if (task.projectId) {
    await createActivityLog({
      entityType: "project",
      entityId: task.projectId,
      actionType: "time_entry_added",
      description: `Time logged against task ${task.title}.`,
      metadata: {
        taskId: task.taskId,
        minutes: input.durationMinutes,
        costAmount: record.costAmount,
      },
    });
  }

  if (resolvedCustomerId) {
    await createActivityLog({
      entityType: "client",
      entityId: resolvedCustomerId,
      actionType: "time_entry_added",
      description: `Time logged against task ${task.title}.`,
      metadata: {
        taskId: task.taskId,
        minutes: input.durationMinutes,
        costAmount: record.costAmount,
      },
    });
  }

  return record;
}

export async function listTimeEntriesByTaskId(taskId: string) {
  const collection = await getTimeEntriesCollection();
  return collection.find({ taskId }).sort({ createdAt: -1 }).toArray();
}

export async function listTimeEntriesByProjectId(projectId: string) {
  const collection = await getTimeEntriesCollection();
  return collection.find({ projectId }).sort({ createdAt: -1 }).toArray();
}
