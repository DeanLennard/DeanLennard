import { formatDisplayDate } from "@/lib/date-format";

import { TextEncoder } from "node:util";

type PdfTextOptions = {
  size?: number;
  color?: [number, number, number];
};

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function sanitizeLine(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function flattenMultilineText(value: string) {
  return sanitizeLine(value)
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);
}

function addText(lines: string[], x: number, y: number, text: string, options?: PdfTextOptions) {
  const size = options?.size ?? 11;
  const color = options?.color ?? [0, 0, 0];
  lines.push("BT");
  lines.push(`${color[0]} ${color[1]} ${color[2]} rg`);
  lines.push(`/F1 ${size} Tf`);
  lines.push(`${x} ${y} Td`);
  lines.push(`(${escapePdfText(text)}) Tj`);
  lines.push("ET");
}

function getApproximateTextWidth(text: string, size: number) {
  return text.length * size * 0.48;
}

function addRightAlignedText(
  lines: string[],
  rightX: number,
  y: number,
  text: string,
  options?: PdfTextOptions
) {
  const size = options?.size ?? 11;
  addText(lines, rightX - getApproximateTextWidth(text, size), y, text, options);
}

function addCenteredText(
  lines: string[],
  centerX: number,
  y: number,
  text: string,
  options?: PdfTextOptions
) {
  const size = options?.size ?? 11;
  addText(lines, centerX - getApproximateTextWidth(text, size) / 2, y, text, options);
}

function drawFilledRect(
  lines: string[],
  x: number,
  y: number,
  width: number,
  height: number,
  color: [number, number, number]
) {
  lines.push(`${color[0]} ${color[1]} ${color[2]} rg`);
  lines.push(`${x} ${y} ${width} ${height} re f`);
}

function drawStrokedRect(
  lines: string[],
  x: number,
  y: number,
  width: number,
  height: number,
  color: [number, number, number],
  lineWidth = 1
) {
  lines.push(`${lineWidth} w`);
  lines.push(`${color[0]} ${color[1]} ${color[2]} RG`);
  lines.push(`${x} ${y} ${width} ${height} re S`);
}

function drawLine(
  lines: string[],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: [number, number, number],
  lineWidth = 1
) {
  lines.push(`${lineWidth} w`);
  lines.push(`${color[0]} ${color[1]} ${color[2]} RG`);
  lines.push(`${x1} ${y1} m ${x2} ${y2} l S`);
}

