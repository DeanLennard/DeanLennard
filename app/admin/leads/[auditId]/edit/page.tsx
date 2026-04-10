import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getAuditById } from "@/lib/audit-store";

const lostReasonOptions = [
  { value: "no_budget", label: "No budget" },
  { value: "no_response", label: "No response" },
  { value: "not_a_fit", label: "Not a fit" },
  { value: "chose_competitor", label: "Chose competitor" },
  { value: "duplicate", label: "Duplicate" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Other" },
] as const;

export const metadata: Metadata = {
  title: "Edit Lead",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditLeadPage({
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
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Edit lead
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          {lead.businessName || lead.normalizedUrl}
        </h1>
        <form
          action={`/api/admin/leads/${lead.auditId}/edit`}
          method="post"
          className="mt-8 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-100" htmlFor="businessName">
              Business name
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              defaultValue={lead.businessName || ""}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-100" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={lead.location || ""}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="leadStatus">
                Lead status
              </label>
              <select
                id="leadStatus"
                name="leadStatus"
                defaultValue={lead.leadStatus}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              >
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
              <input
                type="checkbox"
                name="followUpConsent"
                defaultChecked={lead.followUpConsent}
                className="h-4 w-4 rounded border-[color:var(--color-border)]"
              />
              Follow-up consent
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="lostReason">
                Lost reason
              </label>
              <select
                id="lostReason"
                name="lostReason"
                defaultValue={lead.lostReason ?? "other"}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              >
                {lostReasonOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs leading-6 text-stone-400">
                Only applied when the lead status is set to lost.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="lostReasonNotes">
                Lost reason notes
              </label>
              <textarea
                id="lostReasonNotes"
                name="lostReasonNotes"
                rows={4}
                defaultValue={lead.lostReasonNotes || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              />
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6">
            <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
              Qualification
            </p>
            <div className="mt-4 grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-100" htmlFor="qualificationFit">
                  Fit
                </label>
                <select
                  id="qualificationFit"
                  name="qualificationFit"
                  defaultValue={lead.qualificationFit ?? ""}
                  className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100"
                >
                  <option value="">Not set</option>
                  <option value="strong">Strong</option>
                  <option value="medium">Medium</option>
                  <option value="weak">Weak</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-100" htmlFor="qualificationBudget">
                  Budget
                </label>
                <input
                  id="qualificationBudget"
                  name="qualificationBudget"
                  type="text"
                  defaultValue={lead.qualificationBudget || ""}
                  placeholder="e.g. GBP 2,000 to 3,000"
                  className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-100" htmlFor="qualificationTimeline">
                  Timeline
                </label>
                <input
                  id="qualificationTimeline"
                  name="qualificationTimeline"
                  type="text"
                  defaultValue={lead.qualificationTimeline || ""}
                  placeholder="e.g. launch in 6 weeks"
                  className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100"
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="qualificationNotes">
                Qualification notes
              </label>
              <textarea
                id="qualificationNotes"
                name="qualificationNotes"
                rows={4}
                defaultValue={lead.qualificationNotes || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100"
              />
              <p className="text-xs leading-6 text-stone-400">
                Use this to capture fit, urgency, budget, and any sales notes before converting.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Save Lead
            </button>
            <Link
              href={`/admin/leads/${lead.auditId}`}
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
