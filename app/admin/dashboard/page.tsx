import type { Metadata } from "next";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import {
  buildRangeHref,
  getRangeLabel,
  isDateWithinRange,
  resolveAdminDateRange,
} from "@/lib/admin-date-range";
import { listRecentActivity } from "@/lib/activity-log";
import { listLeads } from "@/lib/audit-store";
import { listClients } from "@/lib/clients-store";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/date-format";
import { listInvoices } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { listProjects } from "@/lib/projects-store";
import { listRecurringInvoiceSchedules } from "@/lib/recurring-billing-store";
import { listRepeatingTaskTemplates } from "@/lib/repeating-task-templates-store";
import { listTasks } from "@/lib/tasks-store";

export const metadata: Metadata = {
  title: "Client OS Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    range?: string | string[];
    start?: string | string[];
    end?: string | string[];
  }>;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const rangeValue = Array.isArray(resolvedSearchParams.range)
    ? resolvedSearchParams.range[0]
    : resolvedSearchParams.range;
  const startValue = Array.isArray(resolvedSearchParams.start)
    ? resolvedSearchParams.start[0]
    : resolvedSearchParams.start;
  const endValue = Array.isArray(resolvedSearchParams.end)
    ? resolvedSearchParams.end[0]
    : resolvedSearchParams.end;
  const range = resolveAdminDateRange({
    range: rangeValue,
    start: startValue,
    end: endValue,
  });

  const [leads, clients, projects, tasks, invoices, recurringSchedules, repeatingTemplates, recentActivity] = await Promise.all([
    listLeads({ filter: "all" }),
    listClients(),
    listProjects(),
    listTasks(),
    listInvoices(),
    listRecurringInvoiceSchedules(),
    listRepeatingTaskTemplates(),
    listRecentActivity(10),
  ]);

  const totalLeads = leads.length;
  const newLeadsThisMonth = leads.filter((lead) => isDateWithinRange(lead.createdAt, range)).length;
  const convertedLeadsThisMonth = leads.filter(
    (lead) => lead.leadStatus === "converted" && isDateWithinRange(lead.updatedAt, range)
  ).length;
  const activeClients = clients.filter((client) => client.status === "active").length;
  const consentedLeads = leads.filter((lead) => lead.followUpConsent).length;
  const activeProjects = projects.filter((project) =>
    ["planned", "active", "on_hold", "review"].includes(project.status)
  ).length;
  const totalTrackedHours = tasks.reduce(
    (sum, task) => sum + (task.actualMinutes ?? 0),
    0
  ) / 60;
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "done") {
      return false;
    }

    return new Date(`${task.dueDate}T23:59:59`).getTime() < Date.now();
  }).length;
  const unpaidInvoices = invoices.filter((invoice) =>
    ["sent", "unpaid", "partially_paid", "overdue"].includes(invoice.status)
  ).length;
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "overdue").length;
  const activeRecurringSchedules = recurringSchedules.filter(
    (schedule) => schedule.status === "active"
  ).length;
  const upcomingRepeatingTasks = repeatingTemplates
    .filter((template) => template.active && template.autoCreateEnabled)
    .slice(0, 5);
  const monthlyRevenue = invoices.reduce((sum, invoice) => {
    if (invoice.status !== "paid") {
      return sum;
    }

    return isDateWithinRange(invoice.paidDate ?? invoice.updatedAt, range) ? sum + invoice.total : sum;
  }, 0);
  const recurringRevenue = recurringSchedules
    .filter((schedule) => schedule.status === "active")
    .reduce((sum, schedule) => sum + schedule.amount, 0);
  const mostProfitableProject = [...projects]
    .sort((a, b) => b.grossProfit - a.grossProfit)
    .find((project) => project.grossProfit > 0);
  const leastProfitableProject = [...projects]
    .sort((a, b) => a.grossProfit - b.grossProfit)
    .at(0);
  const failedProviderEvents = recentActivity.filter(
    (entry) =>
      entry.entityType === "invoice" &&
      entry.actionType === "provider_sync_failed"
  ).length;
  const tasksDueToday = tasks.filter(
    (task) =>
      task.dueDate === new Date().toISOString().slice(0, 10) &&
      task.status !== "done"
  ).length;
  const conversionRate = totalLeads > 0 ? (convertedLeadsThisMonth / totalLeads) * 100 : 0;
  const upcomingRenewals = recurringSchedules.filter((schedule) => {
    const nextInvoiceDate = new Date(`${schedule.nextInvoiceDate}T00:00:00Z`).getTime();
    return nextInvoiceDate >= Date.now() && nextInvoiceDate - Date.now() <= 30 * 24 * 60 * 60 * 1000;
  }).length;
  const rangeLeads = leads.filter((lead) => isDateWithinRange(lead.createdAt, range)).length;
  const rangePaidInvoices = invoices.filter(
    (invoice) =>
      invoice.status === "paid" &&
      isDateWithinRange(invoice.paidDate ?? invoice.updatedAt, range)
  );
  const averageInvoiceValue =
    rangePaidInvoices.length > 0
      ? rangePaidInvoices.reduce((sum, invoice) => sum + invoice.total, 0) / rangePaidInvoices.length
      : 0;
  const leadsNeedingReview = leads.filter((lead) =>
    ["new", "reviewed", "qualified"].includes(lead.leadStatus)
  ).length;
  const invoicesDueSoon = invoices.filter((invoice) => {
    if (!["sent", "unpaid", "partially_paid", "overdue"].includes(invoice.status)) {
      return false;
    }

    const dueAt = new Date(`${invoice.dueDate}T23:59:59Z`).getTime();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return dueAt >= now && dueAt <= now + sevenDays;
  }).length;
  const recurringSchedulesDueSoon = recurringSchedules.filter((schedule) => {
    if (schedule.status !== "active") {
      return false;
    }

    const nextAt = new Date(`${schedule.nextInvoiceDate}T00:00:00Z`).getTime();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return nextAt >= now && nextAt <= now + sevenDays;
  }).length;
  const alerts = [
    {
      label: "Overdue invoices",
      count: overdueInvoices,
      href: "/admin/invoices?status=overdue",
      tone: overdueInvoices > 0 ? "critical" : "clear",
      description: "Invoices already past due and needing follow-up.",
    },
    {
      label: "Tasks due today",
      count: tasksDueToday,
      href: "/admin/tasks",
      tone: tasksDueToday > 0 ? "warning" : "clear",
      description: "Work that should be touched before the day ends.",
    },
    {
      label: "Provider issues",
      count: failedProviderEvents,
      href: "/admin/provider-events?status=failed",
      tone: failedProviderEvents > 0 ? "critical" : "clear",
      description: "Stripe or GoCardless sync problems needing review.",
    },
    {
      label: "Leads needing review",
      count: leadsNeedingReview,
      href: "/admin/leads?status=new",
      tone: leadsNeedingReview > 0 ? "warning" : "clear",
      description: "Fresh and in-flight leads still moving through qualification.",
    },
    {
      label: "Invoices due soon",
      count: invoicesDueSoon,
      href: "/admin/invoices",
      tone: invoicesDueSoon > 0 ? "warning" : "clear",
      description: "Open invoices due within the next seven days.",
    },
    {
      label: "Care-plan billing due",
      count: recurringSchedulesDueSoon,
      href: "/admin/recurring-billing",
      tone: recurringSchedulesDueSoon > 0 ? "warning" : "clear",
      description: "Recurring schedules with the next invoice date in the next week.",
    },
  ];

  const summaryCards = [
    {
      label: "Total leads",
      value: totalLeads,
      description: "All website audit leads stored so far.",
    },
    {
      label: "New leads",
      value: newLeadsThisMonth,
      description: `Fresh lead volume in ${getRangeLabel(range)}.`,
    },
    {
      label: "Converted leads",
      value: convertedLeadsThisMonth,
      description: `Leads that became clients in ${getRangeLabel(range)}.`,
    },
    {
      label: "Active clients",
      value: activeClients,
      description: "Current customers with active status.",
    },
    {
      label: "Consented leads",
      value: consentedLeads,
      description: "Leads who have shown follow-up intent.",
    },
    {
      label: "Active projects",
      value: activeProjects,
      description: "Projects currently in delivery or awaiting completion.",
    },
  ];

  const placeholderCards = [
    {
      label: "Revenue",
      value: formatMoney(monthlyRevenue),
      description: `Paid invoice revenue recorded in ${getRangeLabel(range)}.`,
    },
    {
      label: "Recurring revenue",
      value: formatMoney(recurringRevenue),
      description: "Current recurring project value across active work.",
    },
    {
      label: "Tracked hours",
      value: totalTrackedHours.toFixed(1),
      description: "All logged delivery time across live task work.",
    },
    {
      label: "Overdue tasks",
      value: String(overdueTasks),
      description: "Tasks past their due date and not yet completed.",
    },
    {
      label: "Unpaid invoices",
      value: String(unpaidInvoices),
      description: "Invoices still awaiting payment or part payment.",
    },
    {
      label: "Overdue invoices",
      value: String(overdueInvoices),
      description: "Invoices that are now beyond their due date.",
    },
    {
      label: "Recurring schedules",
      value: String(activeRecurringSchedules),
      description: "Active care-plan billing schedules currently running.",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/dashboard" />
      </section>

      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              Dean Lennard Client OS
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
              A single view of leads, clients, recent audit activity, and the
              operational areas that will expand as the rest of the system comes
              online.
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
          <div className="flex flex-wrap gap-2">
            {(["7d", "30d", "month", "all"] as const).map((option) => (
              <a
                key={option}
                href={buildRangeHref("/admin/dashboard", { preset: option })}
                className={`inline-flex rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  range.preset === option
                    ? "border-amber-500/50 bg-amber-500/10 text-amber-200"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] text-stone-300 hover:bg-white/8"
                }`}
              >
                {option === "7d"
                  ? "Last 7 days"
                  : option === "30d"
                    ? "Last 30 days"
                    : option === "month"
                      ? "Current month"
                      : "All time"}
              </a>
            ))}
          </div>
          <form action="/admin/dashboard" method="get" className="grid gap-4 md:grid-cols-[0.8fr_0.8fr_auto_auto]">
            <input type="hidden" name="range" value="custom" />
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Custom start date</span>
              <input
                type="date"
                name="start"
                defaultValue={range.startDate || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Custom end date</span>
              <input
                type="date"
                name="end"
                defaultValue={range.endDate || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              />
            </label>
            <a
              href="/admin/dashboard"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-4 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8 md:mt-8"
            >
              Clear
            </a>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500 md:mt-8"
            >
              Apply Custom Range
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
          >
            <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
              {card.label}
            </p>
            <p className="mt-4 text-4xl font-semibold text-stone-50">
              {card.value}
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Recent activity
          </p>
          {recentActivity.length > 0 ? (
            <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
              {recentActivity.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
                >
                  <p className="font-semibold text-stone-100">
                    {entry.description}
                  </p>
                  <p className="mt-1">
                    {entry.entityType} | {entry.actionType}
                  </p>
                  <p className="mt-1 text-stone-400">
                    {formatDisplayDateTime(entry.timestamp)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No activity has been recorded yet.
            </p>
          )}
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Financial snapshot
          </p>
          <p className="mt-2 text-sm leading-7 text-stone-400">
            Revenue, cashflow, and operations for {getRangeLabel(range)}.
          </p>
          <div className="mt-6 space-y-4">
            {placeholderCards.map((card) => (
              <div
                key={card.label}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
              >
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-50">
                  {card.value}
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-300">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Control centre
            </p>
            <p className="mt-2 text-sm leading-7 text-stone-300">
              Priority alerts and the next actions most likely to unblock revenue, delivery, and follow-up.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {alerts.map((alert) => (
            <a
              key={alert.label}
              href={alert.href}
              className={`rounded-md border p-4 transition hover:bg-white/8 ${
                alert.tone === "critical"
                  ? "border-red-500/30 bg-red-500/10"
                  : alert.tone === "warning"
                    ? "border-amber-500/30 bg-amber-500/10"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-stone-100">{alert.label}</p>
                <span className="text-2xl font-semibold text-stone-50">{alert.count}</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-stone-300">{alert.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-4">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Alerts
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{overdueInvoices}</p>
          <p className="mt-2 text-sm text-stone-400">Overdue invoices</p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Due today
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{tasksDueToday}</p>
          <p className="mt-2 text-sm text-stone-400">Tasks due today</p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Provider issues
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{failedProviderEvents}</p>
          <p className="mt-2 text-sm text-stone-400">Recent failed billing syncs</p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Maintenance due
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{upcomingRepeatingTasks.length}</p>
          <p className="mt-2 text-sm text-stone-400">Upcoming repeating task templates</p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Renewals due
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{upcomingRenewals}</p>
          <p className="mt-2 text-sm text-stone-400">Yearly care-plan renewals in the next 30 days</p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Lead trend
          </p>
          <p className="mt-4 text-4xl font-semibold text-stone-50">{rangeLeads}</p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Leads created during {getRangeLabel(range)}.
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Conversion rate
          </p>
          <p className="mt-4 text-4xl font-semibold text-stone-50">{conversionRate.toFixed(1)}%</p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Converted leads relative to all stored leads.
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Average invoice value
          </p>
          <p className="mt-4 text-4xl font-semibold text-stone-50">{formatMoney(averageInvoiceValue)}</p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Average paid invoice value in the selected range.
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Most profitable project
          </p>
          {mostProfitableProject ? (
            <div className="mt-6 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              <p className="font-semibold text-stone-100">{mostProfitableProject.name}</p>
              <p className="mt-1">
                Profit {formatMoney(mostProfitableProject.grossProfit)}
              </p>
              <p className="mt-1">
                Margin {mostProfitableProject.grossMarginPercent.toFixed(1)}%
              </p>
            </div>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No profitable projects have been recorded yet.
            </p>
          )}
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Least profitable project
          </p>
          {leastProfitableProject ? (
            <div className="mt-6 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              <p className="font-semibold text-stone-100">{leastProfitableProject.name}</p>
              <p className="mt-1">
                Profit {formatMoney(leastProfitableProject.grossProfit)}
              </p>
              <p className="mt-1">
                Margin {leastProfitableProject.grossMarginPercent.toFixed(1)}%
              </p>
            </div>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No projects have been recorded yet.
            </p>
          )}
        </article>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Upcoming repeating maintenance tasks
        </p>
        {upcomingRepeatingTasks.length > 0 ? (
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {upcomingRepeatingTasks.map((template) => (
              <li
                key={template.templateId}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
              >
                <p className="font-semibold text-stone-100">{template.title}</p>
                <p className="mt-1">
                  Next run {formatDisplayDate(template.nextRunAt)} | {template.frequencyType} every{" "}
                  {template.frequencyInterval}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm leading-7 text-stone-300">
            No repeating maintenance templates are queued yet.
          </p>
        )}
      </section>
    </main>
  );
}
