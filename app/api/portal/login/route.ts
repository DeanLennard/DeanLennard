import { NextResponse } from "next/server";

import { sendPortalMagicLink } from "@/lib/portal-magic-links";

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
  const email = String(formData.get("email") ?? "");

  try {
    await sendPortalMagicLink(email);
    return redirectTo("/portal/login?sent=1");
  } catch {
    return redirectTo("/portal/login?error=email");
  }
}
