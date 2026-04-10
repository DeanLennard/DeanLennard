import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { QuoteLineItemsEditor } from "@/components/quote-line-items-editor";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getQuoteContext, getQuoteById } from "@/lib/quotes-store";

export const metadata: Metadata = {
  title: "Edit Quote",
  robots: { index: false, follow: false },
};

type EditQuoteSearchParams = Promise<{ error?: string | string[] }>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ quoteId: string }>;
  searchParams: EditQuoteSearchParams;
}) {
  await requireAdminAuthentication();
  const { quoteId } = await params;
  const quote = await getQuoteById(quoteId);
  const resolvedSearchParams = await searchParams;
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  if (!quote) notFound();

  const { customer, lead, allClients } = await getQuoteContext({
    customerId: quote.customerId,
    leadId: quote.leadId,
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/quotes" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">Edit quote</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">{quote.title}</h1>
        {error === "missing-title" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">Quote title is required.</div>
        ) : null}

        <form action={`/api/admin/quotes/${quote.quoteId}/edit`} method="post" className="mt-8 space-y-8">
          <input type="hidden" name="leadId" value={quote.leadId || ""} />
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Linked client</span>
              <select name="customerId" defaultValue={customer?.clientId || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                <option value="">No linked client yet</option>
                {allClients.map((clientOption) => (
                  <option key={clientOption.clientId} value={clientOption.clientId}>{clientOption.businessName}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Expiry date</span>
              <DateInput name="expiryDate" defaultValue={quote.expiryDate || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Quote title</span>
            <input name="title" type="text" required defaultValue={quote.title} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Summary</span>
            <textarea name="summary" rows={4} defaultValue={quote.summary || (lead ? `Created from website audit lead ${lead.auditId}.` : "")} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Scope of work</span>
            <textarea name="scopeOfWork" rows={6} defaultValue={quote.scopeOfWork || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Exclusions</span>
            <textarea name="exclusions" rows={4} defaultValue={quote.exclusions || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Payment terms</span>
            <textarea name="paymentTerms" rows={4} defaultValue={quote.paymentTerms || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>
          <QuoteLineItemsEditor initialItems={quote.lineItems} />
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Internal notes</span>
            <textarea name="notes" rows={4} defaultValue={quote.notes || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
              <input
                type="checkbox"
                name="autoCreateProjectOnAcceptance"
                defaultChecked={quote.autoCreateProjectOnAcceptance ?? true}
                className="h-4 w-4 rounded border-[color:var(--color-border)]"
              />
              Auto-create project when quote is approved
            </label>
            <label className="flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
              <input
                type="checkbox"
                name="autoCreateInvoiceOnAcceptance"
                defaultChecked={quote.autoCreateInvoiceOnAcceptance ?? false}
                className="h-4 w-4 rounded border-[color:var(--color-border)]"
              />
              Auto-create initial invoice when quote is approved
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">Save Quote</button>
            <Link href={`/admin/quotes/${quote.quoteId}`} className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8">Cancel</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
