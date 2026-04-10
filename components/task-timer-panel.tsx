"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type TaskTimerPanelProps = {
  taskId: string;
  defaultHourlyRate: number;
  defaultBillable: boolean;
};

type StoredTimerState = {
  startedAt: number;
  description: string;
  billable: boolean;
};

function getStorageKey(taskId: string) {
  return `task-timer:${taskId}`;
}

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export function TaskTimerPanel({
  taskId,
  defaultHourlyRate,
  defaultBillable,
}: TaskTimerPanelProps) {
  const router = useRouter();
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [billable, setBillable] = useState(defaultBillable);
  const [tick, setTick] = useState(Date.now());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(getStorageKey(taskId));

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as StoredTimerState;
      if (typeof parsed.startedAt === "number") {
        setStartedAt(parsed.startedAt);
        setDescription(parsed.description || "");
        setBillable(Boolean(parsed.billable));
      }
    } catch {
      window.localStorage.removeItem(getStorageKey(taskId));
    }
  }, [taskId]);

  useEffect(() => {
    if (!startedAt) {
      return;
    }

    const interval = window.setInterval(() => {
      setTick(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [startedAt]);

  const elapsedSeconds = useMemo(() => {
    if (!startedAt) {
      return 0;
    }

    return Math.max(0, Math.floor((tick - startedAt) / 1000));
  }, [startedAt, tick]);

  function persistTimer(next: StoredTimerState | null) {
    if (next) {
      window.localStorage.setItem(getStorageKey(taskId), JSON.stringify(next));
    } else {
      window.localStorage.removeItem(getStorageKey(taskId));
    }
  }

  function startTimer() {
    const now = Date.now();
    setStartedAt(now);
    setError("");
    persistTimer({
      startedAt: now,
      description,
      billable,
    });
  }

  function resetTimer() {
    setStartedAt(null);
    setDescription("");
    setBillable(defaultBillable);
    setError("");
    persistTimer(null);
  }

  async function stopAndSaveTimer() {
    if (!startedAt) {
      return;
    }

    const durationMinutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/tasks/${encodeURIComponent(taskId)}/time-entries`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          entryDate: new Date().toISOString().slice(0, 10),
          durationMinutes,
          internalHourlyRate: defaultHourlyRate,
          description,
          billable,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error || "Timer entry could not be saved.");
      }

      resetTimer();
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Timer entry could not be saved."
      );
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!startedAt) {
      return;
    }

    persistTimer({
      startedAt,
      description,
      billable,
    });
  }, [billable, description, startedAt, taskId]);

  return (
    <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
            Timer
          </p>
          <p className="mt-2 text-3xl font-semibold text-stone-50">
            {formatElapsed(elapsedSeconds)}
          </p>
          <p className="mt-2 text-sm leading-7 text-stone-400">
            Start a live timer and save it straight into task time tracking.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {!startedAt ? (
            <button
              type="button"
              onClick={startTimer}
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Start Timer
            </button>
          ) : (
            <button
              type="button"
              onClick={stopAndSaveTimer}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-500 disabled:opacity-70"
            >
              {saving ? "Saving..." : "Stop and Save"}
            </button>
          )}
          <button
            type="button"
            onClick={resetTimer}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8 disabled:opacity-70"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-stone-100">Description</span>
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What are you working on?"
            className="w-full rounded-md border border-[color:var(--color-border)] bg-stone-950/50 px-4 py-3 text-sm text-stone-100"
          />
        </label>
        <label className="flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-stone-950/50 px-4 py-3 text-sm text-stone-100 lg:mt-8">
          <input
            type="checkbox"
            checked={billable}
            onChange={(event) => setBillable(event.target.checked)}
            className="h-4 w-4 rounded border-[color:var(--color-border)]"
          />
          Billable
        </label>
      </div>

      {error ? (
        <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
          {error}
        </div>
      ) : null}
    </div>
  );
}
