"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { trackEvent } from "@/lib/analytics";
import type { WebsiteGrowthAuditResult } from "@/lib/website-growth-audit";

type AuditState = "idle" | "loading" | "success" | "error";

const loadingSteps = [
  "Checking performance...",
  "Analysing structure...",
  "Reviewing visibility...",
];

const severityStyles = {
  error: "border-red-500/30 bg-red-500/10 text-red-100",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
} as const;

const severityIcons = {
  error: "X",
  warning: "!",
  success: "OK",
} as const;

function isWebsiteGrowthAuditResult(
  data: WebsiteGrowthAuditResult | { error?: string }
): data is WebsiteGrowthAuditResult {
  return "scores" in data && "normalizedUrl" in data && "checkedAt" in data;
}

function ScoreCard({
  label,
  score,
  description,
}: {
  label: string;
  score: number;
  description: string;
}) {
  const tone =
    score >= 85
      ? "text-emerald-300"
      : score >= 65
        ? "text-amber-300"
        : "text-red-300";

  return (
    <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
      <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
        {label}
      </p>
      <p className={`mt-4 text-4xl font-semibold ${tone}`}>{score}/100</p>
      <p className="mt-3 text-sm leading-7 text-stone-300">{description}</p>
    </div>
  );
}

export function WebsiteGrowthCheckTool({
  initialUrl = "",
  initialBusinessName = "",
  initialLocation = "",
  autoStart = false,
}: {
  initialUrl?: string;
  initialBusinessName?: string;
  initialLocation?: string;
  autoStart?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [url, setUrl] = useState(initialUrl);
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [location, setLocation] = useState(initialLocation);
  const [status, setStatus] = useState<AuditState>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<WebsiteGrowthAuditResult | null>(null);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  useEffect(() => {
    if (status !== "loading") {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentStep((previous) =>
        previous < loadingSteps.length - 1 ? previous + 1 : previous
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (!autoStart || hasAutoStarted || !initialUrl.trim()) {
      return;
    }

    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setHasAutoStarted(true);

    void runAudit({
      url: initialUrl,
      businessName: initialBusinessName,
      location: initialLocation,
      eventName: "website_growth_audit_autostart",
    });
  }, [
    autoStart,
    hasAutoStarted,
    initialBusinessName,
    initialLocation,
    initialUrl,
  ]);

  useEffect(() => {
    if (status === "loading" || status === "success" || status === "error") {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [status]);

  const ctaHref = useMemo(() => {
    const params = new URLSearchParams();

    if (url.trim()) {
      params.set("website", url.trim());
    }

    if (businessName.trim()) {
      params.set("business", businessName.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (result) {
      params.set("conversionScore", String(result.scores.conversion.score));
      params.set("performanceScore", String(result.scores.performance.score));
      params.set("visibilityScore", String(result.scores.visibility.score));
    }

    const query = params.toString();
    return query
      ? `/contact?${query}#project-enquiry`
      : "/contact#project-enquiry";
  }, [businessName, location, result, url]);

  const reviewHref = useMemo(() => {
    const params = new URLSearchParams();

    if (url.trim()) {
      params.set("website", url.trim());
    }

    if (businessName.trim()) {
      params.set("business", businessName.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (result) {
      params.set("conversionScore", String(result.scores.conversion.score));
      params.set("performanceScore", String(result.scores.performance.score));
      params.set("visibilityScore", String(result.scores.visibility.score));
    }

    const query = params.toString();
    return query
      ? `/contact?${query}#project-enquiry`
      : "/contact#project-enquiry";
  }, [businessName, location, result, url]);

  async function runAudit({
    url,
    businessName,
    location,
    eventName = "website_growth_audit_start",
  }: {
    url: string;
    businessName: string;
    location: string;
    eventName?: string;
  }) {
    setStatus("loading");
    setCurrentStep(0);
    setError("");
    setResult(null);

    trackEvent(eventName, {
      page_path: "/website-growth-check",
      has_business_name: Boolean(businessName.trim()),
      has_location: Boolean(location.trim()),
    });

    try {
      const response = await fetch("/api/website-growth-check", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          url,
          businessName,
          location,
        }),
      });

      const data = (await response.json()) as
        | WebsiteGrowthAuditResult
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "The audit could not be completed."
        );
      }

      if (!isWebsiteGrowthAuditResult(data)) {
        throw new Error(data.error || "The audit could not be completed.");
      }

      setResult(data);
      setStatus("success");

      trackEvent("website_growth_audit_complete", {
        page_path: "/website-growth-check",
        conversion_score: data.scores.conversion.score,
        performance_score: data.scores.performance.score,
        visibility_score: data.scores.visibility.score,
      });
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The audit could not be completed right now."
      );
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await runAudit({
      url,
      businessName,
      location,
    });
  }

  return (
    <div id="audit-tool" ref={containerRef} className="scroll-mt-28 space-y-10">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr_0.6fr]">
            <div className="space-y-2">
              <label
                htmlFor="website-url"
                className="text-sm font-semibold text-stone-100"
              >
                Website URL
              </label>
              <input
                id="website-url"
                type="text"
                inputMode="url"
                placeholder="example.com or www.example.com"
                required
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="business-name"
                className="text-sm font-semibold text-stone-100"
              >
                Business name
              </label>
              <input
                id="business-name"
                type="text"
                placeholder="Optional"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="business-location"
                className="text-sm font-semibold text-stone-100"
              >
                Location
              </label>
              <input
                id="business-location"
                type="text"
                placeholder="Optional"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Running Audit..." : "Run Free Audit"}
            </button>
            <p className="text-sm leading-7 text-stone-300">
              Free instant audit, no technical knowledge needed.
            </p>
          </div>

          {status === "error" ? (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
              {error}
            </div>
          ) : null}
        </form>
      </section>

      {status === "loading" ? (
        <section className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Running Audit
          </p>
          <div className="mt-6 space-y-4">
            {loadingSteps.map((step, index) => (
              <div
                key={step}
                className={`rounded-md border p-4 text-sm leading-7 ${
                  index <= currentStep
                    ? "border-amber-500/30 bg-amber-500/10 text-stone-100"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-stone-400"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {result ? (
        <section className="space-y-10">
          <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
              Audit Summary
            </p>
            <h2 className="mt-4 break-words text-3xl font-semibold tracking-tight text-stone-50">
              Here is what may be holding back enquiries from {result.normalizedUrl}
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
              This is a focused review designed to highlight the biggest issues
              affecting conversion, performance, and visibility.
            </p>
            <div className="mt-6 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
                Pages Checked
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Checked {result.checkedPages.length} internal page
                {result.checkedPages.length === 1 ? "" : "s"}
                {result.crawlLimitReached
                  ? `, capped at ${result.crawlLimit} pages for speed and relevance.`
                  : "."}
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
                {result.checkedPages.map((pageUrl) => (
                  <li key={pageUrl} className="break-all">
                    {pageUrl}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <ScoreCard
              label="Conversion Score"
              score={result.scores.conversion.score}
              description="How clearly the page guides visitors toward contacting or enquiring."
            />
            <ScoreCard
              label="Performance Score"
              score={result.scores.performance.score}
              description="How likely speed and mobile basics are helping or hurting conversions."
            />
            <ScoreCard
              label="Visibility Score"
              score={result.scores.visibility.score}
              description="How well the page is set up for search visibility and local relevance."
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
                Priority Issues
              </p>
              {result.issues.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {result.issues.map((issue) => (
                    <div
                      key={`${issue.category}-${issue.message}`}
                      className={`rounded-md border p-4 text-sm leading-7 ${severityStyles[issue.severity]}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex min-w-8 justify-center rounded-md border border-current px-2 py-1 text-xs font-semibold">
                          {severityIcons[issue.severity]}
                        </span>
                        <div>
                          <p className="font-semibold capitalize">
                            {issue.category}
                          </p>
                          <p className="mt-1">{issue.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
                  No priority issues were detected across the pages checked.
                </div>
              )}
            </section>

            <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
                Good Signals
              </p>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
                {result.goodSignals.map((signal) => (
                  <li key={signal} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-6 text-stone-400">
                Checked on {new Date(result.checkedAt).toLocaleString("en-GB")}
              </p>
            </section>
          </div>

          <section className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
              Next Step
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              These issues are likely reducing your enquiries.
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
              I can fix these issues and improve your site&apos;s performance,
              visibility, and conversion flow.
            </p>
            <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
              Want a more detailed review specific to your business? I can take
              a closer look.
            </p>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-stone-300">
              This is a focused review, not a technical report dump.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={ctaHref}
                onClick={() =>
                  trackEvent("website_growth_audit_cta_click", {
                    page_path: "/website-growth-check",
                    cta_label: "Request Fix / Free Review",
                    conversion_score: result.scores.conversion.score,
                    performance_score: result.scores.performance.score,
                    visibility_score: result.scores.visibility.score,
                  })
                }
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Request Fix / Free Review
              </Link>
              <Link
                href={reviewHref}
                onClick={() =>
                  trackEvent("website_growth_audit_cta_click", {
                    page_path: "/website-growth-check",
                    cta_label: "Request Review",
                    conversion_score: result.scores.conversion.score,
                    performance_score: result.scores.performance.score,
                    visibility_score: result.scores.visibility.score,
                  })
                }
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Request Review
              </Link>
              <Link
                href="/contact#book-call"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Book a Call
              </Link>
            </div>
          </section>
        </section>
      ) : null}
    </div>
  );
}
