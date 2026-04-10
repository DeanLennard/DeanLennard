import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAuditById } from "@/lib/audit-store";
import { requireAdminAuthentication } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Audit Detail",
  robots: {
    index: false,
    follow: false,
  },
};

const severityStyles = {
  error: "border-red-500/30 bg-red-500/10 text-red-100",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
} as const;

type AuditDetailPageParams = Promise<{
  auditId: string;
}>;

export default async function AuditDetailPage({
  params,
}: {
  params: AuditDetailPageParams;
}) {
  await requireAdminAuthentication();

  const { auditId } = await params;
  const audit = await getAuditById(auditId);

  if (!audit) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Audit detail
          </p>
          <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight text-stone-50">
            {audit.businessName || audit.normalizedUrl}
          </h1>
          <p className="mt-3 break-all text-base leading-8 text-stone-300">
            {audit.normalizedUrl}
          </p>
          <p className="mt-2 text-sm leading-7 text-stone-400">
            Audit ID: {audit.auditId}
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
        >
          Back to all audits
        </Link>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          {
            label: "Conversion",
            score: audit.scores.conversion.score,
            description: audit.scores.conversion.label,
          },
          {
            label: "Performance",
            score: audit.scores.performance.score,
            description: audit.scores.performance.label,
          },
          {
            label: "Visibility",
            score: audit.scores.visibility.score,
            description: audit.scores.visibility.label,
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
          >
            <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
              {item.label}
            </p>
            <p className="mt-4 text-4xl font-semibold text-stone-50">
              {item.score}/100
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Follow-up status
          </p>
          <p className="mt-4 text-lg font-semibold text-stone-50">
            {audit.followUpConsent ? "Consented to follow-up" : "No consent yet"}
          </p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
            <p>Checked on: {new Date(audit.checkedAt).toLocaleString("en-GB")}</p>
            <p>Stored on: {new Date(audit.createdAt).toLocaleString("en-GB")}</p>
            {audit.consentedAt ? (
              <p>
                Consented on: {new Date(audit.consentedAt).toLocaleString("en-GB")}
              </p>
            ) : null}
            {audit.location ? <p>Location: {audit.location}</p> : null}
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
              Recorded intents
            </p>
            {audit.intents.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                {audit.intents.map((intent) => (
                  <li key={`${intent.type}-${intent.at}`} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                    <p className="font-semibold text-stone-100">{intent.type}</p>
                    <p className="mt-1 text-stone-400">
                      {new Date(intent.at).toLocaleString("en-GB")}
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

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Audit context
          </p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
            <p>Original URL: {audit.url}</p>
            <p>Normalized URL: {audit.normalizedUrl}</p>
            {audit.businessName ? <p>Business name: {audit.businessName}</p> : null}
            <p>
              Pages checked: {audit.checkedPages.length}
              {audit.crawlLimitReached ? ` of ${audit.crawlLimit} max` : ""}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
              Pages checked
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
              {audit.checkedPages.map((pageUrl) => (
                <li key={pageUrl} className="break-all">
                  {pageUrl}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Priority issues
          </p>
          {audit.issues.length > 0 ? (
            <div className="mt-6 space-y-4">
              {audit.issues.map((issue) => (
                <div
                  key={`${issue.category}-${issue.message}`}
                  className={`rounded-md border p-4 text-sm leading-7 ${severityStyles[issue.severity]}`}
                >
                  <p className="font-semibold capitalize">{issue.category}</p>
                  <p className="mt-1">{issue.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
              No priority issues were recorded for this audit.
            </div>
          )}
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Good signals
          </p>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {audit.goodSignals.map((signal) => (
              <li key={signal} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
