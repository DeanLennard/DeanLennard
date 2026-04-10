import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getClientById } from "@/lib/clients-store";
import { getAuditById } from "@/lib/audit-store";
import { getProjectById } from "@/lib/projects-store";
import { listQuotes } from "@/lib/quotes-store";

export const metadata: Metadata = {
  title: "Quotes Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type QuotesPageSearchParams = Promise<{
  q?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: QuotesPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const query = getSingleValue(resolvedSearchParams.q)?.trim() ?? "";
  const quotes = await listQuotes(query);

  const quotesWithContext = await Promise.all(
    quotes.map(async (quote) => ({
      quote,
      client: quote.customerId ? await getClientById(quote.customerId) : null,
      lead: quote.leadId ? await getAuditById(quote.leadId) : null,
      project: quote.projectId ? await getProjectById(quote.projectId) : null,
    }))
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              Quotes
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
              Create and manage quotes linked to leads or clients before work
              moves into projects.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/quotes/new"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              New Quote
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

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <AdminNav currentPath="/admin/quotes" />
          </div>
          <form
            action="/admin/quotes"
            method="get"
            className="flex w-full gap-3 lg:max-w-xl"
          >
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by quote number, title, client, or lead ID"
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
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
        {quotesWithContext.length > 0 ? (
          quotesWithContext.map(({ quote, client, lead, project }) => (
            <article
              key={quote.quoteId}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
                      Quote
                    </p>
                    <p className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-3 py-1 text-sm text-stone-200">
                      {quote.quoteNumber}
                    </p>
                    <span className="rounded-md bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                      {quote.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-stone-50">
                    {quote.title}
                  </h2>
                  {client ? (
                    <p className="text-sm leading-7 text-stone-300">
                      Client: {client.businessName}
                    </p>
                  ) : null}
                  {!client && lead ? (
                    <p className="text-sm leading-7 text-stone-300">
                      Lead: {lead.businessName || lead.normalizedUrl}
                    </p>
                  ) : null}
                  {project ? (
                    <p className="text-sm leading-7 text-stone-300">
                      Project: {project.name}
                    </p>
                  ) : null}
                  <p className="text-sm leading-7 text-stone-400">
                    Total: {quote.currency} {quote.total.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/admin/quotes/${quote.quoteId}`}
                    className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
                  >
                    View Quote
                  </Link>
                  {project ? (
                    <Link
                      href={`/admin/projects/${project.projectId}`}
                      className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                    >
                      Open Project
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-sm leading-7 text-stone-300">
            No quotes matched the current search.
          </div>
        )}
      </section>
    </main>
  );
}
