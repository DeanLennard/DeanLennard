"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type HistoryItem = {
  id: string;
  title: string;
  body?: string;
  meta: string;
};

type AdminClientHistoryFeedProps = {
  clientId: string;
  type: "notes" | "timeline";
  title: string;
  emptyMessage: string;
  initialItems: HistoryItem[];
  initialHasMore: boolean;
  composerAction?: string;
};

export function AdminClientHistoryFeed({
  clientId,
  type,
  title,
  emptyMessage,
  initialItems,
  initialHasMore,
  composerAction,
}: AdminClientHistoryFeedProps) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestKey = useMemo(() => `${clientId}:${type}`, [clientId, type]);

  useEffect(() => {
    setItems(initialItems);
    setHasMore(initialHasMore);
  }, [initialHasMore, initialItems, requestKey]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: "240px 0px",
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, items.length, requestKey]);

  async function loadMore() {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        type,
        offset: String(items.length),
        limit: "10",
      });
      const response = await fetch(
        `/api/admin/clients/${encodeURIComponent(clientId)}/history?${params.toString()}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Could not load more history.");
      }

      const payload = (await response.json()) as {
        items: HistoryItem[];
        hasMore: boolean;
      };

      setItems((current) => [
        ...current,
        ...payload.items.filter((item) => !current.some((existing) => existing.id === item.id)),
      ]);
      setHasMore(payload.hasMore);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
      <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
        {title}
      </p>

      {composerAction ? (
        <form action={composerAction} method="post" className="mt-6 space-y-4">
          <textarea
            name="note"
            rows={4}
            placeholder="Add an internal note about this client"
            className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Add Note
          </button>
        </form>
      ) : null}

      <div className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
            >
              <p className="font-semibold text-stone-100">{item.title}</p>
              {item.body ? <p className="mt-1">{item.body}</p> : null}
              <p className="mt-2 text-stone-400">{item.meta}</p>
            </div>
          ))
        ) : (
          <p>{emptyMessage}</p>
        )}
      </div>

      {hasMore ? (
        <div ref={sentinelRef} className="mt-4 rounded-md p-3 text-center text-sm text-stone-400">
          {loading ? "Loading more..." : "Scroll for more"}
        </div>
      ) : items.length > 0 ? (
        <div className="mt-4 rounded-md p-3 text-center text-sm text-stone-500">
          End of history
        </div>
      ) : null}
    </article>
  );
}
