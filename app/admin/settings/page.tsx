import type { Metadata } from "next";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminRole } from "@/lib/admin-auth";
import { getAppSettings } from "@/lib/settings-store";

export const metadata: Metadata = {
  title: "Settings Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type SettingsPageSearchParams = Promise<{
  saved?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: SettingsPageSearchParams;
}) {
  await requireAdminRole(["admin"]);

  const settings = await getAppSettings();
  const resolvedSearchParams = await searchParams;
  const saved = getSingleValue(resolvedSearchParams.saved) === "1";

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/settings" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Settings
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Business and billing settings
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Keep the company, numbering, bank details, payment provider, and
          internal costing defaults in one place so quotes and invoices stay
          consistent.
        </p>
        {saved ? (
          <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
            Settings saved.
          </div>
        ) : null}

        <form action="/api/admin/settings" method="post" className="mt-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-stone-100">Business settings</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Business name</span>
                <input name="businessName" defaultValue={settings.businessName} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Company number</span>
                <input name="companyNumber" defaultValue={settings.companyNumber} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Registered address</span>
                <textarea name="registeredAddress" rows={4} defaultValue={settings.registeredAddress} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <div className="space-y-6">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-stone-100">VAT number</span>
                  <input name="vatNumber" defaultValue={settings.vatNumber} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
                </label>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-stone-100">Default currency</span>
                    <input name="defaultCurrency" defaultValue={settings.defaultCurrency} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-stone-100">Default payment terms (days)</span>
                    <input name="defaultPaymentTerms" type="number" min="1" defaultValue={settings.defaultPaymentTerms} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-stone-100">Invoice and quote numbering</h2>
            <div className="grid gap-6 md:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Invoice prefix</span>
                <input name="invoicePrefix" defaultValue={settings.invoicePrefix} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Next invoice number</span>
                <input name="nextInvoiceNumber" type="number" min="1" defaultValue={settings.nextInvoiceNumber} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Quote prefix</span>
                <input name="quotePrefix" defaultValue={settings.quotePrefix} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Next quote number</span>
                <input name="nextQuoteNumber" type="number" min="1" defaultValue={settings.nextQuoteNumber} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Default invoice notes</span>
                <textarea name="invoiceDefaultNotes" rows={4} defaultValue={settings.invoiceDefaultNotes} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Default invoice footer text</span>
                <textarea name="invoiceDefaultFooterText" rows={4} defaultValue={settings.invoiceDefaultFooterText} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-stone-100">Bank transfer details</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Account name</span>
                <input name="bankAccountName" defaultValue={settings.bankAccountName} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Sort code</span>
                <input name="bankSortCode" defaultValue={settings.bankSortCode} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Account number</span>
                <input name="bankAccountNumber" defaultValue={settings.bankAccountNumber} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">IBAN</span>
                <input name="bankIban" defaultValue={settings.bankIban} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">BIC</span>
                <input name="bankBic" defaultValue={settings.bankBic} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Default internal hourly cost</span>
                <input name="defaultInternalHourlyCost" type="number" min="0" step="0.01" defaultValue={settings.defaultInternalHourlyCost} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Payment reference instructions</span>
                <textarea name="bankPaymentReferenceInstructions" rows={4} defaultValue={settings.bankPaymentReferenceInstructions} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Default project margin target (%)</span>
                <input name="defaultProjectMarginTarget" type="number" min="0" step="0.1" defaultValue={settings.defaultProjectMarginTarget} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-stone-100">Payment providers</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Stripe public key</span>
                <input name="stripePublicKey" defaultValue={settings.stripePublicKey} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Stripe secret key</span>
                <input name="stripeSecretKey" defaultValue={settings.stripeSecretKey} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Stripe webhook secret</span>
                <input name="stripeWebhookSecret" defaultValue={settings.stripeWebhookSecret} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">GoCardless access token</span>
                <input name="gocardlessAccessToken" defaultValue={settings.gocardlessAccessToken} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">GoCardless webhook secret</span>
                <input name="gocardlessWebhookSecret" defaultValue={settings.gocardlessWebhookSecret} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Resend API key</span>
                <input name="resendApiKey" defaultValue={settings.resendApiKey} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Resend from email</span>
                <input name="resendFromEmail" defaultValue={settings.resendFromEmail} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Resend reply-to email</span>
                <input name="resendReplyToEmail" defaultValue={settings.resendReplyToEmail} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Automation secret</span>
                <input name="automationSecret" defaultValue={settings.automationSecret} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
              </label>
              <div className="grid gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                <label className="inline-flex items-center gap-3 text-sm text-stone-200">
                  <input type="checkbox" name="enableStripe" defaultChecked={settings.enableStripe} className="h-4 w-4 rounded border-[color:var(--color-border)] bg-transparent text-amber-500 focus:ring-amber-400" />
                  Enable Stripe
                </label>
                <label className="inline-flex items-center gap-3 text-sm text-stone-200">
                  <input type="checkbox" name="enableGoCardless" defaultChecked={settings.enableGoCardless} className="h-4 w-4 rounded border-[color:var(--color-border)] bg-transparent text-amber-500 focus:ring-amber-400" />
                  Enable GoCardless
                </label>
                <label className="inline-flex items-center gap-3 text-sm text-stone-200">
                  <input type="checkbox" name="enableBankTransfer" defaultChecked={settings.enableBankTransfer} className="h-4 w-4 rounded border-[color:var(--color-border)] bg-transparent text-amber-500 focus:ring-amber-400" />
                  Enable bank transfer
                </label>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-4">
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">
              Save Settings
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
