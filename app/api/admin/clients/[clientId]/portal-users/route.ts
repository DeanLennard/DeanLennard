import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendPortalMagicLink } from "@/lib/portal-magic-links";
import { createPortalUser, type PortalUserRole } from "@/lib/portal-users";

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
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/clients/${clientId}?error=portal-user-missing`),
      303
    );
  }

  try {
    await createPortalUser({
      clientId,
      email,
      role: (String(formData.get("role") ?? "owner") as PortalUserRole) || "owner",
    });
    await sendPortalMagicLink(email);
  } catch (error) {
    return NextResponse.redirect(
      toAbsoluteRedirect(
        request,
        `/admin/clients/${clientId}?error=${encodeURIComponent(error instanceof Error ? error.message : "portal-user-failed")}`
      ),
      303
    );
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/clients/${clientId}`),
    303
  );
}
