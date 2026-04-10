"use client";

import { useState } from "react";

type QuoteLineItemDraft = {
  id: string;
  title: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

function createDraft(initial?: Partial<QuoteLineItemDraft>): QuoteLineItemDraft {
  return {
    id: initial?.id || crypto.randomUUID(),
    title: initial?.title || "",
    description: initial?.description || "",
    quantity: initial?.quantity || "1",
    unitPrice: initial?.unitPrice || "",
  };
}

export function QuoteLineItemsEditor({
  initialItems,
}: {
  initialItems?: Array<{
    title: string;
    description?: string;
    quantity?: number;
    unitPrice?: number;
  }>;
}) {
  const [items, setItems] = useState<QuoteLineItemDraft[]>([
    ...(initialItems && initialItems.length > 0
      ? initialItems.map((item) =>
          createDraft({
            title: item.title,
            description: item.description ?? "",
            quantity: String(item.quantity ?? 1),
            unitPrice:
              typeof item.unitPrice === "number" ? String(item.unitPrice) : "",
          })
        )
      : [createDraft(), createDraft(), createDraft()]),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Line items
        </p>
        <button
          type="button"
          onClick={() => {
            setItems((currentItems) => [...currentItems, createDraft()]);
          }}
          className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
        >
          Add Line Item
        </button>
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-stone-100">
              Line item {index + 1}
            </p>
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setItems((currentItems) =>
                    currentItems.filter((currentItem) => currentItem.id !== item.id)
                  );
                }}
                className="inline-flex items-center justify-center rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-100 transition hover:bg-red-500/20"
              >
                Remove
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1.4fr_0.5fr_0.7fr]">
            <input
              name="lineItemTitle"
              type="text"
              value={item.title}
              onChange={(event) => {
                setItems((currentItems) =>
                  currentItems.map((currentItem) =>
                    currentItem.id === item.id
                      ? { ...currentItem, title: event.target.value }
                      : currentItem
                  )
                );
              }}
              placeholder={`Line item ${index + 1} title`}
              className="min-w-0 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
            <input
              name="lineItemDescription"
              type="text"
              value={item.description}
              onChange={(event) => {
                setItems((currentItems) =>
                  currentItems.map((currentItem) =>
                    currentItem.id === item.id
                      ? { ...currentItem, description: event.target.value }
                      : currentItem
                  )
                );
              }}
              placeholder="Description"
              className="min-w-0 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
            <input
              name="lineItemQuantity"
              type="number"
              min="1"
              step="1"
              value={item.quantity}
              onChange={(event) => {
                setItems((currentItems) =>
                  currentItems.map((currentItem) =>
                    currentItem.id === item.id
                      ? { ...currentItem, quantity: event.target.value }
                      : currentItem
                  )
                );
              }}
              className="min-w-0 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
            <input
              name="lineItemUnitPrice"
              type="number"
              min="0"
              step="0.01"
              value={item.unitPrice}
              onChange={(event) => {
                setItems((currentItems) =>
                  currentItems.map((currentItem) =>
                    currentItem.id === item.id
                      ? { ...currentItem, unitPrice: event.target.value }
                      : currentItem
                  )
                );
              }}
              placeholder="0.00"
              className="min-w-0 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
