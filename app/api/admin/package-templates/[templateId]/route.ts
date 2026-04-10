import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updatePackageTemplate } from "@/lib/package-templates-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

function parseJsonArray<T>(rawValue: FormDataEntryValue | null): T[] {
  const raw = String(rawValue ?? "").trim();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { templateId } = await params;
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/package-templates/${templateId}?error=missing-name`),
      303
    );
  }

  await updatePackageTemplate(templateId, {
    name,
    description: String(formData.get("description") ?? ""),
    packageType:
      (String(formData.get("packageType") ?? "").trim() as
        | "starter"
        | "lead_focused"
        | "growth"
        | "custom"
        | "care_plan") || "custom",
    billingType:
      (String(formData.get("billingType") ?? "").trim() as
        | "fixed"
        | "recurring"
        | "hourly"
        | "hybrid") || "fixed",
    defaultPrice: Math.max(Number(formData.get("defaultPrice") ?? "0"), 0),
    currency: String(formData.get("currency") ?? "").trim() || "GBP",
    defaultNotes: String(formData.get("defaultNotes") ?? ""),
    lineItems: parseJsonArray(formData.get("lineItemsJson")),
    projectTasks: parseJsonArray(formData.get("projectTasksJson")),
    repeatingTasks: parseJsonArray(formData.get("repeatingTasksJson")),
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, "/admin/package-templates?updated=1"),
    303
  );
}
