import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getClientById } from "@/lib/clients-store";
import { formatDisplayDate } from "@/lib/date-format";
import { type InvoiceStatus, listInvoices } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { getProjectById } from "@/lib/projects-store";

export const metadata: Metadata = {
  title: "Invoices Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type InvoicesPageSearchParams = Promise<{
  q?: string | string[];
  status?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: InvoicesPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const query = getSingleValue(resolvedSearchParams.q)?.trim() ?? "";
  const status = (getSingleValue(resolvedSearchParams.status)?.trim() ??
    "all") as InvoiceStatus | "all";
  const invoices = await listInvoices({ search: query, status });

  const invoicesWithContext = await Promise.all(
    invoices.map(async (invoice) => ({
      invoice,
      client: await getClientById(invoice.customerId),
      project: invoice.projectId ? await getProjectById(invoice.projectId) : null,
    }))
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/invoices" />
      </section>

      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              Invoices
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
              Track draft, sent, unpaid, overdue, and paid invoices in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/invoices/new"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              New Invoice
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <div className="flex flex-col gap-4">
          <form action="/admin/invoices" method="get" className="grid w-full gap-3 lg:max-w-3xl lg:grid-cols-[1fr_auto_auto]">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by invoice number, client, project, or invoice ID"
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
            <select
              name="status"
              defaultValue={status}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partially paid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        {invoicesWithContext.length > 0 ? (
          invoicesWithContext.map(({ invoice, client, project }) => (
            <article
              key={invoice.invoiceId}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
                      Invoice
                    </p>
                    <p className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-3 py-1 text-sm text-stone-200">
                      {invoice.invoiceNumber}
                    </p>
                    <span className="rounded-md bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                      {invoice.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-stone-50">
                    {client?.businessName ?? invoice.customerId}
                  </h2>
                  {project ? (
                    <p className="text-sm leading-7 text-stone-300">
                      Project: {project.name}
                    </p>
                  ) : null}
                  <p className="text-sm leading-7 text-stone-300">
                    Due: {formatDisplayDate(invoice.dueDate)}
                  </p>
                  <p className="text-sm leading-7 text-stone-400">
                    Total: {formatMoney(invoice.total, invoice.currency)} | Balance:{" "}
                    {formatMoney(invoice.balanceDue, invoice.currency)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/admin/invoices/${invoice.invoiceId}/edit`}
                    className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/invoices/${invoice.invoiceId}`}
                    className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
                  >
                    View Invoice
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-sm leading-7 text-stone-300">
            No invoices matched the current filters.
          </div>
        )}
      </section>
    </main>
  );
}
