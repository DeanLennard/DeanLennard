import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listClients } from "@/lib/clients-store";
import { formatDisplayDateTime } from "@/lib/date-format";
import { listInvoices } from "@/lib/invoices-store";
import { listPaymentProviderEvents } from "@/lib/payment-provider-events";
import { formatMoney } from "@/lib/money-format";
import { listRecurringInvoiceSchedules } from "@/lib/recurring-billing-store";

export const metadata: Metadata = {
  title: "Provider Events",
  robots: {
    index: false,
    follow: false,
  },
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProviderEventsPage({
  searchParams,
}: {
  searchParams: Promise<{
    provider?: string | string[];
    status?: string | string[];
  }>;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const provider = getSingleValue(resolvedSearchParams.provider) ?? "all";
  const status = getSingleValue(resolvedSearchParams.status) ?? "all";
  const [events, clients, invoices, schedules] = await Promise.all([
    listPaymentProviderEvents({
      provider: provider as "all" | "stripe" | "gocardless",
      status: status as
        | "all"
        | "received"
        | "processed"
        | "ignored"
        | "failed"
        | "invalid_signature",
    }),
    listClients(),
    listInvoices(),
    listRecurringInvoiceSchedules(),
  ]);
  const stripeLinkedInvoices = invoices.filter((invoice) => invoice.stripeInvoiceId);
  const gocardlessLinkedInvoices = invoices.filter(
    (invoice) => invoice.gocardlessBillingRequestId || invoice.gocardlessPaymentId
  );
  const clientsWithStripe = clients.filter((client) => client.stripeCustomerId).length;
  const clientsWithGoCardless = clients.filter((client) => client.gocardlessCustomerId).length;
  const clientsWithMandates = clients.filter((client) => client.gocardlessMandateId).length;
  const activeStripeSchedules = schedules.filter(
    (schedule) => schedule.status === "active" && schedule.billingProvider === "stripe"
  );
  const activeGoCardlessSchedules = schedules.filter(
    (schedule) => schedule.status === "active" && schedule.billingProvider === "gocardless"
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/provider-events" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Provider events
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Stripe and GoCardless event log
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Inspect recent webhook activity, failures, and invoice links without going into
          Mongo directly.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Stripe lifecycle
          </p>
          <p className="mt-4 text-3xl font-semibold text-stone-50">{clientsWithStripe}</p>
          <p className="mt-2 text-sm leading-7 text-stone-300">
            Clients linked to Stripe customer records.
          </p>
          <p className="mt-4 text-sm text-stone-400">
            {stripeLinkedInvoices.length} invoices linked | {activeStripeSchedules.length} active recurring schedules
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            GoCardless lifecycle
          </p>
          <p className="mt-4 text-3xl font-semibold text-stone-50">{clientsWithGoCardless}</p>
          <p className="mt-2 text-sm leading-7 text-stone-300">
            Clients linked to GoCardless customer records.
          </p>
          <p className="mt-4 text-sm text-stone-400">
            {gocardlessLinkedInvoices.length} invoices linked | {activeGoCardlessSchedules.length} active recurring schedules
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Mandates and payment state
          </p>
          <p className="mt-4 text-3xl font-semibold text-stone-50">{clientsWithMandates}</p>
          <p className="mt-2 text-sm leading-7 text-stone-300">
            Clients with stored GoCardless mandate IDs.
          </p>
          <p className="mt-4 text-sm text-stone-400">
            Provider-linked invoice total {formatMoney(
              [...stripeLinkedInvoices, ...gocardlessLinkedInvoices].reduce(
                (sum, invoice) => sum + invoice.total,
                0
              )
            )}
          </p>
        </article>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Provider</span>
            <select
              name="provider"
              defaultValue={provider}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            >
              <option value="all">All providers</option>
              <option value="stripe">Stripe</option>
              <option value="gocardless">GoCardless</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Status</span>
            <select
              name="status"
              defaultValue={status}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            >
              <option value="all">All statuses</option>
              <option value="processed">Processed</option>
              <option value="received">Received</option>
              <option value="ignored">Ignored</option>
              <option value="failed">Failed</option>
              <option value="invalid_signature">Invalid signature</option>
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500 md:self-end"
          >
            Filter
          </button>
        </form>
      </section>

      <section className="mt-8 space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <article
              key={`${event.provider}-${event.eventId}`}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                    {event.provider}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-stone-50">
                    {event.eventType}
                  </h2>
                  <p className="mt-2 text-sm text-stone-400">
                    Event ID: {event.eventId}
                  </p>
                  <p className="mt-1 text-sm text-stone-400">
                    Received {formatDisplayDateTime(event.receivedAt)}
                  </p>
                  {event.invoiceId ? (
                    <p className="mt-1 text-sm text-stone-400">Linked invoice ID: {event.invoiceId}</p>
                  ) : null}
                </div>
                <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-200">
                  <p>Status: {event.status.replaceAll("_", " ")}</p>
                  {event.invoiceId ? (
                    <Link
                      href={`/admin/invoices/${event.invoiceId}`}
                      className="mt-2 inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                    >
                      Open linked invoice
                    </Link>
                  ) : null}
                </div>
              </div>

              {event.failureReason ? (
                <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
                  {event.failureReason}
                </div>
              ) : null}

              <details className="mt-4 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                <summary className="cursor-pointer text-sm font-semibold text-stone-100">
                  View payload summary
                </summary>
                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-stone-300">
                  {event.payload}
                </pre>
              </details>
            </article>
          ))
        ) : (
          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300">
            No provider events matched the current filters.
          </div>
        )}
      </section>
    </main>
  );
}
