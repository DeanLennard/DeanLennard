import * as tls from "node:tls";

export type AuditSeverity = "error" | "warning" | "success";
export type AuditCategory = "conversion" | "performance" | "visibility";

export type AuditIssue = {
  severity: AuditSeverity;
  category: AuditCategory;
  message: string;
};

export type AuditScore = {
  score: number;
  label: string;
};

export type WebsiteGrowthAuditResult = {
  normalizedUrl: string;
  checkedAt: string;
  scores: {
    conversion: AuditScore;
    performance: AuditScore;
    visibility: AuditScore;
  };
  issues: AuditIssue[];
  goodSignals: string[];
};

type AuditInput = {
  url: string;
  businessName?: string;
  location?: string;
};

type AuditContext = {
  normalizedUrl: string;
  html: string;
  fetchDurationMs: number;
  responseHeaders: Headers;
  responseStatus: number;
  sslCheck: SslCheckResult;
  businessName?: string;
  location?: string;
};

type NormalizedUrlResult = {
  normalizedUrl: string;
  hadExplicitProtocol: boolean;
};

type FetchHtmlResult = {
  html: string;
  fetchDurationMs: number;
  responseHeaders: Headers;
  responseStatus: number;
  finalUrl?: string;
};

type SslCheckResult =
  | {
      status: "not_applicable";
    }
  | {
      status: "error";
      message: string;
    }
  | {
      status: "success";
      validTo: string;
      daysUntilExpiry: number;
      isAuthorized: boolean;
      authorizationError?: string;
    };

const CTA_PATTERN =
  /(contact|get in touch|book a call|book now|start project|start now|request|quote|enquiry|enquire|talk to|call us|call now|free review|free audit|get started)/i;
const EMAIL_PATTERN =
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_PATTERN =
  /(\+?\d[\d\s().-]{7,}\d)/i;

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function scoreLabel(score: number) {
  if (score >= 85) {
    return "Strong";
  }

  if (score >= 65) {
    return "Reasonable";
  }

  if (score >= 45) {
    return "Needs attention";
  }

  return "Weak";
}

function normalizeUrl(rawUrl: string): NormalizedUrlResult {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new Error("Enter a website URL to run the audit.");
  }

  const hadExplicitProtocol = /^https?:\/\//i.test(trimmed);
  const withProtocol = hadExplicitProtocol ? trimmed : `https://${trimmed}`;

  const parsed = new URL(withProtocol);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http and https website URLs are supported.");
  }

  return {
    normalizedUrl: parsed.toString(),
    hadExplicitProtocol,
  };
}

