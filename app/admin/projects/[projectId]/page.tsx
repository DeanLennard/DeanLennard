import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listActivityLogsByEntity } from "@/lib/activity-log";
import { getAuditById } from "@/lib/audit-store";
import { getClientById } from "@/lib/clients-store";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/date-format";
import { listInvoicesByProjectId } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { listProjectCostsByProjectId } from "@/lib/project-costs-store";
import { getProjectById } from "@/lib/projects-store";
import { getQuoteById } from "@/lib/quotes-store";
import { listRecurringInvoiceSchedules } from "@/lib/recurring-billing-store";
import { listRepeatingTaskTemplates } from "@/lib/repeating-task-templates-store";
import { listTasksByProjectId } from "@/lib/tasks-store";
import { listTimeEntriesByProjectId } from "@/lib/time-entries-store";

export const metadata: Metadata = {
  title: "Project Detail",
  robots: {
    index: false,
    follow: false,
  },
};

type ProjectDetailPageSearchParams = Promise<{
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatRecurringInterval(interval: string | undefined) {
  if (!interval) {
    return "monthly";
  }

  return interval.replaceAll("_", " ");
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: ProjectDetailPageSearchParams;
}) {
  await requireAdminAuthentication();

  const { projectId } = await params;
  const resolvedSearchParams = await searchParams;
  const error = getSingleValue(resolvedSearchParams.error) ?? "";
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const [client, quote, lead, tasks, activity, timeEntries, invoices, recurringSchedules, repeatingTemplates, manualCosts] = await Promise.all([
    getClientById(project.customerId),
    project.quoteId ? getQuoteById(project.quoteId) : null,
    project.leadId ? getAuditById(project.leadId) : null,
    listTasksByProjectId(project.projectId),
    listActivityLogsByEntity("project", project.projectId),
    listTimeEntriesByProjectId(project.projectId),
    listInvoicesByProjectId(project.projectId),
    listRecurringInvoiceSchedules({ projectId: project.projectId }),
    listRepeatingTaskTemplates({ projectId: project.projectId }),
    listProjectCostsByProjectId(project.projectId),
  ]);
  const manualCostTotal = manualCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const timeCostTotal = tasks.reduce((sum, task) => sum + task.internalCostTotal, 0);
  const outstandingRevenue = invoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/projects" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Project detail
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          {project.name}
        </h1>
        <p className="mt-2 text-sm leading-7 text-stone-400">
          Project ID: {project.projectId} | {project.status}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/admin/projects/${project.projectId}/edit`}
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Edit Project
          </Link>
          <Link
            href={`/admin/invoices/new?customerId=${project.customerId}&projectId=${project.projectId}${project.quoteId ? `&quoteId=${project.quoteId}` : ""}`}
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Create Invoice
          </Link>
          <Link
            href="/admin/recurring-billing"
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Care Plans
          </Link>
          <form action={`/api/admin/projects/${project.projectId}/duplicate`} method="post">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Duplicate Project
            </button>
          </form>
        </div>
      </section>

      {error === "invalid-status" ? (
        <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          That project status was not recognised.
        </div>
      ) : null}
      {error === "invalid-cost" ? (
        <div className="mt-8 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          Please check the project cost details and try again.
        </div>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Project overview
          </p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
            {client ? <p>Client: {client.businessName}</p> : null}
            <p>Package: {project.packageType.replaceAll("_", " ")}</p>
            <p>Billing type: {project.billingType}</p>
            {project.startDate ? <p>Start date: {formatDisplayDate(project.startDate)}</p> : null}
            {project.targetEndDate ? <p>Target end date: {formatDisplayDate(project.targetEndDate)}</p> : null}
            {project.actualEndDate ? <p>Actual end date: {formatDisplayDate(project.actualEndDate)}</p> : null}
            <p>Estimated revenue: {formatMoney(project.estimatedRevenue)}</p>
            <p>Estimated cost: {formatMoney(project.estimatedCost)}</p>
            <p>Actual revenue: {formatMoney(project.actualRevenue)}</p>
            <p>Actual cost: {formatMoney(project.actualCost)}</p>
            <p>Gross profit: {formatMoney(project.grossProfit)}</p>
            <p>Gross margin: {project.grossMarginPercent.toFixed(1)}%</p>
            <p>Logged hours: {(tasks.reduce((sum, task) => sum + task.actualMinutes, 0) / 60).toFixed(2)}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {(
              ["planned", "active", "on_hold", "review", "completed", "cancelled"] as const
            ).map((status) => (
              <form
                key={status}
                action={`/api/admin/projects/${project.projectId}/status`}
                method="post"
              >
                <input type="hidden" name="status" value={status} />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                >
                  Mark {status.replaceAll("_", " ")}
                </button>
              </form>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Links and context
          </p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
            {project.description ? (
              <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                {project.description}
              </div>
            ) : null}
            {project.notes ? (
              <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                {project.notes}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-4">
              {client ? (
                <Link
                  href={`/admin/clients/${client.clientId}`}
                  className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                >
                  Open linked client
                </Link>
              ) : null}
              {quote ? (
                <Link
                  href={`/admin/quotes/${quote.quoteId}`}
                  className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                >
                  Open linked quote
                </Link>
              ) : null}
              {lead ? (
                <Link
                  href={`/admin/leads/${lead.auditId}`}
                  className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                >
                  Open linked lead
                </Link>
              ) : null}
            </div>
          </div>
        </article>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Linked invoices
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Revenue on this project now rolls up from invoice payments rather than manual guessing.
            </p>
          </div>
          <Link
            href={`/admin/invoices/new?customerId=${project.customerId}&projectId=${project.projectId}`}
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            New Invoice
          </Link>
        </div>
        {invoices.length > 0 ? (
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {invoices.map((invoice) => (
              <li
                key={invoice.invoiceId}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
              >
                <p className="font-semibold text-stone-100">{invoice.invoiceNumber}</p>
                <p className="mt-1">
                  {invoice.status.replaceAll("_", " ")} | Due {formatDisplayDate(invoice.dueDate)}
                </p>
                <p className="mt-1">
                  Total {formatMoney(invoice.total, invoice.currency)} | Paid {formatMoney(invoice.amountPaid, invoice.currency)}
                </p>
                <Link
                  href={`/admin/invoices/${invoice.invoiceId}`}
                  className="mt-3 inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                >
                  Open invoice
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm leading-7 text-stone-300">
            No invoices are linked to this project yet.
          </p>
        )}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Recurring billing
          </p>
          {recurringSchedules.length > 0 ? (
            <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
              {recurringSchedules.map((schedule) => (
                <li
                  key={schedule.scheduleId}
                  className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
                >
                  <p className="font-semibold text-stone-100">{schedule.title}</p>
                  <p className="mt-1">
                    {schedule.status} | {schedule.billingProvider} | Next invoice{" "}
                    {formatDisplayDate(schedule.nextInvoiceDate)}
                  </p>
                  <p className="mt-1">{formatMoney(schedule.amount, schedule.currency)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No recurring billing schedules are linked to this project yet.
            </p>
          )}
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Repeating maintenance
          </p>
          {repeatingTemplates.length > 0 ? (
            <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
              {repeatingTemplates.map((template) => (
                <li
                  key={template.templateId}
                  className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
                >
                  <p className="font-semibold text-stone-100">{template.title}</p>
                  <p className="mt-1">
                    {template.frequencyType} every {template.frequencyInterval} | Next run{" "}
                    {formatDisplayDate(template.nextRunAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No repeating maintenance templates are linked to this project yet.
            </p>
          )}
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Add manual project cost
          </p>
          <form action={`/api/admin/projects/${project.projectId}/costs`} method="post" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Date</span>
                <DateInput name="date" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Category</span>
                <select name="category" defaultValue="other" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="hosting">Hosting</option>
                  <option value="software">Software</option>
                  <option value="contractor">Contractor</option>
                  <option value="stock_assets">Stock assets</option>
                  <option value="domain">Domain</option>
                  <option value="ads">Ads</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Amount</span>
                <input name="amount" type="number" min="0.01" step="0.01" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Recurring interval</span>
                <select name="recurringInterval" defaultValue="monthly" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
            </div>
            <label className="inline-flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-200">
              <input type="checkbox" name="recurring" className="h-4 w-4" />
              Recurring cost
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Description</span>
              <textarea name="description" rows={3} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">
              Add Cost
            </button>
          </form>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Manual project costs
            </p>
            <span className="rounded-md bg-[color:var(--color-panel-strong)] px-3 py-1 text-xs font-semibold text-stone-200">
              {formatMoney(manualCostTotal)}
            </span>
          </div>
          {manualCosts.length > 0 ? (
            <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
              {manualCosts.map((cost) => (
                <li key={cost.id} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-stone-100">{cost.category.replaceAll("_", " ")}</p>
                      <p className="mt-1 text-stone-400">{formatDisplayDate(cost.date)}</p>
                      {cost.description ? <p className="mt-1">{cost.description}</p> : null}
                    </div>
                    <div className="text-sm font-semibold text-stone-100">
                      {formatMoney(cost.amount)}
                      {cost.recurring ? (
                        <p className="mt-1 text-xs font-normal text-stone-400">
                          Recurring {formatRecurringInterval(cost.recurringInterval)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No manual project costs have been recorded yet.
            </p>
          )}
        </article>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Project tasks
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
              Tasks now roll up into the global Kanban board so you can manage this
              project in context with everything else that is live.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <form action="/api/admin/tasks" method="post" className="flex flex-wrap gap-3">
              <input type="hidden" name="projectId" value={project.projectId} />
              <input type="hidden" name="customerId" value={project.customerId} />
              <input
                type="hidden"
                name="returnTo"
                value={`/admin/projects/${project.projectId}`}
              />
              <input
                name="title"
                type="text"
                placeholder="Quick add task"
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Add Task
              </button>
            </form>
            <Link
              href={`/admin/tasks?projectId=${project.projectId}`}
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              View in Board
            </Link>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {tasks.length > 0 ? (
            tasks.slice(0, 6).map((task) => (
              <div
                key={task.taskId}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-stone-800 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-100">
                    {task.taskKey}
                  </span>
                  <p className="font-semibold text-stone-100">{task.title}</p>
                </div>
                <p className="mt-1 text-sm leading-7 text-stone-300">
                  {task.status.replaceAll("_", " ")} | {task.priority}
                </p>
                {task.dueDate ? (
                  <p className="mt-1 text-sm leading-7 text-stone-400">
                    Due {formatDisplayDate(task.dueDate)}
                  </p>
                ) : null}
              </div>
            ))
          ) : (
            <p className="mt-4 text-sm leading-7 text-stone-300">
              No tasks are linked to this project yet.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-4">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Time entries
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{timeEntries.length}</p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Logged hours
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">
            {(tasks.reduce((sum, task) => sum + task.actualMinutes, 0) / 60).toFixed(2)}
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Time cost
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">
            {formatMoney(timeCostTotal)}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Logged delivery cost only.
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Manual cost
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">
            {formatMoney(manualCostTotal)}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Hosting, software, contractors, and other direct costs.
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Total cost
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">
            {formatMoney(project.actualCost)}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Time cost plus manual project costs.
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-4">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Paid revenue
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">
            {formatMoney(project.actualRevenue)}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Based on paid and part-paid invoices.
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Outstanding invoiced
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">
            {formatMoney(outstandingRevenue)}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Invoiced revenue still to be collected.
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Gross profit
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">
            {formatMoney(project.grossProfit)}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Paid revenue minus total project cost.
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Gross margin
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">
            {project.grossMarginPercent.toFixed(1)}%
          </p>
        </article>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Timeline
        </p>
        {activity.length > 0 ? (
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {activity.map((entry) => (
              <li
                key={entry.id}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
              >
                <p className="font-semibold text-stone-100">{entry.description}</p>
                <p className="mt-1">
                  {entry.actionType} | {entry.actor}
                </p>
                <p className="mt-1 text-stone-400">
                  {formatDisplayDateTime(entry.timestamp)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm leading-7 text-stone-300">
            No timeline events yet for this project.
          </p>
        )}
      </section>
    </main>
  );
}
