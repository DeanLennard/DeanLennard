import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDisplayDate } from "@/lib/date-format";
import { getInvoiceById, getInvoiceLinkedContext } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { verifyPublicInvoiceToken } from "@/lib/public-invoice-links";

export const metadata: Metadata = {
  title: "Invoice",
  robots: {
    index: false,
    follow: false,
  },
};

function getInvoiceStatusPresentation(input: {
  status: string;
  currency: string;
  balanceDue: number;
  amountPaid: number;
  paidDate?: string;
}) {
  switch (input.status) {
    case "paid":
      return {
        label: "Paid",
        bannerClassName:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-50",
        badgeClassName:
          "border-emerald-400/30 bg-emerald-400/15 text-emerald-100",
        title: "This invoice has been paid.",
        description: input.paidDate
          ? `Payment was recorded on ${formatDisplayDate(input.paidDate)}.`
          : "Payment has been recorded against this invoice.",
      };
    case "overdue":
      return {
        label: "Overdue",
        bannerClassName: "border-red-500/30 bg-red-500/10 text-red-50",
        badgeClassName: "border-red-400/30 bg-red-400/15 text-red-100",
        title: "This invoice is overdue.",
        description: `There is still ${formatMoney(
          input.balanceDue,
          input.currency
        )} outstanding on this invoice.`,
      };
    case "partially_paid":
      return {
        label: "Partially paid",
        bannerClassName:
          "border-amber-500/30 bg-amber-500/10 text-amber-50",
        badgeClassName:
          "border-amber-400/30 bg-amber-400/15 text-amber-100",
        title: "This invoice has been partially paid.",
        description: `${formatMoney(
          input.amountPaid,
          input.currency
        )} has been received and ${formatMoney(
          input.balanceDue,
          input.currency
        )} remains due.`,
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bannerClassName:
          "border-stone-500/30 bg-stone-500/10 text-stone-100",
        badgeClassName:
          "border-stone-400/30 bg-stone-400/15 text-stone-100",
        title: "This invoice has been cancelled.",
        description: "No further payment is required for this invoice.",
      };
    case "refunded":
      return {
        label: "Refunded",
        bannerClassName: "border-sky-500/30 bg-sky-500/10 text-sky-50",
        badgeClassName: "border-sky-400/30 bg-sky-400/15 text-sky-100",
        title: "This invoice has been refunded.",
        description: "Payment for this invoice has been reversed or refunded.",
      };
    default:
      return {
        label: input.status.replaceAll("_", " "),
        bannerClassName:
          "border-white/10 bg-white/[0.04] text-stone-100",
        badgeClassName:
          "border-white/10 bg-white/[0.06] text-stone-100",
        title: "This invoice is ready for review.",
        description: `The current balance due is ${formatMoney(
          input.balanceDue,
          input.currency
        )}.`,
      };
  }
}