async function fetchHtmlOnce(normalizedUrl: string): Promise<FetchHtmlResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const startedAt = Date.now();

  try {
    const response = await fetch(normalizedUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; DeanLennardWebsiteAudit/1.0; +https://www.deanlennard.com)",
      },
    });

    const fetchDurationMs = Date.now() - startedAt;

    if (!response.ok) {
      throw new Error(
        `The website returned ${response.status}. Try checking the URL and try again.`
      );
    }

    const html = await response.text();
    return {
      html,
      fetchDurationMs,
      responseHeaders: response.headers,
      responseStatus: response.status,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "The website took too long to respond. Try again or test a different page."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("The website could not be checked right now.");
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchHtml(
  normalizedUrl: string,
  hadExplicitProtocol: boolean
): Promise<FetchHtmlResult> {
  try {
    return await fetchHtmlOnce(normalizedUrl);
  } catch (error) {
    const parsedUrl = new URL(normalizedUrl);

    if (
      !hadExplicitProtocol &&
      parsedUrl.protocol === "https:" &&
      !parsedUrl.port
    ) {
      const fallbackUrl = new URL(normalizedUrl);
      fallbackUrl.protocol = "http:";

      const fallbackResult = await fetchHtmlOnce(fallbackUrl.toString());
      return {
        ...fallbackResult,
        finalUrl: fallbackUrl.toString(),
      };
    }

    throw error;
  }
}

async function checkSslCertificate(normalizedUrl: string): Promise<SslCheckResult> {
  const parsedUrl = new URL(normalizedUrl);

  if (parsedUrl.protocol !== "https:") {
    return {
      status: "error",
      message: "The website is not using HTTPS, which can reduce trust and hurt conversions.",
    };
  }

  const host = parsedUrl.hostname;
  const port = parsedUrl.port ? Number(parsedUrl.port) : 443;

  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host,
        port,
        servername: host,
        rejectUnauthorized: false,
      },
      () => {
        try {
          const certificate = socket.getPeerCertificate();

          if (!certificate || !certificate.valid_to) {
            resolve({
              status: "error",
              message: "The SSL certificate could not be read properly.",
            });
            socket.end();
            return;
          }

          const validTo = new Date(certificate.valid_to);
          if (Number.isNaN(validTo.getTime())) {
            resolve({
              status: "error",
              message: "The SSL certificate expiry date could not be read properly.",
            });
            socket.end();
            return;
          }

          const daysUntilExpiry = Math.ceil(
            (validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          resolve({
            status: "success",
            validTo: validTo.toISOString(),
            daysUntilExpiry,
            isAuthorized: socket.authorized,
            authorizationError: socket.authorizationError
              ? String(socket.authorizationError)
              : undefined,
          });
        } catch {
          resolve({
            status: "error",
            message: "The SSL certificate could not be checked right now.",
          });
        } finally {
          socket.end();
        }
      }
    );

    socket.setTimeout(7000, () => {
      resolve({
        status: "error",
        message: "The SSL certificate check timed out.",
      });
      socket.destroy();
    });

    socket.on("error", () => {
      resolve({
        status: "error",
        message: "The SSL certificate could not be checked right now.",
      });
    });
  });
}

function stripTags(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(html: string) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function getTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtml(match[1]).trim() : "";
}

function getMetaContent(html: string, name: string) {
  const pattern = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = html.match(pattern);
  return match ? decodeHtml(match[1]).trim() : "";
}

function getFirstHeading(html: string, tag: "h1" | "h2") {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeHtml(match[1].replace(/<[^>]+>/g, " ").trim()) : "";
}

function getCtaMatches(html: string) {
  const matches = html.match(
    /<(a|button)[^>]*>[\s\S]*?<\/(a|button)>/gi
  );

  if (!matches) {
    return [];
  }

  return matches.filter((item) => CTA_PATTERN.test(item));
}

function getImageCount(html: string) {
  return (html.match(/<img\b/gi) ?? []).length;
}

