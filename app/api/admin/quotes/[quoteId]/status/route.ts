import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateQuoteStatus, type QuoteStatus } from "@/lib/quotes-store";

const validStatuses = new Set<QuoteStatus>([
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
]);

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
  const formData = await request.formData();
  const status = String(formData.get("status") ?? "") as QuoteStatus;

  if (!quoteId || !validStatuses.has(status)) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/quotes?error=invalid-status"),
      303
    );
  }

  await updateQuoteStatus(quoteId, status);
  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/quotes/${quoteId}`),
    303
  );
}
