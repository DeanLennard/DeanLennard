import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDisplayDate } from "@/lib/date-format";
import { formatMoney } from "@/lib/money-format";
import { requirePortalAuthentication } from "@/lib/portal-auth";
import { buildPublicQuoteUrl } from "@/lib/public-quote-links";
import { getQuoteById } from "@/lib/quotes-store";

export const metadata: Metadata = {
  title: "Portal Quote",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PortalQuotePage({
  params,
}: {
  params: Promise<{ quoteId: string }>;
}) {
  const portalUser = await requirePortalAuthentication();
  const { quoteId } = await params;
  const quote = await getQuoteById(quoteId);

  if (!quote || quote.customerId !== portalUser.clientId) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">Quote</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">{quote.title}</h1>
        <div className="mt-6 space-y-2 text-sm leading-7 text-stone-300">
          <p>Quote number: {quote.quoteNumber}</p>
          <p>Status: {quote.status}</p>
          <p>Issue date: {formatDisplayDate(quote.issueDate)}</p>
          {quote.expiryDate ? <p>Expiry date: {formatDisplayDate(quote.expiryDate)}</p> : null}
          <p>Total: {formatMoney(quote.total, quote.currency)}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={buildPublicQuoteUrl(quote.quoteId)} target="_blank" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">
            Open hosted quote
          </Link>
          {quote.pdfPath ? <Link href={quote.pdfPath} target="_blank" className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8">Download PDF</Link> : null}
        </div>
      </section>
    </main>
  );
}
