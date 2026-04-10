import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getPackageTemplateById } from "@/lib/package-templates-store";
import { listClients } from "@/lib/clients-store";
import { getProjectContext } from "@/lib/projects-store";
import { getTaskTemplateById, listTaskTemplates } from "@/lib/task-templates-store";

export const metadata: Metadata = {
  title: "New Project",
  robots: {
    index: false,
    follow: false,
  },
};

type NewProjectPageSearchParams = Promise<{
  customerId?: string | string[];
  quoteId?: string | string[];
  leadId?: string | string[];
  packageTemplateId?: string | string[];
  taskTemplateId?: string | string[];
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: NewProjectPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const customerId = getSingleValue(resolvedSearchParams.customerId)?.trim() ?? "";
  const quoteId = getSingleValue(resolvedSearchParams.quoteId)?.trim() ?? "";
  const leadId = getSingleValue(resolvedSearchParams.leadId)?.trim() ?? "";
  const packageTemplateId =
    getSingleValue(resolvedSearchParams.packageTemplateId)?.trim() ?? "";
  const taskTemplateId = getSingleValue(resolvedSearchParams.taskTemplateId)?.trim() ?? "";
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  const [{ customer, quote, lead }, allClients, packageTemplate, taskTemplate, taskTemplates] =
    await Promise.all([
    getProjectContext({
      customerId: customerId || undefined,
      quoteId: quoteId || undefined,
      leadId: leadId || undefined,
    }),
    listClients(),
    packageTemplateId ? getPackageTemplateById(packageTemplateId) : Promise.resolve(null),
    taskTemplateId ? getTaskTemplateById(taskTemplateId) : Promise.resolve(null),
    listTaskTemplates(),
  ]);

  const defaultName =
    packageTemplate?.name ||
    quote?.title ||
    (customer?.businessName ? `${customer.businessName} project` : "") ||
    (lead?.businessName ? `${lead.businessName} project` : "");

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/projects" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          New project
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Create a delivery project
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Turn accepted work into a project record you can manage through
          delivery.
        </p>
        {error === "missing-fields" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            Client and project name are required.
          </div>
        ) : null}
        {packageTemplate ? (
          <div className="mt-6 rounded-md border border-sky-500/30 bg-sky-500/10 p-4 text-sm leading-7 text-sky-100">
            Using package template: {packageTemplate.name}
          </div>
        ) : null}
        {taskTemplate ? (
          <div className="mt-6 rounded-md border border-sky-500/30 bg-sky-500/10 p-4 text-sm leading-7 text-sky-100">
            Using task template: {taskTemplate.name}
          </div>
        ) : null}

        <form action="/api/admin/projects" method="post" className="mt-8 space-y-8">
          <input type="hidden" name="quoteId" value={quoteId} />
          <input type="hidden" name="leadId" value={leadId} />
          <input type="hidden" name="packageTemplateId" value={packageTemplateId} />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="customerId">
                Client
              </label>
              <select
                id="customerId"
                name="customerId"
                defaultValue={customer?.clientId || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="">Select client</option>
                {allClients.map((clientOption) => (
                  <option key={clientOption.clientId} value={clientOption.clientId}>
                    {clientOption.businessName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="name">
                Project name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={defaultName}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="packageType">
                Package type
              </label>
              <select
                id="packageType"
                name="packageType"
                defaultValue={packageTemplate?.packageType || "custom"}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="starter">Starter</option>
                <option value="lead_focused">Lead focused</option>
                <option value="growth">Growth</option>
                <option value="custom">Custom</option>
                <option value="care_plan">Care plan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="taskTemplateId">
                Task template
              </label>
              <select
                id="taskTemplateId"
                name="taskTemplateId"
                defaultValue={taskTemplateId}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="">No task template</option>
                {taskTemplates.map((template) => (
                  <option key={template.templateId} value={template.templateId}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="billingType">
                Billing type
              </label>
              <select
                id="billingType"
                name="billingType"
                defaultValue={packageTemplate?.billingType || "fixed"}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="fixed">Fixed</option>
                <option value="recurring">Recurring</option>
                <option value="hourly">Hourly</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="status">
                Initial status
              </label>
              <select
                id="status"
                name="status"
                defaultValue="planned"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="on_hold">On hold</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="startDate">
                Start date
              </label>
              <DateInput
                id="startDate"
                name="startDate"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="targetEndDate">
                Target end date
              </label>
              <DateInput
                id="targetEndDate"
                name="targetEndDate"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="estimatedRevenue">
                Estimated revenue
              </label>
              <input
                id="estimatedRevenue"
                name="estimatedRevenue"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  quote?.total.toFixed(2) ??
                  (typeof packageTemplate?.defaultPrice === "number"
                    ? packageTemplate.defaultPrice.toFixed(2)
                    : "")
                }
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="estimatedCost">
                Estimated internal cost
              </label>
              <input
                id="estimatedCost"
                name="estimatedCost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={packageTemplate?.description || quote?.summary || quote?.scopeOfWork || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-100" htmlFor="notes">
              Internal notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              defaultValue={packageTemplate?.defaultNotes || quote?.notes || ""}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Create Project
            </button>
            <Link
              href="/admin/projects"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Back to Projects
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