export default async function PublicInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { invoiceId } = await params;
  const resolvedSearchParams = await searchParams;
  const token = Array.isArray(resolvedSearchParams.token)
    ? resolvedSearchParams.token[0]
    : resolvedSearchParams.token;

  if (!verifyPublicInvoiceToken(invoiceId, token)) {
    notFound();
  }

  const invoice = await getInvoiceById(invoiceId);

  if (!invoice) {
    notFound();
  }

  const { customer } = await getInvoiceLinkedContext(invoice);
  const statusPresentation = getInvoiceStatusPresentation({
    status: invoice.status,
    currency: invoice.currency,
    balanceDue: invoice.balanceDue,
    amountPaid: invoice.amountPaid,
    paidDate: invoice.paidDate,
  });
  const canCollectPayment = !["paid", "cancelled", "refunded"].includes(invoice.status);

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-12 text-stone-100 lg:px-8">
      <section className="mx-auto w-full max-w-5xl rounded-[2rem] border border-white/10 bg-stone-900/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-400">
              Hosted invoice
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              {invoice.invoiceNumber}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
              This secure invoice page is hosted on deanlennard.com so you can review the
              invoice, download the PDF, and use the available payment options in one place.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-7 text-stone-200">
            <p>
              <span className="font-semibold text-white">Status:</span>{" "}
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusPresentation.badgeClassName}`}
              >
                {statusPresentation.label}
              </span>
            </p>
            <p>
              <span className="font-semibold text-white">Issue date:</span>{" "}
              {formatDisplayDate(invoice.issueDate)}
            </p>
            <p>
              <span className="font-semibold text-white">Due date:</span>{" "}
              {formatDisplayDate(invoice.dueDate)}
            </p>
            <p>
              <span className="font-semibold text-white">Total due:</span>{" "}
              {formatMoney(invoice.balanceDue, invoice.currency)}
            </p>
          </div>
        </div>

        <div
          className={`mt-8 rounded-2xl border px-6 py-5 ${statusPresentation.bannerClassName}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em]">
            Invoice status
          </p>
          <p className="mt-2 text-lg font-semibold">{statusPresentation.title}</p>
          <p className="mt-2 text-sm leading-7 opacity-90">
            {statusPresentation.description}
          </p>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Invoice details
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-stone-950/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                  From
                </p>
                <div className="mt-3 space-y-1 text-sm leading-7 text-stone-200">
                  <p className="font-semibold text-white">Outbreak LTD</p>
                  <p>241 Tixall Road</p>
                  <p>Stafford</p>
                  <p>ST16 3XS</p>
                  <p>Company No. 10977129</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-stone-950/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                  Bill to
                </p>
                <div className="mt-3 space-y-1 text-sm leading-7 text-stone-200">
                  <p className="font-semibold text-white">
                    {customer?.businessName || customer?.contactName || "Client"}
                  </p>
                  {customer?.contactName && customer.businessName ? (
                    <p>{customer.contactName}</p>
                  ) : null}
                  {customer?.billingAddress ? (
                    <p className="whitespace-pre-line">{customer.billingAddress}</p>
                  ) : null}
                  {!customer?.billingAddress && customer?.address ? (
                    <p className="whitespace-pre-line">{customer.address}</p>
                  ) : null}
                  {customer?.email ? <p>{customer.email}</p> : null}
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[1.5fr_0.6fr_0.8fr_0.8fr] gap-4 bg-white/[0.04] px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                  <span>Item</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Unit</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="divide-y divide-white/10">
                  {invoice.lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1.5fr_0.6fr_0.8fr_0.8fr] gap-4 px-5 py-5 text-sm text-stone-200"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        {item.description ? (
                          <p className="mt-1 text-sm leading-6 text-stone-400">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-right">{item.quantity}</p>
                      <p className="text-right">
                        {formatMoney(item.unitPrice, invoice.currency)}
                      </p>
                      <p className="text-right font-semibold text-white">
                        {formatMoney(item.total, invoice.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Payment options
            </p>
            <div className="mt-5 space-y-4">
              {canCollectPayment && invoice.stripeHostedInvoiceUrl ? (
                <Link
                  href={invoice.stripeHostedInvoiceUrl}
                  target="_blank"
                  className="flex items-center justify-center rounded-xl bg-amber-500 px-5 py-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
                >
                  Pay by card
                </Link>
              ) : null}
              {canCollectPayment && invoice.gocardlessPaymentUrl ? (
                <Link
                  href={invoice.gocardlessPaymentUrl}
                  target="_blank"
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Pay by direct debit
                </Link>
              ) : null}
              {canCollectPayment && invoice.bankDetailsSnapshot ? (
                <a
                  href="#bank-transfer"
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Pay by bank transfer
                </a>
              ) : null}
              {invoice.pdfPath ? (
                <Link
                  href={invoice.pdfPath}
                  target="_blank"
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Download PDF
                </Link>
              ) : null}
            </div>

            {!canCollectPayment ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-stone-950/50 p-5 text-sm leading-7 text-stone-300">
                <p className="font-semibold text-white">Payment update</p>
                <p className="mt-2">
                  {invoice.status === "paid"
                    ? "No payment action is needed because this invoice has already been settled."
                    : invoice.status === "cancelled"
                      ? "Payment options are hidden because this invoice has been cancelled."
                      : "Payment options are hidden because this invoice has already been refunded."}
                </p>
              </div>
            ) : null}

            <div className="mt-6 rounded-2xl border border-white/10 bg-stone-950/50 p-5 text-sm leading-7 text-stone-300">
              <p className="font-semibold text-white">Totals</p>
              <div className="mt-3 space-y-1">
                <p>Subtotal: {formatMoney(invoice.subtotal, invoice.currency)}</p>
                <p>Tax: {formatMoney(invoice.taxAmount, invoice.currency)}</p>
                <p>Total: {formatMoney(invoice.total, invoice.currency)}</p>
                <p>Paid: {formatMoney(invoice.amountPaid, invoice.currency)}</p>
                <p className="font-semibold text-white">
                  Balance due: {formatMoney(invoice.balanceDue, invoice.currency)}
                </p>
              </div>
            </div>

            {invoice.notes ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-stone-950/50 p-5 text-sm leading-7 text-stone-300">
                <p className="font-semibold text-white">Notes</p>
                <p className="mt-2 whitespace-pre-line">{invoice.notes}</p>
              </div>
            ) : null}
          </article>
        </section>

        {invoice.bankDetailsSnapshot ? (
          <section
            id="bank-transfer"
            className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Bank transfer details
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {invoice.bankDetailsSnapshot.accountName ? (
                <div className="rounded-xl border border-white/10 bg-stone-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Account name
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {invoice.bankDetailsSnapshot.accountName}
                  </p>
                </div>
              ) : null}
              {invoice.bankDetailsSnapshot.sortCode ? (
                <div className="rounded-xl border border-white/10 bg-stone-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Sort code
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {invoice.bankDetailsSnapshot.sortCode}
                  </p>
                </div>
              ) : null}
              {invoice.bankDetailsSnapshot.accountNumber ? (
                <div className="rounded-xl border border-white/10 bg-stone-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Account number
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {invoice.bankDetailsSnapshot.accountNumber}
                  </p>
                </div>
              ) : null}
              {invoice.bankDetailsSnapshot.iban ? (
                <div className="rounded-xl border border-white/10 bg-stone-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">IBAN</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {invoice.bankDetailsSnapshot.iban}
                  </p>
                </div>
              ) : null}
              {invoice.bankDetailsSnapshot.bic ? (
                <div className="rounded-xl border border-white/10 bg-stone-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">BIC</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {invoice.bankDetailsSnapshot.bic}
                  </p>
                </div>
              ) : null}
            </div>
            {invoice.bankDetailsSnapshot.paymentReferenceInstructions ? (
              <p className="mt-5 text-sm leading-7 text-stone-300">
                {invoice.bankDetailsSnapshot.paymentReferenceInstructions}
              </p>
            ) : null}
          </section>
        ) : null}
      </section>
    </main>
  );
}
