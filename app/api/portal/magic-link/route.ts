import { NextResponse } from "next/server";

import {
  createPortalSessionValue,
  getPortalSessionCookieName,
} from "@/lib/portal-auth";
import { consumePortalMagicLink } from "@/lib/portal-magic-links";
import { markPortalUserLoggedIn } from "@/lib/portal-users";

function redirectTo(path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: path,
    },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";

  if (!token) {
    return redirectTo("/portal/login?error=invalid");
  }

  const portalUser = await consumePortalMagicLink(token);

  if (!portalUser) {
    return redirectTo("/portal/login?error=invalid");
  }

  await markPortalUserLoggedIn(portalUser.portalUserId);

  const response = redirectTo("/portal");
  response.cookies.set({
    name: getPortalSessionCookieName(),
    value: createPortalSessionValue(portalUser.email),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
