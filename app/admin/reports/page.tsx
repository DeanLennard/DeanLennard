import type { Metadata } from "next";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
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

export default async function ReportsPage() {
  await requireAdminAuthentication();

  const [leads, clients, projects, tasks, invoices, recurringSchedules] = await Promise.all([
    listLeads({ filter: "all" }),
    listClients(),
    listProjects(),
    listTasks(),
    listInvoices(),
    listRecurringInvoiceSchedules(),
  ]);

  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "overdue");
  const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalCost = projects.reduce((sum, project) => sum + project.actualCost, 0);
  const totalProfit = projects.reduce((sum, project) => sum + project.grossProfit, 0);
  const convertedLeads = leads.filter((lead) => lead.leadStatus === "converted").length;
  const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;
  const recurringRevenue = recurringSchedules
    .filter((schedule) => schedule.status === "active")
    .reduce((sum, schedule) => sum + schedule.amount, 0);

  const revenueByMonth = Array.from(
    paidInvoices.reduce((map, invoice) => {
      const key = getMonthKey(invoice.paidDate || invoice.updatedAt);
      map.set(key, (map.get(key) ?? 0) + invoice.total);
      return map;
    }, new Map<string, number>())
  )
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 6);

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

  const operationsSnapshot = [
    { label: "Total revenue", value: formatMoney(totalRevenue) },
    { label: "Recurring revenue", value: formatMoney(recurringRevenue) },
    { label: "Total project cost", value: formatMoney(totalCost) },
    { label: "Gross profit", value: formatMoney(totalProfit) },
    { label: "Overdue invoices", value: String(overdueInvoices.length) },
    {
      label: "Completed tasks",
      value: String(tasks.filter((task) => task.status === "done").length),
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
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
        <AdminNav currentPath="/admin/reports" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Lead conversion
          </p>
          <p className="mt-4 text-4xl font-semibold text-stone-50">{conversionRate.toFixed(1)}%</p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            {convertedLeads} converted from {leads.length} stored leads.
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
    </main>
  );
}
