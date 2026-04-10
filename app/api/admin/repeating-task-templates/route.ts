import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createRepeatingTaskTemplate } from "@/lib/repeating-task-templates-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const nextRunAt = String(formData.get("nextRunAt") ?? "").trim();

  if (!title || !nextRunAt) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/recurring-billing?error=invalid-template"),
      303
    );
  }

  await createRepeatingTaskTemplate({
    customerId: String(formData.get("customerId") ?? "").trim() || undefined,
    projectId: String(formData.get("projectId") ?? "").trim() || undefined,
    title,
    description: String(formData.get("description") ?? ""),
    defaultPriority:
      (String(formData.get("defaultPriority") ?? "").trim() as
        | "low"
        | "medium"
        | "high"
        | "urgent") || "medium",
    estimatedMinutes: Math.max(Number(formData.get("estimatedMinutes") ?? "0"), 0) || undefined,
    frequencyType:
      (String(formData.get("frequencyType") ?? "").trim() as
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
        | "custom") || "monthly",
    frequencyInterval: Math.max(Number(formData.get("frequencyInterval") ?? "1"), 1),
    nextRunAt,
    taskStatusOnCreate:
      (String(formData.get("taskStatusOnCreate") ?? "").trim() as
        | "todo"
        | "in_progress"
        | "review"
        | "done") || "todo",
    active: formData.get("active") === "on",
    autoCreateEnabled: formData.get("autoCreateEnabled") === "on",
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, "/admin/recurring-billing?saved=template"),
    303
  );
}
