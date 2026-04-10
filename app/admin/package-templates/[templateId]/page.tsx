import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getPackageTemplateById } from "@/lib/package-templates-store";

export const metadata: Metadata = {
  title: "Edit Package Template",
  robots: {
    index: false,
    follow: false,
  },
};

function stringifyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditPackageTemplatePage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  await requireAdminAuthentication();

  const { templateId } = await params;
  const template = await getPackageTemplateById(templateId);
  const resolvedSearchParams = await searchParams;
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  if (!template) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/package-templates" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Edit package template
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          {template.name}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Update the reusable package, pricing, seeded project tasks, and repeating
          maintenance defaults in one place.
        </p>
        {error === "missing-name" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            Template name is required.
          </div>
        ) : null}

        <form
          action={`/api/admin/package-templates/${template.templateId}`}
          method="post"
          className="mt-8 space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Template name</span>
              <input
                name="name"
                defaultValue={template.name}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Default price</span>
              <input
                name="defaultPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={String(template.defaultPrice)}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Package type</span>
              <select
                name="packageType"
                defaultValue={template.packageType}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              >
                <option value="starter">Starter</option>
                <option value="lead_focused">Lead focused</option>
                <option value="growth">Growth</option>
                <option value="custom">Custom</option>
                <option value="care_plan">Care plan</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Billing type</span>
              <select
                name="billingType"
                defaultValue={template.billingType}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              >
                <option value="fixed">Fixed</option>
                <option value="recurring">Recurring</option>
                <option value="hourly">Hourly</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Currency</span>
              <input
                name="currency"
                defaultValue={template.currency}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              />
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Description</span>
            <textarea
              name="description"
              rows={3}
              defaultValue={template.description || ""}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Default notes</span>
            <textarea
              name="defaultNotes"
              rows={3}
              defaultValue={template.defaultNotes || ""}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Line items JSON</span>
            <textarea
              name="lineItemsJson"
              rows={8}
              defaultValue={stringifyJson(template.lineItems)}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 font-mono text-sm text-stone-100"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Project tasks JSON</span>
            <textarea
              name="projectTasksJson"
              rows={8}
              defaultValue={stringifyJson(template.projectTasks)}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 font-mono text-sm text-stone-100"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Repeating tasks JSON</span>
            <textarea
              name="repeatingTasksJson"
              rows={8}
              defaultValue={stringifyJson(template.repeatingTasks)}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 font-mono text-sm text-stone-100"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Save Template
            </button>
            <Link
              href="/admin/package-templates"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Back to Templates
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
