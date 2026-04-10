import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPackageTemplateById } from "@/lib/package-templates-store";
import {
  createProject,
  type ProjectBillingType,
  type ProjectPackageType,
  type ProjectStatus,
} from "@/lib/projects-store";
import { createRepeatingTaskTemplate } from "@/lib/repeating-task-templates-store";
import { createTask } from "@/lib/tasks-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const formData = await request.formData();
  const customerId = String(formData.get("customerId") ?? "").trim();
  const quoteId = String(formData.get("quoteId") ?? "").trim();
  const leadId = String(formData.get("leadId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const packageType = String(formData.get("packageType") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "").trim();
  const targetEndDate = String(formData.get("targetEndDate") ?? "").trim();
  const billingType = String(formData.get("billingType") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const packageTemplateId = String(formData.get("packageTemplateId") ?? "").trim();
  const estimatedRevenue = Number(formData.get("estimatedRevenue") ?? "0");
  const estimatedCost = Number(formData.get("estimatedCost") ?? "0");

  if (!customerId || !name) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/projects/new?error=missing-fields"),
      303
    );
  }

  const project = await createProject({
    customerId,
    quoteId: quoteId || undefined,
    leadId: leadId || undefined,
    name,
    description: description || undefined,
    packageType: packageType as ProjectPackageType | undefined,
    status: status as ProjectStatus | undefined,
    startDate: startDate || undefined,
    targetEndDate: targetEndDate || undefined,
    estimatedRevenue: Number.isFinite(estimatedRevenue) ? estimatedRevenue : 0,
    estimatedCost: Number.isFinite(estimatedCost) ? estimatedCost : 0,
    billingType: billingType as ProjectBillingType | undefined,
    notes: notes || undefined,
  });

  if (packageTemplateId) {
    const packageTemplate = await getPackageTemplateById(packageTemplateId);

    if (packageTemplate) {
      for (const task of packageTemplate.projectTasks) {
        await createTask({
          projectId: project.projectId,
          customerId,
          title: task.title,
          description: task.description,
          priority: task.priority,
          estimatedMinutes: task.estimatedMinutes,
          labels: ["Template"],
        });
      }

      for (const repeatingTask of packageTemplate.repeatingTasks) {
        await createRepeatingTaskTemplate({
          projectId: project.projectId,
          customerId,
          title: repeatingTask.title,
          description: repeatingTask.description,
          defaultPriority: repeatingTask.priority,
          estimatedMinutes: repeatingTask.estimatedMinutes,
          frequencyType: repeatingTask.frequencyType,
          frequencyInterval: repeatingTask.frequencyInterval,
          nextRunAt: startDate || new Date().toISOString().slice(0, 10),
          active: true,
          autoCreateEnabled: true,
          taskStatusOnCreate: "todo",
        });
      }
    }
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/projects/${project.projectId}`),
    303
  );
}
