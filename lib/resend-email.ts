import { getAppSettings } from "@/lib/settings-store";

export async function sendResendEmail(input: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Array<{
    fileName: string;
    contentBase64: string;
    contentType: string;
  }>;
}) {
  const settings = await getAppSettings();

  if (!settings.resendApiKey || !settings.resendFromEmail) {
    throw new Error("Resend is not configured in settings.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: settings.resendFromEmail,
      reply_to: input.replyTo || settings.resendReplyToEmail || undefined,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      attachments: input.attachments?.map((attachment) => ({
        filename: attachment.fileName,
        content: attachment.contentBase64,
        type: attachment.contentType,
      })),
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { id?: string; message?: string; error?: { message?: string } }
    | null;

  if (!response.ok) {
    throw new Error(
      payload?.message || payload?.error?.message || "Resend email send failed."
    );
  }

  return {
    id: payload?.id,
  };
}
