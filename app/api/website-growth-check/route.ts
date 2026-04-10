import { createStoredAudit } from "@/lib/audit-store";
import { runWebsiteGrowthAudit } from "@/lib/website-growth-audit";

export const runtime = "nodejs";

type AuditRequestBody = {
  url?: string;
  businessName?: string;
  location?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuditRequestBody;
    const result = await runWebsiteGrowthAudit({
      url: body.url ?? "",
      businessName: body.businessName,
      location: body.location,
    });
    const auditId = await createStoredAudit({
      url: body.url ?? "",
      businessName: body.businessName,
      location: body.location,
      result,
    });

    return Response.json({
      ...result,
      auditId,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The audit could not be completed right now.";

    return Response.json({ error: message }, { status: 400 });
  }
}
