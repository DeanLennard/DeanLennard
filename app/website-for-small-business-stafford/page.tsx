import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Websites for Small Businesses in Stafford | Designed to Get Enquiries",
  description:
    "Professional websites for small businesses in Stafford designed to generate enquiries, not just look good. Fast, modern, and built to grow your business.",
  path: "/website-for-small-business-stafford",
  openGraph: {
    title: "Websites for Small Businesses in Stafford | Designed to Get Enquiries",
    description:
      "Professional websites for small businesses in Stafford designed to generate enquiries, not just look good. Fast, modern, and built to grow your business.",
  },
});

const websiteNeeds = [
  "Clearly explain what you do",
  "Show trust and credibility",
  "Guide visitors toward contacting you",
  "Work properly on mobile",
  "Load fast",
];

const localAudiences = [
  "Local service providers",
  "Consultants",
  "Growing small businesses",
];

const includedItems = [
  "Mobile-first design",
  "Fast performance",
  "Clear call-to-action structure",
  "Contact forms and enquiry setup",
  "SEO-ready structure",
  "Easy-to-manage setup",
];

const optionalItems = [
  "Ongoing care plans",
  "Performance improvements",
  "Updates and maintenance",
];

const reasonsToWorkWithMe = [
  "UK-based developer",
  "Focus on results, not just design",
  "Built for small business needs",
  "Ongoing support available",
];

export default function WebsiteForSmallBusinessStaffordPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    {
      name: "Website for Small Business Stafford",
      path: "/website-for-small-business-stafford",
    },
  ];

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8">
        <SchemaScript
          id="website-for-small-business-stafford-schema"
          value={[
            buildServiceSchema({
              name: "Websites for Small Businesses in Stafford",
              path: "/website-for-small-business-stafford",
              description:
                "Professional websites for small businesses in Stafford designed to generate enquiries with clear structure, strong performance, and SEO-ready foundations.",
              serviceType: "Small business website design and development",
              areaServed: "Stafford, Staffordshire, United Kingdom",
            }),
            buildBreadcrumbSchema(breadcrumbItems),
          ]}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Website for Small Business Stafford" },
          ]}
        />
      </div>

      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Small Business Website Stafford
            </div>
            <div className="space-y-6">
              <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Websites for Small Businesses in Stafford That Actually Generate
                Enquiries
              </h1>
              <p className="max-w-4xl text-lg leading-8 text-stone-300">
                If you&apos;re a small business in Stafford, your website should
                be doing more than just existing. It should be bringing in
                enquiries.
              </p>
              <p className="max-w-4xl text-base leading-8 text-stone-300">
                Most small business websites look decent but do not convert, are
                slow or outdated, and do not clearly guide visitors to take
                action.
              </p>
              <p className="max-w-4xl text-base leading-8 text-stone-300">
                I build websites specifically for small businesses that are
                designed to turn visitors into real leads.
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
                "Built for small businesses in Stafford and Staffordshire",
                "Focused on generating enquiries, not just looking good",
                "Fast, mobile-friendly, and structured properly",
                "Ongoing support available after launch",
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
          eyebrow="What You Need"
          title="What You Actually Need From a Website"
          description="A successful small business website is not about flashy design. It is about results."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {websiteNeeds.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-4xl text-base leading-8 text-stone-300">
          If your website does not do these things, you are likely losing
          potential customers.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <SectionHeading
            eyebrow="Local Relevance"
            title="Built for Stafford Businesses"
            description="I work with businesses across Stafford and Staffordshire, building websites that reflect your local market and customers."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {localAudiences.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-4xl text-base leading-8 text-stone-300">
            Your website needs to be simple, clear, and effective, especially
            if you are serving a local market and want more enquiries from the
            right people.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="What Is Included"
          title="What's Included"
          description="Every build is designed to give small businesses a strong, practical foundation."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <h2 className="text-xl font-semibold text-stone-50">
              Every Website Includes
            </h2>
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
            eyebrow="Already Have a Website?"
            title="If Your Website Is Not Generating Enquiries, the Issue Is Usually Structure"
            description="Many websites do not have a traffic problem first. They have a clarity, trust, or conversion problem."
          />
          <p className="max-w-4xl text-base leading-8 text-stone-300">
            If you already have a website but it is not generating enquiries,
            the issue usually is not traffic. It is structure.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            The free audit can show what is stopping your website from
            converting visitors into leads.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/website-growth-check"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Run a Free Website Audit
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

      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Why Work With Me"
          title="A Practical Approach for Small Business Websites"
          description="The focus is not just on design. It is on building something that supports your business properly."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reasonsToWorkWithMe.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Want a website that actually works for your business?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            I can show you exactly what your website needs to improve and help
            you decide on the most practical next step.
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
              href="/"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Homepage
            </Link>
            <Link
              href="/services"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Services
            </Link>
            <Link
              href="/website-growth-check"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Website Growth Check
            </Link>
            <Link
              href="/website-audit-tool-uk"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Website audit tool UK
            </Link>
            <Link
              href="/website-developer-for-trades-stafford"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Website developer for trades in Stafford
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
