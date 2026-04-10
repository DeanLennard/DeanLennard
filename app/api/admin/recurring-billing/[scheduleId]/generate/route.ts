import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { generateInvoiceForRecurringSchedule } from "@/lib/recurring-billing-store";

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

  try {
    const result = await generateInvoiceForRecurringSchedule(scheduleId, {
      advanceSchedule: false,
      sendEmail: true,
      referenceDate: new Date().toISOString().slice(0, 10),
    });

    const target = result.providerSyncError
      ? `/admin/recurring-billing?saved=manual-invoice&error=${encodeURIComponent(result.providerSyncError)}`
      : "/admin/recurring-billing?saved=manual-invoice";

    return NextResponse.redirect(toAbsoluteRedirect(request, target), 303);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "manual-invoice-generation-failed";
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/recurring-billing?error=${encodeURIComponent(message)}`),
      303
    );
  }
}
