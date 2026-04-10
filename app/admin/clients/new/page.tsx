import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "New Client",
  robots: {
    index: false,
    follow: false,
  },
};

type ClientNewPageSearchParams = Promise<{
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: ClientNewPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          New client
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Add a customer manually
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Use this when a client comes in outside the website audit flow or you
          want to set them up directly.
        </p>
        <AdminNav currentPath="/admin/clients" />

        {error === "missing-business" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            Business name is required.
          </div>
        ) : null}

        <form action="/api/admin/clients" method="post" className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="businessName">
                Business name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="contactName">
                Contact name
              </label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-100" htmlFor="website">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="text"
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-100" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Create Client
            </button>
            <Link
              href="/admin/clients"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Back to Clients
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
