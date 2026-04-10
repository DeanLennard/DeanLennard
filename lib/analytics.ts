export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-ZDVRLE5YF0";
export const POSTHOG_PROJECT_TOKEN =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? "";
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

export const isAnalyticsEnabled = Boolean(GA_MEASUREMENT_ID);
export const isPostHogEnabled = Boolean(POSTHOG_PROJECT_TOKEN && POSTHOG_HOST);

type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined | null
>;

type GtagCommand = "config" | "event" | "js";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (
      command: GtagCommand,
      targetIdOrEventName: string | Date,
      config?: AnalyticsEventParams
    ) => void;
    posthog?: {
      capture: (eventName: string, properties?: AnalyticsEventParams) => void;
    };
    __posthogEventQueue?: Array<{
      name: string;
      properties?: AnalyticsEventParams;
    }>;
  }
}

function sanitizeParams(params: AnalyticsEventParams = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );
}

function capturePostHogEvent(name: string, properties: AnalyticsEventParams) {
  if (!isPostHogEnabled || typeof window === "undefined") {
    return;
  }

  if (window.posthog?.capture) {
    window.posthog.capture(name, properties);
    return;
  }

  window.__posthogEventQueue = window.__posthogEventQueue ?? [];
  window.__posthogEventQueue.push({
    name,
    properties,
  });
}

export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined") {
    return;
  }

  const params = sanitizeParams({
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });

  if (isAnalyticsEnabled && window.gtag) {
    window.gtag("event", "page_view", params);
  }

  capturePostHogEvent("page_view", params);
}

export function trackEvent(name: string, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const sanitizedParams = sanitizeParams(params);

  if (isAnalyticsEnabled && window.gtag) {
    window.gtag("event", name, sanitizedParams);
  }

  capturePostHogEvent(name, sanitizedParams);
}
