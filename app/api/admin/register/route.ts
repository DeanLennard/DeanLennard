import { NextResponse } from "next/server";

import { registerAdminUser } from "@/lib/admin-users";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const origin = new URL(request.url).origin;

  if (!username.trim() || !password.trim()) {
    return NextResponse.redirect(`${origin}/admin/register?error=missing`, 303);
  }

  if (password !== confirmPassword) {
    return NextResponse.redirect(`${origin}/admin/register?error=mismatch`, 303);
  }

  try {
    await registerAdminUser(username, password);
    return NextResponse.redirect(
      `${origin}/admin/login?registered=1`,
      303
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration could not be completed.";

    if (message.includes("already exists")) {
      return NextResponse.redirect(`${origin}/admin/register?error=exists`, 303);
    }

    return NextResponse.redirect(`${origin}/admin/register?error=failed`, 303);
  }
}
