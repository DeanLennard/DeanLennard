import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { QuoteLineItemsEditor } from "@/components/quote-line-items-editor";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listClients } from "@/lib/clients-store";
import { getInvoiceById } from "@/lib/invoices-store";
import { listProjects } from "@/lib/projects-store";

export const metadata: Metadata = {
  title: "Edit Invoice",
  robots: {
    index: false,
    follow: false,
  },
};

type EditInvoiceSearchParams = Promise<{
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ invoiceId: string }>;
  searchParams: EditInvoiceSearchParams;
}) {
  await requireAdminAuthentication();

  const { invoiceId } = await params;
  const resolvedSearchParams = await searchParams;
  const error = getSingleValue(resolvedSearchParams.error) ?? "";
  const invoice = await getInvoiceById(invoiceId);

  if (!invoice) {
    notFound();
  }

  const [clients, projects] = await Promise.all([listClients(), listProjects()]);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/invoices" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Edit invoice
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          {invoice.invoiceNumber}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-stone-300">
          Update invoice details, line items, totals, and payment settings. Saving will
          recalculate the invoice and clear any previously generated PDF or hosted payment
          links so they can be recreated with the latest values.
        </p>
        {error === "missing-customer" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            A client is required before an invoice can be saved.
          </div>
        ) : null}

        <form
          action={`/api/admin/invoices/${invoice.invoiceId}/edit`}
          method="post"
          className="mt-8 space-y-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Client</span>
              <select
                name="customerId"
                defaultValue={invoice.customerId}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
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
              <select
                name="projectId"
                defaultValue={invoice.projectId || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="">No linked project</option>
                {projects.map((project) => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.name}
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
                defaultValue={invoice.dueDate}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Currency</span>
              <input
                name="currency"
                defaultValue={invoice.currency}
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
                defaultValue={invoice.taxRate.toFixed(2)}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Payment method</span>
              <select
                name="paymentMethod"
                defaultValue={invoice.paymentMethod}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="bank_transfer">Bank transfer</option>
                <option value="manual">Manual</option>
                <option value="stripe">Stripe</option>
                <option value="gocardless">GoCardless</option>
              </select>
            </label>
          </div>

          <QuoteLineItemsEditor initialItems={invoice.lineItems} />

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Invoice notes</span>
              <textarea
                name="notes"
                rows={4}
                defaultValue={invoice.notes || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Footer notes</span>
              <textarea
                name="footerNotes"
                rows={4}
                defaultValue={invoice.footerNotes || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Save Invoice
            </button>
            <Link
              href={`/admin/invoices/${invoice.invoiceId}`}
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
