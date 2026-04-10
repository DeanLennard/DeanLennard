import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { QuoteLineItemsEditor } from "@/components/quote-line-items-editor";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listClients } from "@/lib/clients-store";
import { getInvoiceContext } from "@/lib/invoices-store";
import { listProjects } from "@/lib/projects-store";

export const metadata: Metadata = {
  title: "New Invoice",
  robots: {
    index: false,
    follow: false,
  },
};

type NewInvoiceSearchParams = Promise<{
  customerId?: string | string[];
  projectId?: string | string[];
  quoteId?: string | string[];
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: NewInvoiceSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const customerId = getSingleValue(resolvedSearchParams.customerId)?.trim() ?? "";
  const projectId = getSingleValue(resolvedSearchParams.projectId)?.trim() ?? "";
  const quoteId = getSingleValue(resolvedSearchParams.quoteId)?.trim() ?? "";
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  const [{ customer, project, quote, settings }, clients, projects] = await Promise.all([
    getInvoiceContext({
      customerId: customerId || undefined,
      projectId: projectId || undefined,
      quoteId: quoteId || undefined,
    }),
    listClients(),
    listProjects(),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          New invoice
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Create an invoice
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Build an invoice manually or prefill it from a quote or project so
          revenue and payment tracking stay tied to the delivery work.
        </p>
        <AdminNav currentPath="/admin/invoices" />

        {error === "missing-customer" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            A client is required before an invoice can be created.
          </div>
        ) : null}

        <form action="/api/admin/invoices" method="post" className="mt-8 space-y-8">
          <input type="hidden" name="quoteId" value={quoteId} />

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Client</span>
              <select
                name="customerId"
                defaultValue={customer?.clientId || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="">Select client</option>
                {clients.map((clientOption) => (
                  <option key={clientOption.clientId} value={clientOption.clientId}>
                    {clientOption.businessName}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Project</span>
              <select
                name="projectId"
                defaultValue={project?.projectId || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="">No linked project</option>
                {projects.map((projectOption) => (
                  <option key={projectOption.projectId} value={projectOption.projectId}>
                    {projectOption.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Due date</span>
              <DateInput
                name="dueDate"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Currency</span>
              <input
                name="currency"
                defaultValue={customer?.defaultCurrency || settings.defaultCurrency}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Tax rate (%)</span>
              <input
                name="taxRate"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Payment method</span>
              <select
                name="paymentMethod"
                defaultValue="bank_transfer"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="bank_transfer">Bank transfer</option>
                <option value="manual">Manual</option>
                <option value="stripe">Stripe</option>
                <option value="gocardless">GoCardless</option>
              </select>
            </label>
          </div>

          <QuoteLineItemsEditor
            initialItems={
              quote
                ? quote.lineItems.map((item) => ({
                    title: item.title,
                    description: item.description || "",
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                  }))
                : undefined
            }
          />

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Invoice notes</span>
              <textarea
                name="notes"
                rows={4}
                defaultValue={quote?.notes || settings.invoiceDefaultNotes}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Footer notes</span>
              <textarea
                name="footerNotes"
                rows={4}
                defaultValue={settings.invoiceDefaultFooterText}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Create Invoice
            </button>
            <Link
              href="/admin/invoices"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Back to Invoices
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
