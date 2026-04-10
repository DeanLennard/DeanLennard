import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { QuoteLineItemsEditor } from "@/components/quote-line-items-editor";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getPackageTemplateById } from "@/lib/package-templates-store";
import { getQuoteContext } from "@/lib/quotes-store";

export const metadata: Metadata = {
  title: "New Quote",
  robots: {
    index: false,
    follow: false,
  },
};

type NewQuotePageSearchParams = Promise<{
  customerId?: string | string[];
  leadId?: string | string[];
  packageTemplateId?: string | string[];
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: NewQuotePageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const customerId = getSingleValue(resolvedSearchParams.customerId)?.trim() ?? "";
  const leadId = getSingleValue(resolvedSearchParams.leadId)?.trim() ?? "";
  const packageTemplateId =
    getSingleValue(resolvedSearchParams.packageTemplateId)?.trim() ?? "";
  const error = getSingleValue(resolvedSearchParams.error) ?? "";
  const [{ customer, lead, allClients }, packageTemplate] = await Promise.all([
    getQuoteContext({
      customerId: customerId || undefined,
      leadId: leadId || undefined,
    }),
    packageTemplateId ? getPackageTemplateById(packageTemplateId) : Promise.resolve(null),
  ]);

  const defaultTitle =
    packageTemplate?.name
      ? packageTemplate.name
      : customer?.businessName
      ? `Proposal for ${customer.businessName}`
      : lead?.businessName
        ? `Proposal for ${lead.businessName}`
        : "";

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          New quote
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Create a proposal
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Build a draft quote manually or prefill it from a lead or client before
          moving into paid project work.
        </p>
        <AdminNav currentPath="/admin/quotes" />

        {error === "missing-title" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            Quote title is required.
          </div>
        ) : null}
        {packageTemplate ? (
          <div className="mt-6 rounded-md border border-sky-500/30 bg-sky-500/10 p-4 text-sm leading-7 text-sky-100">
            Using package template: {packageTemplate.name}
          </div>
        ) : null}

        <form action="/api/admin/quotes" method="post" className="mt-8 space-y-8">
          <input type="hidden" name="leadId" value={leadId} />
          <input type="hidden" name="packageTemplateId" value={packageTemplateId} />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="customerId">
                Client
              </label>
              <select
                id="customerId"
                name="customerId"
                defaultValue={customer?.clientId || ""}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="">No linked client yet</option>
                {allClients.map((clientOption) => (
                  <option key={clientOption.clientId} value={clientOption.clientId}>
                    {clientOption.businessName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="expiryDate">
                Expiry date
              </label>
              <DateInput
                id="expiryDate"
                name="expiryDate"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-100" htmlFor="title">
              Quote title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={defaultTitle}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="summary">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={4}
                defaultValue={
                  packageTemplate?.description ||
                  (lead
                    ? `Created from website audit lead ${lead.auditId}.`
                    : "")
                }
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="paymentTerms">
                Payment terms
              </label>
              <textarea
                id="paymentTerms"
                name="paymentTerms"
                rows={4}
                defaultValue={
                  customer
                    ? `Payment due within ${customer.defaultPaymentTerms} days.`
                    : "Payment due within 14 days."
                }
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-100" htmlFor="scopeOfWork">
              Scope of work
            </label>
            <textarea
              id="scopeOfWork"
              name="scopeOfWork"
              rows={6}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-100" htmlFor="exclusions">
              Exclusions
            </label>
            <textarea
              id="exclusions"
              name="exclusions"
              rows={4}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <QuoteLineItemsEditor
            initialItems={
              packageTemplate
                ? packageTemplate.lineItems.map((item) => ({
                    title: item.title,
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                  }))
                : undefined
            }
          />

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-100" htmlFor="notes">
              Internal notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              defaultValue={packageTemplate?.defaultNotes || ""}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Create Quote
            </button>
            <Link
              href="/admin/quotes"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Back to Quotes
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
