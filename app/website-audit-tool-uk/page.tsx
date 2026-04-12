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
  title: "Free Website Audit Tool UK | Find Out Why Your Website Isn't Working",
  description:
    "Use our free website audit tool to find out why your website isn't generating enquiries. Get instant insights into performance, conversion, and visibility.",
  path: "/website-audit-tool-uk",
  openGraph: {
    title: "Free Website Audit Tool UK | Find Out Why Your Website Isn't Working",
    description:
      "Use our free website audit tool to find out why your website isn't generating enquiries. Get instant insights into performance, conversion, and visibility.",
  },
});

type WebsiteAuditToolUkSearchParams = Promise<{
  url?: string | string[];
  business?: string | string[];
  location?: string | string[];
  autorun?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const auditChecks = [
  {
    title: "Conversion",
    points: [
      "Call-to-action visibility",
      "Contact accessibility",
      "Page structure",
      "User flow",
    ],
  },
  {
    title: "Performance",
    points: [
      "Page speed",
      "Loading issues",
      "Mobile experience",
    ],
  },
  {
    title: "Visibility",
    points: [
      "Basic SEO signals",
      "Page structure",
      "Content clarity",
    ],
  },
];

const websiteProblems = [
  "Built without a clear goal",
  "Focused on design instead of results",
  "Missing key conversion elements",
];

const auditOutputs = [
  "A clear breakdown of issues",
  "Simple explanations",
  "Actionable improvements",
];

const nextSteps = [
  "Improve your website yourself",
  "Get help implementing the fixes",
];

export default async function WebsiteAuditToolUkPage({
  searchParams,
}: {
  searchParams: WebsiteAuditToolUkSearchParams;
}) {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Website Audit Tool UK", path: "/website-audit-tool-uk" },
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
          id="website-audit-tool-uk-schema"
          value={[
            buildSoftwareApplicationSchema({
              name: "Website Audit Tool UK",
              path: "/website-audit-tool-uk",
              description:
                "A free website audit tool for UK businesses that highlights issues affecting enquiries, performance, and visibility.",
              applicationCategory: "BusinessApplication",
            }),
            buildBreadcrumbSchema(breadcrumbItems),
          ]}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Website Audit Tool UK" },
          ]}
        />
      </div>

      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Free Website Audit Tool UK
            </div>
            <div className="space-y-6">
              <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Free Website Audit Tool - Find Out What&apos;s Holding Your
                Website Back
              </h1>
              <p className="max-w-4xl text-lg leading-8 text-stone-300">
                If your website is not generating enquiries, there is always a
                reason.
              </p>
              <p className="max-w-4xl text-base leading-8 text-stone-300">
                Instead of guessing what is wrong, you can check your website
                in seconds.
              </p>
              <p className="max-w-4xl text-base leading-8 text-stone-300">
                This free website audit tool analyses your site and shows what
                is affecting conversions, where performance issues exist, and
                which areas need improvement.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="#run-audit"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Run Free Audit
              </Link>
              <Link
                href="/contact#project-enquiry"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Request a Free Review
              </Link>
            </div>
          </div>

          <div className="self-start rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 lg:p-8">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Why Use It
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Built around enquiries, not just technical metrics",
                "Highlights conversion, performance, and visibility issues",
                "Gives clear next steps without technical jargon",
                "Designed for real UK businesses",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="run-audit"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-10 lg:px-8 lg:py-12"
      >
        <SectionHeading
          eyebrow="Run the Audit"
          title="Enter your website URL to get started"
          description="Place your website into the audit tool below to check what is most likely stopping it from generating more enquiries."
        />
        <div className="mt-8">
          <WebsiteGrowthCheckTool
            initialUrl={initialUrl}
            initialBusinessName={initialBusinessName}
            initialLocation={initialLocation}
            autoStart={autoStart}
          />
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          <SectionHeading
            eyebrow="What the Audit Checks"
            title="The audit focuses on what actually matters for generating enquiries"
            description="The tool is built around practical website performance, conversion, and visibility issues rather than vanity metrics."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {auditChecks.map((section) => (
              <section
                key={section.title}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
              >
                <h2 className="text-xl font-semibold text-stone-50">
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-stone-300">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Why Most Websites Don't Work"
          title="Most websites fail because they are not built around results"
          description="A website can look fine on the surface and still fail to generate enquiries if the structure and goals are wrong."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {websiteProblems.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-4xl text-base leading-8 text-stone-300">
          Even small issues can significantly reduce the number of enquiries
          your site generates.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <SectionHeading
            eyebrow="What You'll Get"
            title="A clear breakdown without technical jargon"
            description="The audit is designed to be useful even if you are not technical."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {auditOutputs.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-4xl text-base leading-8 text-stone-300">
            No technical knowledge required.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="What To Do After"
          title="Once you know what's wrong, you can decide what to do next"
          description="Some businesses prefer to handle the fixes themselves, while others want support implementing the right changes."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {nextSteps.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-4xl text-base leading-8 text-stone-300">
          If you want, I can review your results and show you exactly what I
          would change.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <SectionHeading
            eyebrow="Built for UK Businesses"
            title="Designed for small and local businesses across the UK"
            description="This tool is intended for businesses that want their website to do more than just exist online."
          />
          <p className="max-w-4xl text-base leading-8 text-stone-300">
            It is especially useful for small and local businesses that want a
            clearer picture of why their website is not generating enough
            enquiries.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Need Help Fixing It?"
          title="These issues are often quick to fix, but they make a big difference"
          description="If you'd like help improving your site after running the audit, I can help review the issues and prioritise the right changes."
        />
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/contact#project-enquiry"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Request a Free Review
          </Link>
          <Link
            href="/improve-existing-website"
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Get Help Fixing Your Website
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Already know your website isn't working?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            Skip the guesswork and request a review directly, or run the free
            audit first if you want a quick breakdown of the likely issues.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact#project-enquiry"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Request a Review
            </Link>
            <Link
              href="/website-growth-check"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Run a Free Audit
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              href="/why-my-website-isnt-getting-enquiries"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Why Your Website Isn't Getting Enquiries
            </Link>
            <Link
              href="/services"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Services
            </Link>
            <Link
              href="/"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Homepage
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
