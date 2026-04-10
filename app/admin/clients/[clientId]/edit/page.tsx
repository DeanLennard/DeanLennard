import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getClientById } from "@/lib/clients-store";

export const metadata: Metadata = {
  title: "Edit Client",
  robots: {
    index: false,
    follow: false,
  },
};

type EditClientSearchParams = Promise<{
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string }>;
  searchParams: EditClientSearchParams;
}) {
  await requireAdminAuthentication();

  const { clientId } = await params;
  const client = await getClientById(clientId);
  const resolvedSearchParams = await searchParams;
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  if (!client) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Edit client
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          {client.businessName}
        </h1>
        <AdminNav currentPath="/admin/clients" />

        {error === "invalid-input" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            Please check the client details and try again.
          </div>
        ) : null}

        <form
          action={`/api/admin/clients/${client.clientId}/edit`}
          method="post"
          className="mt-8 space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="businessName">
                Business name
              </label>
              <input id="businessName" name="businessName" type="text" required defaultValue={client.businessName} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-100" htmlFor="status">
                Status
              </label>
              <select id="status" name="status" defaultValue={client.status} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Contact name</span>
              <input name="contactName" type="text" defaultValue={client.contactName || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Email</span>
              <input name="email" type="email" defaultValue={client.email || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Phone</span>
              <input name="phone" type="text" defaultValue={client.phone || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Website</span>
              <input name="website" type="text" defaultValue={client.website || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Company number</span>
              <input name="companyNumber" type="text" defaultValue={client.companyNumber || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">VAT number</span>
              <input name="vatNumber" type="text" defaultValue={client.vatNumber || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Address</span>
            <textarea name="address" rows={3} defaultValue={client.address || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Billing address</span>
            <textarea name="billingAddress" rows={3} defaultValue={client.billingAddress || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Acquisition source</span>
              <input name="acquisitionSource" type="text" defaultValue={client.acquisitionSource || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Tags</span>
              <input name="tags" type="text" defaultValue={client.tags.join(", ")} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Default currency</span>
              <input name="defaultCurrency" type="text" defaultValue={client.defaultCurrency} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Default payment terms</span>
              <input name="defaultPaymentTerms" type="number" min="0" step="1" defaultValue={String(client.defaultPaymentTerms)} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Default internal hourly cost</span>
              <input name="defaultHourlyInternalCost" type="number" min="0" step="0.01" defaultValue={client.defaultHourlyInternalCost?.toString() || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Stripe customer ID</span>
              <input name="stripeCustomerId" type="text" defaultValue={client.stripeCustomerId || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">GoCardless customer ID</span>
              <input name="gocardlessCustomerId" type="text" defaultValue={client.gocardlessCustomerId || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">GoCardless mandate ID</span>
              <input name="gocardlessMandateId" type="text" defaultValue={client.gocardlessMandateId || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-100" htmlFor="carePlanStatus">
              Care plan status
            </label>
            <select id="carePlanStatus" name="carePlanStatus" defaultValue={client.carePlanStatus} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
              <option value="none">None</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Internal notes</span>
            <textarea name="notes" rows={5} defaultValue={client.notes || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">Save Client</button>
            <Link href={`/admin/clients/${client.clientId}`} className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8">Cancel</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
