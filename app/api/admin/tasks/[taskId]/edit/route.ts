import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { type TaskPriority, type TaskStatus, updateTask } from "@/lib/tasks-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

const validStatuses: TaskStatus[] = ["todo", "in_progress", "review", "done"];
const validPriorities: TaskPriority[] = ["low", "medium", "high", "urgent"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { taskId } = await params;
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as TaskStatus;
  const priority = String(formData.get("priority") ?? "").trim() as TaskPriority;

  if (!taskId || !title || !validStatuses.includes(status) || !validPriorities.includes(priority)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/tasks/${taskId}/edit?error=invalid-input`),
      303
    );
  }

  const estimatedMinutes = Number(formData.get("estimatedMinutes") ?? "");
  const labels = String(formData.get("labels") ?? "")
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);

  await updateTask(taskId, {
    projectId: String(formData.get("projectId") ?? "").trim() || undefined,
    customerId: String(formData.get("customerId") ?? "").trim() || undefined,
    title,
    description: String(formData.get("description") ?? ""),
    status,
    priority,
    dueDate: String(formData.get("dueDate") ?? "").trim() || undefined,
    scheduledDate: String(formData.get("scheduledDate") ?? "").trim() || undefined,
    estimatedMinutes: Number.isFinite(estimatedMinutes) ? estimatedMinutes : undefined,
    billable: formData.get("billable") === "on",
    labels,
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/tasks`),
    303
  );
}
