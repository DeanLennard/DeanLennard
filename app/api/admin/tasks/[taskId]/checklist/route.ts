import { NextResponse } from "next/server";

import { absoluteRedirect } from "@/lib/absolute-redirect";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createTaskChecklistItem } from "@/lib/task-checklists-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(absoluteRedirect(request, "/admin/login"), 303);
  }

  const { taskId } = await params;
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return NextResponse.redirect(
      absoluteRedirect(request, `/admin/tasks/${taskId}/edit?error=invalid-input`),
      303
    );
  }

  await createTaskChecklistItem(taskId, title);

  return NextResponse.redirect(
    absoluteRedirect(request, `/admin/tasks/${taskId}/edit`),
    303
  );
}
