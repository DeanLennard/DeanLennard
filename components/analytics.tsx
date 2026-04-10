"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { recordAuditIntentClient } from "@/lib/audit-intent-client";
import type { AuditIntentType } from "@/lib/audit-intents";
import { trackEvent, trackPageView } from "@/lib/analytics";

function getPathWithSearch(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function getLinkText(link: HTMLAnchorElement) {
  return (
    link.dataset.analyticsLabel ||
    link.getAttribute("aria-label") ||
    link.textContent?.replace(/\s+/g, " ").trim() ||
    link.href
  );
}

function getLinkDestination(link: HTMLAnchorElement) {
  if (link.href.startsWith("mailto:")) {
    return "email";
  }

  if (link.href.includes("calendly.com")) {
    return "calendly";
  }

  if (link.href.includes("linkedin.com")) {
    return "linkedin";
  }

  if (link.hash === "#book-call") {
    return "book_call";
  }

  if (link.hash === "#project-enquiry") {
    return "project_enquiry";
  }

  return "other";
}

function isServicePage(pathname: string) {
  return !["/", "/about", "/contact", "/projects", "/services"].includes(pathname);
}

function getAuditIdFromCurrentLocation() {
  return new URL(window.location.href).searchParams.get("auditId");
}

function getAuditIntentForLink(link: HTMLAnchorElement): AuditIntentType | null {
  const explicitIntent = link.dataset.auditIntent;

  if (
    explicitIntent === "request_review" ||
    explicitIntent === "request_fix_free_review" ||
    explicitIntent === "book_call" ||
    explicitIntent === "send_email" ||
    explicitIntent === "calendly_open"
  ) {
    return explicitIntent;
  }

  if (link.href.startsWith("mailto:")) {
    return "send_email";
  }

  if (link.hash === "#book-call") {
    return "book_call";
  }

  if (link.href.includes("calendly.com")) {
    return "book_call";
  }

  return null;
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef<string>("");

  useEffect(() => {
    const path = getPathWithSearch(pathname, searchParams);

    if (previousPathRef.current === path) {
      return;
    }

    previousPathRef.current = path;
    trackPageView(path, document.title);

    if (pathname === "/contact") {
      trackEvent("contact_page_view", {
        page_path: path,
      });
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a");
      if (!(link instanceof HTMLAnchorElement) || !link.href) {
        return;
      }

      const url = new URL(link.href, window.location.origin);
      const isExternal = url.origin !== window.location.origin;
      const linkText = getLinkText(link);
      const destination = getLinkDestination(link);
      const auditId = link.dataset.auditId || getAuditIdFromCurrentLocation();
      const auditIntent = getAuditIntentForLink(link);
      const baseParams = {
        cta_label: linkText,
        destination,
        link_url: link.href,
        page_path: window.location.pathname,
      };

      if (auditId && auditIntent) {
        recordAuditIntentClient(auditId, auditIntent);
      }

      if (link.href.startsWith("mailto:")) {
        trackEvent("generate_lead", {
          ...baseParams,
          contact_method: "email",
          lead_type: "project_enquiry",
        });
        return;
      }

      if (link.hash === "#book-call" || link.href.includes("calendly.com")) {
        trackEvent("book_call_click", {
          ...baseParams,
          contact_method: "call",
        });
      }

      if (link.href.includes("calendly.com")) {
        trackEvent("calendly_open", {
          ...baseParams,
          contact_method: "call",
        });
      }

      if (link.hash === "#project-enquiry") {
        trackEvent("project_enquiry_click", {
          ...baseParams,
          contact_method: "enquiry",
        });
      }

      if (isServicePage(window.location.pathname) && link.pathname === "/contact") {
        trackEvent("service_cta_click", {
          ...baseParams,
          service_page: window.location.pathname,
        });
      }

      if (isExternal) {
        trackEvent("outbound_click", {
          ...baseParams,
          outbound_domain: url.hostname,
        });
      }
    }

    function handleCalendlyMessage(event: MessageEvent) {
      if (typeof event.data?.event !== "string") {
        return;
      }

      if (!event.data.event.startsWith("calendly.")) {
        return;
      }

      const baseParams = {
        page_path: window.location.pathname,
      };
      const auditId = getAuditIdFromCurrentLocation();

      if (event.data.event === "calendly.profile_page_viewed") {
        if (auditId) {
          recordAuditIntentClient(auditId, "calendly_open");
        }
        trackEvent("calendly_open", baseParams);
      }

      if (event.data.event === "calendly.event_scheduled") {
        trackEvent("calendly_booking_complete", {
          ...baseParams,
          contact_method: "call",
        });
        trackEvent("generate_lead", {
          ...baseParams,
          contact_method: "call",
          lead_type: "booked_call",
        });
      }
    }

    document.addEventListener("click", handleClick);
    window.addEventListener("message", handleCalendlyMessage);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("message", handleCalendlyMessage);
    };
  }, []);

  return null;
}
