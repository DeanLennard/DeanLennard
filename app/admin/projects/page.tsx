import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { getClientById } from "@/lib/clients-store";
import { listProjects } from "@/lib/projects-store";

export const metadata: Metadata = {
  title: "Projects Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type ProjectsPageSearchParams = Promise<{
  q?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: ProjectsPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const query = getSingleValue(resolvedSearchParams.q)?.trim() ?? "";
  const projects = await listProjects(query);

  const projectsWithClients = await Promise.all(
    projects.map(async (project) => ({
      project,
      client: await getClientById(project.customerId),
    }))
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/projects" />
      </section>

      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              Projects
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
              Track delivery work linked back to clients, quotes, and original lead
              context.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              New Project
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
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <div className="flex flex-col gap-4">
          <form
            action="/admin/projects"
            method="get"
            className="flex w-full gap-3 lg:max-w-xl"
          >
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by project ID, name, client, quote, or lead"
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
        {projectsWithClients.length > 0 ? (
          projectsWithClients.map(({ project, client }) => (
            <article
              key={project.projectId}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
                      Project
                    </p>
                    <p className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-3 py-1 text-sm text-stone-200">
                      {project.projectId}
                    </p>
                    <span className="rounded-md bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                      {project.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-stone-50">
                    {project.name}
                  </h2>
                  {client ? (
                    <p className="text-sm leading-7 text-stone-300">
                      Client: {client.businessName}
                    </p>
                  ) : null}
                  <p className="text-sm leading-7 text-stone-300">
                    Package: {project.packageType.replaceAll("_", " ")}
                  </p>
                  <p className="text-sm leading-7 text-stone-400">
                    Estimated revenue: GBP {project.estimatedRevenue.toFixed(2)}
                  </p>
                </div>

                <Link
                  href={`/admin/projects/${project.projectId}`}
                  className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
                >
                  View Project
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-sm leading-7 text-stone-300">
            No projects matched the current search.
          </div>
        )}
      </section>
    </main>
  );
}
