import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Improve Existing Website | Fix Performance, SEO & Delivery Issues",
  description:
    "Improve your existing website with performance optimisation, technical SEO fixes, and full-stack development support. Fix slow, underperforming platforms.",
  path: "/improve-existing-website",
  openGraph: {
    title: "Improve Existing Website | Fix Performance, SEO & Delivery Issues",
    description:
      "Improve your existing website with performance optimisation, technical SEO fixes, and full-stack development support. Fix slow, underperforming platforms.",
  },
});

const problems = [
  "Slow load times and poor Core Web Vitals",
  "Low search visibility despite good content",
  "Outdated or hard-to-maintain code",
  "Poor structure or user experience",
  "Systems that do not scale or integrate properly",
];

const services = [
  "Performance optimisation and speed improvements",
  "Technical SEO fixes and site structure improvements",
  "Codebase clean-up and refactoring",
  "UI and UX improvements",
  "API integrations and system enhancements",
  "Stabilising and scaling existing platforms",
];

const capabilities = [
  "Full-stack development",
  "Technical SEO",
  "Infrastructure and performance optimisation",
  "Structured delivery",
];

const outcomes = [
  "Faster load times",
  "Better search performance",
  "Improved usability",
  "Cleaner, more maintainable systems",
];

const audiences = [
  "Businesses with underperforming websites",
  "Teams struggling with slow or unstable platforms",
  "Sites with SEO or performance issues",
  "Companies needing improvements without a full rebuild",
];

export default function ImproveExistingWebsitePage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Improve Existing Website", path: "/improve-existing-website" },
  ];

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8">
        <SchemaScript
          id="improve-existing-website-schema"
          value={[
            buildServiceSchema({
              name: "Improve Existing Website",
              path: "/improve-existing-website",
              description:
                "Improve your existing website with performance optimisation, technical SEO fixes, and full-stack development support.",
              serviceType: "Website improvement and optimisation services",
            }),
            buildBreadcrumbSchema(breadcrumbItems),
          ]}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Improve Existing Website" },
          ]}
        />
      </div>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Improve Existing Website
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Improve Your Existing Website - Performance, SEO & Delivery
                Fixes
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                If your website is not performing as it should, I can help
                identify the issues and implement the fixes.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                I work with businesses to improve existing websites, fixing
                performance problems, resolving technical issues, and delivering
                practical improvements that make a real impact.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Book a Call
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Discuss Your Website
              </Link>
            </div>
            <div className="space-y-3 text-sm leading-7 text-stone-300">
              <p>
                Happy to discuss projects at any stage, even if you&apos;re
                still figuring things out.
              </p>
              <p>
                Most projects start with a short call to understand your
                requirements and outline next steps.
              </p>
              <p>There&apos;s no obligation, just a practical conversation about what you need.</p>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Performance fixes",
                "Technical SEO improvements",
                "Codebase clean-up",
                "Structured delivery of improvements",
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

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="Problem Identification"
          title="Is Your Website Holding You Back?"
          description="Many websites look fine on the surface but have underlying issues that limit performance."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {problems.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          These problems often go unnoticed, but they directly affect traffic,
          conversions, and business performance.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="What I Do"
            title="Website Improvement & Optimisation Services"
            description="I focus on improving existing platforms rather than replacing them unnecessarily."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((item) => (
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

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="Your Edge"
          title="Development + SEO + Delivery in One Place"
          description="Improving a website often requires multiple skillsets. I combine them."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          This means issues are not just identified. They are fixed properly and
          efficiently.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Approach"
            title="Practical, Measurable Improvements"
            description="I focus on making improvements that have real impact."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {outcomes.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
            The goal is not just to update your site, but to make it work
            better.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <SectionHeading
            eyebrow="Website Review"
            title="Website Performance & Technical Review"
            description="If you already have a website or platform, I can provide a focused review covering performance and speed, technical SEO issues, structure and usability, and potential improvements."
          />
          <p className="mt-6 max-w-4xl text-base leading-8 text-stone-300">
            You&apos;ll get a clear, practical summary of what&apos;s working
            and what isn&apos;t, along with suggested next steps.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Request a Review
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Book a Call
            </Link>
          </div>
          <div className="mt-6">
            <Link
              href="/website-growth-check"
              className="text-sm font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
            >
              Try the Website Growth Check
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="Who It&apos;s For"
          title="Who This Is For"
          description="This service is for businesses and teams that need existing websites to perform better without a full rebuild."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {audiences.map((item) => (
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
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Related Work"
            title="Relevant Projects"
            description="I&apos;ve worked on improving and scaling web platforms by combining development, SEO, and delivery."
          />
          <div className="mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            View Related Projects
          </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Let&apos;s Improve Your Website
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If your website is not performing as it should, let&apos;s discuss
            the issues, the right fixes, and the next steps.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            Most projects start with a short call to understand your
            requirements and outline next steps.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            There&apos;s no obligation, just a practical conversation about what
            you need.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re unsure what you need yet, I can help you work
            through the options.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Book a Call
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Discuss Your Website
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              href="/technical-seo-services-uk"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Technical SEO services
            </Link>
            <Link
              href="/web-application-development-uk"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Web application development
            </Link>
            <Link
              href="/services"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Services page
            </Link>
            <Link
              href="/contact"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Contact page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
