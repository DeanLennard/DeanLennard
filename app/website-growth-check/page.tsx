import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import { WebsiteGrowthCheckTool } from "@/components/website-growth-check-tool";
import {
  buildBreadcrumbSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Website Growth Check | Free Website Audit Tool",
  description:
    "Free website audit tool and website performance check to show why your website is not generating enquiries. Review conversion, performance, and visibility issues in seconds.",
  path: "/website-growth-check",
  openGraph: {
    title: "Website Growth Check | Free Website Audit Tool",
    description:
      "A free website audit tool that shows why your website is not generating enquiries and highlights performance and visibility issues.",
  },
});

type WebsiteGrowthCheckSearchParams = Promise<{
  url?: string | string[];
  business?: string | string[];
  location?: string | string[];
  autorun?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WebsiteGrowthCheckPage({
  searchParams,
}: {
  searchParams: WebsiteGrowthCheckSearchParams;
}) {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Website Growth Check", path: "/website-growth-check" },
  ];
  const resolvedSearchParams = await searchParams;
  const initialUrl = getSingleValue(resolvedSearchParams.url)?.trim() ?? "";
  const initialBusinessName =
    getSingleValue(resolvedSearchParams.business)?.trim() ?? "";
  const initialLocation =
    getSingleValue(resolvedSearchParams.location)?.trim() ?? "";
  const autoStart = getSingleValue(resolvedSearchParams.autorun) === "1";

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8">
        <SchemaScript
          id="website-growth-check-schema"
          value={[
            buildSoftwareApplicationSchema({
              name: "Website Growth Check",
              path: "/website-growth-check",
              description:
                "A free website audit tool that reviews conversion, performance, and visibility issues and highlights likely growth blockers.",
              applicationCategory: "BusinessApplication",
            }),
            buildBreadcrumbSchema(breadcrumbItems),
          ]}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Website Growth Check" },
          ]}
        />
      </div>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Free Website Audit Tool
            </div>
            <div className="space-y-6">
              <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Find out why your website isn&apos;t generating enquiries
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                Free instant audit, no technical knowledge needed.
              </p>
              <p className="max-w-4xl text-base leading-8 text-stone-300">
                In 30 seconds, see what&apos;s stopping your website from
                generating more enquiries.
              </p>
              <p className="max-w-4xl text-base leading-8 text-stone-300">
                In around 30 seconds, this tool reviews a business website and
                highlights what may be affecting conversions, performance, and
                visibility.
              </p>
            </div>
            <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
                Built for real business owners
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                {[
                  "Small business owners who need more leads from their website",
                  "Service businesses like clinics, trades, and consultants",
                  "Teams who know the site is underperforming but are not sure why",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-amber-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 lg:p-8">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              What the audit checks
            </p>
            <div className="mt-6 space-y-5 text-sm leading-7 text-stone-300">
              <div>
                <p className="font-semibold text-stone-100">Conversion</p>
                <p>
                  Calls-to-action, contact options, and basic homepage clarity.
                </p>
              </div>
              <div>
                <p className="font-semibold text-stone-100">Performance</p>
                <p>
                  Response speed, image-heavy pages, and mobile basics.
                </p>
              </div>
              <div>
                <p className="font-semibold text-stone-100">Visibility</p>
                <p>
                  Page title, meta description, headings, and local signals.
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-stone-300">
              Built by a professional web developer, with a focus on practical
              improvements rather than technical noise.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <WebsiteGrowthCheckTool
          initialUrl={initialUrl}
          initialBusinessName={initialBusinessName}
          initialLocation={initialLocation}
          autoStart={autoStart}
        />
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          <SectionHeading
            eyebrow="What Happens Next"
            title="Turn the audit into a practical action plan"
            description="If the results show issues that are likely hurting enquiries, I can help you fix them and improve the way the site performs."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Review the most important issues affecting your site",
              "Get a clear recommendation on what to fix first",
              "Discuss whether a deeper review or implementation makes sense",
            ].map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact#project-enquiry"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Request Review
            </Link>
            <Link
              href="/improve-existing-website"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Improve an Existing Website
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
