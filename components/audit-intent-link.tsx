"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { AuditIntentType } from "@/lib/audit-intents";

async function sendAuditIntent(auditId: string, action: AuditIntentType) {
  try {
    await fetch(`/api/audits/${auditId}/intent`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ intentType: action }),
      keepalive: true,
    });
  } catch {
    // Do not block the user flow if this intent call fails.
  }
}

export function AuditIntentLink({
  auditId,
  action,
  href,
  className,
  onClick,
  children,
}: {
  auditId?: string;
  action: AuditIntentType;
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        onClick?.();

        if (auditId) {
          void sendAuditIntent(auditId, action);
        }
      }}
    >
      {children}
    </Link>
  );
}
