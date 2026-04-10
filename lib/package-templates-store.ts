import { ObjectId } from "mongodb";

import { createActivityLog } from "@/lib/activity-log";
import { getDatabase } from "@/lib/mongodb";
import type { ProjectBillingType, ProjectPackageType } from "@/lib/projects-store";
import type { RepeatingTaskFrequencyType } from "@/lib/repeating-task-templates-store";

export type PackageTemplateTask = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  estimatedMinutes?: number;
};

export type PackageTemplateRecurringTask = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  estimatedMinutes?: number;
  frequencyType: RepeatingTaskFrequencyType;
  frequencyInterval: number;
};

export type PackageTemplateLineItem = {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;
};

export type PackageTemplateRecord = {
  templateId: string;
  name: string;
  description?: string;
  packageType: ProjectPackageType;
  billingType: ProjectBillingType;
  defaultPrice: number;
  currency: string;
  defaultNotes?: string;
  lineItems: PackageTemplateLineItem[];
  projectTasks: PackageTemplateTask[];
  repeatingTasks: PackageTemplateRecurringTask[];
  createdAt: string;
  updatedAt: string;
};

function getPackageTemplatesCollection() {
  return getDatabase().then((db) =>
    db.collection<PackageTemplateRecord>("package_templates")
  );
}

function normalizeTemplate(record: PackageTemplateRecord) {
  return {
    ...record,
    packageType: record.packageType ?? "custom",
    billingType: record.billingType ?? "fixed",
    defaultPrice: record.defaultPrice ?? 0,
    currency: record.currency ?? "GBP",
    lineItems: record.lineItems ?? [],
    projectTasks: record.projectTasks ?? [],
    repeatingTasks: record.repeatingTasks ?? [],
  } satisfies PackageTemplateRecord;
}

export async function createPackageTemplate(input: {
  name: string;
  description?: string;
  packageType?: ProjectPackageType;
  billingType?: ProjectBillingType;
  defaultPrice?: number;
  currency?: string;
  defaultNotes?: string;
  lineItems?: Array<{
    title: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }>;
  projectTasks?: Array<{
    title: string;
    description?: string;
    priority: "low" | "medium" | "high" | "urgent";
    estimatedMinutes?: number;
  }>;
  repeatingTasks?: Array<{
    title: string;
    description?: string;
    priority: "low" | "medium" | "high" | "urgent";
    estimatedMinutes?: number;
    frequencyType: RepeatingTaskFrequencyType;
    frequencyInterval: number;
  }>;
}) {
  const collection = await getPackageTemplatesCollection();
  const now = new Date().toISOString();
  const templateId = new ObjectId().toHexString();
  const record: PackageTemplateRecord = {
    templateId,
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    packageType: input.packageType ?? "custom",
    billingType: input.billingType ?? "fixed",
    defaultPrice: input.defaultPrice ?? 0,
    currency: input.currency || "GBP",
    defaultNotes: input.defaultNotes?.trim() || undefined,
    lineItems:
      input.lineItems?.map((item) => ({
        id: new ObjectId().toHexString(),
        title: item.title.trim(),
        description: item.description?.trim() || undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })) ?? [],
    projectTasks:
      input.projectTasks?.map((task) => ({
        id: new ObjectId().toHexString(),
        title: task.title.trim(),
        description: task.description?.trim() || undefined,
        priority: task.priority,
        estimatedMinutes: task.estimatedMinutes,
      })) ?? [],
    repeatingTasks:
      input.repeatingTasks?.map((task) => ({
        id: new ObjectId().toHexString(),
        title: task.title.trim(),
        description: task.description?.trim() || undefined,
        priority: task.priority,
        estimatedMinutes: task.estimatedMinutes,
        frequencyType: task.frequencyType,
        frequencyInterval: task.frequencyInterval,
      })) ?? [],
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(record);

  await createActivityLog({
    entityType: "package_template",
    entityId: templateId,
    actionType: "package_template_created",
    description: `Package template ${record.name} created.`,
  });

  return normalizeTemplate(record);
}

export async function listPackageTemplates() {
  const collection = await getPackageTemplatesCollection();
  const records = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return records.map(normalizeTemplate);
}

export async function getPackageTemplateById(templateId: string) {
  const collection = await getPackageTemplatesCollection();
  const record = await collection.findOne({ templateId });
  return record ? normalizeTemplate(record) : null;
}

export async function updatePackageTemplate(
  templateId: string,
  input: {
    name: string;
    description?: string;
    packageType?: ProjectPackageType;
    billingType?: ProjectBillingType;
    defaultPrice?: number;
    currency?: string;
    defaultNotes?: string;
    lineItems?: Array<{
      title: string;
      description?: string;
      quantity: number;
      unitPrice: number;
    }>;
    projectTasks?: Array<{
      title: string;
      description?: string;
      priority: "low" | "medium" | "high" | "urgent";
      estimatedMinutes?: number;
    }>;
    repeatingTasks?: Array<{
      title: string;
      description?: string;
      priority: "low" | "medium" | "high" | "urgent";
      estimatedMinutes?: number;
      frequencyType: RepeatingTaskFrequencyType;
      frequencyInterval: number;
    }>;
  }
) {
  const collection = await getPackageTemplatesCollection();
  const existing = await collection.findOne({ templateId });

  if (!existing) {
    throw new Error("Package template not found.");
  }

  const now = new Date().toISOString();

  await collection.updateOne(
    { templateId },
    {
      $set: {
        name: input.name.trim(),
        description: input.description?.trim() || undefined,
        packageType: input.packageType ?? "custom",
        billingType: input.billingType ?? "fixed",
        defaultPrice: input.defaultPrice ?? 0,
        currency: input.currency || "GBP",
        defaultNotes: input.defaultNotes?.trim() || undefined,
        lineItems:
          input.lineItems?.map((item) => ({
            id: new ObjectId().toHexString(),
            title: item.title.trim(),
            description: item.description?.trim() || undefined,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })) ?? [],
        projectTasks:
          input.projectTasks?.map((task) => ({
            id: new ObjectId().toHexString(),
            title: task.title.trim(),
            description: task.description?.trim() || undefined,
            priority: task.priority,
            estimatedMinutes: task.estimatedMinutes,
          })) ?? [],
        repeatingTasks:
          input.repeatingTasks?.map((task) => ({
            id: new ObjectId().toHexString(),
            title: task.title.trim(),
            description: task.description?.trim() || undefined,
            priority: task.priority,
            estimatedMinutes: task.estimatedMinutes,
            frequencyType: task.frequencyType,
            frequencyInterval: task.frequencyInterval,
          })) ?? [],
        updatedAt: now,
      },
    }
  );

  await createActivityLog({
    entityType: "package_template",
    entityId: templateId,
    actionType: "package_template_updated",
    description: `Package template ${input.name.trim()} updated.`,
  });
}
