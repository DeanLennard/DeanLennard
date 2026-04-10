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
              {invoice.status.replaceAll("_", " ")}
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
              {invoice.stripeHostedInvoiceUrl ? (
                <Link
                  href={invoice.stripeHostedInvoiceUrl}
                  target="_blank"
                  className="flex items-center justify-center rounded-xl bg-amber-500 px-5 py-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
                >
                  Pay by card
                </Link>
              ) : null}
              {invoice.gocardlessPaymentUrl ? (
                <Link
                  href={invoice.gocardlessPaymentUrl}
                  target="_blank"
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Pay by direct debit
                </Link>
              ) : null}
              {invoice.bankDetailsSnapshot ? (
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
