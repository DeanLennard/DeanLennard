function getForwardedHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function buildRedirectUrl(request: Request, path: string) {
  const url = new URL(request.url);
  const forwardedHost = getForwardedHeaderValue(
    request.headers.get("x-forwarded-host")
  );
  const forwardedProto = getForwardedHeaderValue(
    request.headers.get("x-forwarded-proto")
  );
  const forwardedPort = getForwardedHeaderValue(
    request.headers.get("x-forwarded-port")
  );

  if (forwardedProto) {
    url.protocol = `${forwardedProto}:`;
  }

  if (forwardedHost) {
    const host =
      forwardedPort &&
      !forwardedHost.includes(":") &&
      forwardedPort !== "80" &&
      forwardedPort !== "443"
        ? `${forwardedHost}:${forwardedPort}`
        : forwardedHost;

    url.host = host;
  }

  return new URL(path, url);
}

export function toAbsoluteRedirect(request: Request, path: string) {
  return buildRedirectUrl(request, path);
}

export function absoluteRedirect(request: Request, path: string) {
  return buildRedirectUrl(request, path);
}
