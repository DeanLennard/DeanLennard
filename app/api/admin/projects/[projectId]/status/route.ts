import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { type ProjectStatus, updateProjectStatus } from "@/lib/projects-store";

const validStatuses: ProjectStatus[] = [
  "planned",
  "active",
  "on_hold",
  "review",
  "completed",
  "cancelled",
];

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
  const formData = await request.formData();
  const status = String(formData.get("status") ?? "").trim() as ProjectStatus;

  if (!validStatuses.includes(status)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/projects/${projectId}?error=invalid-status`),
      303
    );
  }

  await updateProjectStatus(projectId, status);
  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/projects/${projectId}`),
    303
  );
}
