import { NextResponse } from "next/server";

import {
  createAdminSessionValue,
  getAdminSessionCookieName,
} from "@/lib/admin-auth";
import { validateAdminLogin } from "@/lib/admin-users";

function redirectTo(path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: path,
    },
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const result = await validateAdminLogin(username, password);

    if (result.status === "pending") {
      return redirectTo("/admin/login?error=pending");
    }

    if (result.status !== "success") {
      return redirectTo("/admin/login?error=invalid");
    }

    const response = redirectTo("/admin");
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
  } catch (error) {
    console.error("Admin login configuration error", error);
    return redirectTo("/admin/login?error=config");
  }
}
