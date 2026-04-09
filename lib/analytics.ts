export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-ZDVRLE5YF0";

export const isAnalyticsEnabled = Boolean(GA_MEASUREMENT_ID);

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
  }
}

function sanitizeParams(params: AnalyticsEventParams = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );
}

export function trackPageView(path: string, title?: string) {
  if (!isAnalyticsEnabled || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function trackEvent(name: string, params: AnalyticsEventParams = {}) {
  if (!isAnalyticsEnabled || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", name, sanitizeParams(params));
}
