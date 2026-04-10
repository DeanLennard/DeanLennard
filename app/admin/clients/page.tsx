import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listClients } from "@/lib/clients-store";
import { formatDisplayDateTime } from "@/lib/date-format";

export const metadata: Metadata = {
  title: "Client Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminClientsPageSearchParams = Promise<{
  q?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: AdminClientsPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const query = getSingleValue(resolvedSearchParams.q)?.trim() ?? "";
  const clients = await listClients(query);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              Clients
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
              Review converted clients linked back to their originating audit.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/clients/new"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Add Client
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <AdminNav currentPath="/admin/clients" />
          </div>

          <form
            action="/admin/clients"
            method="get"
            className="flex w-full gap-3 lg:max-w-xl"
          >
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by client ID, business, website, or email"
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        {clients.length > 0 ? (
          clients.map((client) => (
            <article
              key={client.clientId}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
                      Client
                    </p>
                    <p className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-3 py-1 text-sm text-stone-200">
                      {client.clientId}
                    </p>
                  </div>
                  <h2 className="text-2xl font-semibold text-stone-50">
                    {client.businessName}
                  </h2>
                  <p className="text-sm leading-7 text-stone-300">
                    Status: {client.status}
                  </p>
                  {client.website ? (
                    <p className="break-all text-sm leading-7 text-stone-300">
                      {client.website}
                    </p>
                  ) : null}
                  <p className="text-sm leading-7 text-stone-400">
                    Created on {formatDisplayDateTime(client.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/admin/clients/${client.clientId}`}
                    className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
                  >
                    View Client Detail
                  </Link>
                  <Link
                    href={`/admin/quotes/new?customerId=${client.clientId}`}
                    className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                  >
                    New Quote
                  </Link>
                  <Link
                    href={`/admin/projects/new?customerId=${client.clientId}`}
                    className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
                  >
                    New Project
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-sm leading-7 text-stone-300">
            No clients matched the current search.
          </div>
        )}
      </section>
    </main>
  );
}
