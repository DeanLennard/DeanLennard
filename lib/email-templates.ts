type EmailShellInput = {
  eyebrow: string;
  title: string;
  intro: string;
  details: Array<{ label: string; value: string }>;
  actions?: Array<{ label: string; href: string; tone?: "primary" | "secondary" }>;
  closing?: string;
};

function renderDetails(details: Array<{ label: string; value: string }>) {
  return details
    .map(
      (detail) => `
        <tr>
          <td style="padding:8px 0;color:#a8a29e;font-size:13px;font-weight:600;vertical-align:top;">${detail.label}</td>
          <td style="padding:8px 0;color:#e7e5e4;font-size:14px;text-align:right;">${detail.value}</td>
        </tr>
      `
    )
    .join("");
}

function renderShell(input: EmailShellInput) {
  return `
    <div style="margin:0;padding:32px 16px;background:#0c0a09;font-family:Arial,sans-serif;color:#e7e5e4;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;border:1px solid #292524;border-radius:20px;overflow:hidden;background:#1c1917;">
        <tr>
          <td style="padding:28px 28px 20px;background:linear-gradient(135deg,#d97706 0%,#f59e0b 100%);color:#0c0a09;">
            <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">${input.eyebrow}</div>
            <h1 style="margin:14px 0 0;font-size:28px;line-height:1.2;">${input.title}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#d6d3d1;">${input.intro}</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #292524;border-bottom:1px solid #292524;">
              ${renderDetails(input.details)}
            </table>
            ${
              input.actions?.length
                ? `<div style="margin:28px 0 18px;">
                    ${input.actions
                      .map((action, index) => {
                        const isPrimary = action.tone !== "secondary";
                        return `<a href="${action.href}" style="display:inline-block;margin:${index > 0 ? "10px 12px 0 0" : "0 12px 0 0"};padding:14px 18px;border-radius:12px;${
                          isPrimary
                            ? "background:#f59e0b;color:#0c0a09;"
                            : "background:#292524;color:#f5f5f4;border:1px solid #44403c;"
                        }text-decoration:none;font-weight:700;">${action.label}</a>`;
                      })
                      .join("")}
                  </div>`
                : ""
            }
            <p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#a8a29e;">${input.closing || "Kind regards,<br />Dean Lennard<br />Outbreak LTD"}</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export function buildQuoteEmailTemplate(input: {
  recipientName: string;
  quoteNumber: string;
  total: string;
  expiryDate?: string;
  viewQuoteHref?: string;
  pdfHref?: string;
}) {
  return renderShell({
    eyebrow: "Proposal",
    title: `Quote ${input.quoteNumber}`,
    intro: `Hello ${input.recipientName}, your quote is ready. I have attached the PDF to this email and also prepared a secure hosted quote page on deanlennard.com where you can review the details and approve the proposal online.`,
    details: [
      { label: "Quote number", value: input.quoteNumber },
      { label: "Total", value: input.total },
      ...(input.expiryDate ? [{ label: "Expiry date", value: input.expiryDate }] : []),
    ],
    actions: [
      ...(input.viewQuoteHref
        ? [{ label: "Review quote", href: input.viewQuoteHref, tone: "primary" as const }]
        : []),
      ...(input.pdfHref
        ? [{ label: "Open PDF", href: input.pdfHref, tone: "secondary" as const }]
        : []),
    ],
  });
}

export function buildInvoiceEmailTemplate(input: {
  recipientName: string;
  invoiceNumber: string;
  total: string;
  dueDate: string;
  viewInvoiceHref?: string;
  pdfHref?: string;
  paymentHref?: string;
}) {
  return renderShell({
    eyebrow: "Invoice",
    title: `Invoice ${input.invoiceNumber}`,
    intro: `Hello ${input.recipientName}, your invoice is attached and also available on a secure hosted page on deanlennard.com. You can review the details there and use the available payment options that have been prepared for this invoice.`,
    details: [
      { label: "Invoice number", value: input.invoiceNumber },
      { label: "Total due", value: input.total },
      { label: "Due date", value: input.dueDate },
    ],
    actions: [
      ...(input.viewInvoiceHref
        ? [{ label: "View invoice", href: input.viewInvoiceHref, tone: "primary" as const }]
        : []),
      ...(input.paymentHref
        ? [{ label: "Pay now", href: input.paymentHref, tone: "secondary" as const }]
        : []),
      ...(!input.paymentHref && input.pdfHref
        ? [{ label: "Open PDF", href: input.pdfHref, tone: "secondary" as const }]
        : []),
    ],
  });
}

export function buildOverdueInvoiceEmailTemplate(input: {
  recipientName: string;
  invoiceNumber: string;
  total: string;
  dueDate: string;
  viewInvoiceHref?: string;
  paymentHref?: string;
}) {
  return renderShell({
    eyebrow: "Payment reminder",
    title: `Invoice ${input.invoiceNumber} is overdue`,
    intro: `Hello ${input.recipientName}, this is a reminder that the invoice below is now overdue. You can review it on the secure hosted page and use the available payment option there if you still need to settle it.`,
    details: [
      { label: "Invoice number", value: input.invoiceNumber },
      { label: "Outstanding", value: input.total },
      { label: "Due date", value: input.dueDate },
    ],
    actions: [
      ...(input.viewInvoiceHref
        ? [{ label: "View invoice", href: input.viewInvoiceHref, tone: "primary" as const }]
        : []),
      ...(input.paymentHref
        ? [{ label: "Pay now", href: input.paymentHref, tone: "secondary" as const }]
        : []),
    ],
  });
}

export function buildPaymentConfirmationEmailTemplate(input: {
  recipientName: string;
  invoiceNumber: string;
  totalPaid: string;
  paidDate?: string;
  viewInvoiceHref?: string;
  pdfHref?: string;
}) {
  return renderShell({
    eyebrow: "Payment received",
    title: `Payment confirmed for ${input.invoiceNumber}`,
    intro: `Hello ${input.recipientName}, thank you. Payment has been recorded against your invoice and I have included the hosted invoice page and PDF below for your records.`,
    details: [
      { label: "Invoice number", value: input.invoiceNumber },
      { label: "Amount received", value: input.totalPaid },
      ...(input.paidDate ? [{ label: "Paid date", value: input.paidDate }] : []),
    ],
    actions: [
      ...(input.viewInvoiceHref
        ? [{ label: "View invoice", href: input.viewInvoiceHref, tone: "primary" as const }]
        : []),
      ...(input.pdfHref
        ? [{ label: "Open PDF", href: input.pdfHref, tone: "secondary" as const }]
        : []),
    ],
  });
}

export function buildRecurringInvoiceCreatedEmailTemplate(input: {
  recipientName: string;
  invoiceNumber: string;
  total: string;
  dueDate: string;
  viewInvoiceHref?: string;
  paymentHref?: string;
  pdfHref?: string;
}) {
  return renderShell({
    eyebrow: "Recurring invoice",
    title: `New recurring invoice ${input.invoiceNumber}`,
    intro: `Hello ${input.recipientName}, a new recurring invoice has been created for your care plan or ongoing service. You can review it on the secure hosted page and pay using the available option there.`,
    details: [
      { label: "Invoice number", value: input.invoiceNumber },
      { label: "Total due", value: input.total },
      { label: "Due date", value: input.dueDate },
    ],
    actions: [
      ...(input.viewInvoiceHref
        ? [{ label: "View invoice", href: input.viewInvoiceHref, tone: "primary" as const }]
        : []),
      ...(input.paymentHref
        ? [{ label: "Pay now", href: input.paymentHref, tone: "secondary" as const }]
        : []),
      ...(!input.paymentHref && input.pdfHref
        ? [{ label: "Open PDF", href: input.pdfHref, tone: "secondary" as const }]
        : []),
    ],
  });
}

export function buildPortalMagicLinkEmailTemplate(input: {
  recipientName: string;
  businessName: string;
  magicLinkHref: string;
  expiryMinutes: number;
}) {
  return renderShell({
    eyebrow: "Client portal",
    title: `Your secure sign-in link for ${input.businessName}`,
    intro: `Hello ${input.recipientName}, use the secure link below to sign in to your client portal. This passwordless link expires in ${input.expiryMinutes} minutes.`,
    details: [
      { label: "Access type", value: "Magic link" },
      { label: "Expires in", value: `${input.expiryMinutes} minutes` },
    ],
    actions: [
      {
        label: "Sign in to portal",
        href: input.magicLinkHref,
        tone: "primary",
      },
    ],
    closing:
      "If you did not request this sign-in link, you can safely ignore this email.<br />Dean Lennard<br />Outbreak LTD",
  });
}

export function buildMonthlyProjectSummaryEmailTemplate(input: {
  recipientName: string;
  projectName: string;
  projectStatus: string;
  openTasks: string;
  completedTasks: string;
  loggedHours: string;
  revenue: string;
  outstandingBalance: string;
}) {
  return renderShell({
    eyebrow: "Project summary",
    title: `Monthly update for ${input.projectName}`,
    intro: `Hello ${input.recipientName}, here is a short monthly summary for your project so you have a clear view of delivery progress and current commercial status.`,
    details: [
      { label: "Project status", value: input.projectStatus },
      { label: "Open tasks", value: input.openTasks },
      { label: "Completed tasks", value: input.completedTasks },
      { label: "Logged hours", value: input.loggedHours },
      { label: "Paid revenue", value: input.revenue },
      { label: "Outstanding balance", value: input.outstandingBalance },
    ],
  });
}

export function buildCarePlanRenewalEmailTemplate(input: {
  recipientName: string;
  scheduleTitle: string;
  renewalDate: string;
  amount: string;
  tierLabel: string;
}) {
  return renderShell({
    eyebrow: "Care plan renewal",
    title: `${input.scheduleTitle} renews soon`,
    intro: `Hello ${input.recipientName}, this is a heads-up that your ${input.tierLabel} care plan is coming up for renewal soon. The next billing date is below so there are no surprises.`,
    details: [
      { label: "Plan", value: input.scheduleTitle },
      { label: "Tier", value: input.tierLabel },
      { label: "Renewal date", value: input.renewalDate },
      { label: "Renewal amount", value: input.amount },
    ],
  });
}
