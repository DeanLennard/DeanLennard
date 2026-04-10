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
  pdfHref?: string;
}) {
  return renderShell({
    eyebrow: "Proposal",
    title: `Quote ${input.quoteNumber}`,
    intro: `Hello ${input.recipientName}, your quote is ready. I have attached the PDF to this email so you can review the scope and pricing easily.`,
    details: [
      { label: "Quote number", value: input.quoteNumber },
      { label: "Total", value: input.total },
      ...(input.expiryDate ? [{ label: "Expiry date", value: input.expiryDate }] : []),
    ],
    actions: input.pdfHref
      ? [{ label: "Open PDF", href: input.pdfHref, tone: "primary" }]
      : undefined,
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
