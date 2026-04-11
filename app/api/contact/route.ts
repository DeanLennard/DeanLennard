import { NextResponse } from "next/server";

import { recordAuditIntent } from "@/lib/audit-store";
import { sendContactEnquiryEmail } from "@/lib/contact-enquiry-email";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = value(formData, "name");
  const email = value(formData, "email");
  const phone = value(formData, "phone");
  const company = value(formData, "company");
  const website = value(formData, "website");
  const location = value(formData, "location");
  const message = value(formData, "message");
  const auditId = value(formData, "auditId");
  const conversionScore = value(formData, "conversionScore");
  const performanceScore = value(formData, "performanceScore");
  const visibilityScore = value(formData, "visibilityScore");
  const honey = value(formData, "faxNumber");

  if (honey) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/contact?sent=1#project-enquiry"),
      303
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !emailPattern.test(email) || !message) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/contact?error=invalid-input#project-enquiry"),
      303
    );
  }

  try {
    await sendContactEnquiryEmail({
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      website: website || undefined,
      location: location || undefined,
      message,
      auditId: auditId || undefined,
      conversionScore: conversionScore || undefined,
      performanceScore: performanceScore || undefined,
      visibilityScore: visibilityScore || undefined,
    });

    if (auditId) {
      await recordAuditIntent(auditId, "send_email");
    }

    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/contact?sent=1#project-enquiry"),
      303
    );
  } catch {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/contact?error=send-failed#project-enquiry"),
      303
    );
  }
}