function buildSimplePdf(textCommands: string[]) {
  const encoder = new TextEncoder();
  const streamContent = textCommands.join("\n");

  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${encoder.encode(streamContent).length} >> stream\n${streamContent}\nendstream endobj`,
  ];

  let body = "%PDF-1.4\n";
  const offsets = [0];

  for (const object of objects) {
    offsets.push(encoder.encode(body).length);
    body += `${object}\n`;
  }

  const xrefOffset = encoder.encode(body).length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    body += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return encoder.encode(body);
}

function buildCommonHeader(params: {
  title: string;
  businessName: string;
  businessAddress: string;
  documentNumber: string;
  issueDate: string;
  dueDate?: string;
  recipientName: string;
  recipientAddress?: string;
}) {
  const commands: string[] = [];
  let y = 800;

  addText(commands, 40, y, params.businessName, { size: 18 });
  y -= 22;

  for (const line of flattenMultilineText(params.businessAddress)) {
    addText(commands, 40, y, line, { size: 10 });
    y -= 14;
  }

  addText(commands, 380, 800, params.title, { size: 20 });
  addText(commands, 380, 778, `Number: ${params.documentNumber}`, { size: 10 });
  addText(commands, 380, 764, `Issue: ${params.issueDate}`, { size: 10 });

  if (params.dueDate) {
    addText(commands, 380, 750, `Due: ${params.dueDate}`, { size: 10 });
  }

  y -= 24;
  addText(commands, 40, y, "Bill to", { size: 11 });
  y -= 18;
  addText(commands, 40, y, params.recipientName, { size: 12 });
  y -= 16;

  for (const line of flattenMultilineText(params.recipientAddress ?? "")) {
    addText(commands, 40, y, line, { size: 10 });
    y -= 14;
  }

  return { commands, y: y - 10 };
}

export function generateQuotePdf(input: {
  quoteNumber: string;
  issueDate: string;
  expiryDate?: string;
  businessName: string;
  businessAddress: string;
  customerName: string;
  customerAddress?: string;
  title: string;
  summary?: string;
  scopeOfWork?: string;
  exclusions?: string;
  paymentTerms?: string;
  notes?: string;
  currency: string;
  lineItems: Array<{
    title: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  total: number;
}) {
  const commands: string[] = [];
  const brandAmber: [number, number, number] = [0.96, 0.62, 0.04];
  const deepStone: [number, number, number] = [0.11, 0.10, 0.09];
  const midStone: [number, number, number] = [0.42, 0.38, 0.35];
  const lightStone: [number, number, number] = [0.90, 0.89, 0.88];
  const white: [number, number, number] = [1, 1, 1];

  drawFilledRect(commands, 0, 0, 595, 842, white);
  drawFilledRect(commands, 0, 760, 595, 82, brandAmber);
  addText(commands, 40, 800, input.businessName, { size: 24, color: deepStone });
  addRightAlignedText(commands, 555, 800, "QUOTE", { size: 26, color: deepStone });

  let leftY = 736;
  for (const line of flattenMultilineText(input.businessAddress)) {
    addText(commands, 40, leftY, line, { size: 10, color: deepStone });
    leftY -= 13;
  }

  drawFilledRect(commands, 350, 675, 205, 65, [0.96, 0.95, 0.94]);
  drawStrokedRect(commands, 350, 675, 205, 65, [0.82, 0.80, 0.77]);
  addText(commands, 366, 720, "Quote number", { size: 9, color: midStone });
  addRightAlignedText(commands, 540, 720, input.quoteNumber, { size: 12, color: deepStone });
  addText(commands, 366, 701, "Issue date", { size: 9, color: midStone });
  addRightAlignedText(commands, 540, 701, input.issueDate, { size: 11, color: deepStone });
  addText(commands, 366, 682, "Expiry date", { size: 9, color: midStone });
  addRightAlignedText(
    commands,
    540,
    682,
    input.expiryDate || "Open",
    { size: 11, color: deepStone }
  );

  addText(commands, 40, 670, "Prepared for", { size: 10, color: midStone });
  addText(commands, 40, 650, input.customerName, { size: 14, color: deepStone });
  let customerY = 634;
  for (const line of flattenMultilineText(input.customerAddress ?? "")) {
    addText(commands, 40, customerY, line, { size: 10, color: deepStone });
    customerY -= 13;
  }

  drawFilledRect(commands, 40, 565, 515, 60, [0.97, 0.97, 0.96]);
  drawStrokedRect(commands, 40, 565, 515, 60, [0.87, 0.85, 0.83]);
  addText(commands, 58, 602, "Proposal", { size: 9, color: midStone });
  addText(commands, 58, 580, input.title, { size: 18, color: deepStone });

  let sectionY = 535;
  const sections = [
    ["Summary", input.summary],
    ["Scope of work", input.scopeOfWork],
    ["Exclusions", input.exclusions],
    ["Payment terms", input.paymentTerms],
    ["Notes", input.notes],
  ] as const;

  for (const [label, value] of sections) {
    if (!value?.trim()) {
      continue;
    }

    drawFilledRect(commands, 40, sectionY - 20, 515, 20, [0.96, 0.95, 0.94]);
    addText(commands, 52, sectionY - 6, label, { size: 10, color: deepStone });
    sectionY -= 34;

    for (const line of flattenMultilineText(value)) {
      addText(commands, 52, sectionY, line, { size: 10, color: deepStone });
      sectionY -= 13;
    }

    sectionY -= 10;
  }

  const tableTop = Math.max(sectionY - 6, 260);
  drawFilledRect(commands, 40, tableTop, 515, 24, deepStone);
  addText(commands, 52, tableTop + 7, "Description", { size: 10, color: lightStone });
  addCenteredText(commands, 382, tableTop + 7, "Qty", { size: 10, color: lightStone });
  addCenteredText(commands, 447, tableTop + 7, "Unit", { size: 10, color: lightStone });
  addCenteredText(commands, 522, tableTop + 7, "Total", { size: 10, color: lightStone });

  let y = tableTop - 18;
  for (const item of input.lineItems) {
    const descriptionLines = [item.title, ...flattenMultilineText(item.description ?? "")];
    const rowHeight = Math.max(24, 16 + descriptionLines.length * 12);
    drawLine(commands, 40, y - rowHeight + 6, 555, y - rowHeight + 6, [0.88, 0.87, 0.85]);

    addText(commands, 52, y, item.title, { size: 11, color: deepStone });
    let lineY = y - 13;
    for (const line of flattenMultilineText(item.description ?? "")) {
      addText(commands, 52, lineY, line, { size: 9, color: midStone });
      lineY -= 11;
    }

    addCenteredText(commands, 382, y, String(item.quantity), { size: 10, color: deepStone });
    addCenteredText(commands, 447, y, `${input.currency} ${item.unitPrice.toFixed(2)}`, {
      size: 10,
      color: deepStone,
    });
    addRightAlignedText(commands, 545, y, `${input.currency} ${item.total.toFixed(2)}`, {
      size: 10,
      color: deepStone,
    });

    y -= rowHeight;
  }

  const totalsBoxTop = y - 8;
  drawFilledRect(commands, 325, totalsBoxTop - 50, 230, 50, [0.98, 0.97, 0.95]);
  drawStrokedRect(commands, 325, totalsBoxTop - 50, 230, 50, [0.87, 0.85, 0.83]);
  addText(commands, 340, totalsBoxTop - 18, "Subtotal", { size: 10, color: midStone });
  addRightAlignedText(commands, 540, totalsBoxTop - 18, `${input.currency} ${input.subtotal.toFixed(2)}`, {
    size: 10,
    color: deepStone,
  });
  addText(commands, 340, totalsBoxTop - 38, "Quote total", { size: 11, color: deepStone });
  addRightAlignedText(commands, 540, totalsBoxTop - 38, `${input.currency} ${input.total.toFixed(2)}`, {
    size: 14,
    color: deepStone,
  });

  addText(commands, 40, 36, `Generated by ${input.businessName}`, { size: 9, color: midStone });
  addRightAlignedText(commands, 555, 36, "Prepared for review and approval", { size: 9, color: midStone });

  return buildSimplePdf(commands);
}

export function generateInvoicePdf(input: {
  invoiceNumber: string;
  status?: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  businessName: string;
  businessAddress: string;
  companyNumber?: string;
  vatNumber?: string;
  customerName: string;
  customerAddress?: string;
  notes?: string;
  footerNotes?: string;
  bankInstructions?: string;
  currency: string;
  taxAmount: number;
  subtotal: number;
  total: number;
  amountPaid?: number;
  balanceDue?: number;
  lineItems: Array<{
    title: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}) {
  const commands: string[] = [];
  const brandAmber: [number, number, number] = [0.96, 0.62, 0.04];
  const deepStone: [number, number, number] = [0.11, 0.10, 0.09];
  const midStone: [number, number, number] = [0.42, 0.38, 0.35];
  const lightStone: [number, number, number] = [0.90, 0.89, 0.88];
  const white: [number, number, number] = [1, 1, 1];
  const successGreen: [number, number, number] = [0.07, 0.55, 0.33];
  const alertRed: [number, number, number] = [0.76, 0.20, 0.18];
  const warningAmber: [number, number, number] = [0.75, 0.47, 0.04];
  const infoBlue: [number, number, number] = [0.12, 0.43, 0.78];
  const mutedStone: [number, number, number] = [0.52, 0.48, 0.45];
  const invoiceStatus = input.status ?? "draft";
  const amountPaid = input.amountPaid ?? 0;
  const balanceDue = input.balanceDue ?? input.total;

  const statusPresentation = (() => {
    switch (invoiceStatus) {
      case "paid":
        return {
          label: "PAID",
          fill: successGreen,
          text: input.paidDate
            ? `Paid on ${formatDisplayDate(input.paidDate)}`
            : "Payment received",
        };
      case "overdue":
        return {
          label: "OVERDUE",
          fill: alertRed,
          text: `Outstanding ${input.currency} ${balanceDue.toFixed(2)}`,
        };
      case "partially_paid":
        return {
          label: "PART PAID",
          fill: warningAmber,
          text: `Paid ${input.currency} ${amountPaid.toFixed(2)} | Due ${input.currency} ${balanceDue.toFixed(2)}`,
        };
      case "refunded":
        return {
          label: "REFUNDED",
          fill: infoBlue,
          text: "Payment reversed or refunded",
        };
      case "cancelled":
        return {
          label: "CANCELLED",
          fill: mutedStone,
          text: "Invoice no longer payable",
        };
      default:
        return {
          label: invoiceStatus.replaceAll("_", " ").toUpperCase(),
          fill: deepStone,
          text: `Balance due ${input.currency} ${balanceDue.toFixed(2)}`,
        };
    }
  })();

  drawFilledRect(commands, 0, 0, 595, 842, white);
  drawFilledRect(commands, 0, 760, 595, 82, brandAmber);
  addText(commands, 40, 800, input.businessName, { size: 24, color: deepStone });
  addRightAlignedText(commands, 555, 800, "INVOICE", { size: 26, color: deepStone });

  let leftY = 736;
  for (const line of flattenMultilineText(input.businessAddress)) {
    addText(commands, 40, leftY, line, { size: 10, color: deepStone });
    leftY -= 13;
  }
  if (input.companyNumber) {
    addText(commands, 40, leftY - 4, `Company no. ${input.companyNumber}`, {
      size: 10,
      color: deepStone,
    });
    leftY -= 17;
  }
  if (input.vatNumber) {
    addText(commands, 40, leftY - 4, `VAT ${input.vatNumber}`, {
      size: 10,
      color: deepStone,
    });
  }

  drawFilledRect(commands, 350, 675, 205, 65, [0.96, 0.95, 0.94]);
  drawStrokedRect(commands, 350, 675, 205, 65, [0.82, 0.80, 0.77]);
  addText(commands, 366, 720, "Invoice number", { size: 9, color: midStone });
  addRightAlignedText(commands, 540, 720, input.invoiceNumber, { size: 12, color: deepStone });
  addText(commands, 366, 701, "Issue date", { size: 9, color: midStone });
  addRightAlignedText(commands, 540, 701, input.issueDate, { size: 11, color: deepStone });
  addText(commands, 366, 682, "Due date", { size: 9, color: midStone });
  addRightAlignedText(commands, 540, 682, input.dueDate, { size: 11, color: deepStone });

  addText(commands, 40, 670, "Bill to", { size: 10, color: midStone });
  addText(commands, 40, 650, input.customerName, { size: 14, color: deepStone });
  let customerY = 634;
  for (const line of flattenMultilineText(input.customerAddress ?? "")) {
    addText(commands, 40, customerY, line, { size: 10, color: deepStone });
    customerY -= 13;
  }

  drawFilledRect(commands, 40, 602, 515, 40, statusPresentation.fill);
  addText(commands, 58, 618, statusPresentation.label, { size: 14, color: white });
  addRightAlignedText(commands, 535, 618, statusPresentation.text, {
    size: 10,
    color: white,
  });

  const summaryTop = 548;
  drawFilledRect(commands, 40, summaryTop - 58, 515, 58, [0.97, 0.97, 0.96]);
  drawStrokedRect(commands, 40, summaryTop - 58, 515, 58, [0.87, 0.85, 0.83]);
  addText(commands, 58, summaryTop - 18, "Subtotal", { size: 9, color: midStone });
  addText(commands, 214, summaryTop - 18, "Tax", { size: 9, color: midStone });
  addText(
    commands,
    350,
    summaryTop - 18,
    invoiceStatus === "paid" ? "Invoice total" : "Total due",
    { size: 9, color: midStone }
  );
  addRightAlignedText(commands, 180, summaryTop - 38, `${input.currency} ${input.subtotal.toFixed(2)}`, {
    size: 15,
    color: deepStone,
  });
  addRightAlignedText(commands, 320, summaryTop - 38, `${input.currency} ${input.taxAmount.toFixed(2)}`, {
    size: 15,
    color: deepStone,
  });
  addRightAlignedText(commands, 535, summaryTop - 38, `${input.currency} ${input.total.toFixed(2)}`, {
    size: 18,
    color: deepStone,
  });

  const tableTop = 458;
  drawFilledRect(commands, 40, tableTop, 515, 24, deepStone);
  addText(commands, 52, tableTop + 7, "Description", { size: 10, color: lightStone });
  addCenteredText(commands, 382, tableTop + 7, "Qty", { size: 10, color: lightStone });
  addCenteredText(commands, 447, tableTop + 7, "Unit", { size: 10, color: lightStone });
  addCenteredText(commands, 522, tableTop + 7, "Total", { size: 10, color: lightStone });

  let y = tableTop - 18;
  for (const item of input.lineItems) {
    const descriptionLines = [item.title, ...flattenMultilineText(item.description ?? "")];
    const rowHeight = Math.max(24, 16 + descriptionLines.length * 12);
    drawLine(commands, 40, y - rowHeight + 6, 555, y - rowHeight + 6, [0.88, 0.87, 0.85]);

    addText(commands, 52, y, item.title, { size: 11, color: deepStone });
    let lineY = y - 13;
    for (const line of flattenMultilineText(item.description ?? "")) {
      addText(commands, 52, lineY, line, { size: 9, color: midStone });
      lineY -= 11;
    }

    addCenteredText(commands, 382, y, String(item.quantity), { size: 10, color: deepStone });
    addCenteredText(commands, 447, y, `${input.currency} ${item.unitPrice.toFixed(2)}`, {
      size: 10,
      color: deepStone,
    });
    addRightAlignedText(commands, 545, y, `${input.currency} ${item.total.toFixed(2)}`, {
      size: 10,
      color: deepStone,
    });

    y -= rowHeight;
  }

  const totalsBoxTop = y - 8;
  drawFilledRect(commands, 325, totalsBoxTop - 86, 230, 86, [0.98, 0.97, 0.95]);
  drawStrokedRect(commands, 325, totalsBoxTop - 86, 230, 86, [0.87, 0.85, 0.83]);
  addText(commands, 340, totalsBoxTop - 18, "Subtotal", { size: 10, color: midStone });
  addRightAlignedText(commands, 540, totalsBoxTop - 18, `${input.currency} ${input.subtotal.toFixed(2)}`, {
    size: 10,
    color: deepStone,
  });
  addText(commands, 340, totalsBoxTop - 36, "Tax", { size: 10, color: midStone });
  addRightAlignedText(commands, 540, totalsBoxTop - 36, `${input.currency} ${input.taxAmount.toFixed(2)}`, {
    size: 10,
    color: deepStone,
  });
  addText(commands, 340, totalsBoxTop - 54, "Amount paid", { size: 10, color: midStone });
  addRightAlignedText(commands, 540, totalsBoxTop - 54, `${input.currency} ${amountPaid.toFixed(2)}`, {
    size: 10,
    color: deepStone,
  });
  addText(commands, 340, totalsBoxTop - 74, "Balance due", { size: 11, color: deepStone });
  addRightAlignedText(commands, 540, totalsBoxTop - 74, `${input.currency} ${balanceDue.toFixed(2)}`, {
    size: 14,
    color: deepStone,
  });

  let sectionY = totalsBoxTop - 113;
  const sections = [
    ["Notes", input.notes],
    ["Payment details", input.bankInstructions],
    ["Footer notes", input.footerNotes],
  ] as const;

  for (const [label, value] of sections) {
    if (!value?.trim()) {
      continue;
    }

    drawFilledRect(commands, 40, sectionY - 20, 515, 20, [0.96, 0.95, 0.94]);
    addText(commands, 52, sectionY - 6, label, { size: 10, color: deepStone });
    sectionY -= 34;

    for (const line of flattenMultilineText(value)) {
      addText(commands, 52, sectionY, line, { size: 10, color: deepStone });
      sectionY -= 13;
    }

    sectionY -= 10;
  }

  addText(commands, 40, 36, `Generated by ${input.businessName}`, { size: 9, color: midStone });
  addRightAlignedText(commands, 555, 36, "Thank you for your business", { size: 9, color: midStone });

  return buildSimplePdf(commands);
}
