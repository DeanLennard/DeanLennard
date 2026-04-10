import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addTimeEntry } from "@/lib/time-entries-store";

function absoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(absoluteRedirect(request, "/admin/login"), 303);
  }

  const { taskId } = await params;
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      entryDate?: string;
      durationMinutes?: number;
      internalHourlyRate?: number;
      description?: string;
      billable?: boolean;
    };

    const entryDate = String(body.entryDate ?? "").trim();
    const durationMinutes = Number(body.durationMinutes ?? 0);
    const internalHourlyRate = Number(body.internalHourlyRate ?? 0);

    if (
      !entryDate ||
      !Number.isFinite(durationMinutes) ||
      durationMinutes <= 0 ||
      !Number.isFinite(internalHourlyRate) ||
      internalHourlyRate < 0
    ) {
      return NextResponse.json({ error: "Invalid time entry." }, { status: 400 });
    }

    await addTimeEntry({
      taskId,
      entryDate,
      durationMinutes,
      description: String(body.description ?? ""),
      internalHourlyRate,
      billable: Boolean(body.billable),
    });

    return NextResponse.json({ success: true });
  }

  const formData = await request.formData();
  const returnToValue = formData.get("returnTo");
  const returnTo =
    typeof returnToValue === "string" && returnToValue.startsWith("/")
      ? returnToValue
      : `/admin/tasks/${taskId}/edit`;

  const entryDate =
    typeof formData.get("entryDate") === "string"
      ? formData.get("entryDate")!.toString().trim()
      : "";
  const durationMinutesRaw =
    typeof formData.get("durationMinutes") === "string"
      ? formData.get("durationMinutes")!.toString().trim()
      : "";
  const internalHourlyRateRaw =
    typeof formData.get("internalHourlyRate") === "string"
      ? formData.get("internalHourlyRate")!.toString().trim()
      : "";
  const description =
    typeof formData.get("description") === "string"
      ? formData.get("description")!.toString()
      : "";
  const billable = formData.get("billable") === "on";

  const durationMinutes = Number(durationMinutesRaw);
  const internalHourlyRate = Number(internalHourlyRateRaw);

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

  await addTimeEntry({
    taskId,
    entryDate,
    durationMinutes,
    description,
    internalHourlyRate,
    billable,
  });

  return NextResponse.redirect(absoluteRedirect(request, returnTo), 303);
}
