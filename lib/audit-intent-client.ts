import type { AuditIntentType } from "@/lib/audit-intents";

export function recordAuditIntentClient(
  auditId: string | null | undefined,
  intentType: AuditIntentType
) {
  if (!auditId || typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify({ intentType });
  const endpoint = `/api/audits/${encodeURIComponent(auditId)}/intent`;

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(endpoint, blob);
    return;
  }

  void fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: payload,
    keepalive: true,
  });
}
