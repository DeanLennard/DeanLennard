import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateLeadStatus, type LeadStatus } from "@/lib/audit-store";

const validStatuses = new Set<LeadStatus>([
  "new",
  "contacted",
  "converted",
  "lost",
]);

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ auditId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { auditId } = await params;
  const formData = await request.formData();
  const status = String(formData.get("status") ?? "") as LeadStatus;

  if (!auditId || !validStatuses.has(status)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/leads?error=invalid-status"),
      303
    );
  }

  await updateLeadStatus(auditId, status);
  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/leads/${auditId}`),
    303
  );
}
