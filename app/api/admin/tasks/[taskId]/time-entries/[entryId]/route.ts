import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteTimeEntry, updateTimeEntry } from "@/lib/time-entries-store";

function absoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string; entryId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(absoluteRedirect(request, "/admin/login"), 303);
  }

  const { taskId, entryId } = await params;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "update").trim();
  const returnTo = `/admin/tasks/${taskId}/edit`;

  if (intent === "delete") {
    await deleteTimeEntry(entryId);
    return NextResponse.redirect(absoluteRedirect(request, returnTo), 303);
  }

  const entryDate = String(formData.get("entryDate") ?? "").trim();
  const durationMinutes = Number(formData.get("durationMinutes") ?? 0);
  const internalHourlyRate = Number(formData.get("internalHourlyRate") ?? 0);
  const description = String(formData.get("description") ?? "");
  const billable = formData.get("billable") === "on";

  if (
    !entryDate ||
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0 ||
    !Number.isFinite(internalHourlyRate) ||
    internalHourlyRate < 0
  ) {
    return NextResponse.redirect(
      absoluteRedirect(request, `${returnTo}?error=invalid-time-entry`),
      303
    );
  }

  await updateTimeEntry(entryId, {
    entryDate,
    durationMinutes,
    description,
    internalHourlyRate,
    billable,
  });

  return NextResponse.redirect(absoluteRedirect(request, returnTo), 303);
}
