import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDisplayDate } from "@/lib/date-format";
import { formatMoney } from "@/lib/money-format";
import { verifyPublicQuoteToken } from "@/lib/public-quote-links";
import { getQuoteById } from "@/lib/quotes-store";

export const metadata: Metadata = {
  title: "Quote",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PublicQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ quoteId: string }>;
  searchParams: Promise<{ token?: string | string[]; accepted?: string | string[] }>;
}) {
  const { quoteId } = await params;
  const resolvedSearchParams = await searchParams;
  const token = Array.isArray(resolvedSearchParams.token)
    ? resolvedSearchParams.token[0]
    : resolvedSearchParams.token;
  const accepted =
    (Array.isArray(resolvedSearchParams.accepted)
      ? resolvedSearchParams.accepted[0]
      : resolvedSearchParams.accepted) === "1";

  if (!verifyPublicQuoteToken(quoteId, token)) {
    notFound();
  }

  const quote = await getQuoteById(quoteId);

  if (!quote) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-12 text-stone-100 lg:px-8">
      <section className="mx-auto w-full max-w-5xl rounded-[2rem] border border-white/10 bg-stone-900/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-400">
              Hosted quote
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              {quote.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
              Review the proposal, pricing, and scope below. When you are happy to move
              forward you can approve it here and I will mark the quote as accepted.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-7 text-stone-200">
            <p>
              <span className="font-semibold text-white">Quote:</span> {quote.quoteNumber}
            </p>
            <p>
              <span className="font-semibold text-white">Status:</span>{" "}
              {quote.status.replaceAll("_", " ")}
            </p>
            <p>
              <span className="font-semibold text-white">Issue date:</span>{" "}
              {formatDisplayDate(quote.issueDate)}
            </p>
            {quote.expiryDate ? (
              <p>
                <span className="font-semibold text-white">Expiry date:</span>{" "}
                {formatDisplayDate(quote.expiryDate)}
              </p>
            ) : null}
            <p>
              <span className="font-semibold text-white">Total:</span>{" "}
              {formatMoney(quote.total, quote.currency)}
            </p>
          </div>
        </div>

        {accepted || quote.status === "accepted" ? (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm leading-7 text-emerald-100">
            This quote has been approved and recorded.
          </div>
        ) : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Scope and terms
            </p>
            {quote.summary ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-stone-950/50 p-5 text-sm leading-7 text-stone-300">
                {quote.summary}
              </div>
            ) : null}
            {quote.scopeOfWork ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-stone-950/50 p-5 text-sm leading-7 text-stone-300">
                {quote.scopeOfWork}
              </div>
            ) : null}
            {quote.exclusions ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-stone-950/50 p-5 text-sm leading-7 text-stone-300">
                <p className="font-semibold text-white">Exclusions</p>
                <p className="mt-2 whitespace-pre-line">{quote.exclusions}</p>
              </div>
            ) : null}
            {quote.paymentTerms ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-stone-950/50 p-5 text-sm leading-7 text-stone-300">
                <p className="font-semibold text-white">Payment terms</p>
                <p className="mt-2 whitespace-pre-line">{quote.paymentTerms}</p>
              </div>
            ) : null}
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Pricing
            </p>
            <div className="mt-5 space-y-4">
              {quote.lineItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-stone-950/50 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      {item.description ? (
                        <p className="mt-2 text-sm leading-6 text-stone-400">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right text-sm leading-6 text-stone-300">
                      <p>Qty {item.quantity}</p>
                      <p>{formatMoney(item.unitPrice, quote.currency)}</p>
                      <p className="font-semibold text-white">
                        {formatMoney(item.total, quote.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-stone-950/50 p-5 text-sm leading-7 text-stone-300">
              <p>Subtotal: {formatMoney(quote.subtotal, quote.currency)}</p>
              <p>Total: {formatMoney(quote.total, quote.currency)}</p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {quote.pdfPath ? (
                <Link
                  href={quote.pdfPath}
                  target="_blank"
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Download PDF
                </Link>
              ) : null}
              {quote.status !== "accepted" ? (
                <form action={`/api/public/quotes/${quote.quoteId}/accept`} method="post">
                  <input type="hidden" name="token" value={token || ""} />
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-xl bg-amber-500 px-5 py-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
                  >
                    Approve quote
                  </button>
                </form>
              ) : null}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
