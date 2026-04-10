import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getDatabase } from "@/lib/mongodb";
import { getTaskById } from "@/lib/tasks-store";

export type TaskChecklistItemRecord = {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

function getTaskChecklistCollection() {
  return getDatabase().then((db) =>
    db.collection<TaskChecklistItemRecord>("task_checklist_items")
  );
}

export async function listTaskChecklistItems(taskId: string) {
  const collection = await getTaskChecklistCollection();
  return collection.find({ taskId }).sort({ createdAt: 1 }).toArray();
}

export async function createTaskChecklistItem(taskId: string, title: string) {
  const task = await getTaskById(taskId);

  if (!task) {
    throw new Error("Task not found.");
  }

  const collection = await getTaskChecklistCollection();
  const now = new Date().toISOString();
  const record: TaskChecklistItemRecord = {
    id: new ObjectId().toHexString(),
    taskId,
    title: title.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

  await createActivityLog({
    entityType: "task",
    entityId: taskId,
    actionType: "task_checklist_item_added",
    description: `Checklist item added: ${record.title}.`,
    metadata: {
      checklistItemId: record.id,
    },
  });

  return record;
}

export async function toggleTaskChecklistItem(itemId: string) {
  const collection = await getTaskChecklistCollection();
  const existing = await collection.findOne({ id: itemId });

  if (!existing) {
    throw new Error("Checklist item not found.");
  }

  const completed = !existing.completed;

  await collection.updateOne(
    { id: itemId },
    {
      $set: {
        completed,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  await createActivityLog({
    entityType: "task",
    entityId: existing.taskId,
    actionType: "task_checklist_item_toggled",
    description: `${completed ? "Completed" : "Reopened"} checklist item: ${existing.title}.`,
    metadata: {
      checklistItemId: existing.id,
      completed,
    },
  });
}

export async function deleteTaskChecklistItem(itemId: string) {
  const collection = await getTaskChecklistCollection();
  const existing = await collection.findOne({ id: itemId });

  if (!existing) {
    throw new Error("Checklist item not found.");
  }

  await collection.deleteOne({ id: itemId });

  await createActivityLog({
    entityType: "task",
    entityId: existing.taskId,
    actionType: "task_checklist_item_deleted",
    description: `Checklist item removed: ${existing.title}.`,
    metadata: {
      checklistItemId: existing.id,
    },
  });
}
