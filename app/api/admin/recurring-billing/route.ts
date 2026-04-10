import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createRecurringInvoiceSchedule } from "@/lib/recurring-billing-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const formData = await request.formData();
  const customerId = String(formData.get("customerId") ?? "").trim();
  const projectId = String(formData.get("projectId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const nextInvoiceDate = String(formData.get("nextInvoiceDate") ?? "").trim();
  const amount = Number(formData.get("amount") ?? "0");

  if (!customerId || !title || !nextInvoiceDate || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/recurring-billing?error=invalid-schedule"),
      303
    );
  }

  await createRecurringInvoiceSchedule({
    customerId,
    projectId: projectId || undefined,
    title,
    billingProvider:
      (String(formData.get("billingProvider") ?? "").trim() as
        | "stripe"
        | "gocardless"
        | "manual") || "manual",
    frequency:
      (String(formData.get("frequency") ?? "").trim() as
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly") || "monthly",
    intervalCount: Math.max(Number(formData.get("intervalCount") ?? "1"), 1),
    nextInvoiceDate,
    amount,
    currency: String(formData.get("currency") ?? "").trim() || undefined,
    taxRate: Number(formData.get("taxRate") ?? "0"),
    paymentTermsDays: Math.max(Number(formData.get("paymentTermsDays") ?? "14"), 1),
    autoSend: formData.get("autoSend") === "on",
    autoCollect: formData.get("autoCollect") === "on",
    carePlanTier:
      (String(formData.get("carePlanTier") ?? "").trim() as
        | "basic"
        | "standard"
        | "growth"
        | "custom") || "custom",
    notes: String(formData.get("notes") ?? ""),
    lineItemsTemplate: [
      {
        title,
        description: String(formData.get("lineItemDescription") ?? "").trim() || undefined,
        quantity: Math.max(Number(formData.get("lineItemQuantity") ?? "1"), 1),
        unitPrice: amount,
      },
    ],
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, "/admin/recurring-billing?saved=schedule"),
    303
  );
}
