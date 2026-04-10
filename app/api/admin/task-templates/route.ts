import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createTaskTemplate } from "@/lib/task-templates-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

function parseTasksJson(rawValue: string) {
  if (!rawValue.trim()) {
    return [];
  }

  const parsed = JSON.parse(rawValue) as Array<{
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high" | "urgent";
    estimatedMinutes?: number;
    labels?: string[];
  }>;

  return parsed.map((task) => ({
    title: String(task.title ?? ""),
    description: task.description,
    priority: task.priority ?? "medium",
    estimatedMinutes:
      typeof task.estimatedMinutes === "number" ? task.estimatedMinutes : undefined,
    labels: Array.isArray(task.labels) ? task.labels.map(String) : [],
  }));
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/task-templates?error=missing-name"),
      303
    );
  }

  try {
    await createTaskTemplate({
      name,
      description: String(formData.get("description") ?? ""),
      tasks: parseTasksJson(String(formData.get("tasksJson") ?? "")),
    });
  } catch {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/task-templates?error=invalid-json"),
      303
    );
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, "/admin/task-templates?saved=1"),
    303
  );
}
