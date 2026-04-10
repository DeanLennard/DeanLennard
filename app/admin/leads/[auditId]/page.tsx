import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getAuditById } from "@/lib/audit-store";
import { formatDisplayDateTime } from "@/lib/date-format";

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
  title: "Lead Detail",
  robots: {
    index: false,
    follow: false,
  },
};

function formatLeadStatusLabel(value: string) {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ auditId: string }>;
}) {
  await requireAdminAuthentication();

  const { auditId } = await params;
  const lead = await getAuditById(auditId);

  if (!lead) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/leads" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Lead detail
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          {lead.businessName || lead.normalizedUrl}
        </h1>
        <p className="mt-3 break-all text-base leading-8 text-stone-300">
          {lead.normalizedUrl}
        </p>
        <p className="mt-2 text-sm leading-7 text-stone-400">
          Audit ID: {lead.auditId}
        </p>
        <div className="mt-4">
          <Link
            href={`/admin/leads/${lead.auditId}/edit`}
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Edit Lead
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Lead status
          </p>
          <p className="mt-4 text-lg font-semibold text-stone-50">
            {formatLeadStatusLabel(lead.leadStatus)}
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Follow-up consent: {lead.followUpConsent ? "Yes" : "No"}
          </p>
          {lead.leadStatus === "lost" && lead.lostReason ? (
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Lost reason: {lostReasonLabels[lead.lostReason] ?? lead.lostReason}
            </p>
          ) : null}
          {lead.leadStatus === "lost" && lead.lostReasonNotes ? (
            <div className="mt-4 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              {lead.lostReasonNotes}
            </div>
          ) : null}
          {lead.convertedClientId ? (
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Converted client ID: {lead.convertedClientId}
            </p>
          ) : null}
          {lead.qualificationFit || lead.qualificationBudget || lead.qualificationTimeline ? (
            <div className="mt-4 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              <p className="font-semibold text-stone-100">Qualification snapshot</p>
              {lead.qualificationFit ? <p className="mt-2">Fit: {lead.qualificationFit}</p> : null}
              {lead.qualificationBudget ? <p>Budget: {lead.qualificationBudget}</p> : null}
              {lead.qualificationTimeline ? <p>Timeline: {lead.qualificationTimeline}</p> : null}
              {lead.qualificationNotes ? <p className="mt-2">{lead.qualificationNotes}</p> : null}
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {(["new", "reviewed", "contacted", "qualified", "lost", "archived"] as const).map((status) => (
              <form
                key={status}
                action={`/api/admin/leads/${lead.auditId}/status`}
                method="post"
              >
                <input type="hidden" name="status" value={status} />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                >
                  Mark {formatLeadStatusLabel(status)}
                </button>
              </form>
            ))}
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
          <div className="mt-6">
            <Link
              href={`/admin/audits/${lead.auditId}`}
              className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
            >
              View full audit detail
            </Link>
          </div>
          <div className="mt-6 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
            <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
              Mark as lost with reason
            </p>
            <form
              action={`/api/admin/leads/${lead.auditId}/status`}
              method="post"
              className="mt-4 space-y-4"
            >
              <input type="hidden" name="status" value="lost" />
              <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr_auto]">
                <select
                  name="lostReason"
                  defaultValue={lead.lostReason ?? "other"}
                  className="rounded-md border border-[color:var(--color-border)] bg-stone-950/50 px-4 py-3 text-sm text-stone-100"
                >
                  {Object.entries(lostReasonLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <input
                  name="lostReasonNotes"
                  type="text"
                  defaultValue={lead.lostReasonNotes || ""}
                  placeholder="Optional notes about why this lead was lost"
                  className="rounded-md border border-[color:var(--color-border)] bg-stone-950/50 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-4 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                >
                  Save Lost Reason
                </button>
              </div>
            </form>
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Lead context
          </p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
            <p>Checked on: {formatDisplayDateTime(lead.checkedAt)}</p>
            {lead.location ? <p>Location: {lead.location}</p> : null}
            <p>Pages checked: {lead.checkedPages.length}</p>
            {lead.traffic?.sourcePage ? <p>Source page: {lead.traffic.sourcePage}</p> : null}
            {lead.traffic?.referrer ? <p className="break-all">Referrer: {lead.traffic.referrer}</p> : null}
            {lead.traffic?.ipAddress ? <p>IP address: {lead.traffic.ipAddress}</p> : null}
            {lead.traffic?.utmCampaign ? <p>UTM campaign: {lead.traffic.utmCampaign}</p> : null}
            {lead.traffic?.utmSource ? <p>UTM source: {lead.traffic.utmSource}</p> : null}
            {lead.traffic?.utmMedium ? <p>UTM medium: {lead.traffic.utmMedium}</p> : null}
            {lead.traffic?.utmTerm ? <p>UTM term: {lead.traffic.utmTerm}</p> : null}
            {lead.traffic?.utmContent ? <p>UTM content: {lead.traffic.utmContent}</p> : null}
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
              Recorded intents
            </p>
            {lead.intents.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                {lead.intents.map((intent) => (
                  <li
                    key={`${intent.type}-${intent.at}`}
                    className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
                  >
                    <p className="font-semibold text-stone-100">{intent.type}</p>
                    <p className="mt-1 text-stone-400">
                      {formatDisplayDateTime(intent.at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-7 text-stone-300">
                No intent signals recorded yet.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
