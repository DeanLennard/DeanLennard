import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getDatabase } from "@/lib/mongodb";

export type ProjectCostCategory =
  | "hosting"
  | "software"
  | "contractor"
  | "stock_assets"
  | "domain"
  | "ads"
  | "other";

export type ProjectCostRecurringInterval =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export type ProjectCostRecord = {
  id: string;
  projectId: string;
  date: string;
  category: ProjectCostCategory;
  description?: string;
  amount: number;
  recurring: boolean;
  recurringInterval?: ProjectCostRecurringInterval;
  createdAt: string;
  updatedAt: string;
};

function getProjectCostsCollection() {
  return getDatabase().then((db) =>
    db.collection<ProjectCostRecord>("project_costs")
  );
}

function normalizeProjectCostRecord(record: ProjectCostRecord) {
  return {
    ...record,
    category: record.category ?? "other",
    recurring: record.recurring ?? false,
    recurringInterval:
      record.recurring === false
        ? undefined
        : record.recurringInterval ?? "monthly",
    amount: record.amount ?? 0,
  } satisfies ProjectCostRecord;
}

export async function createProjectCost(input: {
  projectId: string;
  date: string;
  category: ProjectCostCategory;
  description?: string;
  amount: number;
  recurring?: boolean;
  recurringInterval?: ProjectCostRecurringInterval;
}) {
  const collection = await getProjectCostsCollection();
  const now = new Date().toISOString();
  const recurring = input.recurring ?? false;
  const record: ProjectCostRecord = {
    id: new ObjectId().toHexString(),
    projectId: input.projectId,
    date: input.date,
    category: input.category,
    description: input.description?.trim() || undefined,
    amount: input.amount,
    recurring,
    recurringInterval: recurring ? input.recurringInterval ?? "monthly" : undefined,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

  await createActivityLog({
    entityType: "project",
    entityId: input.projectId,
    actionType: "project_cost_created",
    description: `Project cost added: ${record.category.replaceAll("_", " ")}.`,
    metadata: {
      amount: record.amount,
      recurring: record.recurring,
      recurringInterval: record.recurringInterval ?? null,
    },
  });

  return normalizeProjectCostRecord(record);
}

export async function listProjectCostsByProjectId(projectId: string) {
  const collection = await getProjectCostsCollection();
  const records = await collection.find({ projectId }).sort({ date: -1, createdAt: -1 }).toArray();
  return records.map(normalizeProjectCostRecord);
}

export async function getProjectCostTotal(projectId: string) {
  const costs = await listProjectCostsByProjectId(projectId);
  return costs.reduce((sum, cost) => sum + cost.amount, 0);
}
