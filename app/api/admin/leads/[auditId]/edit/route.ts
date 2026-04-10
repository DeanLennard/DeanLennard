import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { type LeadStatus, updateLeadDetails } from "@/lib/audit-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

const validStatuses: LeadStatus[] = ["new", "contacted", "converted", "lost"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ auditId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { auditId } = await params;
  const formData = await request.formData();
  const leadStatus = String(formData.get("leadStatus") ?? "").trim() as LeadStatus;

  if (!auditId || !validStatuses.includes(leadStatus)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/leads?error=invalid-status"),
      303
    );
  }

  await updateLeadDetails(auditId, {
    businessName: String(formData.get("businessName") ?? ""),
    location: String(formData.get("location") ?? ""),
    leadStatus,
    followUpConsent: formData.get("followUpConsent") === "on",
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/leads/${auditId}`),
    303
  );
}
