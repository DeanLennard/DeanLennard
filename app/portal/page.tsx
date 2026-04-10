import type { Metadata } from "next";
import Link from "next/link";

import { getClientById } from "@/lib/clients-store";
import { formatDisplayDate } from "@/lib/date-format";
import { listInvoicesByClientId } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { requirePortalAuthentication } from "@/lib/portal-auth";
import { listProjectsByClientId } from "@/lib/projects-store";
import { buildPublicInvoiceUrl } from "@/lib/public-invoice-links";
import { buildPublicQuoteUrl } from "@/lib/public-quote-links";
import { toPublicUrl } from "@/lib/public-site";
import { listQuotes } from "@/lib/quotes-store";

export const metadata: Metadata = {
  title: "Client Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PortalHomePage() {
  const portalUser = await requirePortalAuthentication();
  const client = await getClientById(portalUser.clientId);
  const [invoices, projects, quotes] = await Promise.all([
    listInvoicesByClientId(portalUser.clientId),
    listProjectsByClientId(portalUser.clientId),
    listQuotes(portalUser.clientId),
  ]);
  const clientQuotes = quotes.filter((quote) => quote.customerId === portalUser.clientId);
  const openInvoices = invoices.filter((invoice) =>
    ["sent", "unpaid", "partially_paid", "overdue"].includes(invoice.status)
  );
  const activeProjects = projects.filter((project) =>
    ["planned", "active", "review", "on_hold"].includes(project.status)
  );
  const recentDocuments = [
    ...invoices
      .filter((invoice) => invoice.pdfPath)
      .slice(0, 3)
      .map((invoice) => ({
        id: invoice.invoiceId,
        title: invoice.invoiceNumber,
        subtitle: `Invoice | ${formatMoney(invoice.total, invoice.currency)}`,
        href: toPublicUrl(invoice.pdfPath!),
      })),
    ...clientQuotes
      .filter((quote) => quote.pdfPath)
      .slice(0, 3)
      .map((quote) => ({
        id: quote.quoteId,
        title: quote.quoteNumber,
        subtitle: `Quote | ${formatMoney(quote.total, quote.currency)}`,
        href: toPublicUrl(quote.pdfPath!),
      })),
  ].slice(0, 6);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Client portal
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              {client?.businessName || "Your account"}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
              View your invoices, quotes, and project progress in one secure area.
            </p>
          </div>

          <form action="/api/portal/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Sign Out
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <PortalCard label="Invoices" value={String(invoices.length)} />
        <PortalCard label="Quotes" value={String(clientQuotes.length)} />
        <PortalCard label="Projects" value={String(projects.length)} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <PortalCard label="Open invoices" value={String(openInvoices.length)} />
        <PortalCard label="Active projects" value={String(activeProjects.length)} />
        <PortalCard label="Documents" value={String(recentDocuments.length)} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr_0.9fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Invoices
          </p>
          <div className="mt-6 space-y-4">
            {invoices.length > 0 ? invoices.map((invoice) => (
              <div key={invoice.invoiceId} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                <p className="font-semibold text-stone-100">{invoice.invoiceNumber}</p>
                <p className="mt-1 text-sm leading-7 text-stone-300">
                  {invoice.status.replaceAll("_", " ")} | Due {formatDisplayDate(invoice.dueDate)}
                </p>
                <p className="mt-1 text-sm leading-7 text-stone-400">
                  {formatMoney(invoice.total, invoice.currency)}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link href={`/portal/invoices/${invoice.invoiceId}`} className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                    Details
                  </Link>
                  <Link href={buildPublicInvoiceUrl(invoice.invoiceId)} target="_blank" className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                    View online
                  </Link>
                  {invoice.pdfPath ? (
                    <Link href={toPublicUrl(invoice.pdfPath)} target="_blank" className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                      PDF
                    </Link>
                  ) : null}
                </div>
              </div>
            )) : <p className="text-sm leading-7 text-stone-300">No invoices yet.</p>}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Quotes
          </p>
          <div className="mt-6 space-y-4">
            {clientQuotes.length > 0 ? clientQuotes.map((quote) => (
              <div key={quote.quoteId} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                <p className="font-semibold text-stone-100">{quote.title}</p>
                <p className="mt-1 text-sm leading-7 text-stone-300">
                  {quote.quoteNumber} | {quote.status}
                </p>
                <p className="mt-1 text-sm leading-7 text-stone-400">
                  {formatMoney(quote.total, quote.currency)}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link href={`/portal/quotes/${quote.quoteId}`} className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                    Details
                  </Link>
                  <Link href={buildPublicQuoteUrl(quote.quoteId)} target="_blank" className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                    View online
                  </Link>
                  {quote.pdfPath ? (
                    <Link href={toPublicUrl(quote.pdfPath)} target="_blank" className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4">
                      PDF
                    </Link>
                  ) : null}
                </div>
              </div>
            )) : <p className="text-sm leading-7 text-stone-300">No quotes yet.</p>}
          </div>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Projects
          </p>
          <div className="mt-6 space-y-4">
            {projects.length > 0 ? projects.map((project) => (
              <div key={project.projectId} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                <p className="font-semibold text-stone-100">{project.name}</p>
                <p className="mt-1 text-sm leading-7 text-stone-300">
                  {project.status} | {project.packageType.replaceAll("_", " ")}
                </p>
                <p className="mt-1 text-sm leading-7 text-stone-400">
                  Target end {project.targetEndDate ? formatDisplayDate(project.targetEndDate) : "Not set"}
                </p>
              </div>
            )) : <p className="text-sm leading-7 text-stone-300">No projects yet.</p>}
          </div>
        </article>
      </section>

      <section className="mt-8">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Recent documents
          </p>
          <div className="mt-6 space-y-4">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((document) => (
                <Link
                  key={document.id}
                  href={document.href}
                  target="_blank"
                  className="block rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 transition hover:bg-white/8"
                >
                  <p className="font-semibold text-stone-100">{document.title}</p>
                  <p className="mt-1 text-sm leading-7 text-stone-300">{document.subtitle}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                No generated documents are available yet.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

function PortalCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
      <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-stone-50">{value}</p>
    </article>
  );
}
