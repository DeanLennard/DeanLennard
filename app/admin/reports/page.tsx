import type { Metadata } from "next";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import {
  buildRangeHref,
  getRangeLabel,
  isDateWithinRange,
  resolveAdminDateRange,
} from "@/lib/admin-date-range";
import { listLeads } from "@/lib/audit-store";
import { listClients } from "@/lib/clients-store";
import { formatDisplayDate } from "@/lib/date-format";
import { listInvoices } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { listProjects } from "@/lib/projects-store";
import { listRecurringInvoiceSchedules } from "@/lib/recurring-billing-store";
import { listTasks } from "@/lib/tasks-store";

export const metadata: Metadata = {
  title: "Reports",
  robots: {
    index: false,
    follow: false,
  },
};

function getMonthKey(dateString: string) {
  const date = new Date(dateString);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getProjectDurationDays(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) {
    return null;
  }

  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }

  return Math.max(1, Math.round((end - start) / (24 * 60 * 60 * 1000)));
}

export default async function ReportsPage({
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
  const range = resolveAdminDateRange({
    range: Array.isArray(resolvedSearchParams.range)
      ? resolvedSearchParams.range[0]
      : resolvedSearchParams.range,
    start: Array.isArray(resolvedSearchParams.start)
      ? resolvedSearchParams.start[0]
      : resolvedSearchParams.start,
    end: Array.isArray(resolvedSearchParams.end)
      ? resolvedSearchParams.end[0]
      : resolvedSearchParams.end,
  });

  const [leads, clients, projects, tasks, invoices, recurringSchedules] = await Promise.all([
    listLeads({ filter: "all" }),
    listClients(),
    listProjects(),
    listTasks(),
    listInvoices(),
    listRecurringInvoiceSchedules(),
  ]);

  const paidInvoices = invoices.filter(
    (invoice) =>
      invoice.status === "paid" &&
      isDateWithinRange(invoice.paidDate || invoice.updatedAt, range)
  );
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "overdue");
  const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalCost = projects.reduce((sum, project) => sum + project.actualCost, 0);
  const totalProfit = projects.reduce((sum, project) => sum + project.grossProfit, 0);
  const rangeLeads = leads.filter((lead) => isDateWithinRange(lead.createdAt, range));
  const convertedLeads = leads.filter(
    (lead) => lead.leadStatus === "converted" && isDateWithinRange(lead.updatedAt, range)
  ).length;
  const conversionRate = rangeLeads.length > 0 ? (convertedLeads / rangeLeads.length) * 100 : 0;
  const recurringRevenue = recurringSchedules
    .filter((schedule) => schedule.status === "active")
    .reduce((sum, schedule) => sum + schedule.amount, 0);
  const outstandingRevenue = invoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0);
  const taskHoursByPackage = Array.from(
    projects.reduce((map, project) => {
      const projectTaskMinutes = tasks
        .filter((task) => task.projectId === project.projectId)
        .reduce((sum, task) => sum + (task.actualMinutes ?? 0), 0);
      map.set(project.packageType, (map.get(project.packageType) ?? 0) + projectTaskMinutes / 60);
      return map;
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1]);
  const invoiceStatusSummary = [
    { label: "Paid", value: invoices.filter((invoice) => invoice.status === "paid").length },
    { label: "Overdue", value: overdueInvoices.length },
    {
      label: "Outstanding",
      value: invoices.filter((invoice) => ["sent", "unpaid", "partially_paid", "overdue"].includes(invoice.status)).length,
    },
  ];

  const revenueByMonth = Array.from(
    paidInvoices.reduce((map, invoice) => {
      const key = getMonthKey(invoice.paidDate || invoice.updatedAt);
      map.set(key, (map.get(key) ?? 0) + invoice.total);
      return map;
    }, new Map<string, number>())
  )
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 12);

  const revenueByClient = clients
    .map((client) => ({
      client,
      revenue: paidInvoices
        .filter((invoice) => invoice.customerId === client.clientId)
        .reduce((sum, invoice) => sum + invoice.total, 0),
    }))
    .filter((entry) => entry.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const packageProfitability = Array.from(
    projects.reduce((map, project) => {
      const current = map.get(project.packageType) ?? { revenue: 0, cost: 0, profit: 0, count: 0 };
      current.revenue += project.actualRevenue;
      current.cost += project.actualCost;
      current.profit += project.grossProfit;
      current.count += 1;
      map.set(project.packageType, current);
      return map;
    }, new Map<string, { revenue: number; cost: number; profit: number; count: number }>())
  );
  const completedProjectsInRange = projects.filter(
    (project) =>
      project.status === "completed" &&
      project.actualEndDate &&
      isDateWithinRange(project.actualEndDate, range)
  );
  const averageProjectDurationDays =
    completedProjectsInRange.length > 0
      ? completedProjectsInRange.reduce((sum, project) => {
          return sum + (getProjectDurationDays(project.startDate, project.actualEndDate) ?? 0);
        }, 0) / completedProjectsInRange.length
      : 0;
  const revenueByPackageType = Array.from(
    paidInvoices.reduce((map, invoice) => {
      const project = invoice.projectId
        ? projects.find((entry) => entry.projectId === invoice.projectId)
        : null;
      const packageType = project?.packageType ?? "unassigned";
      const current = map.get(packageType) ?? { revenue: 0, invoices: 0 };
      current.revenue += invoice.total;
      current.invoices += 1;
      map.set(packageType, current);
      return map;
    }, new Map<string, { revenue: number; invoices: number }>())
  ).sort((a, b) => b[1].revenue - a[1].revenue);
  const recurringVsOneOffTrend = Array.from(
    paidInvoices.reduce((map, invoice) => {
      const key = getMonthKey(invoice.paidDate || invoice.updatedAt);
      const current = map.get(key) ?? { recurring: 0, oneOff: 0 };
      if (invoice.recurringScheduleId) {
        current.recurring += invoice.total;
      } else {
        current.oneOff += invoice.total;
      }
      map.set(key, current);
      return map;
    }, new Map<string, { recurring: number; oneOff: number }>())
  )
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 12);
  const sourceConversionRates = Array.from(
    rangeLeads.reduce((map, lead) => {
      const source =
        lead.traffic?.utmSource?.trim() ||
        lead.traffic?.sourcePage?.trim() ||
        lead.traffic?.referrer?.trim() ||
        "Direct / unknown";
      const current = map.get(source) ?? { leads: 0, converted: 0 };
      current.leads += 1;
      if (lead.leadStatus === "converted" && isDateWithinRange(lead.updatedAt, range)) {
        current.converted += 1;
      }
      map.set(source, current);
      return map;
    }, new Map<string, { leads: number; converted: number }>())
  )
    .map(([source, totals]) => ({
      source,
      ...totals,
      conversionRate: totals.leads > 0 ? (totals.converted / totals.leads) * 100 : 0,
    }))
    .sort((a, b) => b.conversionRate - a.conversionRate || b.leads - a.leads)
    .slice(0, 10);
  const customerProfitability = clients
    .map((client) => {
      const clientProjects = projects.filter((project) => project.customerId === client.clientId);
      const revenue = clientProjects.reduce((sum, project) => sum + project.actualRevenue, 0);
      const cost = clientProjects.reduce((sum, project) => sum + project.actualCost, 0);
      const profit = revenue - cost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        client,
        revenue,
        cost,
        profit,
        margin,
        projectCount: clientProjects.length,
      };
    })
    .filter((entry) => entry.projectCount > 0 || entry.revenue > 0 || entry.cost > 0)
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

  const operationsSnapshot = [
    { label: "Total revenue", value: formatMoney(totalRevenue) },
    { label: "Recurring revenue", value: formatMoney(recurringRevenue) },
    { label: "Total project cost", value: formatMoney(totalCost) },
    { label: "Gross profit", value: formatMoney(totalProfit) },
    {
      label: "Average project duration",
      value: completedProjectsInRange.length > 0 ? `${averageProjectDurationDays.toFixed(1)} days` : "N/A",
    },
    { label: "Overdue invoices", value: String(overdueInvoices.length) },
    {
      label: "Completed tasks",
      value: String(tasks.filter((task) => task.status === "done").length),
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/reports" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Reports
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Revenue, profit, and operations
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          A single reporting view across leads, invoices, projects, recurring revenue,
          and delivery throughput.
        </p>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {(["7d", "30d", "month", "all"] as const).map((option) => (
              <a
                key={option}
                href={buildRangeHref("/admin/reports", { preset: option })}
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
          <form action="/admin/reports" method="get" className="grid gap-4 md:grid-cols-[0.8fr_0.8fr_auto]">
            <input type="hidden" name="range" value="custom" />
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Custom start date</span>
              <input type="date" name="start" defaultValue={range.startDate || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Custom end date</span>
              <input type="date" name="end" defaultValue={range.endDate || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500 md:mt-8">
              Apply Custom Range
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Lead conversion
          </p>
          <p className="mt-4 text-4xl font-semibold text-stone-50">{conversionRate.toFixed(1)}%</p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            {convertedLeads} converted from {rangeLeads.length} leads in {getRangeLabel(range)}.
          </p>
        </article>
        {operationsSnapshot.map((item) => (
          <article key={item.label} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              {item.label}
            </p>
            <p className="mt-4 text-4xl font-semibold text-stone-50">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Revenue by month
          </p>
          <div className="mt-6 space-y-4">
            {revenueByMonth.map(([month, revenue]) => (
              <div key={month} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                <p className="font-semibold text-stone-100">{month}</p>
                <p className="mt-1 text-stone-300">{formatMoney(revenue)}</p>
                <div className="mt-3 h-2 rounded-full bg-stone-900/70">
                  <div
                    className="h-2 rounded-full bg-amber-500"
                    style={{
                      width: `${Math.max(
                        8,
                        revenueByMonth[0]?.[1] ? (revenue / revenueByMonth[0][1]) * 100 : 0
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Revenue by client
          </p>
          <div className="mt-6 space-y-4">
            {revenueByClient.length > 0 ? (
              revenueByClient.map(({ client, revenue }) => (
                <div key={client.clientId} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <p className="font-semibold text-stone-100">{client.businessName}</p>
                  <p className="mt-1 text-stone-300">{formatMoney(revenue, client.defaultCurrency)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                No paid invoice revenue has been recorded yet.
              </p>
            )}
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Revenue by package type
          </p>
          <div className="mt-6 space-y-4">
            {revenueByPackageType.length > 0 ? (
              revenueByPackageType.map(([packageType, totals]) => (
                <div key={packageType} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-stone-100">{packageType.replaceAll("_", " ")}</p>
                    <p className="text-stone-300">{formatMoney(totals.revenue)}</p>
                  </div>
                  <p className="mt-2 text-sm text-stone-400">{totals.invoices} paid invoices</p>
                  <div className="mt-3 h-2 rounded-full bg-stone-900/70">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{
                        width: `${Math.max(
                          8,
                          revenueByPackageType[0]?.[1].revenue
                            ? (totals.revenue / revenueByPackageType[0][1].revenue) * 100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                No paid invoice revenue has been linked to project package types yet.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Recurring vs one-off trend
          </p>
          <div className="mt-6 space-y-4">
            {recurringVsOneOffTrend.length > 0 ? (
              recurringVsOneOffTrend.map(([month, totals]) => (
                <div key={month} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-stone-100">{month}</p>
                    <p className="text-sm text-stone-300">
                      Recurring {formatMoney(totals.recurring)} | One-off {formatMoney(totals.oneOff)}
                    </p>
                  </div>
                  <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-stone-900/70">
                    <div
                      className="bg-emerald-500"
                      style={{
                        width: `${totals.recurring + totals.oneOff > 0 ? (totals.recurring / (totals.recurring + totals.oneOff)) * 100 : 0}%`,
                      }}
                    />
                    <div
                      className="bg-amber-500"
                      style={{
                        width: `${totals.recurring + totals.oneOff > 0 ? (totals.oneOff / (totals.recurring + totals.oneOff)) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                No paid invoice trend data is available yet.
              </p>
            )}
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Outstanding revenue
          </p>
          <p className="mt-4 text-4xl font-semibold text-stone-50">{formatMoney(outstandingRevenue)}</p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Total invoiced balance still to be collected.
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Active clients
          </p>
          <p className="mt-4 text-4xl font-semibold text-stone-50">
            {clients.filter((client) => client.status === "active").length}
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Current active customer accounts in the system.
          </p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Project margin average
          </p>
          <p className="mt-4 text-4xl font-semibold text-stone-50">
            {projects.length > 0
              ? `${(
                  projects.reduce((sum, project) => sum + project.grossMarginPercent, 0) / projects.length
                ).toFixed(1)}%`
              : "0.0%"}
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Average gross margin across all projects.
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Profit by package type
          </p>
          <div className="mt-6 space-y-4">
            {packageProfitability.map(([packageType, totals]) => (
              <div key={packageType} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                <p className="font-semibold text-stone-100">{packageType.replaceAll("_", " ")}</p>
                <p className="mt-1 text-stone-300">
                  Revenue {formatMoney(totals.revenue)} | Cost {formatMoney(totals.cost)} | Profit {formatMoney(totals.profit)}
                </p>
                <p className="mt-1 text-stone-400">{totals.count} projects</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Overdue invoices
          </p>
          {overdueInvoices.length > 0 ? (
            <div className="mt-6 space-y-4">
              {overdueInvoices.map((invoice) => (
                <div key={invoice.invoiceId} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <p className="font-semibold text-stone-100">{invoice.invoiceNumber}</p>
                  <p className="mt-1 text-stone-300">
                    Due {formatDisplayDate(invoice.dueDate)} | Balance {formatMoney(invoice.balanceDue, invoice.currency)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No overdue invoices right now.
            </p>
          )}
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Time by package type
          </p>
          <div className="mt-6 space-y-4">
            {taskHoursByPackage.length > 0 ? (
              taskHoursByPackage.map(([packageType, hours]) => (
                <div key={packageType} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-stone-100">{packageType.replaceAll("_", " ")}</p>
                    <p className="text-stone-300">{hours.toFixed(1)}h</p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-stone-900/70">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{
                        width: `${Math.max(
                          8,
                          taskHoursByPackage[0]?.[1] ? (hours / taskHoursByPackage[0][1]) * 100 : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                No logged task time is available yet.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Invoice status mix
          </p>
          <div className="mt-6 space-y-4">
            {invoiceStatusSummary.map((item) => (
              <div key={item.label} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-stone-100">{item.label}</p>
                  <p className="text-stone-300">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Source conversion rates
          </p>
          <div className="mt-6 space-y-4">
            {sourceConversionRates.length > 0 ? (
              sourceConversionRates.map((entry) => (
                <div key={entry.source} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-stone-100">{entry.source}</p>
                    <p className="text-stone-300">{entry.conversionRate.toFixed(1)}%</p>
                  </div>
                  <p className="mt-2 text-sm text-stone-400">
                    {entry.converted} converted from {entry.leads} leads
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                Source conversion data will appear once leads begin converting.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Customer profitability
          </p>
          <div className="mt-6 space-y-4">
            {customerProfitability.length > 0 ? (
              customerProfitability.map((entry) => (
                <div key={entry.client.clientId} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-stone-100">{entry.client.businessName}</p>
                    <p className="text-stone-300">{entry.margin.toFixed(1)}% margin</p>
                  </div>
                  <p className="mt-2 text-sm text-stone-300">
                    Revenue {formatMoney(entry.revenue, entry.client.defaultCurrency)} | Cost {formatMoney(entry.cost, entry.client.defaultCurrency)} | Profit {formatMoney(entry.profit, entry.client.defaultCurrency)}
                  </p>
                  <p className="mt-1 text-sm text-stone-400">{entry.projectCount} linked projects</p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                Customer profitability will populate once projects carry revenue and cost data.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
