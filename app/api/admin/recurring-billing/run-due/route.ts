import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { runDueRecurringInvoices } from "@/lib/recurring-billing-store";
import { runDueRepeatingTaskTemplates } from "@/lib/repeating-task-templates-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const [invoicesCreated, tasksCreated] = await Promise.all([
    runDueRecurringInvoices(),
    runDueRepeatingTaskTemplates(),
  ]);

  return NextResponse.redirect(
    toAbsoluteRedirect(
      request,
      `/admin/recurring-billing?ran=1&invoicesCreated=${invoicesCreated}&tasksCreated=${tasksCreated}`
    ),
    303
  );
}
