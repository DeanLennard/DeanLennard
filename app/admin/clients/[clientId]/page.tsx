import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminClientHistoryFeed } from "@/components/admin-client-history-feed";
import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listActivityLogsByEntityPage } from "@/lib/activity-log";
import { getAuditById } from "@/lib/audit-store";
import { getClientById } from "@/lib/clients-store";
import { listCustomerNotesPage } from "@/lib/customer-notes";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/date-format";
import { listInvoicesByClientId } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { listProjectsByClientId } from "@/lib/projects-store";
import { listRecurringInvoiceSchedules } from "@/lib/recurring-billing-store";
import { listQuotes } from "@/lib/quotes-store";
import { listRepeatingTaskTemplates } from "@/lib/repeating-task-templates-store";
import { listPortalUsersByClientId } from "@/lib/portal-users";

export const metadata: Metadata = {
  title: "Client Detail",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  await requireAdminAuthentication();

  const { clientId } = await params;
  const resolvedSearchParams = await searchParams;
  const error = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0] ?? ""
    : resolvedSearchParams.error ?? "";
  const client = await getClientById(clientId);

  if (!client) {
    notFound();
  }

  const sourceAudit = client.sourceAuditId
    ? await getAuditById(client.sourceAuditId)
    : null;
  const [notesPage, activityPage, projects, quotes, invoices, recurringSchedules, repeatingTemplates, portalUsers] = await Promise.all([
    listCustomerNotesPage(client.clientId, { offset: 0, limit: 10 }),
    listActivityLogsByEntityPage("client", client.clientId, { offset: 0, limit: 10 }),
    listProjectsByClientId(client.clientId),
    listQuotes(client.clientId),
    listInvoicesByClientId(client.clientId),
    listRecurringInvoiceSchedules({ customerId: client.clientId }),
    listRepeatingTaskTemplates({ customerId: client.clientId }),
    listPortalUsersByClientId(client.clientId),
  ]);
  const clientQuotes = quotes.filter((quote) => quote.customerId === client.clientId);
  const outstandingInvoiceTotal = invoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/clients" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Client detail
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          {client.businessName}
        </h1>
        <p className="mt-2 text-sm leading-7 text-stone-400">
          Client ID: {client.clientId}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/admin/quotes/new?customerId=${client.clientId}`}
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Create Quote
          </Link>
          <Link
            href={`/admin/projects/new?customerId=${client.clientId}`}
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Create Project
          </Link>
          <Link
            href={`/admin/clients/${client.clientId}/edit`}
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Edit Client
          </Link>
          <Link
            href={`/admin/invoices/new?customerId=${client.clientId}`}
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Create Invoice
          </Link>
          <Link
            href="/admin/recurring-billing"
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Care Plans
          </Link>
        </div>
        {error ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            {decodeURIComponent(error)}
          </div>
        ) : null}
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
        <div className="flex flex-wrap gap-3">
          {[
            ["overview", "Overview"],
            ["financial", "Billing"],
            ["delivery", "Projects"],
            ["portal", "Portal"],
            ["notes", "Notes"],
            ["timeline", "Timeline"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="inline-flex items-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      <section id="overview" className="mt-8 grid gap-6 md:grid-cols-4">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Projects
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{projects.length}</p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Quotes
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{clientQuotes.length}</p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Invoices
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{invoices.length}</p>
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Outstanding
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">
            {formatMoney(outstandingInvoiceTotal, client.defaultCurrency)}
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Client details
          </p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
            {client.website ? <p>Website: {client.website}</p> : null}
            <p>Status: {client.status}</p>
            {client.email ? <p>Email: {client.email}</p> : null}
            {client.phone ? <p>Phone: {client.phone}</p> : null}
            {client.contactName ? <p>Primary contact: {client.contactName}</p> : null}
            {client.defaultCurrency ? <p>Currency: {client.defaultCurrency}</p> : null}
            <p>Payment terms: {client.defaultPaymentTerms} days</p>
            <p>Care plan status: {client.carePlanStatus}</p>
            <p>Created on: {formatDisplayDateTime(client.createdAt)}</p>
          </div>
          {client.notes ? (
            <div className="mt-6 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300">
              {client.notes}
            </div>
          ) : null}
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Source audit
          </p>
          {sourceAudit ? (
            <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              <p>Audit ID: {sourceAudit.auditId}</p>
              <p className="break-all">Website: {sourceAudit.normalizedUrl}</p>
              <p>Lead status: {sourceAudit.leadStatus}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                    Conversion
                  </p>
                  <p className="mt-2 text-xl font-semibold text-stone-50">
                    {sourceAudit.scores.conversion.score}
                  </p>
                </div>
                <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                    Performance
                  </p>
                  <p className="mt-2 text-xl font-semibold text-stone-50">
                    {sourceAudit.scores.performance.score}
                  </p>
                </div>
                <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
                    Visibility
                  </p>
                  <p className="mt-2 text-xl font-semibold text-stone-50">
                    {sourceAudit.scores.visibility.score}
                  </p>
                </div>
              </div>
              <Link
                href={`/admin/audits/${sourceAudit.auditId}`}
                className="inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
              >
                Open full audit detail
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-stone-300">
              No source audit is linked to this client.
            </p>
          )}
        </article>
      </section>

      <section id="delivery" className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Linked projects
          </p>
          {projects.length > 0 ? (
            <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
              {projects.map((project) => (
                <li
                  key={project.projectId}
                  className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
                >
                  <p className="font-semibold text-stone-100">{project.name}</p>
                  <p className="mt-1">
                    {project.status} | {project.packageType.replaceAll("_", " ")}
                  </p>
                  <Link
                    href={`/admin/projects/${project.projectId}`}
                    className="mt-3 inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                  >
                    Open project
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No projects are linked to this client yet.
            </p>
          )}
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Linked quotes
          </p>
          {clientQuotes.length > 0 ? (
            <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
              {clientQuotes.map((quote) => (
                <li
                  key={quote.quoteId}
                  className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
                >
                  <p className="font-semibold text-stone-100">{quote.title}</p>
                  <p className="mt-1">
                    {quote.quoteNumber} | {quote.status}
                  </p>
                  <Link
                    href={`/admin/quotes/${quote.quoteId}`}
                    className="mt-3 inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                  >
                    Open quote
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No quotes are linked to this client yet.
            </p>
          )}
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Linked invoices
          </p>
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
                    Total {formatMoney(invoice.total, invoice.currency)}
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
              No invoices are linked to this client yet.
            </p>
          )}
        </article>
      </section>

      <section id="financial" className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Care plan schedules
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
                  <p className="mt-1">
                    {formatMoney(schedule.amount, schedule.currency)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No care-plan schedules are linked to this client yet.
            </p>
          )}
        </article>
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Repeating maintenance templates
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
              No recurring maintenance templates are linked to this client yet.
            </p>
          )}
        </article>
      </section>

      <section id="portal" className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Portal access
          </p>
          <form
            action={`/api/admin/clients/${client.clientId}/portal-users`}
            method="post"
            className="mt-6 space-y-4"
          >
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Portal email</span>
              <input name="email" type="email" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Portal role</span>
              <select name="role" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                <option value="owner">Owner</option>
                <option value="member">Member</option>
              </select>
            </label>
            <p className="text-sm leading-7 text-stone-400">
              Portal customers do not have passwords. Creating access here immediately sends them a secure one-time magic link by email.
            </p>
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">
              Create Access and Send Link
            </button>
          </form>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Existing portal users
          </p>
          {portalUsers.length > 0 ? (
            <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
              {portalUsers.map((user) => (
                <li key={user.portalUserId} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <p className="font-semibold text-stone-100">{user.email}</p>
                  <p className="mt-1">{user.role} | {user.active ? "active" : "inactive"}</p>
                  {user.lastMagicLinkSentAt ? (
                    <p className="mt-1 text-stone-400">
                      Last link sent {formatDisplayDateTime(user.lastMagicLinkSentAt)}
                    </p>
                  ) : null}
                  {user.lastLoginAt ? (
                    <p className="mt-1 text-stone-400">
                      Last sign-in {formatDisplayDateTime(user.lastLoginAt)}
                    </p>
                  ) : null}
                  <p className="mt-1 text-stone-400">{formatDisplayDateTime(user.createdAt)}</p>
                  <form action={`/api/admin/portal-users/${user.portalUserId}/magic-link`} method="post" className="mt-3">
                    <button type="submit" className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8">
                      Send Fresh Magic Link
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm leading-7 text-stone-300">
              No portal users have been created for this client yet.
            </p>
          )}
        </article>
      </section>

      <section id="notes" className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div id="timeline">
          <AdminClientHistoryFeed
            clientId={client.clientId}
            type="notes"
            title="Customer notes"
            emptyMessage="No notes yet for this client."
            initialItems={notesPage.items.map((note) => ({
              id: note.id,
              title: "Customer note",
              body: note.note,
              meta: formatDisplayDateTime(note.createdAt),
            }))}
            initialHasMore={notesPage.hasMore}
            composerAction={`/api/admin/clients/${client.clientId}/notes`}
          />
        </div>

        <AdminClientHistoryFeed
          clientId={client.clientId}
          type="timeline"
          title="Timeline"
          emptyMessage="No timeline events yet for this client."
          initialItems={activityPage.items.map((entry) => ({
            id: entry.id,
            title: entry.description,
            body: `${entry.actionType} | ${entry.actor}`,
            meta: formatDisplayDateTime(entry.timestamp),
          }))}
          initialHasMore={activityPage.hasMore}
        />
      </section>
    </main>
  );
}
