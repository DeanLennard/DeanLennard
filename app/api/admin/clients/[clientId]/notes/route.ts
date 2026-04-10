import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createActivityLog } from "@/lib/activity-log";
import { addCustomerNote } from "@/lib/customer-notes";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { clientId } = await params;
  const formData = await request.formData();
  const note = String(formData.get("note") ?? "").trim();

  if (!clientId || !note) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/clients/${clientId}?error=missing-note`),
      303
    );
  }

  await addCustomerNote(clientId, note);
  await createActivityLog({
    entityType: "client",
    entityId: clientId,
    actionType: "note_added",
    description: "Customer note added.",
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/clients/${clientId}`),
    303
  );
}
