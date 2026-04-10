import type { Metadata } from "next";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listClients } from "@/lib/clients-store";
import { formatDisplayDate } from "@/lib/date-format";
import { formatMoney } from "@/lib/money-format";
import { listProjects } from "@/lib/projects-store";
import { listRecurringInvoiceSchedules } from "@/lib/recurring-billing-store";
import { listRepeatingTaskTemplates } from "@/lib/repeating-task-templates-store";
import { getAppSettings } from "@/lib/settings-store";

export const metadata: Metadata = {
  title: "Recurring Billing Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type RecurringBillingPageSearchParams = Promise<{
  saved?: string | string[];
  error?: string | string[];
  ran?: string | string[];
  invoicesCreated?: string | string[];
  tasksCreated?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function RecurringBillingPage({
  searchParams,
}: {
  searchParams: RecurringBillingPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const saved = getSingleValue(resolvedSearchParams.saved) ?? "";
  const error = getSingleValue(resolvedSearchParams.error) ?? "";
  const ran = getSingleValue(resolvedSearchParams.ran) === "1";
  const invoicesCreated = Number(getSingleValue(resolvedSearchParams.invoicesCreated) ?? "0");
  const tasksCreated = Number(getSingleValue(resolvedSearchParams.tasksCreated) ?? "0");

  const [settings, clients, projects, schedules, templates] = await Promise.all([
    getAppSettings(),
    listClients(),
    listProjects(),
    listRecurringInvoiceSchedules(),
    listRepeatingTaskTemplates(),
  ]);

  const clientMap = new Map(clients.map((client) => [client.clientId, client]));
  const projectMap = new Map(projects.map((project) => [project.projectId, project]));

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              Recurring Billing
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
              Manage care plans, repeating maintenance templates, and due automations
              in one place.
            </p>
          </div>

          <form action="/api/admin/recurring-billing/run-due" method="post">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Run Due Automations
            </button>
          </form>
        </div>

        <AdminNav currentPath="/admin/recurring-billing" />

        {saved ? (
          <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
            Saved: {saved.replaceAll("-", " ")}.
          </div>
        ) : null}
        {error ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            There was a problem with {error.replaceAll("-", " ")}.
          </div>
        ) : null}
        {ran ? (
          <div className="mt-6 rounded-md border border-sky-500/30 bg-sky-500/10 p-4 text-sm leading-7 text-sky-100">
            Due automations run. Invoices created: {Number.isFinite(invoicesCreated) ? invoicesCreated : 0}. Tasks created: {Number.isFinite(tasksCreated) ? tasksCreated : 0}.
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            New recurring invoice schedule
          </p>
          <form action="/api/admin/recurring-billing" method="post" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Client</span>
                <select name="customerId" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="">Select client</option>
                  {clients.map((client) => (
                    <option key={client.clientId} value={client.clientId}>
                      {client.businessName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Project</span>
                <select name="projectId" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="">No linked project</option>
                  {projects.map((project) => (
                    <option key={project.projectId} value={project.projectId}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Title</span>
                <input name="title" placeholder="Standard Care Plan" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Care plan tier</span>
                <select name="carePlanTier" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="growth">Growth</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Amount</span>
                <input name="amount" type="number" min="0.01" step="0.01" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Currency</span>
                <input name="currency" defaultValue={settings.defaultCurrency} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Tax rate (%)</span>
                <input name="taxRate" type="number" min="0" step="0.01" defaultValue="0" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Payment terms</span>
                <input name="paymentTermsDays" type="number" min="1" defaultValue={settings.defaultPaymentTerms} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Provider</span>
                <select name="billingProvider" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="manual">Manual</option>
                  <option value="stripe">Stripe</option>
                  <option value="gocardless">GoCardless</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Frequency</span>
                <select name="frequency" defaultValue="monthly" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Interval count</span>
                <input name="intervalCount" type="number" min="1" defaultValue="1" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Next invoice date</span>
                <DateInput name="nextInvoiceDate" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Line item description</span>
                <textarea name="lineItemDescription" rows={3} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Internal notes</span>
                <textarea name="notes" rows={3} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Line item quantity</span>
                <input name="lineItemQuantity" type="number" min="1" defaultValue="1" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="inline-flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-200">
                <input type="checkbox" name="autoSend" className="h-4 w-4" />
                Auto send invoices
              </label>
              <label className="inline-flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-200">
                <input type="checkbox" name="autoCollect" className="h-4 w-4" />
                Auto collect payments
              </label>
            </div>
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">
              Create Schedule
            </button>
          </form>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            New repeating task template
          </p>
          <form action="/api/admin/repeating-task-templates" method="post" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Client</span>
                <select name="customerId" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="">Select client</option>
                  {clients.map((client) => (
                    <option key={client.clientId} value={client.clientId}>
                      {client.businessName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Project</span>
                <select name="projectId" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="">No linked project</option>
                  {projects.map((project) => (
                    <option key={project.projectId} value={project.projectId}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Title</span>
                <input name="title" placeholder="Monthly plugin updates" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Default priority</span>
                <select name="defaultPriority" defaultValue="medium" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </label>
            </div>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Description</span>
              <textarea name="description" rows={3} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <div className="grid gap-4 md:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Estimated minutes</span>
                <input name="estimatedMinutes" type="number" min="0" step="1" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Frequency</span>
                <select name="frequencyType" defaultValue="monthly" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Interval</span>
                <input name="frequencyInterval" type="number" min="1" defaultValue="1" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Next run date</span>
                <DateInput name="nextRunAt" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Task status on create</span>
                <select name="taskStatusOnCreate" defaultValue="todo" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label className="inline-flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-200">
                <input type="checkbox" name="active" defaultChecked className="h-4 w-4" />
                Active
              </label>
              <label className="inline-flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-200">
                <input type="checkbox" name="autoCreateEnabled" defaultChecked className="h-4 w-4" />
                Auto create tasks
              </label>
            </div>
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">
              Create Template
            </button>
          </form>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Recurring schedules
            </p>
            <span className="rounded-md bg-[color:var(--color-panel-strong)] px-3 py-1 text-xs font-semibold text-stone-200">
              {schedules.length}
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {schedules.length > 0 ? (
              schedules.map((schedule) => {
                const client = clientMap.get(schedule.customerId);
                const project = schedule.projectId ? projectMap.get(schedule.projectId) : null;

                return (
                  <div key={schedule.scheduleId} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                    <p className="font-semibold text-stone-100">{schedule.title}</p>
                    <p className="mt-1 text-sm leading-7 text-stone-300">
                      {client?.businessName ?? schedule.customerId}
                      {project ? ` | ${project.name}` : ""}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-stone-300">
                      {schedule.frequency} every {schedule.intervalCount} | Next invoice {formatDisplayDate(schedule.nextInvoiceDate)}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-stone-400">
                      {formatMoney(schedule.amount, schedule.currency)} | {schedule.billingProvider} | {schedule.status}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(["active", "paused", "cancelled"] as const).map((status) => (
                        <form key={status} action={`/api/admin/recurring-billing/${schedule.scheduleId}/status`} method="post">
                          <input type="hidden" name="status" value={status} />
                          <button type="submit" className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8">
                            Mark {status}
                          </button>
                        </form>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                No recurring schedules created yet.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Repeating task templates
            </p>
            <span className="rounded-md bg-[color:var(--color-panel-strong)] px-3 py-1 text-xs font-semibold text-stone-200">
              {templates.length}
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {templates.length > 0 ? (
              templates.map((template) => {
                const client = template.customerId ? clientMap.get(template.customerId) : null;
                const project = template.projectId ? projectMap.get(template.projectId) : null;

                return (
                  <div key={template.templateId} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                    <p className="font-semibold text-stone-100">{template.title}</p>
                    <p className="mt-1 text-sm leading-7 text-stone-300">
                      {client?.businessName ?? "No linked client"}
                      {project ? ` | ${project.name}` : ""}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-stone-300">
                      {template.frequencyType} every {template.frequencyInterval} | Next run {formatDisplayDate(template.nextRunAt)}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-stone-400">
                      {template.defaultPriority} | {template.active ? "active" : "inactive"} | {template.autoCreateEnabled ? "auto-create on" : "auto-create off"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <form action={`/api/admin/repeating-task-templates/${template.templateId}/status`} method="post">
                        <input type="hidden" name="mode" value="toggle-active" />
                        <input type="hidden" name="value" value={String(!template.active)} />
                        <button type="submit" className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8">
                          {template.active ? "Pause" : "Activate"}
                        </button>
                      </form>
                      <form action={`/api/admin/repeating-task-templates/${template.templateId}/status`} method="post">
                        <input type="hidden" name="mode" value="toggle-auto-create" />
                        <input type="hidden" name="value" value={String(!template.autoCreateEnabled)} />
                        <button type="submit" className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8">
                          {template.autoCreateEnabled ? "Disable auto-create" : "Enable auto-create"}
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                No repeating maintenance templates created yet.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
