import { createHmac, timingSafeEqual } from "node:crypto";

function safeCompareHex(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function verifyStripeSignature(payload: string, header: string, secret: string) {
  const parts = header
    .split(",")
    .map((part) => part.trim())
    .reduce<Record<string, string[]>>((accumulator, part) => {
      const [key, value] = part.split("=");

      if (!key || !value) {
        return accumulator;
      }

      const current = accumulator[key] ?? [];
      current.push(value);
      accumulator[key] = current;
      return accumulator;
    }, {});

  const timestamp = parts.t?.[0];
  const signatures = parts.v1 ?? [];

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  return signatures.some((signature) => safeCompareHex(expected, signature));
}

export function verifyGoCardlessSignature(
  payload: string,
  signature: string,
  secret: string
) {
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return safeCompareHex(expected, signature.trim());
}
