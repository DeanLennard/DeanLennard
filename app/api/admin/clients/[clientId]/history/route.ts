import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  listActivityLogsByEntityPage,
} from "@/lib/activity-log";
import { listCustomerNotesPage } from "@/lib/customer-notes";
import { formatDisplayDateTime } from "@/lib/date-format";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const offset = Number(searchParams.get("offset") ?? "0");
  const limit = Number(searchParams.get("limit") ?? "10");

  if (!clientId || (type !== "notes" && type !== "timeline")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (type === "notes") {
    const page = await listCustomerNotesPage(clientId, { offset, limit });

    return NextResponse.json({
      items: page.items.map((note) => ({
        id: note.id,
        title: "Customer note",
        body: note.note,
        meta: formatDisplayDateTime(note.createdAt),
      })),
      hasMore: page.hasMore,
      nextOffset: page.nextOffset,
    });
  }

  const page = await listActivityLogsByEntityPage("client", clientId, { offset, limit });

  return NextResponse.json({
    items: page.items.map((entry) => ({
      id: entry.id,
      title: entry.description,
      body: `${entry.actionType} | ${entry.actor}`,
      meta: formatDisplayDateTime(entry.timestamp),
    })),
    hasMore: page.hasMore,
    nextOffset: page.nextOffset,
  });
}
