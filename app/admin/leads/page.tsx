import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { formatDisplayDateTime } from "@/lib/date-format";
import { listLeads, type LeadStatus } from "@/lib/audit-store";

const lostReasonLabels: Record<string, string> = {
  no_budget: "No budget",
  no_response: "No response",
  not_a_fit: "Not a fit",
  chose_competitor: "Chose competitor",
  duplicate: "Duplicate",
  spam: "Spam",
  other: "Other",
};

export const metadata: Metadata = {
  title: "Lead Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type LeadFilter = "all" | LeadStatus;

type AdminLeadsPageSearchParams = Promise<{
  status?: string | string[];
  q?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getFilter(value: string | undefined): LeadFilter {
  if (
    value === "new" ||
    value === "reviewed" ||
    value === "contacted" ||
    value === "qualified" ||
    value === "converted" ||
    value === "lost" ||
    value === "archived"
  ) {
    return value;
  }

  return "all";
}

function formatLeadStatusLabel(status: LeadFilter) {
  if (status === "all") {
    return "All leads";
  }

  return status
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function buildFilterHref(status: LeadFilter, query: string) {
  const params = new URLSearchParams();

  if (status !== "all") {
    params.set("status", status);
  }

  if (query.trim()) {
    params.set("q", query.trim());
  }

  const search = params.toString();
  return search ? `/admin/leads?${search}` : "/admin/leads";
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: AdminLeadsPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const query = getSingleValue(resolvedSearchParams.q)?.trim() ?? "";
  const status = getFilter(getSingleValue(resolvedSearchParams.status));
  const leads = await listLeads({
    filter: status,
    search: query,
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/leads" />
      </section>

      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              Leads from website audits
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
              Work through audit leads, update their status, and convert the
              right ones into clients when they are ready.
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
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
              {(
                [
                  "all",
                  "new",
                  "reviewed",
                  "contacted",
                  "qualified",
                  "converted",
                  "lost",
                  "archived",
                ] as LeadFilter[]
              ).map(
                (option) => {
                  const active = option === status;
                  const label = formatLeadStatusLabel(option);

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

          <form
            action="/admin/leads"
            method="get"
            className="flex w-full gap-3 lg:max-w-xl"
          >
            {status !== "all" ? (
              <input type="hidden" name="status" value={status} />
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
        {leads.length > 0 ? (
          leads.map((lead) => (
            <article
              key={lead.auditId}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
                      Lead
                    </p>
                    <p className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-3 py-1 text-sm text-stone-200">
                      {lead.auditId}
                    </p>
                    <span className="rounded-md bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                      {lead.leadStatus}
                    </span>
                    <span
                      className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        lead.followUpConsent
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "bg-stone-700/60 text-stone-200"
                      }`}
                    >
                      {lead.followUpConsent ? "Consented" : "Not consented"}
                    </span>
                  </div>

                  <h2 className="text-2xl font-semibold text-stone-50">
                    {lead.businessName || lead.normalizedUrl}
                  </h2>
                  <p className="break-all text-sm leading-7 text-stone-300">
                    {lead.normalizedUrl}
                  </p>
                  {lead.location ? (
                    <p className="text-sm leading-7 text-stone-300">
                      Location: {lead.location}
                    </p>
                  ) : null}
                  {lead.traffic?.utmCampaign ? (
                    <p className="text-sm leading-7 text-stone-300">
                      Campaign: {lead.traffic.utmCampaign}
                    </p>
                  ) : null}
                  {lead.traffic?.sourcePage ? (
                    <p className="text-sm leading-7 text-stone-400">
                      Source page: {lead.traffic.sourcePage}
                    </p>
                  ) : null}
                  {lead.qualificationFit ? (
                    <p className="text-sm leading-7 text-stone-300">
                      Qualification: {lead.qualificationFit}
                      {lead.qualificationBudget ? ` | Budget ${lead.qualificationBudget}` : ""}
                      {lead.qualificationTimeline
                        ? ` | Timeline ${lead.qualificationTimeline}`
                        : ""}
                    </p>
                  ) : null}
                  {lead.leadStatus === "lost" && lead.lostReason ? (
                    <p className="text-sm leading-7 text-stone-300">
                      Lost reason: {lostReasonLabels[lead.lostReason] ?? lead.lostReason}
                    </p>
                  ) : null}
                  <p className="text-sm leading-7 text-stone-400">
                    Checked on {formatDisplayDateTime(lead.checkedAt)}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:w-[360px]">
                  <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                      Conversion
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-stone-50">
                      {lead.scores.conversion.score}
                    </p>
                  </div>
                  <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                      Performance
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-stone-50">
                      {lead.scores.performance.score}
                    </p>
                  </div>
                  <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                      Visibility
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-stone-50">
                      {lead.scores.visibility.score}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-3">
                  <form action={`/api/admin/leads/${lead.auditId}/status`} method="post">
                    <input type="hidden" name="status" value="reviewed" />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                    >
                      Mark Reviewed
                    </button>
                  </form>
                  <form action={`/api/admin/leads/${lead.auditId}/status`} method="post">
                    <input type="hidden" name="status" value="contacted" />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                    >
                      Mark Contacted
                    </button>
                  </form>
                  <form action={`/api/admin/leads/${lead.auditId}/status`} method="post">
                    <input type="hidden" name="status" value="qualified" />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                    >
                      Mark Qualified
                    </button>
                  </form>
                  <form action={`/api/admin/leads/${lead.auditId}/status`} method="post">
                    <input type="hidden" name="status" value="lost" />
                    <input type="hidden" name="lostReason" value={lead.lostReason ?? "other"} />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                    >
                      Mark Lost
                    </button>
                  </form>
                  <form action={`/api/admin/leads/${lead.auditId}/status`} method="post">
                    <input type="hidden" name="status" value="archived" />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                    >
                      Archive
                    </button>
                  </form>
                  {lead.leadStatus !== "converted" ? (
                    <form action={`/api/admin/leads/${lead.auditId}/convert`} method="post">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
                      >
                        Convert to Client
                      </button>
                    </form>
                  ) : null}
                  <Link
                    href={`/admin/quotes/new?leadId=${lead.auditId}`}
                    className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                  >
                    Create Quote
                  </Link>
                </div>

                <Link
                  href={`/admin/leads/${lead.auditId}`}
                  className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                >
                  View Lead Detail
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-sm leading-7 text-stone-300">
            No leads matched the current filter.
          </div>
        )}
      </section>
    </main>
  );
}
