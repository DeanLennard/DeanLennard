import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createProjectFromQuote } from "@/lib/projects-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { quoteId } = await params;
  const project = await createProjectFromQuote(quoteId);
  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/projects/${project.projectId}`),
    303
  );
}
