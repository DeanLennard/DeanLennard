import { NextResponse } from "next/server";

import { getAuthenticatedAdminUser } from "@/lib/admin-auth";
import { saveAppSettings } from "@/lib/settings-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

function asNumber(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value ?? "");
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedAdminUser();

  if (!user) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  if ((user.role ?? "admin") !== "admin") {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin"), 303);
  }

  const formData = await request.formData();

  await saveAppSettings({
    businessName: String(formData.get("businessName") ?? "").trim() || "Outbreak LTD",
    registeredAddress:
      String(formData.get("registeredAddress") ?? "").trim() ||
      "241 Tixall Road, Stafford, ST16 3XS",
    companyNumber: String(formData.get("companyNumber") ?? "").trim() || "10977129",
    vatNumber: String(formData.get("vatNumber") ?? "").trim() || undefined,
    defaultCurrency: String(formData.get("defaultCurrency") ?? "").trim() || "GBP",
    defaultPaymentTerms: asNumber(formData.get("defaultPaymentTerms"), 14),
    invoicePrefix: String(formData.get("invoicePrefix") ?? "").trim() || "INV",
    quotePrefix: String(formData.get("quotePrefix") ?? "").trim() || "Q",
    nextInvoiceNumber: Math.max(asNumber(formData.get("nextInvoiceNumber"), 1), 1),
    nextQuoteNumber: Math.max(asNumber(formData.get("nextQuoteNumber"), 1), 1),
    bankAccountName: String(formData.get("bankAccountName") ?? "").trim() || undefined,
    bankSortCode: String(formData.get("bankSortCode") ?? "").trim() || undefined,
    bankAccountNumber:
      String(formData.get("bankAccountNumber") ?? "").trim() || undefined,
    bankIban: String(formData.get("bankIban") ?? "").trim() || undefined,
    bankBic: String(formData.get("bankBic") ?? "").trim() || undefined,
    bankPaymentReferenceInstructions:
      String(formData.get("bankPaymentReferenceInstructions") ?? "").trim() ||
      undefined,
    invoiceDefaultNotes:
      String(formData.get("invoiceDefaultNotes") ?? "").trim() || undefined,
    invoiceDefaultFooterText:
      String(formData.get("invoiceDefaultFooterText") ?? "").trim() || undefined,
    stripePublicKey:
      String(formData.get("stripePublicKey") ?? "").trim() || undefined,
    stripeSecretKey:
      String(formData.get("stripeSecretKey") ?? "").trim() || undefined,
    stripeWebhookSecret:
      String(formData.get("stripeWebhookSecret") ?? "").trim() || undefined,
    gocardlessAccessToken:
      String(formData.get("gocardlessAccessToken") ?? "").trim() || undefined,
    gocardlessWebhookSecret:
      String(formData.get("gocardlessWebhookSecret") ?? "").trim() || undefined,
    resendApiKey:
      String(formData.get("resendApiKey") ?? "").trim() || undefined,
    resendFromEmail:
      String(formData.get("resendFromEmail") ?? "").trim() || undefined,
    resendReplyToEmail:
      String(formData.get("resendReplyToEmail") ?? "").trim() || undefined,
    automationSecret:
      String(formData.get("automationSecret") ?? "").trim() || undefined,
    enableStripe: formData.get("enableStripe") === "on",
    enableGoCardless: formData.get("enableGoCardless") === "on",
    enableBankTransfer: formData.get("enableBankTransfer") === "on",
    defaultInternalHourlyCost: asNumber(
      formData.get("defaultInternalHourlyCost"),
      0
    ),
    defaultProjectMarginTarget: asNumber(
      formData.get("defaultProjectMarginTarget"),
      0
    ),
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, "/admin/settings?saved=1"),
    303
  );
}
