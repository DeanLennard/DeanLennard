import { NextResponse } from "next/server";

import {
  createAdminSessionValue,
  getAdminSessionCookieName,
} from "@/lib/admin-auth";
import { validateAdminLogin } from "@/lib/admin-users";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const origin = new URL(request.url).origin;

  try {
    const result = await validateAdminLogin(username, password);

    if (result.status === "pending") {
      return NextResponse.redirect(`${origin}/admin/login?error=pending`, 303);
    }

    if (result.status !== "success") {
      return NextResponse.redirect(`${origin}/admin/login?error=invalid`, 303);
    }

    const response = NextResponse.redirect(`${origin}/admin`, 303);
    response.cookies.set({
      name: getAdminSessionCookieName(),
      value: createAdminSessionValue(result.user.username),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    return NextResponse.redirect(`${origin}/admin/login?error=config`, 303);
  }
}
