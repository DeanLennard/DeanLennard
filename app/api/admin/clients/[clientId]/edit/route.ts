import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  type CarePlanStatus,
  type ClientStatus,
  updateClient,
} from "@/lib/clients-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

const validStatuses: ClientStatus[] = ["lead", "active", "inactive", "archived"];
const validCarePlanStatuses: CarePlanStatus[] = ["none", "active", "paused", "cancelled"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { clientId } = await params;
  const formData = await request.formData();
  const status = String(formData.get("status") ?? "").trim() as ClientStatus;
  const carePlanStatus = String(formData.get("carePlanStatus") ?? "").trim() as CarePlanStatus;
  const businessName = String(formData.get("businessName") ?? "").trim();

  if (!clientId || !businessName || !validStatuses.includes(status) || !validCarePlanStatuses.includes(carePlanStatus)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/clients/${clientId}/edit?error=invalid-input`),
      303
    );
  }

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const defaultPaymentTerms = Number(formData.get("defaultPaymentTerms") ?? "14");
  const defaultHourlyInternalCost = Number(formData.get("defaultHourlyInternalCost") ?? "");

  await updateClient(clientId, {
    status,
    businessName,
    contactName: String(formData.get("contactName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    website: String(formData.get("website") ?? ""),
    address: String(formData.get("address") ?? ""),
    billingAddress: String(formData.get("billingAddress") ?? ""),
    companyNumber: String(formData.get("companyNumber") ?? ""),
    vatNumber: String(formData.get("vatNumber") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    tags,
    acquisitionSource: String(formData.get("acquisitionSource") ?? ""),
    defaultCurrency: String(formData.get("defaultCurrency") ?? "GBP"),
    defaultPaymentTerms: Number.isFinite(defaultPaymentTerms) ? defaultPaymentTerms : 14,
    defaultHourlyInternalCost: Number.isFinite(defaultHourlyInternalCost)
      ? defaultHourlyInternalCost
      : undefined,
    carePlanStatus,
    stripeCustomerId: String(formData.get("stripeCustomerId") ?? ""),
    gocardlessCustomerId: String(formData.get("gocardlessCustomerId") ?? ""),
    gocardlessMandateId: String(formData.get("gocardlessMandateId") ?? ""),
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/clients/${clientId}`),
    303
  );
}
