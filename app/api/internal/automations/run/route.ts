import { NextResponse } from "next/server";

import { getAppSettings } from "@/lib/settings-store";
import { runDueRecurringInvoices } from "@/lib/recurring-billing-store";
import { runDueRepeatingTaskTemplates } from "@/lib/repeating-task-templates-store";

function readBearerToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) {
    return "";
  }

  return header.slice("Bearer ".length).trim();
}

async function runAutomations(request: Request) {
  const settings = await getAppSettings();
  const providedSecret =
    request.headers.get("x-automation-secret")?.trim() || readBearerToken(request);

  if (!settings.automationSecret || providedSecret !== settings.automationSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [invoicesCreated, tasksCreated] = await Promise.all([
    runDueRecurringInvoices(),
    runDueRepeatingTaskTemplates(),
  ]);

  return NextResponse.json({
    ok: true,
    invoicesCreated,
    tasksCreated,
    ranAt: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  return runAutomations(request);
}

export async function GET(request: Request) {
  return runAutomations(request);
}
