import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { formatMoney } from "@/lib/money-format";
import { listPackageTemplates } from "@/lib/package-templates-store";

export const metadata: Metadata = {
  title: "Package Templates",
  robots: {
    index: false,
    follow: false,
  },
};

type PackageTemplatesPageSearchParams = Promise<{
  saved?: string | string[];
  updated?: string | string[];
  duplicated?: string | string[];
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PackageTemplatesPage({
  searchParams,
}: {
  searchParams: PackageTemplatesPageSearchParams;
}) {
  await requireAdminAuthentication();

  const templates = await listPackageTemplates();
  const resolvedSearchParams = await searchParams;
  const saved = getSingleValue(resolvedSearchParams.saved) === "1";
  const updated = getSingleValue(resolvedSearchParams.updated) === "1";
  const duplicated = getSingleValue(resolvedSearchParams.duplicated) === "1";
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/package-templates" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Package templates
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Save repeatable delivery setups
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Build reusable packages that prefill quotes, seed project tasks, and
          create recurring maintenance work without starting from scratch each time.
        </p>
        {saved ? (
          <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
            Package template saved.
          </div>
        ) : null}
        {updated ? (
          <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
            Package template updated.
          </div>
        ) : null}
        {duplicated ? (
          <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
            Package template duplicated.
          </div>
        ) : null}
        {error === "missing-name" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            Template name is required.
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            New template
          </p>
          <form action="/api/admin/package-templates" method="post" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Template name</span>
                <input name="name" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" placeholder="Starter Website" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Default price</span>
                <input name="defaultPrice" type="number" min="0" step="0.01" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Package type</span>
                <select name="packageType" defaultValue="custom" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="starter">Starter</option>
                  <option value="lead_focused">Lead focused</option>
                  <option value="growth">Growth</option>
                  <option value="custom">Custom</option>
                  <option value="care_plan">Care plan</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Billing type</span>
                <select name="billingType" defaultValue="fixed" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                  <option value="fixed">Fixed</option>
                  <option value="recurring">Recurring</option>
                  <option value="hourly">Hourly</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-100">Currency</span>
                <input name="currency" defaultValue="GBP" className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
              </label>
            </div>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Description</span>
              <textarea name="description" rows={3} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Default notes</span>
              <textarea name="defaultNotes" rows={3} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Line items JSON</span>
              <textarea
                name="lineItemsJson"
                rows={8}
                defaultValue={`[\n  {\n    "title": "Homepage design and build",\n    "description": "Responsive design and development",\n    "quantity": 1,\n    "unitPrice": 1200\n  }\n]`}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 font-mono text-sm text-stone-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Project tasks JSON</span>
              <textarea
                name="projectTasksJson"
                rows={8}
                defaultValue={`[\n  {\n    "title": "Gather requirements",\n    "priority": "medium",\n    "estimatedMinutes": 90\n  },\n  {\n    "title": "Build pages",\n    "priority": "high",\n    "estimatedMinutes": 480\n  }\n]`}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 font-mono text-sm text-stone-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Repeating tasks JSON</span>
              <textarea
                name="repeatingTasksJson"
                rows={8}
                defaultValue={`[\n  {\n    "title": "Monthly plugin updates",\n    "priority": "medium",\n    "estimatedMinutes": 60,\n    "frequencyType": "monthly",\n    "frequencyInterval": 1\n  }\n]`}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 font-mono text-sm text-stone-100"
              />
            </label>
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">
              Save Template
            </button>
          </form>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Saved templates
            </p>
            <span className="rounded-md bg-[color:var(--color-panel-strong)] px-3 py-1 text-xs font-semibold text-stone-200">
              {templates.length}
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {templates.length > 0 ? (
              templates.map((template) => (
                <div key={template.templateId} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
                  <p className="font-semibold text-stone-100">{template.name}</p>
                  <p className="mt-1 text-sm leading-7 text-stone-300">
                    {template.packageType.replaceAll("_", " ")} | {template.billingType}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-stone-300">
                    {formatMoney(template.defaultPrice, template.currency)}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-stone-400">
                    {template.lineItems.length} quote items | {template.projectTasks.length} project tasks | {template.repeatingTasks.length} repeating tasks
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={`/admin/quotes/new?packageTemplateId=${template.templateId}`} className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8">
                      Use for Quote
                    </Link>
                    <Link href={`/admin/projects/new?packageTemplateId=${template.templateId}`} className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8">
                      Use for Project
                    </Link>
                    <Link href={`/admin/package-templates/${template.templateId}`} className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8">
                      Edit
                    </Link>
                    <form action={`/api/admin/package-templates/${template.templateId}/duplicate`} method="post">
                      <button type="submit" className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8">
                        Duplicate
                      </button>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                No package templates created yet.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
