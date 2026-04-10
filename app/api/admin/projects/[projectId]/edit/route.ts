import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  type ProjectBillingType,
  type ProjectPackageType,
  type ProjectStatus,
  updateProject,
} from "@/lib/projects-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

const validStatuses: ProjectStatus[] = [
  "planned",
  "active",
  "on_hold",
  "review",
  "completed",
  "cancelled",
];
const validPackageTypes: ProjectPackageType[] = [
  "starter",
  "lead_focused",
  "growth",
  "custom",
  "care_plan",
];
const validBillingTypes: ProjectBillingType[] = ["fixed", "recurring", "hourly", "hybrid"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { projectId } = await params;
  const formData = await request.formData();
  const customerId = String(formData.get("customerId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const packageType = String(formData.get("packageType") ?? "").trim() as ProjectPackageType;
  const status = String(formData.get("status") ?? "").trim() as ProjectStatus;
  const billingType = String(formData.get("billingType") ?? "").trim() as ProjectBillingType;

  if (
    !projectId ||
    !customerId ||
    !name ||
    !validPackageTypes.includes(packageType) ||
    !validStatuses.includes(status) ||
    !validBillingTypes.includes(billingType)
  ) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/projects/${projectId}/edit?error=invalid-input`),
      303
    );
  }

  const estimatedRevenue = Number(formData.get("estimatedRevenue") ?? "0");
  const estimatedCost = Number(formData.get("estimatedCost") ?? "0");

  await updateProject(projectId, {
    customerId,
    quoteId: String(formData.get("quoteId") ?? "").trim() || undefined,
    leadId: String(formData.get("leadId") ?? "").trim() || undefined,
    name,
    description: String(formData.get("description") ?? ""),
    packageType,
    status,
    startDate: String(formData.get("startDate") ?? "").trim() || undefined,
    targetEndDate: String(formData.get("targetEndDate") ?? "").trim() || undefined,
    estimatedRevenue: Number.isFinite(estimatedRevenue) ? estimatedRevenue : 0,
    estimatedCost: Number.isFinite(estimatedCost) ? estimatedCost : 0,
    billingType,
    notes: String(formData.get("notes") ?? ""),
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/projects/${projectId}`),
    303
  );
}
