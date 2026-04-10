import { recordAuditIntent } from "@/lib/audit-store";
import type { AuditIntentType } from "@/lib/audit-intents";

const validIntentTypes = new Set<AuditIntentType>([
  "request_review",
  "request_fix_free_review",
  "book_call",
  "send_email",
  "calendly_open",
]);

type IntentRequestBody = {
  intentType?: AuditIntentType;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ auditId: string }> }
) {
  const { auditId } = await params;
  const body = (await request.json().catch(() => ({}))) as IntentRequestBody;

  if (!auditId || !body.intentType || !validIntentTypes.has(body.intentType)) {
    return Response.json({ error: "Invalid audit intent request." }, { status: 400 });
  }

  await recordAuditIntent(auditId, body.intentType);
  return new Response(null, { status: 204 });
}
