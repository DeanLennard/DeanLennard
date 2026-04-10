const DEFAULT_PUBLIC_SITE_URL = "https://www.deanlennard.com";

export function getPublicSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_PUBLIC_SITE_URL;
}

export function toPublicUrl(path: string) {
  return new URL(path, getPublicSiteUrl()).toString();
}
