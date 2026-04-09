"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { trackEvent } from "@/lib/analytics";

export function WebsiteGrowthCheckWidget() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    params.set("url", url.trim());
    params.set("autorun", "1");

    if (businessName.trim()) {
      params.set("business", businessName.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    trackEvent("website_growth_widget_submit", {
      page_path: "/",
      has_business_name: Boolean(businessName.trim()),
      has_location: Boolean(location.trim()),
    });

    router.push(`/website-growth-check?${params.toString()}#audit-tool`);
  }

  return (
    <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
      <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
        Website Growth Check
      </p>
      <p className="mt-3 text-sm leading-7 text-stone-300">
        Want a quick starting point first? Run a free website check and carry
        the details into the full audit.
      </p>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <input
            type="text"
            inputMode="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Website URL, for example aaa.com"
            className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          />
          <input
            type="text"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Business name"
            className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          />
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location"
            className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Run Free Audit
          </button>
          <p className="text-sm leading-7 text-stone-300">
            Free instant audit, no technical knowledge needed.
          </p>
        </div>
      </form>
    </div>
  );
}
