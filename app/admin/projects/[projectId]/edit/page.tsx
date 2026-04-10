import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listClients } from "@/lib/clients-store";
import { getProjectById } from "@/lib/projects-store";

export const metadata: Metadata = {
  title: "Edit Project",
  robots: { index: false, follow: false },
};

type EditProjectSearchParams = Promise<{ error?: string | string[] }>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: EditProjectSearchParams;
}) {
  await requireAdminAuthentication();
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  const clients = await listClients();
  const resolvedSearchParams = await searchParams;
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  if (!project) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">Edit project</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">{project.name}</h1>
        <AdminNav currentPath="/admin/projects" />

        {error === "invalid-input" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">Please check the project details and try again.</div>
        ) : null}

        <form action={`/api/admin/projects/${project.projectId}/edit`} method="post" className="mt-8 space-y-6">
          <input type="hidden" name="quoteId" value={project.quoteId || ""} />
          <input type="hidden" name="leadId" value={project.leadId || ""} />
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Client</span>
              <select name="customerId" defaultValue={project.customerId} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                {clients.map((client) => <option key={client.clientId} value={client.clientId}>{client.businessName}</option>)}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Project name</span>
              <input name="name" type="text" required defaultValue={project.name} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Package type</span>
              <select name="packageType" defaultValue={project.packageType} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                <option value="starter">Starter</option><option value="lead_focused">Lead focused</option><option value="growth">Growth</option><option value="custom">Custom</option><option value="care_plan">Care plan</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Billing type</span>
              <select name="billingType" defaultValue={project.billingType} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                <option value="fixed">Fixed</option><option value="recurring">Recurring</option><option value="hourly">Hourly</option><option value="hybrid">Hybrid</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Status</span>
              <select name="status" defaultValue={project.status} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                <option value="planned">Planned</option><option value="active">Active</option><option value="on_hold">On hold</option><option value="review">Review</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Start date</span>
              <DateInput name="startDate" defaultValue={project.startDate || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Target end date</span>
              <DateInput name="targetEndDate" defaultValue={project.targetEndDate || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Estimated revenue</span>
              <input name="estimatedRevenue" type="number" min="0" step="0.01" defaultValue={String(project.estimatedRevenue)} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Estimated cost</span>
              <input name="estimatedCost" type="number" min="0" step="0.01" defaultValue={String(project.estimatedCost)} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Description</span>
            <textarea name="description" rows={4} defaultValue={project.description || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Internal notes</span>
            <textarea name="notes" rows={4} defaultValue={project.notes || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">Save Project</button>
            <Link href={`/admin/projects/${project.projectId}`} className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8">Cancel</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
