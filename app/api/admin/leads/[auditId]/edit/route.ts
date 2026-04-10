import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  type LeadQualificationFit,
  type LeadLostReason,
  type LeadStatus,
  updateLeadDetails,
} from "@/lib/audit-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

const validStatuses: LeadStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "qualified",
  "converted",
  "lost",
  "archived",
];
const validLostReasons: LeadLostReason[] = [
  "no_budget",
  "no_response",
  "not_a_fit",
  "chose_competitor",
  "duplicate",
  "spam",
  "other",
];
const validQualificationFits: LeadQualificationFit[] = ["strong", "medium", "weak"];

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
  const lostReason = String(formData.get("lostReason") ?? "").trim() as LeadLostReason;
  const qualificationFit = String(
    formData.get("qualificationFit") ?? ""
  ).trim() as LeadQualificationFit;

  if (!auditId || !validStatuses.includes(leadStatus)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/leads?error=invalid-status"),
      303
    );
  }

  if (leadStatus === "lost" && !validLostReasons.includes(lostReason)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/leads/${auditId}/edit?error=invalid-status`),
      303
    );
  }

  if (qualificationFit && !validQualificationFits.includes(qualificationFit)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/leads/${auditId}/edit?error=invalid-qualification`),
      303
    );
  }

  await updateLeadDetails(auditId, {
    businessName: String(formData.get("businessName") ?? ""),
    location: String(formData.get("location") ?? ""),
    leadStatus,
    followUpConsent: formData.get("followUpConsent") === "on",
    lostReason: leadStatus === "lost" ? lostReason : undefined,
    lostReasonNotes: String(formData.get("lostReasonNotes") ?? ""),
    qualificationBudget: String(formData.get("qualificationBudget") ?? ""),
    qualificationTimeline: String(formData.get("qualificationTimeline") ?? ""),
    qualificationFit: qualificationFit || undefined,
    qualificationNotes: String(formData.get("qualificationNotes") ?? ""),
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/leads/${auditId}`),
    303
  );
}
