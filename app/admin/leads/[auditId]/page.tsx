import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getAuditById } from "@/lib/audit-store";
import { formatDisplayDateTime } from "@/lib/date-format";

export const metadata: Metadata = {
  title: "Lead Detail",
  robots: {
    index: false,
    follow: false,
  },
};

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
        <AdminNav currentPath="/admin/leads" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Lead status
          </p>
          <p className="mt-4 text-lg font-semibold text-stone-50">
            {lead.leadStatus}
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Follow-up consent: {lead.followUpConsent ? "Yes" : "No"}
          </p>
          {lead.convertedClientId ? (
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Converted client ID: {lead.convertedClientId}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {(["new", "contacted", "lost"] as const).map((status) => (
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
                  Mark {status.charAt(0).toUpperCase() + status.slice(1)}
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
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Lead context
          </p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
            <p>Checked on: {formatDisplayDateTime(lead.checkedAt)}</p>
            {lead.location ? <p>Location: {lead.location}</p> : null}
            <p>Pages checked: {lead.checkedPages.length}</p>
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
