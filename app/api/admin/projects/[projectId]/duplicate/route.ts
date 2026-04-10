import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createProject, getProjectById } from "@/lib/projects-store";
import { listRepeatingTaskTemplates, createRepeatingTaskTemplate } from "@/lib/repeating-task-templates-store";
import { createTask, listTasksByProjectId } from "@/lib/tasks-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/projects"), 303);
  }

  const duplicate = await createProject({
    customerId: project.customerId,
    name: `${project.name} Copy`,
    description: project.description,
    packageType: project.packageType,
    status: "planned",
    startDate: project.startDate,
    targetEndDate: project.targetEndDate,
    estimatedRevenue: project.estimatedRevenue,
    estimatedCost: project.estimatedCost,
    billingType: project.billingType,
    notes: project.notes,
  });

  const [tasks, repeatingTemplates] = await Promise.all([
    listTasksByProjectId(project.projectId),
    listRepeatingTaskTemplates({ projectId: project.projectId }),
  ]);

  for (const task of tasks) {
    await createTask({
      projectId: duplicate.projectId,
      customerId: duplicate.customerId,
      title: task.title,
      description: task.description,
      internalNotes: task.internalNotes,
      status: "todo",
      priority: task.priority,
      dueDate: task.dueDate,
      scheduledDate: task.scheduledDate,
      estimatedMinutes: task.estimatedMinutes,
      billable: task.billable,
      labels: task.labels,
    });
  }

  for (const template of repeatingTemplates) {
    await createRepeatingTaskTemplate({
      projectId: duplicate.projectId,
      customerId: duplicate.customerId,
      title: template.title,
      description: template.description,
      defaultPriority: template.defaultPriority,
      estimatedMinutes: template.estimatedMinutes,
      frequencyType: template.frequencyType,
      frequencyInterval: template.frequencyInterval,
      nextRunAt: template.nextRunAt,
      active: template.active,
      taskStatusOnCreate: template.taskStatusOnCreate,
      autoCreateEnabled: template.autoCreateEnabled,
    });
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/projects/${duplicate.projectId}`),
    303
  );
}
