import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listTaskTemplates } from "@/lib/task-templates-store";

export const metadata: Metadata = {
  title: "Task Templates",
  robots: {
    index: false,
    follow: false,
  },
};

type TaskTemplatesPageSearchParams = Promise<{
  saved?: string | string[];
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TaskTemplatesPage({
  searchParams,
}: {
  searchParams: TaskTemplatesPageSearchParams;
}) {
  await requireAdminAuthentication();

  const templates = await listTaskTemplates();
  const resolvedSearchParams = await searchParams;
  const saved = getSingleValue(resolvedSearchParams.saved) === "1";
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/task-templates" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Task templates
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Save reusable delivery task sets
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Build reusable task sets you can apply to new projects so repeatable delivery
          work starts with a structured checklist instead of a blank board.
        </p>
        {saved ? (
          <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
            Task template saved.
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
            New task template
          </p>
          <form action="/api/admin/task-templates" method="post" className="mt-6 space-y-4">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Template name</span>
              <input
                name="name"
                placeholder="Starter Website Task Set"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Description</span>
              <textarea
                name="description"
                rows={3}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Tasks JSON</span>
              <textarea
                name="tasksJson"
                rows={10}
                defaultValue={`[\n  {\n    "title": "Gather requirements",\n    "description": "Collect goals, pages, content, and assets.",\n    "priority": "medium",\n    "estimatedMinutes": 90,\n    "labels": ["Discovery"]\n  },\n  {\n    "title": "Build homepage",\n    "priority": "high",\n    "estimatedMinutes": 240,\n    "labels": ["Build"]\n  }\n]`}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 font-mono text-sm text-stone-100"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Save Task Template
            </button>
          </form>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Saved task templates
            </p>
            <span className="rounded-md bg-[color:var(--color-panel-strong)] px-3 py-1 text-xs font-semibold text-stone-200">
              {templates.length}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {templates.length > 0 ? (
              templates.map((template) => (
                <div
                  key={template.templateId}
                  className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
                >
                  <p className="font-semibold text-stone-100">{template.name}</p>
                  {template.description ? (
                    <p className="mt-1 text-sm leading-7 text-stone-300">
                      {template.description}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm leading-7 text-stone-400">
                    {template.tasks.length} tasks
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/projects/new?taskTemplateId=${template.templateId}`}
                      className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8"
                    >
                      Use for Project
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-stone-300">
                No task templates created yet.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
