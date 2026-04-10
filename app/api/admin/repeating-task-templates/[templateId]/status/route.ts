import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateRepeatingTaskTemplateStatus } from "@/lib/repeating-task-templates-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
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
  const mode = String(formData.get("mode") ?? "").trim();

  if (mode === "toggle-active") {
    await updateRepeatingTaskTemplateStatus(templateId, {
      active: String(formData.get("value") ?? "") === "true",
    });
  } else if (mode === "toggle-auto-create") {
    await updateRepeatingTaskTemplateStatus(templateId, {
      autoCreateEnabled: String(formData.get("value") ?? "") === "true",
    });
  } else {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/recurring-billing?error=invalid-template-status"),
      303
    );
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, "/admin/recurring-billing?saved=template-status"),
    303
  );
}
