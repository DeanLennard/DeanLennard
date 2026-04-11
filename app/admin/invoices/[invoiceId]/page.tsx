import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listActivityLogsByEntity } from "@/lib/activity-log";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/date-format";
import { listEmailLogsByEntity } from "@/lib/email-logs-store";
import {
  getInvoiceById,
  getInvoiceLinkedContext,
} from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { buildPublicInvoiceUrl } from "@/lib/public-invoice-links";

export const metadata: Metadata = {
  title: "Invoice Detail",
  robots: {
    index: false,
    follow: false,
  },
};

type InvoiceDetailSearchParams = Promise<{
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function InvoiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ invoiceId: string }>;
  searchParams: InvoiceDetailSearchParams;
}) {
  await requireAdminAuthentication();

  const { invoiceId } = await params;
  const resolvedSearchParams = await searchParams;
  const error = getSingleValue(resolvedSearchParams.error) ?? "";
  const invoice = await getInvoiceById(invoiceId);

  if (!invoice) {
    notFound();
  }

  const [{ customer, project, quote, lead }, activity, emailLogs] = await Promise.all([
    getInvoiceLinkedContext(invoice),
    listActivityLogsByEntity("invoice", invoice.invoiceId),
    listEmailLogsByEntity("invoice", invoice.invoiceId),
  ]);
  const hostedInvoicePageUrl = buildPublicInvoiceUrl(invoice.invoiceId);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/invoices" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Invoice detail
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          {invoice.invoiceNumber}
        </h1>
        <p className="mt-2 text-sm leading-7 text-stone-400">
          {customer?.businessName ?? invoice.customerId} |{" "}
          {invoice.status.replaceAll("_", " ")}
        </p>
      </section>

      {error === "invalid-status" ? (
        <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          That invoice status was not recognised.
        </div>
      ) : null}
      {error === "invalid-payment" ? (
        <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          Enter a valid payment amount greater than zero.
        </div>
      ) : null}
      {error === "missing-email" ? (
        <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          This invoice cannot be emailed until the linked client has an email address.
        </div>
      ) : null}
      {error === "email-failed" ? (
        <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          The invoice email could not be sent. Check Resend settings and the generated PDF.
        </div>
      ) : null}
      {error === "duplicate-failed" ? (
        <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          The invoice could not be duplicated. Please try again.
        </div>
      ) : null}
      {error &&
      !["invalid-status", "invalid-payment", "missing-email", "email-failed", "duplicate-failed"].includes(error) ? (
        <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          {decodeURIComponent(error)}
        </div>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Invoice overview
          </p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
            <p>Issue date: {formatDisplayDate(invoice.issueDate)}</p>
            <p>Due date: {formatDisplayDate(invoice.dueDate)}</p>
            {invoice.paidDate ? <p>Paid date: {formatDisplayDate(invoice.paidDate)}</p> : null}
            <p>Currency: {invoice.currency}</p>
            <p>Payment method: {invoice.paymentMethod.replaceAll("_", " ")}</p>
            <p>Subtotal: {formatMoney(invoice.subtotal, invoice.currency)}</p>
            <p>Tax: {formatMoney(invoice.taxAmount, invoice.currency)}</p>
            <p>Total: {formatMoney(invoice.total, invoice.currency)}</p>
            <p>Amount paid: {formatMoney(invoice.amountPaid, invoice.currency)}</p>
            <p>Balance due: {formatMoney(invoice.balanceDue, invoice.currency)}</p>
            {invoice.reconciliationReference ? (
              <p>Reconciliation reference: {invoice.reconciliationReference}</p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/admin/invoices/${invoice.invoiceId}/edit`}
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Edit Invoice
            </Link>
            <form action={`/api/admin/invoices/${invoice.invoiceId}/duplicate`} method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Duplicate Invoice
              </button>
            </form>
            <form action={`/api/admin/invoices/${invoice.invoiceId}/pdf`} method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Generate PDF
              </button>
            </form>
            <form action={`/api/admin/invoices/${invoice.invoiceId}/send`} method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Email Invoice
              </button>
            </form>
            {invoice.status === "overdue" ? (
              <form action={`/api/admin/invoices/${invoice.invoiceId}/send-overdue-reminder`} method="post">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                >
                  Send Overdue Reminder
                </button>
              </form>
            ) : null}
            {invoice.status === "paid" ? (
              <form action={`/api/admin/invoices/${invoice.invoiceId}/send-payment-confirmation`} method="post">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                >
                  Send Payment Confirmation
                </button>
              </form>
            ) : null}
            <form action={`/api/admin/invoices/${invoice.invoiceId}/provider`} method="post">
              <input type="hidden" name="provider" value="stripe" />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Create Stripe Billing
              </button>
            </form>
            <form action={`/api/admin/invoices/${invoice.invoiceId}/provider`} method="post">
              <input type="hidden" name="provider" value="gocardless" />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Create GoCardless Billing
              </button>
            </form>
            {(
              [
                "draft",
                "sent",
                "unpaid",
                "partially_paid",
                "paid",
                "overdue",
                "cancelled",
                "refunded",
              ] as const
            ).map((status) => (
              <form
                key={status}
                action={`/api/admin/invoices/${invoice.invoiceId}/status`}
                method="post"
              >
                <input type="hidden" name="status" value={status} />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                >
                  Mark {status.replaceAll("_", " ")}
                </button>
              </form>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Linked context
          </p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-stone-300">
            {customer ? (
              <Link href={`/admin/clients/${customer.clientId}`} className="block font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                Open client
              </Link>
            ) : null}
            {project ? (
              <Link href={`/admin/projects/${project.projectId}`} className="block font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                Open project
              </Link>
            ) : null}
            {quote ? (
              <Link href={`/admin/quotes/${quote.quoteId}`} className="block font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                Open source quote
              </Link>
            ) : null}
            {lead ? (
              <Link href={`/admin/leads/${lead.auditId}`} className="block font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                Open linked lead
              </Link>
            ) : null}
            {invoice.notes ? (
              <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                {invoice.notes}
              </div>
            ) : null}
            {invoice.footerNotes ? (
              <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                {invoice.footerNotes}
              </div>
            ) : null}
            {invoice.pdfPath ? (
              <Link href={invoice.pdfPath} target="_blank" className="block font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                Open generated PDF
              </Link>
            ) : null}
            <Link href={hostedInvoicePageUrl} target="_blank" className="block font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
              Open hosted invoice page
            </Link>
            {invoice.stripeHostedInvoiceUrl ? (
              <Link href={invoice.stripeHostedInvoiceUrl} target="_blank" className="block font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                Open Stripe hosted invoice
              </Link>
            ) : null}
            {invoice.gocardlessPaymentUrl ? (
              <Link href={invoice.gocardlessPaymentUrl} target="_blank" className="block font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                Open GoCardless payment flow
              </Link>
            ) : null}
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Line items
          </p>
          <div className="mt-6 space-y-4">
            {invoice.lineItems.map((item) => (
              <div
                key={item.id}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-stone-100">{item.title}</p>
                    {item.description ? (
                      <p className="mt-1 text-sm leading-7 text-stone-300">{item.description}</p>
                    ) : null}
                  </div>
                  <div className="text-sm leading-7 text-stone-300 sm:text-right">
                    <p>Qty: {item.quantity}</p>
                    <p>Unit: {formatMoney(item.unitPrice, invoice.currency)}</p>
                    <p className="font-semibold text-stone-100">
                      Total: {formatMoney(item.total, invoice.currency)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

            {invoice.bankDetailsSnapshot ? (
            <div className="mt-6 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              <p className="font-semibold text-stone-100">Bank transfer details snapshot</p>
              {invoice.bankDetailsSnapshot.accountName ? <p>Account name: {invoice.bankDetailsSnapshot.accountName}</p> : null}
              {invoice.bankDetailsSnapshot.sortCode ? <p>Sort code: {invoice.bankDetailsSnapshot.sortCode}</p> : null}
              {invoice.bankDetailsSnapshot.accountNumber ? <p>Account number: {invoice.bankDetailsSnapshot.accountNumber}</p> : null}
              {invoice.bankDetailsSnapshot.iban ? <p>IBAN: {invoice.bankDetailsSnapshot.iban}</p> : null}
              {invoice.bankDetailsSnapshot.bic ? <p>BIC: {invoice.bankDetailsSnapshot.bic}</p> : null}
              {invoice.bankDetailsSnapshot.paymentReferenceInstructions ? (
                <p>{invoice.bankDetailsSnapshot.paymentReferenceInstructions}</p>
              ) : null}
            </div>
          ) : null}
          {invoice.reconciliationNotes || invoice.reconciliationAttachmentPath ? (
            <div className="mt-6 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              <p className="font-semibold text-stone-100">Bank transfer reconciliation</p>
              {invoice.reconciliationNotes ? (
                <p className="mt-2">{invoice.reconciliationNotes}</p>
              ) : null}
              {invoice.reconciliationAttachmentPath ? (
                <Link href={invoice.reconciliationAttachmentPath} target="_blank" className="mt-3 block font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                  Open uploaded proof
                </Link>
              ) : null}
            </div>
          ) : null}
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Record payment
          </p>
          <form
            action={`/api/admin/invoices/${invoice.invoiceId}/payment`}
            method="post"
            encType="multipart/form-data"
            className="mt-6 space-y-4"
          >
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Amount received</span>
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={invoice.balanceDue > 0 ? invoice.balanceDue.toFixed(2) : ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Payment date</span>
              <DateInput
                name="paidDate"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Bank transfer reference</span>
              <input
                name="reconciliationReference"
                type="text"
                defaultValue={invoice.reconciliationReference || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Reconciliation notes</span>
              <textarea
                name="reconciliationNotes"
                rows={3}
                defaultValue={invoice.reconciliationNotes || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Upload proof or receipt</span>
              <input
                name="reconciliationAttachment"
                type="file"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Record Payment
            </button>
          </form>

          <div className="mt-8">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Timeline
            </p>
            {activity.length > 0 ? (
              <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
                {activity.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
                  >
                    <p className="font-semibold text-stone-100">{entry.description}</p>
                    <p className="mt-1">
                      {entry.actionType} | {entry.actor}
                    </p>
                    <p className="mt-1 text-stone-400">
                      {formatDisplayDateTime(entry.timestamp)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm leading-7 text-stone-300">
                No timeline events yet for this invoice.
              </p>
            )}
            <div className="mt-6">
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
                Email log
              </p>
              {emailLogs.length > 0 ? (
                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                  {emailLogs.map((log) => (
                    <li key={log.id} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                      <p className="font-semibold text-stone-100">{log.subject}</p>
                      <p className="mt-1">{log.recipient} | {log.deliveryStatus}</p>
                      <p className="mt-1 text-stone-400">{formatDisplayDateTime(log.sentAt)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-7 text-stone-300">
                  No invoice emails have been logged yet.
                </p>
              )}
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
