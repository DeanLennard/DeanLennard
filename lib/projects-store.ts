import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getAuditById } from "@/lib/audit-store";
import { getClientById } from "@/lib/clients-store";
import { getDatabase } from "@/lib/mongodb";
import { getProjectCostTotal } from "@/lib/project-costs-store";
import { getQuoteById, linkProjectToQuote } from "@/lib/quotes-store";

export type ProjectPackageType =
  | "starter"
  | "lead_focused"
  | "growth"
  | "custom"
  | "care_plan";

export type ProjectStatus =
  | "planned"
  | "active"
  | "on_hold"
  | "review"
  | "completed"
  | "cancelled";

export type ProjectBillingType = "fixed" | "recurring" | "hourly" | "hybrid";

export type ProjectRecord = {
  projectId: string;
  customerId: string;
  quoteId?: string;
  leadId?: string;
  name: string;
  description?: string;
  packageType: ProjectPackageType;
  status: ProjectStatus;
  startDate?: string;
  targetEndDate?: string;
  actualEndDate?: string;
  estimatedRevenue: number;
  actualRevenue: number;
  estimatedCost: number;
  actualCost: number;
  grossProfit: number;
  grossMarginPercent: number;
  billingType: ProjectBillingType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

function getProjectsCollection() {
  return getDatabase().then((db) => db.collection<ProjectRecord>("projects"));
}

function calculateGrossMarginPercent(actualRevenue: number, actualCost: number) {
  if (actualRevenue <= 0) {
    return 0;
  }

  return ((actualRevenue - actualCost) / actualRevenue) * 100;
}

function normalizeProjectRecord(record: ProjectRecord) {
  const actualRevenue = record.actualRevenue ?? 0;
  const actualCost = record.actualCost ?? 0;
  const grossProfit = actualRevenue - actualCost;

  return {
    ...record,
    packageType: record.packageType ?? "custom",
    status: record.status ?? "planned",
    billingType: record.billingType ?? "fixed",
    estimatedRevenue: record.estimatedRevenue ?? 0,
    actualRevenue,
    estimatedCost: record.estimatedCost ?? 0,
    actualCost,
    grossProfit,
    grossMarginPercent: calculateGrossMarginPercent(actualRevenue, actualCost),
  } satisfies ProjectRecord;
}

export async function createProject(input: {
  customerId: string;
  quoteId?: string;
  leadId?: string;
  name: string;
  description?: string;
  packageType?: ProjectPackageType;
  status?: ProjectStatus;
  startDate?: string;
  targetEndDate?: string;
  estimatedRevenue?: number;
  estimatedCost?: number;
  billingType?: ProjectBillingType;
  notes?: string;
}) {
  const collection = await getProjectsCollection();
  const now = new Date().toISOString();
  const projectId = new ObjectId().toHexString();

  const record: ProjectRecord = {
    projectId,
    customerId: input.customerId,
    quoteId: input.quoteId || undefined,
    leadId: input.leadId || undefined,
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    packageType: input.packageType ?? "custom",
    status: input.status ?? "planned",
    startDate: input.startDate || undefined,
    targetEndDate: input.targetEndDate || undefined,
    estimatedRevenue: input.estimatedRevenue ?? 0,
    actualRevenue: 0,
    estimatedCost: input.estimatedCost ?? 0,
    actualCost: 0,
    grossProfit: 0,
    grossMarginPercent: 0,
    billingType: input.billingType ?? "fixed",
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

  await createActivityLog({
    entityType: "project",
    entityId: projectId,
    actionType: "project_created",
    description: `Project ${record.name} created.`,
    metadata: {
      customerId: record.customerId,
      quoteId: record.quoteId ?? null,
      leadId: record.leadId ?? null,
    },
  });

  await createActivityLog({
    entityType: "client",
    entityId: record.customerId,
    actionType: "project_created",
    description: `Project ${record.name} created for this client.`,
    metadata: {
      projectId,
      quoteId: record.quoteId ?? null,
    },
  });

  if (record.quoteId) {
    await linkProjectToQuote(record.quoteId, projectId);
    await createActivityLog({
      entityType: "quote",
      entityId: record.quoteId,
      actionType: "project_created",
      description: `Project ${record.name} created from this quote.`,
      metadata: {
        projectId,
      },
    });
  }

  if (record.leadId) {
    await createActivityLog({
      entityType: "lead",
      entityId: record.leadId,
      actionType: "project_created",
      description: `Project ${record.name} created from this lead.`,
      metadata: {
        projectId,
      },
    });
  }

  return normalizeProjectRecord(record);
}

export async function getProjectById(projectId: string) {
  const collection = await getProjectsCollection();
  const record = await collection.findOne({ projectId });
  return record ? normalizeProjectRecord(record) : null;
}

export async function getProjectByQuoteId(quoteId: string) {
  const collection = await getProjectsCollection();
  const record = await collection.findOne({ quoteId });
  return record ? normalizeProjectRecord(record) : null;
}

export async function createProjectFromQuote(quoteId: string) {
  const quote = await getQuoteById(quoteId);

  if (!quote) {
    throw new Error("Quote not found.");
  }

  if (!quote.customerId) {
    throw new Error("Quote must be linked to a client before creating a project.");
  }

  if (quote.projectId) {
    const existingByProjectId = await getProjectById(quote.projectId);
    if (existingByProjectId) {
      return existingByProjectId;
    }
  }

  const existingByQuoteId = await getProjectByQuoteId(quote.quoteId);
  if (existingByQuoteId) {
    return existingByQuoteId;
  }

  return createProject({
    customerId: quote.customerId,
    quoteId: quote.quoteId,
    leadId: quote.leadId,
    name: quote.title,
    description: quote.summary || quote.scopeOfWork,
    packageType: "custom",
    status: "planned",
    estimatedRevenue: quote.total,
    billingType: "fixed",
    notes: quote.notes,
  });
}

export async function listProjects(search = "") {
  const collection = await getProjectsCollection();
  const query: Record<string, unknown> = {};

  if (search.trim()) {
    query.$or = [
      { projectId: search.trim() },
      { name: { $regex: search.trim(), $options: "i" } },
      { customerId: search.trim() },
      { quoteId: search.trim() },
      { leadId: search.trim() },
    ];
  }

  const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return records.map(normalizeProjectRecord);
}

export async function listProjectsByClientId(customerId: string) {
  const collection = await getProjectsCollection();
  const records = await collection.find({ customerId }).sort({ createdAt: -1 }).toArray();
  return records.map(normalizeProjectRecord);
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  const collection = await getProjectsCollection();
  const existing = await collection.findOne({ projectId });

  if (!existing) {
    throw new Error("Project not found.");
  }

  const now = new Date().toISOString();
  const update: { $set: Partial<ProjectRecord> } = {
    $set: {
      status,
      updatedAt: now,
    },
  };

  if (status === "completed") {
    update.$set.actualEndDate = now.slice(0, 10);
  }

  await collection.updateOne({ projectId }, update);

  await createActivityLog({
    entityType: "project",
    entityId: projectId,
    actionType: "project_status_updated",
    description: `Project status changed to ${status}.`,
    metadata: {
      status,
    },
  });

  await createActivityLog({
    entityType: "client",
    entityId: existing.customerId,
    actionType: "project_status_updated",
    description: `Project ${existing.name} changed to ${status}.`,
    metadata: {
      projectId,
      status,
    },
  });

  if (existing.quoteId) {
    await createActivityLog({
      entityType: "quote",
      entityId: existing.quoteId,
      actionType: "project_status_updated",
      description: `Project ${existing.name} changed to ${status}.`,
      metadata: {
        projectId,
        status,
      },
    });
  }

  if (existing.leadId) {
    await createActivityLog({
      entityType: "lead",
      entityId: existing.leadId,
      actionType: "project_status_updated",
      description: `Project ${existing.name} changed to ${status}.`,
      metadata: {
        projectId,
        status,
      },
    });
  }
}

export async function updateProject(
  projectId: string,
  input: {
    customerId: string;
    quoteId?: string;
    leadId?: string;
    name: string;
    description?: string;
    packageType: ProjectPackageType;
    status: ProjectStatus;
    startDate?: string;
    targetEndDate?: string;
    estimatedRevenue?: number;
    estimatedCost?: number;
    billingType: ProjectBillingType;
    notes?: string;
  }
) {
  const collection = await getProjectsCollection();
  const existing = await collection.findOne({ projectId });

  if (!existing) {
    throw new Error("Project not found.");
  }

  const now = new Date().toISOString();

  await collection.updateOne(
    { projectId },
    {
      $set: {
        customerId: input.customerId,
        quoteId: input.quoteId || undefined,
        leadId: input.leadId || undefined,
        name: input.name.trim(),
        description: input.description?.trim() || undefined,
        packageType: input.packageType,
        status: input.status,
        startDate: input.startDate || undefined,
        targetEndDate: input.targetEndDate || undefined,
        estimatedRevenue: input.estimatedRevenue ?? 0,
        estimatedCost: input.estimatedCost ?? 0,
        billingType: input.billingType,
        notes: input.notes?.trim() || undefined,
        updatedAt: now,
      },
    }
  );

  await createActivityLog({
    entityType: "project",
    entityId: projectId,
    actionType: "project_updated",
    description: `Project ${existing.name} updated.`,
  });

  await createActivityLog({
    entityType: "client",
    entityId: input.customerId,
    actionType: "project_updated",
    description: `Project ${input.name.trim()} updated.`,
    metadata: {
      projectId,
    },
  });
}

export async function recalculateProjectCostsFromTasks(projectId: string) {
  const db = await getDatabase();
  const collection = await getProjectsCollection();
  const existing = await collection.findOne({ projectId });

  if (!existing) {
    throw new Error("Project not found.");
  }

  const tasks = await db
    .collection<{
      internalCostTotal?: number;
    }>("tasks")
    .find({ projectId })
    .toArray();

  const taskCost = tasks.reduce(
    (sum, task) => sum + (task.internalCostTotal ?? 0),
    0
  );
  const manualCost = await getProjectCostTotal(projectId);
  const actualCost = taskCost + manualCost;
  const actualRevenue = existing.actualRevenue ?? 0;
  const grossProfit = actualRevenue - actualCost;
  const grossMarginPercent = calculateGrossMarginPercent(actualRevenue, actualCost);

  await collection.updateOne(
    { projectId },
    {
      $set: {
        actualCost,
        grossProfit,
        grossMarginPercent,
        updatedAt: new Date().toISOString(),
      },
    }
  );
}

export async function getProjectContext({
  customerId,
  quoteId,
  leadId,
}: {
  customerId?: string;
  quoteId?: string;
  leadId?: string;
}) {
  const [customer, quote, lead] = await Promise.all([
    customerId ? getClientById(customerId) : null,
    quoteId ? getQuoteById(quoteId) : null,
    leadId ? getAuditById(leadId) : null,
  ]);

  const resolvedCustomer =
    customer || (quote?.customerId ? await getClientById(quote.customerId) : null);

  return {
    customer: resolvedCustomer,
    quote,
    lead,
  };
}
