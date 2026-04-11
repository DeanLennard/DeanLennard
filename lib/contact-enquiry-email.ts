import { sendResendEmail } from "@/lib/resend-email";

type ContactEnquiryInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  location?: string;
  message: string;
  auditId?: string;
  conversionScore?: string;
  performanceScore?: string;
  visibilityScore?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatParagraphs(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function detailRows(input: ContactEnquiryInput) {
  return [
    ["Name", input.name],
    ["Email", input.email],
    ["Phone", input.phone || ""],
    ["Company", input.company || ""],
    ["Website", input.website || ""],
    ["Location", input.location || ""],
    ["Audit ID", input.auditId || ""],
    ["Conversion score", input.conversionScore ? `${input.conversionScore}/100` : ""],
    ["Performance score", input.performanceScore ? `${input.performanceScore}/100` : ""],
    ["Visibility score", input.visibilityScore ? `${input.visibilityScore}/100` : ""],
  ].filter(([, value]) => value);
}

function buildContactEnquiryHtml(input: ContactEnquiryInput) {
  const rows = detailRows(input);

  return `
    <div style="margin:0;background:#0f172a;padding:32px 16px;font-family:Arial,sans-serif;color:#e2e8f0;">
      <div style="margin:0 auto;max-width:720px;border:1px solid rgba(245,158,11,0.25);background:#111827;border-radius:20px;overflow:hidden;">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#111827;">
          <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;">Dean Lennard</p>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;">New Contact Enquiry</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.7;">
            A new enquiry has been submitted through the contact form on deanlennard.com.
          </p>
        </div>
        <div style="padding:32px;">
          <div style="border:1px solid rgba(148,163,184,0.2);background:#0f172a;border-radius:16px;padding:20px;">
            <p style="margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#fbbf24;">Contact details</p>
            ${rows
              .map(
                ([label, value]) => `
                  <div style="padding:10px 0;border-top:1px solid rgba(148,163,184,0.12);">
                    <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#94a3b8;">${escapeHtml(label)}</p>
                    <p style="margin:6px 0 0;font-size:15px;line-height:1.6;color:#f8fafc;">${escapeHtml(value)}</p>
                  </div>
                `
              )
              .join("")}
          </div>
          <div style="margin-top:20px;border:1px solid rgba(148,163,184,0.2);background:#0f172a;border-radius:16px;padding:20px;">
            <p style="margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#fbbf24;">Project summary</p>
            <p style="margin:0;font-size:15px;line-height:1.8;color:#e2e8f0;">${formatParagraphs(input.message)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function sendContactEnquiryEmail(input: ContactEnquiryInput) {
  const subject = input.auditId
    ? `Website Growth Check Follow-up from ${input.name}`
    : `Project Enquiry from ${input.name}`;

  return sendResendEmail({
    to: "dean@deanlennard.com",
    replyTo: input.email,
    subject,
    html: buildContactEnquiryHtml(input),
  });
}
