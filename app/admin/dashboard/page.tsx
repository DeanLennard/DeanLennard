import type { Metadata } from "next";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
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

function isSameMonth(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth()
  );
}

export default async function AdminDashboardPage() {
  await requireAdminAuthentication();

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
  const newLeadsThisMonth = leads.filter((lead) => isSameMonth(lead.createdAt)).length;
  const convertedLeadsThisMonth = leads.filter(
    (lead) => lead.leadStatus === "converted" && isSameMonth(lead.updatedAt)
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

    return isSameMonth(invoice.paidDate ?? invoice.updatedAt) ? sum + invoice.total : sum;
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

  const summaryCards = [
    {
      label: "Total leads",
      value: totalLeads,
      description: "All website audit leads stored so far.",
    },
    {
      label: "New this month",
      value: newLeadsThisMonth,
      description: "Fresh lead volume in the current month.",
    },
    {
      label: "Converted this month",
      value: convertedLeadsThisMonth,
      description: "Leads that became clients this month.",
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
      label: "Monthly revenue",
      value: formatMoney(monthlyRevenue),
      description: "Paid invoice revenue recorded this month.",
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

        <AdminNav currentPath="/admin/dashboard" />
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
