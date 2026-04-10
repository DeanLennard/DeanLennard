import type { Metadata } from "next";
import Link from "next/link";

import { listAudits } from "@/lib/audit-store";
import { requireAdminAuthentication } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Audit Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AuditListFilter = "all" | "consented" | "not_consented";

type AdminPageSearchParams = Promise<{
  filter?: string | string[];
  q?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getFilter(value: string | undefined): AuditListFilter {
  if (value === "consented" || value === "not_consented") {
    return value;
  }

  return "all";
}

function buildFilterHref(filter: AuditListFilter, query: string) {
  const params = new URLSearchParams();

  if (filter !== "all") {
    params.set("filter", filter);
  }

  if (query.trim()) {
    params.set("q", query.trim());
  }

  const search = params.toString();
  return search ? `/admin?${search}` : "/admin";
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: AdminPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const query = getSingleValue(resolvedSearchParams.q)?.trim() ?? "";
  const filter = getFilter(getSingleValue(resolvedSearchParams.filter));
  const audits = await listAudits({
    filter,
    search: query,
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              Website Growth Check audits
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
              Review stored audits, search by audit ID from enquiry emails, and
              filter down to consented or non-consented follow-up opportunities.
            </p>
          </div>

          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Sign Out
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {(["all", "consented", "not_consented"] as AuditListFilter[]).map(
              (option) => {
                const active = option === filter;
                const label =
                  option === "all"
                    ? "All audits"
                    : option === "consented"
                      ? "Consented"
                      : "Not consented";

                return (
                  <Link
                    key={option}
                    href={buildFilterHref(option, query)}
                    className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-amber-600 text-stone-950"
                        : "border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] text-stone-100 hover:bg-white/8"
                    }`}
                  >
                    {label}
                  </Link>
                );
              }
            )}
          </div>

          <form action="/admin" method="get" className="flex w-full gap-3 lg:max-w-xl">
            {filter !== "all" ? (
              <input type="hidden" name="filter" value={filter} />
            ) : null}
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by audit ID, website, business, or location"
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
        {audits.length > 0 ? (
          audits.map((audit) => (
            <article
              key={audit.auditId}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
                      Audit ID
                    </p>
                    <p className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-3 py-1 text-sm text-stone-200">
                      {audit.auditId}
                    </p>
                    <span
                      className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        audit.followUpConsent
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "bg-stone-700/60 text-stone-200"
                      }`}
                    >
                      {audit.followUpConsent ? "Consented" : "Not consented"}
                    </span>
                  </div>

                  <h2 className="text-2xl font-semibold text-stone-50">
                    {audit.businessName || audit.normalizedUrl}
                  </h2>
                  <p className="break-all text-sm leading-7 text-stone-300">
                    {audit.normalizedUrl}
                  </p>
                  {audit.location ? (
                    <p className="text-sm leading-7 text-stone-300">
                      Location: {audit.location}
                    </p>
                  ) : null}
                  <p className="text-sm leading-7 text-stone-400">
                    Checked on {new Date(audit.checkedAt).toLocaleString("en-GB")}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:w-[360px]">
                  <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                      Conversion
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-stone-50">
                      {audit.scores.conversion.score}
                    </p>
                  </div>
                  <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                      Performance
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-stone-50">
                      {audit.scores.performance.score}
                    </p>
                  </div>
                  <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                      Visibility
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-stone-50">
                      {audit.scores.visibility.score}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm leading-7 text-stone-300">
                  Intent signals:{" "}
                  {audit.intents.length > 0
                    ? audit.intents.map((intent) => intent.type).join(", ")
                    : "None recorded yet"}
                </p>
                <Link
                  href={`/admin/audits/${audit.auditId}`}
                  className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
                >
                  View Audit Detail
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-sm leading-7 text-stone-300">
            No audits matched the current filter.
          </div>
        )}
      </section>
    </main>
  );
}
