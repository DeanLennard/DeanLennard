import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createCustomerManually } from "@/lib/clients-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const formData = await request.formData();
  const businessName = String(formData.get("businessName") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!businessName) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/clients/new?error=missing-business"),
      303
    );
  }

  const client = await createCustomerManually({
    businessName,
    contactName,
    email,
    phone,
    website,
    notes,
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/clients/${client.clientId}`),
    303
  );
}
