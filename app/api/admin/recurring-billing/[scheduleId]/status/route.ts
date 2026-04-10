import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  type RecurringBillingStatus,
  updateRecurringInvoiceScheduleStatus,
} from "@/lib/recurring-billing-store";

const validStatuses: RecurringBillingStatus[] = ["active", "paused", "cancelled"];

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { scheduleId } = await params;
  const formData = await request.formData();
  const status = String(formData.get("status") ?? "").trim() as RecurringBillingStatus;

  if (!validStatuses.includes(status)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/recurring-billing?error=invalid-status"),
      303
    );
  }

  await updateRecurringInvoiceScheduleStatus(scheduleId, status);

  return NextResponse.redirect(
    toAbsoluteRedirect(request, "/admin/recurring-billing?saved=status"),
    303
  );
}
