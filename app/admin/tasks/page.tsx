import type { Metadata } from "next";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { TasksKanbanBoard } from "@/components/tasks-kanban-board";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listClients } from "@/lib/clients-store";
import { listProjects } from "@/lib/projects-store";
import { type TaskPriority, listTasks } from "@/lib/tasks-store";

export const metadata: Metadata = {
  title: "Tasks Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type TasksPageSearchParams = Promise<{
  q?: string | string[];
  projectId?: string | string[];
  priority?: string | string[];
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const priorityOptions: TaskPriority[] = ["low", "medium", "high", "urgent"];

export default async function TasksPage({
  searchParams,
}: {
  searchParams: TasksPageSearchParams;
}) {
  await requireAdminAuthentication();

  const resolvedSearchParams = await searchParams;
  const query = getSingleValue(resolvedSearchParams.q)?.trim() ?? "";
  const projectId = getSingleValue(resolvedSearchParams.projectId)?.trim() ?? "";
  const priority = getSingleValue(resolvedSearchParams.priority)?.trim() ?? "";
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  const [projects, tasks, clients] = await Promise.all([
    listProjects(),
    listTasks({
      search: query || undefined,
      projectId: projectId || undefined,
      priority: (priority || "") as TaskPriority | "",
    }),
    listClients(),
  ]);

  return (
    <main className="mx-auto w-full max-w-[1500px] px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/tasks" />
      </section>

      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              Global task board
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
              One Kanban view across all projects so you can see active work,
              bottlenecks, and overdue items in a single place.
            </p>
          </div>

          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Sign Out
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">

        {error === "missing-title" ? (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            Task title is required.
          </div>
        ) : null}

        {error === "invalid-status" ? (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            That task status was not recognised.
          </div>
        ) : null}

        <form action="/api/admin/tasks" method="post" className={`${error ? "mt-6" : ""} space-y-6`}>
          <input type="hidden" name="returnTo" value="/admin/tasks" />
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1.1fr_0.7fr_0.8fr_0.8fr_0.8fr]">
            <input
              name="title"
              type="text"
              placeholder="Quick add task title"
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
            <select
              name="projectId"
              defaultValue={projectId}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <option value="">No linked project</option>
              {projects.map((project) => (
                <option key={project.projectId} value={project.projectId}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              name="priority"
              defaultValue="medium"
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              name="status"
              defaultValue="todo"
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            <DateInput
              name="dueDate"
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Add Task
            </button>
          </div>
        </form>

        <form
          action="/admin/tasks"
          method="get"
          className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr_0.8fr_0.6fr]"
        >
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search tasks, projects, or task IDs"
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          />
          <select
            name="projectId"
            defaultValue={projectId}
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.projectId}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            name="priority"
            defaultValue={priority}
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <option value="">All priorities</option>
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Filter
          </button>
        </form>
      </section>

      <section className="mt-8">
        <TasksKanbanBoard
          tasks={tasks}
          projects={projects.map((project) => ({
            projectId: project.projectId,
            name: project.name,
            customerId: project.customerId,
          }))}
          defaultHourlyRates={Object.fromEntries(
            clients.map((client) => [
              client.clientId,
              client.defaultHourlyInternalCost ?? 0,
            ])
          )}
        />
      </section>
    </main>
  );
}
