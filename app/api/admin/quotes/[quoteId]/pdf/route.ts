import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureQuotePdfPath } from "@/lib/document-generation";
import { getQuoteById } from "@/lib/quotes-store";

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
  const quote = await getQuoteById(quoteId);

  if (!quote) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/quotes"), 303);
  }

  await ensureQuotePdfPath(quote.quoteId);

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/quotes/${quote.quoteId}`),
    303
  );
}
