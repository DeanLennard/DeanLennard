import { NextResponse } from "next/server";

import { getPortalSessionCookieName } from "@/lib/portal-auth";

export async function POST() {
  const response = new NextResponse(null, {
    status: 303,
    headers: {
      Location: "/portal/login",
    },
  });

  response.cookies.set({
    name: getPortalSessionCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
