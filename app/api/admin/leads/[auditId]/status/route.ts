import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAuditById,
  updateLeadDetails,
  updateLeadStatus,
  type LeadLostReason,
  type LeadStatus,
} from "@/lib/audit-store";

const validStatuses = new Set<LeadStatus>([
  "new",
  "reviewed",
  "contacted",
  "qualified",
  "converted",
  "lost",
  "archived",
]);
const validLostReasons = new Set<LeadLostReason>([
  "no_budget",
  "no_response",
  "not_a_fit",
  "chose_competitor",
  "duplicate",
  "spam",
  "other",
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
  const lostReason = String(formData.get("lostReason") ?? "") as LeadLostReason;
  const lostReasonNotes = String(formData.get("lostReasonNotes") ?? "");

  if (!auditId || !validStatuses.has(status)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/leads?error=invalid-status"),
      303
    );
  }

  if (status === "lost") {
    const existingLead = await getAuditById(auditId);

    if (!existingLead) {
      return NextResponse.redirect(
        toAbsoluteRedirect(request, "/admin/leads?error=invalid-status"),
        303
      );
    }

    await updateLeadDetails(auditId, {
      businessName: existingLead.businessName,
      location: existingLead.location,
      leadStatus: "lost",
      followUpConsent: existingLead.followUpConsent,
      lostReason: validLostReasons.has(lostReason) ? lostReason : "other",
      lostReasonNotes,
    });
  } else {
    await updateLeadStatus(auditId, status);
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/leads/${auditId}`),
    303
  );
}
