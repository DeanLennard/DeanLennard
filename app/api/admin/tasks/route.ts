import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createTask, type TaskPriority, type TaskStatus } from "@/lib/tasks-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const formData = await request.formData();
  const projectId = String(formData.get("projectId") ?? "").trim();
  const customerId = String(formData.get("customerId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const priority = String(formData.get("priority") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const scheduledDate = String(formData.get("scheduledDate") ?? "").trim();
  const estimatedMinutes = Number(formData.get("estimatedMinutes") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "").trim();
  const redirectPath = returnTo.startsWith("/") ? returnTo : "/admin/tasks";

  if (!title) {
    const errorPath =
      redirectPath === "/admin/tasks"
        ? "/admin/tasks?error=missing-title"
        : redirectPath;
    return NextResponse.redirect(toAbsoluteRedirect(request, errorPath), 303);
  }

  await createTask({
    projectId: projectId || undefined,
    customerId: customerId || undefined,
    title,
    description: description || undefined,
    status: (status || "todo") as TaskStatus,
    priority: (priority || "medium") as TaskPriority,
    dueDate: dueDate || undefined,
    scheduledDate: scheduledDate || undefined,
    estimatedMinutes: Number.isFinite(estimatedMinutes) ? estimatedMinutes : undefined,
  });

  return NextResponse.redirect(toAbsoluteRedirect(request, redirectPath), 303);
}
