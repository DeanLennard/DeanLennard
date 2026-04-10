import { createStoredAudit } from "@/lib/audit-store";
import { runWebsiteGrowthAudit } from "@/lib/website-growth-audit";

export const runtime = "nodejs";

type AuditRequestBody = {
  url?: string;
  businessName?: string;
  location?: string;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuditRequestBody;
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
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
      traffic: {
        sourcePage: body.sourcePage,
        referrer: request.headers.get("referer") ?? undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
        ipAddress: forwardedFor || request.headers.get("x-real-ip") || undefined,
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        utmTerm: body.utmTerm,
        utmContent: body.utmContent,
      },
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