function getNonLazyImageCount(html: string) {
  const matches = html.match(/<img\b[^>]*>/gi) ?? [];
  return matches.filter((item) => !/loading=["']lazy["']/i.test(item)).length;
}

function getBodyOpeningTag(html: string) {
  const match = html.match(/<body[^>]*>/i);
  return match?.index ?? 0;
}

function getAboveTheFoldHtml(html: string) {
  const bodyIndex = getBodyOpeningTag(html);
  const startIndex = bodyIndex > 0 ? bodyIndex : 0;
  const sliceLength = 4500;
  return html.slice(startIndex, startIndex + sliceLength);
}

function getEarlyVisibleText(html: string) {
  return stripTags(getAboveTheFoldHtml(html)).toLowerCase();
}

function hasViewportMeta(html: string) {
  return /<meta[^>]+name=["']viewport["']/i.test(html);
}

function hasContactForm(html: string) {
  return /<form\b/i.test(html);
}

function hasVisibleEmail(text: string) {
  return EMAIL_PATTERN.test(text);
}

function hasVisiblePhone(text: string) {
  return PHONE_PATTERN.test(text);
}

function hasLocalSignals(text: string, location?: string) {
  const lowerText = text.toLowerCase();
  const localHints = [
    "uk",
    "united kingdom",
    "staffordshire",
    "stafford",
    "stoke-on-trent",
    "cannock",
    "birmingham",
    "manchester",
    "london",
    "local business",
  ];

  if (location?.trim()) {
    return lowerText.includes(location.trim().toLowerCase());
  }

  return localHints.some((item) => lowerText.includes(item));
}

function hasKeywordSignals(text: string) {
  const lowerText = text.toLowerCase();
  const keywordHints = [
    "service",
    "services",
    "business",
    "website",
    "web",
    "clinic",
    "consultant",
    "plumber",
    "electrician",
    "accountant",
    "solicitor",
    "builder",
    "developer",
    "design",
    "seo",
    "marketing",
  ];

  return keywordHints.some((item) => lowerText.includes(item));
}

function getKeywordSignalCount(text: string) {
  const lowerText = text.toLowerCase();
  const keywordHints = [
    "service",
    "services",
    "business",
    "website",
    "web",
    "clinic",
    "consultant",
    "plumber",
    "electrician",
    "accountant",
    "solicitor",
    "builder",
    "developer",
    "design",
    "seo",
    "marketing",
    "repair",
    "trade",
    "booking",
  ];

  return keywordHints.filter((item) => lowerText.includes(item)).length;
}

function hasGoogleBusinessHint(text: string) {
  const lowerText = text.toLowerCase();
  const localBusinessHints = [
    "opening hours",
    "review",
    "reviews",
    "directions",
    "find us",
    "visit us",
    "call us",
    "google maps",
    "located in",
    "serving",
  ];

  return localBusinessHints.some((item) => lowerText.includes(item));
}

function hasStructuredLocalBusinessData(html: string) {
  return /"@type"\s*:\s*"(LocalBusiness|ProfessionalService|Organization)"/i.test(
    html
  );
}

function hasAddressSignal(text: string) {
  return /\b(street|road|avenue|lane|drive|court|postcode|post code|suite|unit)\b/i.test(
    text
  );
}

function hasMapEmbed(html: string) {
  return /google\.com\/maps|maps\.google\.com|google maps/i.test(html);
}

function hasReviewSignal(text: string) {
  return /\b(review|reviews|rated|rating|testimonials?)\b/i.test(text);
}

function getImageSources(html: string, pageUrl: string) {
  const matches = [...html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)];

  return matches
    .map((match) => match[1])
    .filter(Boolean)
    .slice(0, 5)
    .map((src) => {
      try {
        return new URL(src, pageUrl).toString();
      } catch {
        return null;
      }
    })
    .filter((src): src is string => Boolean(src));
}

function getAssetSources(
  html: string,
  pageUrl: string,
  tag: "script" | "stylesheet"
) {
  const pattern =
    tag === "script"
      ? /<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi
      : /<link\b[^>]*rel=["'][^"']*stylesheet[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/gi;

  const matches = [...html.matchAll(pattern)];

  return matches
    .map((match) => match[1])
    .filter(Boolean)
    .slice(0, 5)
    .map((src) => {
      try {
        return new URL(src, pageUrl).toString();
      } catch {
        return null;
      }
    })
    .filter((src): src is string => Boolean(src));
}

async function getLargeImageCount(imageUrls: string[]) {
  let largeImageCount = 0;

  for (const imageUrl of imageUrls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(imageUrl, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const contentLength = Number(response.headers.get("content-length") ?? "0");
      if (contentLength > 450000) {
        largeImageCount += 1;
      }
    } catch {
      continue;
    }
  }

  return largeImageCount;
}

async function getApproximateAssetWeight(assetUrls: string[]) {
  let totalBytes = 0;

  for (const assetUrl of assetUrls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(assetUrl, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const contentLength = Number(response.headers.get("content-length") ?? "0");
      totalBytes += Number.isFinite(contentLength) ? contentLength : 0;
    } catch {
      continue;
    }
  }

  return totalBytes;
}

function buildConversionAudit(context: AuditContext) {
  const issues: AuditIssue[] = [];
  const goodSignals: string[] = [];
  let score = 100;

  const text = stripTags(context.html);
  const ctas = getCtaMatches(context.html);
  const aboveTheFoldHtml = getAboveTheFoldHtml(context.html);
  const aboveTheFoldCtas = getCtaMatches(aboveTheFoldHtml);
  const earlyVisibleText = getEarlyVisibleText(context.html);
  const hasForm = hasContactForm(context.html);
  const hasEmail = hasVisibleEmail(text);
  const hasPhone = hasVisiblePhone(text);
  const firstH1 = getFirstHeading(context.html, "h1");

  if (ctas.length === 0) {
    score -= 20;
    issues.push({
      severity: "error",
      category: "conversion",
      message: "No clear call-to-action was detected on the page.",
    });
  } else if (ctas.length === 1) {
    score -= 8;
    issues.push({
      severity: "warning",
      category: "conversion",
      message: "Only one clear call-to-action was detected. More prominent next steps could help conversions.",
    });
  } else {
    goodSignals.push("Clear calls-to-action are visible on the page.");
  }

  if (aboveTheFoldCtas.length === 0) {
    score -= 12;
    issues.push({
      severity: "warning",
      category: "conversion",
      message: "No clear call-to-action appears near the top of the page, which can reduce early enquiries.",
    });
  } else {
    goodSignals.push("A call-to-action appears near the top of the page.");
  }

  if (!hasForm) {
    score -= 10;
    issues.push({
      severity: "warning",
      category: "conversion",
      message: "No contact form was detected, which can reduce enquiries from visitors who do not want to call.",
    });
  } else {
    goodSignals.push("A contact form is available for visitors who want to enquire.");
  }

  if (!hasEmail && !hasPhone) {
    score -= 12;
    issues.push({
      severity: "warning",
      category: "conversion",
      message: "Contact details are hard to find, which can make it harder for visitors to enquire quickly.",
    });
  } else {
    goodSignals.push("Contact details appear to be visible on the page.");
  }

  if (!firstH1) {
    score -= 12;
    issues.push({
      severity: "error",
      category: "conversion",
      message: "The page does not appear to have a clear main headline, which can make the offer harder to understand quickly.",
    });
  } else {
    const wordCount = firstH1.split(/\s+/).filter(Boolean).length;
    const headlineText = `${firstH1} ${earlyVisibleText}`.toLowerCase();
    const claritySignals = [
      "book",
      "call",
      "contact",
      "service",
      "website",
      "developer",
      "seo",
      "business",
      "project",
      "app",
      "quote",
      "help",
      "service",
      "get in touch",
    ];
    const hasClaritySignal = claritySignals.some((item) =>
      headlineText.includes(item)
    );
    const veryShortTopCopy = earlyVisibleText.split(/\s+/).filter(Boolean).length < 18;

    if (wordCount < 4 || !hasClaritySignal || veryShortTopCopy) {
      score -= 8;
      issues.push({
        severity: "warning",
        category: "conversion",
        message: "The headline and opening copy may not explain the offer clearly enough near the top of the page.",
      });
    } else {
      goodSignals.push("The page has a clear main headline.");
    }
  }

  return {
    score: clampScore(score),
    issues,
    goodSignals,
  };
}

async function buildPerformanceAudit(context: AuditContext) {
  const issues: AuditIssue[] = [];
  const goodSignals: string[] = [];
  let score = 100;

  const imageCount = getImageCount(context.html);
  const nonLazyImageCount = getNonLazyImageCount(context.html);
  const hasViewport = hasViewportMeta(context.html);
  const imageSources = getImageSources(context.html, context.normalizedUrl);
  const stylesheetSources = getAssetSources(
    context.html,
    context.normalizedUrl,
    "stylesheet"
  );
  const scriptSources = getAssetSources(
    context.html,
    context.normalizedUrl,
    "script"
  );
  const largeImageCount = await getLargeImageCount(imageSources);
  const assetWeightBytes = await getApproximateAssetWeight([
    ...stylesheetSources,
    ...scriptSources,
  ]);
  const serverTimingHeader = context.responseHeaders.get("server-timing");

  if (context.fetchDurationMs > 3000) {
    score -= 20;
    issues.push({
      severity: "error",
      category: "performance",
      message: "Page speed looks slow enough to affect conversions and user trust.",
    });
  } else if (context.fetchDurationMs > 1600 || context.responseStatus >= 300) {
    score -= 10;
    issues.push({
      severity: "warning",
      category: "performance",
      message: "The page response time could be improved to reduce friction for visitors.",
    });
  } else {
    goodSignals.push("Initial page response time looks reasonable.");
  }

  if (largeImageCount > 0) {
    score -= 15;
    issues.push({
      severity: "error",
      category: "performance",
      message: "Large image assets were detected and may be slowing down the page for visitors.",
    });
  } else if (imageCount >= 10 || nonLazyImageCount >= 6) {
    score -= 12;
    issues.push({
      severity: "warning",
      category: "performance",
      message: "Large or image-heavy sections may be slowing down the page for visitors on mobile devices.",
    });
  } else if (imageCount > 0) {
    goodSignals.push("The page does not appear overloaded with images.");
  }

  if (assetWeightBytes > 900000) {
    score -= 10;
    issues.push({
      severity: "warning",
      category: "performance",
      message: "Stylesheets or scripts appear fairly heavy, which may slow down the page on weaker connections.",
    });
  } else if (assetWeightBytes > 0) {
    goodSignals.push("Frontend asset weight looks reasonably controlled.");
  }

  if (serverTimingHeader) {
    goodSignals.push("Server timing information is available, which is helpful for performance tuning.");
  }

  if (!hasViewport) {
    score -= 12;
    issues.push({
      severity: "error",
      category: "performance",
      message: "No mobile viewport setting was detected, which can cause problems on phones and tablets.",
    });
  } else {
    goodSignals.push("Basic mobile viewport support is in place.");
  }

  return {
    score: clampScore(score),
    issues,
    goodSignals,
  };
}

function buildVisibilityAudit(context: AuditContext) {
  const issues: AuditIssue[] = [];
  const goodSignals: string[] = [];
  let score = 100;

  const title = getTitle(context.html);
  const metaDescription = getMetaContent(context.html, "description");
  const h1 = getFirstHeading(context.html, "h1");
  const text = stripTags(context.html);
  const earlyVisibleText = getEarlyVisibleText(context.html);
  const seoSummaryText = [title, metaDescription, h1].join(" ").trim();

  if (!title) {
    score -= 15;
    issues.push({
      severity: "error",
      category: "visibility",
      message: "Missing page title. This makes it harder for search engines and users to understand the page.",
    });
  } else if (title.length < 20) {
    score -= 8;
    issues.push({
      severity: "warning",
      category: "visibility",
      message: "The page title is present but may be too short to target the right search terms clearly.",
    });
  } else {
    goodSignals.push("A page title is in place.");
  }

  if (!metaDescription) {
    score -= 12;
    issues.push({
      severity: "error",
      category: "visibility",
      message: "Missing meta description. This can weaken how the page appears in search results.",
    });
  } else {
    goodSignals.push("A meta description is in place.");
  }

  if (!h1) {
    score -= 12;
    issues.push({
      severity: "error",
      category: "visibility",
      message: "No H1 heading was detected, which can weaken page structure and clarity for search engines.",
    });
  }

  const keywordSignalCount = getKeywordSignalCount(seoSummaryText);
  const topCopyKeywordSignalCount = getKeywordSignalCount(earlyVisibleText);

  if (
    seoSummaryText &&
    (!hasKeywordSignals(seoSummaryText) ||
      keywordSignalCount < 2 ||
      topCopyKeywordSignalCount < 1)
  ) {
    score -= 8;
    issues.push({
      severity: "warning",
      category: "visibility",
      message: "Keyword targeting looks weak, so the page may not be clearly signalling what the business offers or where it helps.",
    });
  } else if (seoSummaryText) {
    goodSignals.push("The page includes some useful keyword signals.");
  }

  if (!hasLocalSignals(text, context.location)) {
    score -= 10;
    issues.push({
      severity: "warning",
      category: "visibility",
      message: context.location
        ? `No clear local signals related to ${context.location} were detected.`
        : "No clear local or regional signals were detected, which may make it harder to rank for local searches.",
    });
  } else {
    goodSignals.push("The page includes local or regional signals.");
  }

  if (
    !hasGoogleBusinessHint(text) &&
    !hasStructuredLocalBusinessData(context.html) &&
    !hasAddressSignal(text) &&
    !hasMapEmbed(context.html) &&
    !hasReviewSignal(text)
  ) {
    score -= 6;
    issues.push({
      severity: "warning",
      category: "visibility",
      message: "There are limited local trust signals, such as location details, reviews, or business information.",
    });
  } else {
    goodSignals.push("The page includes some local business trust signals.");
  }

  if (context.businessName?.trim()) {
    const businessName = context.businessName.trim().toLowerCase();
    if (!text.toLowerCase().includes(businessName) && !title.toLowerCase().includes(businessName)) {
      score -= 6;
      issues.push({
        severity: "warning",
        category: "visibility",
        message: "The business name is not clearly referenced on the page, which can weaken brand relevance.",
      });
    }
  }

  if (context.sslCheck.status === "error") {
    score -= 18;
    issues.push({
      severity: "error",
      category: "visibility",
      message: context.sslCheck.message,
    });
  }

  if (context.sslCheck.status === "success") {
    if (!context.sslCheck.isAuthorized) {
      score -= 18;
      issues.push({
        severity: "error",
        category: "visibility",
        message: "The SSL certificate does not appear to be fully trusted, which can affect visitor confidence.",
      });
    } else if (context.sslCheck.daysUntilExpiry <= 0) {
      score -= 18;
      issues.push({
        severity: "error",
        category: "visibility",
        message: "The SSL certificate appears to have expired, which can block visitors and reduce trust immediately.",
      });
    } else if (context.sslCheck.daysUntilExpiry <= 30) {
      score -= 8;
      issues.push({
        severity: "warning",
        category: "visibility",
        message: `The SSL certificate expires soon, in about ${context.sslCheck.daysUntilExpiry} days, so it should be renewed soon.`,
      });
    } else {
      goodSignals.push(
        `The SSL certificate is active and currently valid for about ${context.sslCheck.daysUntilExpiry} more days.`
      );
    }
  }

  return {
    score: clampScore(score),
    issues,
    goodSignals,
  };
}

export async function runWebsiteGrowthAudit(input: AuditInput): Promise<WebsiteGrowthAuditResult> {
  const normalized = normalizeUrl(input.url);
  const {
    html,
    fetchDurationMs,
    responseHeaders,
    responseStatus,
    finalUrl,
  } = await fetchHtml(normalized.normalizedUrl, normalized.hadExplicitProtocol);
  const effectiveUrl = finalUrl ?? normalized.normalizedUrl;
  const sslCheck = await checkSslCertificate(effectiveUrl);

  const context: AuditContext = {
    normalizedUrl: effectiveUrl,
    html,
    fetchDurationMs,
    responseHeaders,
    responseStatus,
    sslCheck,
    businessName: input.businessName,
    location: input.location,
  };

  const conversion = buildConversionAudit(context);
  const performance = await buildPerformanceAudit(context);
  const visibility = buildVisibilityAudit(context);

  const combinedIssues = [
    ...conversion.issues,
    ...performance.issues,
    ...visibility.issues,
  ]
    .sort((a, b) => {
      const severityOrder = { error: 0, warning: 1, success: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    })
    .slice(0, 7);

  const goodSignals = [
    ...conversion.goodSignals,
    ...performance.goodSignals,
    ...visibility.goodSignals,
  ].slice(0, 4);

  return {
    normalizedUrl: effectiveUrl,
    checkedAt: new Date().toISOString(),
    scores: {
      conversion: {
        score: conversion.score,
        label: scoreLabel(conversion.score),
      },
      performance: {
        score: performance.score,
        label: scoreLabel(performance.score),
      },
      visibility: {
        score: visibility.score,
        label: scoreLabel(visibility.score),
      },
    },
    issues: combinedIssues,
    goodSignals,
  };
}
