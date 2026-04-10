import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  deleteTaskChecklistItem,
  toggleTaskChecklistItem,
} from "@/lib/task-checklists-store";

function absoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string; itemId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(absoluteRedirect(request, "/admin/login"), 303);
  }

  const { taskId, itemId } = await params;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "toggle");

  if (intent === "delete") {
    await deleteTaskChecklistItem(itemId);
  } else {
    await toggleTaskChecklistItem(itemId);
  }

  return NextResponse.redirect(
    absoluteRedirect(request, `/admin/tasks/${taskId}/edit`),
    303
  );
}
