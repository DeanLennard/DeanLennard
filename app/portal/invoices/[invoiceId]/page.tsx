import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getInvoiceById } from "@/lib/invoices-store";
import { formatDisplayDate } from "@/lib/date-format";
import { formatMoney } from "@/lib/money-format";
import { requirePortalAuthentication } from "@/lib/portal-auth";
import { buildPublicInvoiceUrl } from "@/lib/public-invoice-links";

export const metadata: Metadata = {
  title: "Portal Invoice",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PortalInvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const portalUser = await requirePortalAuthentication();
  const { invoiceId } = await params;
  const invoice = await getInvoiceById(invoiceId);

  if (!invoice || invoice.customerId !== portalUser.clientId) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">Invoice</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">{invoice.invoiceNumber}</h1>
        <div className="mt-6 space-y-2 text-sm leading-7 text-stone-300">
          <p>Status: {invoice.status.replaceAll("_", " ")}</p>
          <p>Issue date: {formatDisplayDate(invoice.issueDate)}</p>
          <p>Due date: {formatDisplayDate(invoice.dueDate)}</p>
          <p>Total: {formatMoney(invoice.total, invoice.currency)}</p>
          <p>Balance due: {formatMoney(invoice.balanceDue, invoice.currency)}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={buildPublicInvoiceUrl(invoice.invoiceId)} target="_blank" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">
            Open hosted invoice
          </Link>
          {invoice.pdfPath ? <Link href={invoice.pdfPath} target="_blank" className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8">Download PDF</Link> : null}
        </div>
      </section>
    </main>
  );
}
