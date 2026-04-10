import { NextResponse } from "next/server";

import { getAdminSessionCookieName } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(`${origin}/admin/login`, 303);

  response.cookies.set({
    name: getAdminSessionCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
