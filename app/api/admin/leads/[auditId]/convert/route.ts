import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createClientFromAudit } from "@/lib/clients-store";
import { getAuditById, markAuditConverted } from "@/lib/audit-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ auditId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { auditId } = await params;

  if (!auditId) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/leads?error=missing-audit"),
      303
    );
  }

  const audit = await getAuditById(auditId);

  if (!audit) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/leads?error=missing-audit"),
      303
    );
  }

  const client = await createClientFromAudit(audit);
  await markAuditConverted(auditId, client.clientId);

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/clients/${client.clientId}`),
    303
  );
}
