import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { DateInput } from "@/components/date-input";
import { requireAdminAuthentication } from "@/lib/admin-auth";
import { listClients } from "@/lib/clients-store";
import { formatDisplayDate } from "@/lib/date-format";
import { listProjects } from "@/lib/projects-store";
import { getTaskById } from "@/lib/tasks-store";
import { listTimeEntriesByTaskId } from "@/lib/time-entries-store";

export const metadata: Metadata = {
  title: "Edit Task",
  robots: { index: false, follow: false },
};

type EditTaskSearchParams = Promise<{ error?: string | string[] }>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditTaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ taskId: string }>;
  searchParams: EditTaskSearchParams;
}) {
  await requireAdminAuthentication();
  const { taskId } = await params;
  const [task, projects, clients, timeEntries] = await Promise.all([
    getTaskById(taskId),
    listProjects(),
    listClients(),
    listTimeEntriesByTaskId(taskId),
  ]);
  const resolvedSearchParams = await searchParams;
  const error = getSingleValue(resolvedSearchParams.error) ?? "";

  if (!task) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">Edit task</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">{task.title}</h1>
        <p className="mt-2 text-sm leading-7 text-stone-400">{task.taskKey}</p>
        <AdminNav currentPath="/admin/tasks" />

        {error === "invalid-input" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">Please check the task details and try again.</div>
        ) : null}

        {error === "invalid-time-entry" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">Please check the time entry details and try again.</div>
        ) : null}

        <form action={`/api/admin/tasks/${task.taskId}/edit`} method="post" className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Linked project</span>
              <select name="projectId" defaultValue={task.projectId || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                <option value="">No linked project</option>
                {projects.map((project) => <option key={project.projectId} value={project.projectId}>{project.name}</option>)}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Linked client</span>
              <select name="customerId" defaultValue={task.customerId || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                <option value="">No linked client</option>
                {clients.map((client) => <option key={client.clientId} value={client.clientId}>{client.businessName}</option>)}
              </select>
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Task title</span>
            <input name="title" type="text" required defaultValue={task.title} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Description</span>
            <textarea name="description" rows={4} defaultValue={task.description || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>
          <div className="grid gap-6 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Status</span>
              <select name="status" defaultValue={task.status} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                <option value="todo">To Do</option><option value="in_progress">In Progress</option><option value="review">Review</option><option value="done">Done</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Priority</span>
              <select name="priority" defaultValue={task.priority} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Estimated minutes</span>
              <input name="estimatedMinutes" type="number" min="0" step="1" defaultValue={task.estimatedMinutes?.toString() || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Due date</span>
              <DateInput name="dueDate" defaultValue={task.dueDate || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-stone-100">Scheduled date</span>
              <DateInput name="scheduledDate" defaultValue={task.scheduledDate || ""} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Labels</span>
            <input name="labels" type="text" defaultValue={task.labels.join(", ")} className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100" />
          </label>
          <label className="flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
            <input type="checkbox" name="billable" defaultChecked={task.billable} className="h-4 w-4 rounded border-[color:var(--color-border)]" />
            Billable task
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500">Save Task</button>
            <Link href="/admin/tasks" className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8">Back to Tasks</Link>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">Time tracking</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
              Log delivery time against this task so project costs and profitability
              roll up automatically.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Actual minutes</p>
              <p className="mt-2 text-2xl font-semibold text-stone-50">{task.actualMinutes}</p>
            </div>
            <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Actual hours</p>
              <p className="mt-2 text-2xl font-semibold text-stone-50">{(task.actualMinutes / 60).toFixed(2)}</p>
            </div>
            <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Internal cost</p>
              <p className="mt-2 text-2xl font-semibold text-stone-50">GBP {task.internalCostTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <form
          action={`/api/admin/tasks/${task.taskId}/time-entries`}
          method="post"
          className="mt-8 grid gap-4 lg:grid-cols-[0.8fr_0.8fr_0.8fr_0.7fr_1.4fr_auto]"
        >
          <input type="hidden" name="returnTo" value={`/admin/tasks/${task.taskId}/edit`} />
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Entry date</span>
            <DateInput
              name="entryDate"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Minutes spent</span>
            <input
              name="durationMinutes"
              type="number"
              min="1"
              step="1"
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Internal hourly rate</span>
            <input
              name="internalHourlyRate"
              type="number"
              min="0"
              step="0.01"
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            />
          </label>
          <label className="flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100">
            <input type="checkbox" name="billable" className="h-4 w-4 rounded border-[color:var(--color-border)]" />
            Billable
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-stone-100">Description</span>
            <input
              name="description"
              type="text"
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Log Time
          </button>
        </form>

        <div className="mt-8 space-y-4">
          {timeEntries.length > 0 ? (
            timeEntries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-stone-100">
                      {entry.durationMinutes} minutes on {formatDisplayDate(entry.entryDate)}
                    </p>
                    {entry.description ? (
                      <p className="mt-1 text-sm leading-7 text-stone-300">{entry.description}</p>
                    ) : null}
                  </div>
                  <div className="text-sm leading-7 text-stone-300 md:text-right">
                    <p>Rate: GBP {entry.internalHourlyRate.toFixed(2)}/hr</p>
                    <p>Cost: GBP {entry.costAmount.toFixed(2)}</p>
                    <p>{entry.billable ? "Billable" : "Non-billable"}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm leading-7 text-stone-300">
              No time entries have been logged for this task yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
