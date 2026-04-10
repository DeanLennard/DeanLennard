import { NextResponse } from "next/server";

import { getAuthenticatedAdminUser } from "@/lib/admin-auth";
import { updateAdminUserAccess, type InternalUserRole } from "@/lib/admin-users";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const user = await getAuthenticatedAdminUser();

  if (!user) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  if ((user.role ?? "admin") !== "admin") {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin"), 303);
  }

  const { username } = await params;
  const formData = await request.formData();

  await updateAdminUserAccess(username, {
    approved: formData.get("approved") === "on",
    role: (String(formData.get("role") ?? "readonly") as InternalUserRole) || "readonly",
  });

  return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/users"), 303);
}
