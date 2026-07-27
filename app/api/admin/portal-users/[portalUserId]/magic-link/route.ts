import { NextResponse } from "next/server";

import { toAbsoluteRedirect } from "@/lib/absolute-redirect";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendPortalMagicLink } from "@/lib/portal-magic-links";
import { getPortalUserById } from "@/lib/portal-users";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ portalUserId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { portalUserId } = await params;
  const portalUser = await getPortalUserById(portalUserId);

  if (!portalUser) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/clients?error=portal-user-missing"), 303);
  }

  try {
    await sendPortalMagicLink(portalUser.email);
  } catch (error) {
    return NextResponse.redirect(
      toAbsoluteRedirect(
        request,
        `/admin/clients/${portalUser.clientId}?error=${encodeURIComponent(error instanceof Error ? error.message : "portal-link-failed")}`
      ),
      303
    );
  }

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/clients/${portalUser.clientId}`),
    303
  );
}
