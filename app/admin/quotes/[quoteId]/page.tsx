import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getAuditById } from "@/lib/audit-store";
import { getClientById } from "@/lib/clients-store";
import { listActivityLogsByEntity } from "@/lib/activity-log";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/date-format";
import { listEmailLogsByEntity } from "@/lib/email-logs-store";
import { getInvoiceBySourceQuoteId } from "@/lib/invoices-store";
import { getProjectById } from "@/lib/projects-store";
import { buildPublicQuoteUrl } from "@/lib/public-quote-links";
import { getQuoteById } from "@/lib/quotes-store";

export const metadata: Metadata = {
  title: "Quote Detail",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function QuoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ quoteId: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  await requireAdminAuthentication();

  const { quoteId } = await params;
  const resolvedSearchParams = await searchParams;
  const error = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error ?? "";
  const quote = await getQuoteById(quoteId);

  if (!quote) {
    notFound();
  }

  const [client, lead, project, activity, emailLogs, linkedInvoice] = await Promise.all([
    quote.customerId ? getClientById(quote.customerId) : null,
    quote.leadId ? getAuditById(quote.leadId) : null,
    quote.projectId ? getProjectById(quote.projectId) : null,
    listActivityLogsByEntity("quote", quote.quoteId),
    listEmailLogsByEntity("quote", quote.quoteId),
    getInvoiceBySourceQuoteId(quote.quoteId),
  ]);
  const hostedQuoteUrl = buildPublicQuoteUrl(quote.quoteId);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/quotes" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Quote detail
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          {quote.title}
        </h1>
        <p className="mt-2 text-sm leading-7 text-stone-400">
          {quote.quoteNumber} | {quote.status}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/admin/quotes/${quote.quoteId}/edit`}
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Edit Quote
          </Link>
          <form action={`/api/admin/quotes/${quote.quoteId}/pdf`} method="post">
            <button type="submit" className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8">
              Generate PDF
            </button>
          </form>
          <form action={`/api/admin/quotes/${quote.quoteId}/send`} method="post">
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">
              Email Quote
            </button>
          </form>
          <form action={`/api/admin/quotes/${quote.quoteId}/duplicate`} method="post">
            <button type="submit" className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8">
              Duplicate Quote
            </button>
          </form>
        </div>
      </section>

      {error === "missing-email" ? (
        <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          This quote cannot be emailed until the linked client has an email address.
        </div>
      ) : null}
      {error === "email-failed" ? (
        <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          The quote email could not be sent. Check Resend settings and the generated PDF.
        </div>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Quote overview
          </p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
            <p>Issue date: {formatDisplayDate(quote.issueDate)}</p>
            {quote.expiryDate ? <p>Expiry date: {formatDisplayDate(quote.expiryDate)}</p> : null}
            {quote.acceptedAt ? <p>Accepted at: {formatDisplayDateTime(quote.acceptedAt)}</p> : null}
            <p>Currency: {quote.currency}</p>
            <p>Subtotal: {quote.currency} {quote.subtotal.toFixed(2)}</p>
            <p>Total: {quote.currency} {quote.total.toFixed(2)}</p>
            {client ? <p>Client: {client.businessName}</p> : null}
            {!client && lead ? (
              <p>Lead: {lead.businessName || lead.normalizedUrl}</p>
            ) : null}
            {project ? <p>Linked project: {project.name}</p> : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {(["draft", "sent", "accepted", "rejected", "expired"] as const).map(
              (status) => (
                <form
                  key={status}
                  action={`/api/admin/quotes/${quote.quoteId}/status`}
                  method="post"
                >
                  <input type="hidden" name="status" value={status} />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                  >
                    Mark {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                </form>
              )
            )}
            {!project && client ? (
              <form
                action={`/api/admin/quotes/${quote.quoteId}/convert-to-project`}
                method="post"
              >
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
                >
                  Convert to Project
                </button>
              </form>
            ) : null}
            {client ? (
              <Link
                href={`/admin/invoices/new?quoteId=${quote.quoteId}`}
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Create Invoice
              </Link>
            ) : null}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Scope and terms
          </p>
          {quote.summary ? (
            <div className="mt-4 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              {quote.summary}
            </div>
          ) : null}
          {quote.scopeOfWork ? (
            <div className="mt-4 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              {quote.scopeOfWork}
            </div>
          ) : null}
          {quote.exclusions ? (
            <div className="mt-4 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              {quote.exclusions}
            </div>
          ) : null}
          {quote.paymentTerms ? (
            <div className="mt-4 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              {quote.paymentTerms}
            </div>
          ) : null}
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Line items
          </p>
          <div className="mt-6 space-y-4">
            {quote.lineItems.map((item) => (
              <div
                key={item.id}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-stone-100">{item.title}</p>
                    {item.description ? (
                      <p className="mt-1 text-sm leading-7 text-stone-300">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-sm leading-7 text-stone-300 sm:text-right">
                    <p>Qty: {item.quantity}</p>
                    <p>Unit: {quote.currency} {item.unitPrice.toFixed(2)}</p>
                    <p className="font-semibold text-stone-100">
                      Total: {quote.currency} {item.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
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
              No timeline events yet for this quote.
            </p>
          )}
          <div className="mt-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Documents and email
            </p>
            {quote.pdfPath ? (
              <div className="mt-4">
                <Link
                  href={quote.pdfPath}
                  target="_blank"
                  className="inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                >
                  Open generated PDF
                </Link>
              </div>
            ) : null}
            <div className="mt-4">
              <Link
                href={hostedQuoteUrl}
                target="_blank"
                className="inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
              >
                Open hosted quote page
              </Link>
            </div>
            {emailLogs.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                {emailLogs.map((log) => (
                  <li
                    key={log.id}
                    className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
                  >
                    <p className="font-semibold text-stone-100">{log.subject}</p>
                    <p className="mt-1">{log.recipient} | {log.deliveryStatus}</p>
                    <p className="mt-1 text-stone-400">
                      {formatDisplayDateTime(log.sentAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-7 text-stone-300">
                No quote emails have been logged yet.
              </p>
            )}
          </div>
          {client ? (
            <div className="mt-6">
              <Link
                href={`/admin/clients/${client.clientId}`}
                className="inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
              >
                Open linked client
              </Link>
            </div>
          ) : null}
          {project ? (
            <div className="mt-6">
              <Link
                href={`/admin/projects/${project.projectId}`}
                className="inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
              >
                Open linked project
              </Link>
            </div>
          ) : null}
          {linkedInvoice ? (
            <div className="mt-6">
              <Link
                href={`/admin/invoices/${linkedInvoice.invoiceId}`}
                className="inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
              >
                Open invoice created from this quote
              </Link>
            </div>
          ) : null}
          {!client && lead ? (
            <div className="mt-6">
              <Link
                href={`/admin/leads/${lead.auditId}`}
                className="inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
              >
                Open linked lead
              </Link>
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
}
