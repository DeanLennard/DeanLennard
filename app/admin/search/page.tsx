import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listLeads } from "@/lib/audit-store";
import { listClients } from "@/lib/clients-store";
import { formatDisplayDate } from "@/lib/date-format";
import { listInvoices } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { listProjects } from "@/lib/projects-store";
import { listQuotes } from "@/lib/quotes-store";
import { listTasks } from "@/lib/tasks-store";

export const metadata: Metadata = {
  title: "Global Search",
  robots: {
    index: false,
    follow: false,
  },
};

type SearchPageSearchParams = Promise<{
  q?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function SearchSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          {title}
        </p>
        <span className="rounded-md bg-[color:var(--color-panel-strong)] px-3 py-1 text-xs font-semibold text-stone-200">
          {count}
        </span>
      </div>
      <div className="mt-6 space-y-4">
        {count > 0 ? children : <p className="text-sm leading-7 text-stone-300">No matches in this section.</p>}
      </div>
    </article>
  );
}

function SearchCard({
  title,
  meta,
  subtitle,
  href,
}: {
  title: string;
  meta: string;
  subtitle: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 transition hover:bg-white/8"
    >
      <p className="font-semibold text-stone-100">{title}</p>
      <p className="mt-1 text-sm leading-7 text-stone-300">{meta}</p>
      {subtitle ? <p className="mt-1 text-sm leading-7 text-stone-400">{subtitle}</p> : null}
    </Link>
  );
}

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: SearchPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const query = getSingleValue(resolvedSearchParams.q)?.trim() ?? "";

  const [leads, clients, projects, invoices, quotes, tasks] = query
    ? await Promise.all([
        listLeads({ search: query, filter: "all" }),
        listClients(query),
        listProjects(query),
        listInvoices({ search: query }),
        listQuotes(query),
        listTasks({ search: query }),
      ])
    : [[], [], [], [], [], []];
  const totalResults =
    leads.length +
    clients.length +
    projects.length +
    invoices.length +
    quotes.length +
    tasks.length;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/search" />
      </section>

      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Search
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Global admin search
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Search across leads, clients, projects, invoices, quotes, and tasks from one place.
        </p>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <form action="/admin/search" method="get">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by business name, URL, invoice, quote, task key, or ID"
            className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          />
        </form>
      </section>

      {query ? (
        <section className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:col-span-2">
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
                Search summary
              </p>
              <p className="mt-3 text-4xl font-semibold text-stone-50">
                {totalResults}
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Matches across leads, clients, projects, invoices, quotes, and tasks.
              </p>
            </article>
            {[
              { label: "Leads", value: leads.length },
              { label: "Clients", value: clients.length },
              { label: "Projects", value: projects.length },
              { label: "Tasks", value: tasks.length },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
              >
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-stone-50">
                  {item.value}
                </p>
              </article>
            ))}
          </div>

          <SearchSection title="Leads" count={leads.length}>
            {leads.map((lead) => (
              <SearchCard
                key={lead.auditId}
                title={lead.businessName || lead.normalizedUrl}
                meta={`${lead.auditId} | ${lead.leadStatus}`}
                subtitle={lead.normalizedUrl}
                href={`/admin/leads/${lead.auditId}`}
              />
            ))}
          </SearchSection>

          <SearchSection title="Clients" count={clients.length}>
            {clients.map((client) => (
              <SearchCard
                key={client.clientId}
                title={client.businessName}
                meta={`${client.clientId} | ${client.status}`}
                subtitle={client.email || client.website || ""}
                href={`/admin/clients/${client.clientId}`}
              />
            ))}
          </SearchSection>

          <SearchSection title="Projects" count={projects.length}>
            {projects.map((project) => (
              <SearchCard
                key={project.projectId}
                title={project.name}
                meta={`${project.projectId} | ${project.status}`}
                subtitle={`${project.packageType.replaceAll("_", " ")} | ${formatMoney(project.actualRevenue)}`}
                href={`/admin/projects/${project.projectId}`}
              />
            ))}
          </SearchSection>

          <SearchSection title="Invoices" count={invoices.length}>
            {invoices.map((invoice) => (
              <SearchCard
                key={invoice.invoiceId}
                title={invoice.invoiceNumber}
                meta={`${invoice.invoiceId} | ${invoice.status}`}
                subtitle={`Due ${formatDisplayDate(invoice.dueDate)} | ${formatMoney(invoice.total, invoice.currency)}`}
                href={`/admin/invoices/${invoice.invoiceId}`}
              />
            ))}
          </SearchSection>

          <SearchSection title="Quotes" count={quotes.length}>
            {quotes.map((quote) => (
              <SearchCard
                key={quote.quoteId}
                title={quote.title}
                meta={`${quote.quoteNumber} | ${quote.status}`}
                subtitle={formatMoney(quote.total, quote.currency)}
                href={`/admin/quotes/${quote.quoteId}`}
              />
            ))}
          </SearchSection>

          <SearchSection title="Tasks" count={tasks.length}>
            {tasks.map((task) => (
              <SearchCard
                key={task.taskId}
                title={task.title}
                meta={`${task.taskKey} | ${task.status}`}
                subtitle={task.projectId || task.customerId || ""}
                href={`/admin/tasks/${task.taskId}/edit`}
              />
            ))}
          </SearchSection>
        </section>
      ) : null}
    </main>
  );
}
