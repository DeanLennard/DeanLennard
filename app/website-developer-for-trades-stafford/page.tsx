import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Website Developer for Trades in Stafford | Get More Jobs, Not Just Traffic",
  description:
    "Websites for trades in Stafford designed to generate more calls and enquiries. Built for plumbers, electricians, builders and local services.",
  path: "/website-developer-for-trades-stafford",
  openGraph: {
    title: "Website Developer for Trades in Stafford | Get More Jobs, Not Just Traffic",
    description:
      "Websites for trades in Stafford designed to generate more calls and enquiries. Built for plumbers, electricians, builders and local services.",
  },
});

const customerDecisionPoints = [
  "Search locally",
  "Scan quickly",
  "Pick someone who looks trustworthy and easy to contact",
];

const websiteNeeds = [
  "Show what you do immediately",
  "Build trust fast",
  "Make contacting you effortless",
];

const commonProblems = [
  'No clear call-to-action, like "Call Now" or "Get a Quote"',
  "Poor mobile experience",
  "Slow load times",
  "Unclear services",
  "No trust signals such as reviews, images, or proof",
];

const includedItems = [
  'Clear "Call Now" and enquiry buttons',
  "Mobile-first layout",
  "Fast loading pages",
  "Simple service breakdown",
  "Trust elements such as reviews, images, and testimonials",
  "Contact forms and click-to-call",
];

const optionalItems = [
  "Ongoing maintenance",
  "Performance improvements",
  "Local SEO setup",
];

const whyItMatters = [
  "More enquiries",
  "Better quality jobs",
  "Less reliance on word of mouth",
];

const reasonsToWorkWithMe = [
  "Focused on results such as calls and enquiries",
  "Built for real trade businesses",
  "Fast turnaround",
  "Ongoing support available",
];

export default function WebsiteDeveloperForTradesStaffordPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    {
      name: "Website Developer for Trades Stafford",
      path: "/website-developer-for-trades-stafford",
    },
  ];

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8">
        <SchemaScript
          id="website-developer-for-trades-stafford-schema"
          value={[
            buildServiceSchema({
              name: "Website Developer for Trades in Stafford",
              path: "/website-developer-for-trades-stafford",
              description:
                "Websites for trades in Stafford designed to generate more calls, messages, and job enquiries for local service businesses.",
              serviceType: "Website design and development for trades businesses",
              areaServed: "Stafford, Staffordshire, United Kingdom",
            }),
            buildBreadcrumbSchema(breadcrumbItems),
          ]}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Website Developer for Trades Stafford" },
          ]}
        />
      </div>

      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Trades Website Stafford
            </div>
            <div className="space-y-6">
              <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Websites for Trades in Stafford That Bring in More Jobs
              </h1>
              <p className="max-w-4xl text-lg leading-8 text-stone-300">
                If you&apos;re a tradesperson in Stafford, your website should
                be helping you win better jobs, not just sitting there.
              </p>
              <p className="max-w-4xl text-base leading-8 text-stone-300">
                Most trade websites do not generate consistent enquiries, make
                it hard for customers to contact you, and look outdated or
                untrustworthy.
              </p>
              <p className="max-w-4xl text-base leading-8 text-stone-300">
                I build websites specifically for trades that are designed to
                get more calls, messages, and job enquiries.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact#project-enquiry"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Request a Free Review
              </Link>
              <Link
                href="/website-growth-check"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Run a Free Audit
              </Link>
            </div>
          </div>

          <div className="self-start rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Built for plumbers, electricians, builders, and local trades",
                "Focused on more calls, messages, and job enquiries",
                "Fast on mobile where most trade traffic happens",
                "Trust-focused layout with easy contact options",
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

      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="How Customers Choose"
          title="Built for How Customers Actually Choose Trades"
          description="When someone needs a plumber, electrician, or builder, they do not spend hours researching."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <h2 className="text-xl font-semibold text-stone-50">
              What They Usually Do
            </h2>
            <div className="mt-6 grid gap-4">
              {customerDecisionPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-6">
            <h2 className="text-xl font-semibold text-stone-50">
              What Your Website Needs To Do
            </h2>
            <div className="mt-6 grid gap-4">
              {websiteNeeds.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-amber-500/20 bg-black/10 p-4 text-sm leading-7 text-stone-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <SectionHeading
            eyebrow="Common Problems"
            title="Why Trade Websites Often Miss Out on Jobs"
            description="Most trade websites fail for simple reasons that directly affect trust and conversions."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {commonProblems.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-4xl text-base leading-8 text-stone-300">
            This usually leads to lost enquiries and missed jobs.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="What I Build"
          title="Websites for Trades Designed To Maximise Enquiries"
          description="Every website is built around helping potential customers contact you quickly and confidently."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <h2 className="text-xl font-semibold text-stone-50">Includes</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {includedItems.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-6">
            <h2 className="text-xl font-semibold text-stone-50">Optional</h2>
            <div className="mt-6 grid gap-4">
              {optionalItems.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-amber-500/20 bg-black/10 p-4 text-sm leading-7 text-stone-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <SectionHeading
            eyebrow="Already Getting Traffic?"
            title="If People Visit but Do Not Call, It Is Usually a Conversion Problem"
            description="This is very common with trade websites that get some visibility but do not make contacting you easy enough."
          />
          <p className="max-w-4xl text-base leading-8 text-stone-300">
            If people are visiting your site but not contacting you, it is
            usually a conversion issue rather than a traffic issue.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            The free audit will show what is stopping your site from turning
            visitors into jobs.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/website-growth-check"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Run a Free Website Audit
            </Link>
            <Link
              href="/website-for-small-business-stafford"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Small Business Website Page
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Why This Matters"
          title="Small Website Improvements Can Mean Better Jobs"
          description="For local trades, even a modest improvement in structure and trust can change how many enquiries come through."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {whyItMatters.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <SectionHeading
            eyebrow="Why Work With Me"
            title="Built To Help Trade Businesses Win More Enquiries"
            description="The goal is straightforward: make your website easier to trust, easier to contact, and more useful for local customers."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reasonsToWorkWithMe.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Want more enquiries from your website?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            I can show you exactly what needs improving and help you decide on
            the most practical next step.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact#project-enquiry"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Request a Free Review
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
              href="/website-growth-check"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Website Growth Check
            </Link>
            <Link
              href="/website-for-small-business-stafford"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Small Business Website Stafford
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
