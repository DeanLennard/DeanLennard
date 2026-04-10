type EmailShellInput = {
  eyebrow: string;
  title: string;
  intro: string;
  details: Array<{ label: string; value: string }>;
  primaryLabel?: string;
  primaryHref?: string;
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
              input.primaryLabel && input.primaryHref
                ? `<div style="margin:28px 0 18px;">
                    <a href="${input.primaryHref}" style="display:inline-block;padding:14px 18px;border-radius:12px;background:#f59e0b;color:#0c0a09;text-decoration:none;font-weight:700;">${input.primaryLabel}</a>
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
    primaryLabel: input.pdfHref ? "Open PDF" : undefined,
    primaryHref: input.pdfHref,
  });
}

export function buildInvoiceEmailTemplate(input: {
  recipientName: string;
  invoiceNumber: string;
  total: string;
  dueDate: string;
  pdfHref?: string;
  paymentHref?: string;
}) {
  return renderShell({
    eyebrow: "Invoice",
    title: `Invoice ${input.invoiceNumber}`,
    intro: `Hello ${input.recipientName}, your invoice is attached and ready for review. The key details are below so payment and record-keeping stay straightforward.`,
    details: [
      { label: "Invoice number", value: input.invoiceNumber },
      { label: "Total due", value: input.total },
      { label: "Due date", value: input.dueDate },
    ],
    primaryLabel: input.paymentHref ? "Open payment link" : input.pdfHref ? "Open PDF" : undefined,
    primaryHref: input.paymentHref || input.pdfHref,
  });
}
