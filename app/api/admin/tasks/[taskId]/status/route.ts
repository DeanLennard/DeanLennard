import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { reorderTasks, type TaskStatus, updateTaskStatus } from "@/lib/tasks-store";

const validStatuses: TaskStatus[] = ["todo", "in_progress", "review", "done"];

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { taskId } = await params;
  const formData = await request.formData();
  const status = String(formData.get("status") ?? "").trim() as TaskStatus;
  const returnTo = String(formData.get("returnTo") ?? "").trim();
  const redirectPath = returnTo.startsWith("/") ? returnTo : "/admin/tasks";

  if (!validStatuses.includes(status)) {
    const errorPath =
      redirectPath === "/admin/tasks"
        ? "/admin/tasks?error=invalid-status"
        : redirectPath;
    return NextResponse.redirect(toAbsoluteRedirect(request, errorPath), 303);
  }

  await updateTaskStatus(taskId, status);
  return NextResponse.redirect(toAbsoluteRedirect(request, redirectPath), 303);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;
  const body = (await request.json()) as {
    status?: string;
    orderedTaskIds?: string[];
    sourceStatus?: string;
    sourceOrderedTaskIds?: string[];
  };
  const status = String(body.status ?? "").trim() as TaskStatus;

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (Array.isArray(body.orderedTaskIds) && body.orderedTaskIds.length > 0) {
    const destinationItems = body.orderedTaskIds.map((orderedTaskId, index) => ({
      taskId: orderedTaskId,
      status,
      sortOrder: index + 1,
    }));

    const sourceStatus = String(body.sourceStatus ?? "").trim() as TaskStatus;
    const sourceItems =
      validStatuses.includes(sourceStatus) &&
      Array.isArray(body.sourceOrderedTaskIds) &&
      sourceStatus !== status
        ? body.sourceOrderedTaskIds.map((orderedTaskId, index) => ({
            taskId: orderedTaskId,
            status: sourceStatus,
            sortOrder: index + 1,
          }))
        : [];

    await reorderTasks([...sourceItems, ...destinationItems]);
    return NextResponse.json({ success: true });
  }

  await updateTaskStatus(taskId, status);
  return NextResponse.json({ success: true });
}
