import { NextResponse } from "next/server";

import { registerAdminUser } from "@/lib/admin-users";

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
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!username.trim() || !password.trim()) {
    return redirectTo("/admin/register?error=missing");
  }

  if (password !== confirmPassword) {
    return redirectTo("/admin/register?error=mismatch");
  }

  try {
    await registerAdminUser(username, password);
    return redirectTo("/admin/login?registered=1");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration could not be completed.";

    if (message.includes("already exists")) {
      return redirectTo("/admin/register?error=exists");
    }

    return redirectTo("/admin/register?error=failed");
  }
}
