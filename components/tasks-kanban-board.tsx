"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatDisplayDate } from "@/lib/date-format";
import type { TaskRecord, TaskStatus } from "@/lib/tasks-store";

type ProjectOption = {
  projectId: string;
  name: string;
  customerId?: string;
};

type TasksKanbanBoardProps = {
  tasks: TaskRecord[];
  projects: ProjectOption[];
  defaultHourlyRates: Record<string, number>;
};

const columns: Array<{ key: TaskStatus; label: string }> = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];

function isOverdue(task: TaskRecord) {
  if (!task.dueDate || task.status === "done") {
    return false;
  }

  const dueDate = new Date(`${task.dueDate}T23:59:59`);
  return dueDate.getTime() < Date.now();
}

function formatPriority(priority: TaskRecord["priority"]) {
  switch (priority) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    case "urgent":
      return "Urgent";
    default:
      return priority;
  }
}

export function TasksKanbanBoard({
  tasks,
  projects,
  defaultHourlyRates,
}: TasksKanbanBoardProps) {
  const [boardTasks, setBoardTasks] = useState(
    [...tasks].sort((left, right) => left.sortOrder - right.sortOrder)
  );
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropStatus, setDropStatus] = useState<TaskStatus | null>(null);
  const [dropTaskId, setDropTaskId] = useState<string | null>(null);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewPrompt, setReviewPrompt] = useState<{
    taskId: string;
    nextStatus: TaskStatus;
    beforeTaskId?: string | null;
    hours: string;
    minutes: string;
  } | null>(null);
  const [reviewPromptError, setReviewPromptError] = useState("");

  const projectMap = useMemo(
    () => new Map(projects.map((project) => [project.projectId, project])),
    [projects]
  );

  const tasksByStatus = useMemo(
    () =>
      new Map<TaskStatus, TaskRecord[]>(
        columns.map((column) => [
          column.key,
          boardTasks
            .filter((task) => task.status === column.key)
            .sort((left, right) => left.sortOrder - right.sortOrder),
        ])
      ),
    [boardTasks]
  );

  function buildReorderedTasks(
    currentTasks: TaskRecord[],
    taskId: string,
    nextStatus: TaskStatus,
    beforeTaskId?: string | null
  ) {
    const movingTask = currentTasks.find((task) => task.taskId === taskId);

    if (!movingTask) {
      return {
        nextTasks: currentTasks,
        destinationIds: [] as string[],
        sourceIds: [] as string[],
        previousStatus: nextStatus,
      };
    }

    const previousStatus = movingTask.status;
    const remainingTasks = currentTasks.filter((task) => task.taskId !== taskId);

    const destinationTasks = remainingTasks
      .filter((task) => task.status === nextStatus)
      .sort((left, right) => left.sortOrder - right.sortOrder);

    const insertionIndex =
      beforeTaskId
        ? destinationTasks.findIndex((task) => task.taskId === beforeTaskId)
        : -1;

    const nextDestinationTasks = [...destinationTasks];
    const reorderedTask = { ...movingTask, status: nextStatus };

    if (insertionIndex >= 0) {
      nextDestinationTasks.splice(insertionIndex, 0, reorderedTask);
    } else {
      nextDestinationTasks.push(reorderedTask);
    }

    const sourceIds = remainingTasks
      .filter((task) => task.status === previousStatus)
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((task) => task.taskId);

    const destinationIds = nextDestinationTasks.map((task) => task.taskId);

    const nextTasks = remainingTasks.map((task) => {
      if (task.status === previousStatus) {
        const newIndex = sourceIds.indexOf(task.taskId);
        if (newIndex >= 0) {
          return { ...task, sortOrder: newIndex + 1 };
        }
      }

      if (task.status === nextStatus) {
        const newIndex = destinationIds.indexOf(task.taskId);
        if (newIndex >= 0) {
          return { ...task, sortOrder: newIndex + 1 };
        }
      }

      return task;
    });

    nextDestinationTasks.forEach((task, index) => {
      const existingIndex = nextTasks.findIndex((item) => item.taskId === task.taskId);
      if (existingIndex >= 0) {
        nextTasks[existingIndex] = {
          ...nextTasks[existingIndex],
          status: nextStatus,
          sortOrder: index + 1,
        };
      } else {
        nextTasks.push({
          ...task,
          status: nextStatus,
          sortOrder: index + 1,
        });
      }
    });

    return {
      nextTasks,
      destinationIds,
      sourceIds,
      previousStatus,
    };
  }

  async function moveTask(
    taskId: string,
    nextStatus: TaskStatus,
    beforeTaskId?: string | null
  ) {
    const previousTasks = boardTasks;
    const targetTask = previousTasks.find((task) => task.taskId === taskId);

    if (!targetTask) {
      return false;
    }

    if (
      targetTask.status === nextStatus &&
      (!beforeTaskId || beforeTaskId === taskId)
    ) {
      return false;
    }

    const {
      nextTasks,
      destinationIds,
      sourceIds,
      previousStatus,
    } = buildReorderedTasks(previousTasks, taskId, nextStatus, beforeTaskId);

    setErrorMessage("");
    setSavingTaskId(taskId);
    setBoardTasks(nextTasks);

    try {
      const response = await fetch(`/api/admin/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
          orderedTaskIds: destinationIds,
          sourceStatus: previousStatus,
          sourceOrderedTaskIds: sourceIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update task status.");
      }

      return true;
    } catch {
      setBoardTasks(previousTasks);
      setErrorMessage("Task status could not be updated. Please try again.");
      return false;
    } finally {
      setSavingTaskId(null);
      setDraggedTaskId(null);
      setDropStatus(null);
      setDropTaskId(null);
    }
  }

  function requestMoveTask(
    taskId: string,
    nextStatus: TaskStatus,
    beforeTaskId?: string | null
  ) {
    const task = boardTasks.find((item) => item.taskId === taskId);

    if (!task) {
      return;
    }

    if (task.status === "in_progress" && nextStatus === "review") {
      setReviewPrompt({
        taskId,
        nextStatus,
        beforeTaskId,
        hours: "",
        minutes: "",
      });
      setReviewPromptError("");
      return;
    }

    void moveTask(taskId, nextStatus, beforeTaskId);
  }

  async function submitReviewPrompt() {
    if (!reviewPrompt) {
      return;
    }

    const task = boardTasks.find((item) => item.taskId === reviewPrompt.taskId);

    if (!task) {
      setReviewPrompt(null);
      return;
    }

    const hours = Number(reviewPrompt.hours || "0");
    const minutes = Number(reviewPrompt.minutes || "0");

    if (
      !Number.isFinite(hours) ||
      hours < 0 ||
      !Number.isFinite(minutes) ||
      minutes < 0
    ) {
      setReviewPromptError("Please enter valid hours and minutes.");
      return;
    }

    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes <= 0) {
      setReviewPromptError("Please enter some time spent before moving to review.");
      return;
    }

    const project = task.projectId ? projectMap.get(task.projectId) : null;
    const resolvedCustomerId = task.customerId ?? project?.customerId;
    const internalHourlyRate = defaultHourlyRates[resolvedCustomerId ?? ""] ?? 0;

    setSavingTaskId(task.taskId);
    setReviewPromptError("");

    try {
      const timeEntryResponse = await fetch(
        `/api/admin/tasks/${task.taskId}/time-entries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entryDate: new Date().toISOString().slice(0, 10),
            durationMinutes: totalMinutes,
            internalHourlyRate,
            description: "Time logged when moving task to review.",
            billable: task.billable,
          }),
        }
      );

      if (!timeEntryResponse.ok) {
        throw new Error("Time entry could not be saved.");
      }

      const moved = await moveTask(
        reviewPrompt.taskId,
        reviewPrompt.nextStatus,
        reviewPrompt.beforeTaskId
      );

      if (!moved) {
        return;
      }

      setReviewPrompt(null);
    } catch {
      setErrorMessage("Time entry could not be saved. Please try again.");
    } finally {
      setSavingTaskId(null);
    }
  }

  return (
    <>
      {errorMessage ? (
        <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = tasksByStatus.get(column.key) ?? [];

          return (
            <article
              key={column.key}
              onDragOver={(event) => {
                event.preventDefault();
                setDropStatus(column.key);
                setDropTaskId(null);
              }}
              onDrop={(event) => {
                event.preventDefault();
                const taskId = event.dataTransfer.getData("text/taskId");
                if (taskId) {
                  requestMoveTask(taskId, column.key, null);
                }
              }}
              onDragLeave={(event) => {
                if (dropStatus === column.key) {
                  setDropStatus(null);
                }
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setDropTaskId(null);
                }
              }}
              className={`rounded-md border bg-[color:var(--color-panel)] p-5 transition ${
                dropStatus === column.key
                  ? "border-amber-400/70"
                  : "border-[color:var(--color-border)]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold tracking-[0.22em] text-amber-400 uppercase">
                  {column.label}
                </p>
                <span className="rounded-md bg-[color:var(--color-panel-strong)] px-3 py-1 text-xs font-semibold text-stone-200">
                  {columnTasks.length}
                </span>
              </div>

              <p className="mt-3 text-xs leading-6 text-stone-400">
                Drag tasks here to update their status.
              </p>

              <div className="mt-5 space-y-4">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => {
                    const project = task.projectId
                      ? projectMap.get(task.projectId)
                      : null;

                    return (
                      <div
                        key={task.taskId}
                        draggable={savingTaskId !== task.taskId}
                        onDragOver={(event) => {
                          event.preventDefault();
                          setDropStatus(column.key);
                          setDropTaskId(task.taskId);
                        }}
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/taskId", task.taskId);
                          event.dataTransfer.effectAllowed = "move";
                          setDraggedTaskId(task.taskId);
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          const taskId = event.dataTransfer.getData("text/taskId");
                          if (taskId) {
                            requestMoveTask(taskId, column.key, task.taskId);
                          }
                        }}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDropStatus(null);
                          setDropTaskId(null);
                        }}
                        className={`rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 transition ${
                          draggedTaskId === task.taskId ? "opacity-60" : ""
                        } ${dropTaskId === task.taskId ? "ring-2 ring-amber-400/60" : ""}`}
                      >
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                          <span className="rounded-md bg-stone-800 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-100">
                            {task.taskKey}
                          </span>
                          <div className="flex justify-center">
                            <span className="rounded-md bg-amber-500/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200">
                              {formatPriority(task.priority)}
                            </span>
                          </div>
                          {typeof task.estimatedMinutes === "number" ? (
                            <span className="justify-self-end rounded-md bg-sky-500/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200">
                              {task.estimatedMinutes}
                            </span>
                          ) : (
                            <span />
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {isOverdue(task) ? (
                            <span className="rounded-md bg-red-500/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-200">
                              Overdue
                            </span>
                          ) : null}
                          {savingTaskId === task.taskId ? (
                            <span className="rounded-md bg-sky-500/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200">
                              Saving
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 font-semibold text-stone-100">
                          {task.title}
                        </p>
                        {task.description ? (
                          <p className="mt-2 text-sm leading-7 text-stone-300">
                            {task.description}
                          </p>
                        ) : null}
                        <div className="mt-3 space-y-1 text-xs leading-6 text-stone-400">
                          {task.dueDate ? <p>Due: {formatDisplayDate(task.dueDate)}</p> : null}
                          {task.actualMinutes > 0 ? (
                            <p>Logged: {(task.actualMinutes / 60).toFixed(2)} hrs</p>
                          ) : null}
                        </div>
                        <div className="mt-4">
                          {project ? (
                            <span className="rounded-md bg-white/8 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-200">
                              {project.name}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link
                            href={`/admin/tasks/${task.taskId}/edit`}
                            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8"
                          >
                            Edit
                          </Link>
                          {project ? (
                            <Link
                              href={`/admin/projects/${project.projectId}`}
                              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-white/8"
                            >
                              Project
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm leading-7 text-stone-300">
                    No tasks in this column.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {reviewPrompt ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/90 backdrop-blur-sm p-6">
          <div className="w-full max-w-md rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-2xl">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Move to Review
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-stone-50">
              Log time before sending this task to review
            </h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              How much time was spent on this task?
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-stone-100" htmlFor="review-hours">
                  Hours
                </label>
                <input
                  id="review-hours"
                  type="number"
                  min="0"
                  step="1"
                  value={reviewPrompt.hours}
                  onChange={(event) =>
                    setReviewPrompt((current) =>
                      current
                        ? { ...current, hours: event.target.value }
                        : current
                    )
                  }
                  className="mt-2 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-100" htmlFor="review-minutes">
                  Minutes
                </label>
                <input
                  id="review-minutes"
                  type="number"
                  min="0"
                  max="59"
                  step="1"
                  value={reviewPrompt.minutes}
                  onChange={(event) =>
                    setReviewPrompt((current) =>
                      current
                        ? { ...current, minutes: event.target.value }
                        : current
                    )
                  }
                  className="mt-2 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
                />
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-stone-400">
              Internal cost uses the linked client default rate when available.
            </p>
            {reviewPromptError ? (
              <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm leading-7 text-red-100">
                {reviewPromptError}
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void submitReviewPrompt()}
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Log Time and Move
              </button>
              <button
                type="button"
                onClick={() => {
                  setReviewPrompt(null);
                  setReviewPromptError("");
                }}
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
