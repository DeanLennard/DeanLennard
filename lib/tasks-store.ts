import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getClientById } from "@/lib/clients-store";
import { getDatabase } from "@/lib/mongodb";
import { getProjectById } from "@/lib/projects-store";

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskRecord = {
  taskId: string;
  taskKey: string;
  sortOrder: number;
  projectId?: string;
  customerId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  scheduledDate?: string;
  completedAt?: string;
  estimatedMinutes?: number;
  actualMinutes: number;
  internalCostTotal: number;
  billable: boolean;
  labels: string[];
  createdAt: string;
  updatedAt: string;
};

function getTasksCollection() {
  return getDatabase().then((db) =>
    db.collection<Omit<TaskRecord, "taskKey" | "sortOrder"> & {
      taskKey?: string;
      sortOrder?: number;
    }>("tasks")
  );
}

async function getNextTaskKey() {
  const db = await getDatabase();
  const counter = await db
    .collection<{ key: string; value: number }>("counters")
    .findOneAndUpdate(
    { key: "task_key" },
    {
      $inc: { value: 1 },
      $setOnInsert: { key: "task_key" },
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  const value =
    typeof counter?.value === "number" && Number.isFinite(counter.value)
      ? counter.value
      : 1;

  return `DL-${value}`;
}

function parseTaskKeyNumber(taskKey: string | undefined) {
  if (!taskKey) {
    return null;
  }

  const match = /^DL-(\d+)$/.exec(taskKey.trim().toUpperCase());
  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

async function getMaxExistingTaskKeyNumber() {
  const collection = await getTasksCollection();
  const records = await collection
    .find(
      { taskKey: { $regex: /^DL-\d+$/ } },
      { projection: { taskKey: 1 } }
    )
    .toArray();

  return records.reduce((max, record) => {
    const parsed = parseTaskKeyNumber(record.taskKey);
    return parsed && parsed > max ? parsed : max;
  }, 0);
}

async function reserveUniqueTaskKey() {
  const db = await getDatabase();
  const collection = await getTasksCollection();
  let candidate = await getNextTaskKey();
  let candidateNumber = parseTaskKeyNumber(candidate) ?? 0;
  const maxExisting = await getMaxExistingTaskKeyNumber();

  if (candidateNumber <= maxExisting) {
    candidateNumber = maxExisting + 1;
    candidate = `DL-${candidateNumber}`;
    await db
      .collection<{ key: string; value: number }>("counters")
      .updateOne(
        { key: "task_key" },
        {
          $set: {
            value: candidateNumber,
          },
        },
        { upsert: true }
      );
  }

  let existing = await collection.findOne({ taskKey: candidate });

  while (existing) {
    candidateNumber += 1;
    candidate = `DL-${candidateNumber}`;
    existing = await collection.findOne({ taskKey: candidate });
  }

  await db
    .collection<{ key: string; value: number }>("counters")
    .updateOne(
      { key: "task_key" },
      {
        $set: {
          value: candidateNumber,
        },
      },
      { upsert: true }
    );

  return candidate;
}

function normalizeTaskRecord(
  record: Omit<TaskRecord, "taskKey" | "sortOrder"> & {
    taskKey?: string;
    sortOrder?: number;
  }
) {
  const { _id: _unusedId, ...plainRecord } = record as typeof record & {
    _id?: unknown;
  };

  return {
    ...plainRecord,
    taskKey: plainRecord.taskKey ?? "DL-PENDING",
    sortOrder: typeof plainRecord.sortOrder === "number" ? plainRecord.sortOrder : 0,
    status: plainRecord.status ?? "todo",
    priority: plainRecord.priority ?? "medium",
    actualMinutes: plainRecord.actualMinutes ?? 0,
    internalCostTotal: plainRecord.internalCostTotal ?? 0,
    billable: plainRecord.billable ?? false,
    labels: plainRecord.labels ?? [],
  } satisfies TaskRecord;
}

async function ensureTaskKey(
  record: Omit<TaskRecord, "taskKey" | "sortOrder"> & {
    taskKey?: string;
    sortOrder?: number;
  }
) {
  const collection = await getTasksCollection();

  if (record.taskKey) {
    const duplicate = await collection.findOne({
      taskKey: record.taskKey,
      taskId: { $ne: record.taskId },
    });

    if (!duplicate) {
      return normalizeTaskRecord(record);
    }
  }

  const taskKey = await reserveUniqueTaskKey();
  await collection.updateOne(
    { taskId: record.taskId },
    {
      $set: {
        taskKey,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  return normalizeTaskRecord({
    ...record,
    taskKey,
  });
}

async function getNextTaskSortOrder(status: TaskStatus) {
  const collection = await getTasksCollection();
  const existing = await collection
    .find({ status })
    .sort({ sortOrder: -1 })
    .limit(1)
    .toArray();

  return typeof existing[0]?.sortOrder === "number" ? existing[0].sortOrder + 1 : 1;
}

export async function createTask(input: {
  projectId?: string;
  customerId?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  scheduledDate?: string;
  estimatedMinutes?: number;
  billable?: boolean;
  labels?: string[];
}) {
  const collection = await getTasksCollection();
  const now = new Date().toISOString();
  const taskId = new ObjectId().toHexString();
  const taskKey = await reserveUniqueTaskKey();
  const status = input.status ?? "todo";
  const sortOrder = await getNextTaskSortOrder(status);

  let resolvedCustomerId = input.customerId || undefined;

  if (!resolvedCustomerId && input.projectId) {
    const project = await getProjectById(input.projectId);
    resolvedCustomerId = project?.customerId;
  }

  const record: TaskRecord = {
    taskId,
    taskKey,
    projectId: input.projectId || undefined,
    customerId: resolvedCustomerId,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    status,
    sortOrder,
    priority: input.priority ?? "medium",
    dueDate: input.dueDate || undefined,
    scheduledDate: input.scheduledDate || undefined,
    estimatedMinutes: input.estimatedMinutes,
    actualMinutes: 0,
    internalCostTotal: 0,
    billable: input.billable ?? false,
    labels: input.labels ?? [],
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

  await createActivityLog({
    entityType: "task",
    entityId: taskId,
    actionType: "task_created",
    description: `Task ${record.title} created.`,
    metadata: {
      projectId: record.projectId ?? null,
      customerId: record.customerId ?? null,
      status: record.status,
    },
  });

  if (record.projectId) {
    await createActivityLog({
      entityType: "project",
      entityId: record.projectId,
      actionType: "task_created",
      description: `Task ${record.title} created for this project.`,
      metadata: {
        taskId,
        status: record.status,
      },
    });
  }

  if (record.customerId) {
    await createActivityLog({
      entityType: "client",
      entityId: record.customerId,
      actionType: "task_created",
      description: `Task ${record.title} created for this client.`,
      metadata: {
        taskId,
        projectId: record.projectId ?? null,
      },
    });
  }

  return normalizeTaskRecord(record);
}

export async function listTasks(filters?: {
  search?: string;
  projectId?: string;
  priority?: TaskPriority | "";
}) {
  const collection = await getTasksCollection();
  const query: Record<string, unknown> = {};

  if (filters?.projectId?.trim()) {
    query.projectId = filters.projectId.trim();
  }

  if (filters?.priority?.trim()) {
    query.priority = filters.priority.trim();
  }

  if (filters?.search?.trim()) {
    query.$or = [
      { taskId: filters.search.trim() },
      { taskKey: filters.search.trim().toUpperCase() },
      { title: { $regex: filters.search.trim(), $options: "i" } },
      { description: { $regex: filters.search.trim(), $options: "i" } },
      { projectId: filters.search.trim() },
      { customerId: filters.search.trim() },
    ];
  }

  const records = await collection
    .find(query)
    .sort({ status: 1, sortOrder: 1, dueDate: 1, updatedAt: -1, createdAt: -1 })
    .toArray();

  return Promise.all(records.map(ensureTaskKey));
}

export async function listTasksByProjectId(projectId: string) {
  return listTasks({ projectId });
}

export async function getTaskById(taskId: string) {
  const collection = await getTasksCollection();
  const record = await collection.findOne({ taskId });
  return record ? ensureTaskKey(record) : null;
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const collection = await getTasksCollection();
  const existing = await collection.findOne({ taskId });

  if (!existing) {
    throw new Error("Task not found.");
  }

  const now = new Date().toISOString();
  const sortOrder =
    existing.status === status
      ? existing.sortOrder
      : await getNextTaskSortOrder(status);
  const update: { $set: Partial<TaskRecord> } = {
    $set: {
      status,
      sortOrder,
      updatedAt: now,
      completedAt: status === "done" ? now : undefined,
    },
  };

  await collection.updateOne({ taskId }, update);

  await createActivityLog({
    entityType: "task",
    entityId: taskId,
    actionType: "task_status_updated",
    description: `Task status changed to ${status}.`,
    metadata: {
      status,
    },
  });

  if (existing.projectId) {
    await createActivityLog({
      entityType: "project",
      entityId: existing.projectId,
      actionType: "task_status_updated",
      description: `Task ${existing.title} changed to ${status}.`,
      metadata: {
        taskId,
        status,
      },
    });
  }

  if (existing.customerId) {
    await createActivityLog({
      entityType: "client",
      entityId: existing.customerId,
      actionType: "task_status_updated",
      description: `Task ${existing.title} changed to ${status}.`,
      metadata: {
        taskId,
        status,
      },
    });
  }
}

export async function updateTask(
  taskId: string,
  input: {
    projectId?: string;
    customerId?: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    scheduledDate?: string;
    estimatedMinutes?: number;
    billable: boolean;
    labels?: string[];
  }
) {
  const collection = await getTasksCollection();
  const existing = await collection.findOne({ taskId });

  if (!existing) {
    throw new Error("Task not found.");
  }

  let resolvedCustomerId = input.customerId || undefined;

  if (!resolvedCustomerId && input.projectId) {
    const project = await getProjectById(input.projectId);
    resolvedCustomerId = project?.customerId;
  }

  const now = new Date().toISOString();
  const sortOrder =
    existing.status === input.status
      ? existing.sortOrder
      : await getNextTaskSortOrder(input.status);

  await collection.updateOne(
    { taskId },
    {
      $set: {
        projectId: input.projectId || undefined,
        customerId: resolvedCustomerId,
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        status: input.status,
        sortOrder,
        priority: input.priority,
        dueDate: input.dueDate || undefined,
        scheduledDate: input.scheduledDate || undefined,
        estimatedMinutes: input.estimatedMinutes,
        billable: input.billable,
        labels: input.labels ?? [],
        completedAt: input.status === "done" ? existing.completedAt ?? now : undefined,
        updatedAt: now,
      },
    }
  );

  await createActivityLog({
    entityType: "task",
    entityId: taskId,
    actionType: "task_updated",
    description: `Task ${existing.title} updated.`,
  });

  if (resolvedCustomerId) {
    await createActivityLog({
      entityType: "client",
      entityId: resolvedCustomerId,
      actionType: "task_updated",
      description: `Task ${input.title.trim()} updated.`,
      metadata: {
        taskId,
      },
    });
  }

  if (input.projectId) {
    await createActivityLog({
      entityType: "project",
      entityId: input.projectId,
      actionType: "task_updated",
      description: `Task ${input.title.trim()} updated.`,
      metadata: {
        taskId,
      },
    });
  }
}

export async function reorderTasks(
  input: Array<{
    taskId: string;
    status: TaskStatus;
    sortOrder: number;
  }>
) {
  if (input.length === 0) {
    return;
  }

  const collection = await getTasksCollection();
  const now = new Date().toISOString();

  await collection.bulkWrite(
    input.map((item) => ({
      updateOne: {
        filter: { taskId: item.taskId },
        update: {
          $set: {
            status: item.status,
            sortOrder: item.sortOrder,
            updatedAt: now,
            completedAt: item.status === "done" ? now : undefined,
          },
        },
      },
    }))
  );
}

export async function recalculateTaskTotalsFromTimeEntries(taskId: string) {
  const collection = await getTasksCollection();
  const db = await getDatabase();
  const entries = await db
    .collection<{
      durationMinutes?: number;
      costAmount?: number;
    }>("time_entries")
    .find({ taskId })
    .toArray();

  const actualMinutes = entries.reduce(
    (sum, entry) => sum + (entry.durationMinutes ?? 0),
    0
  );
  const internalCostTotal = entries.reduce(
    (sum, entry) => sum + (entry.costAmount ?? 0),
    0
  );

  await collection.updateOne(
    { taskId },
    {
      $set: {
        actualMinutes,
        internalCostTotal,
        updatedAt: new Date().toISOString(),
      },
    }
  );
}

export async function getTaskContext(task: TaskRecord) {
  const [project, client] = await Promise.all([
    task.projectId ? getProjectById(task.projectId) : null,
    task.customerId ? getClientById(task.customerId) : null,
  ]);

  return {
    project,
    client,
  };
}
