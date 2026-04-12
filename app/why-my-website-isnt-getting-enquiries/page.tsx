import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
} from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Why Your Website Isn't Getting Enquiries (And How to Fix It)",
  description:
    "Not getting enquiries from your website? Learn the most common reasons websites fail to convert and how to fix them to start generating leads.",
  path: "/why-my-website-isnt-getting-enquiries",
  openGraph: {
    title: "Why Your Website Isn't Getting Enquiries (And How to Fix It)",
    description:
      "Not getting enquiries from your website? Learn the most common reasons websites fail to convert and how to fix them to start generating leads.",
  },
});

const signs = [
  "Visitors but no enquiries",
  "Low engagement",
  "People leaving quickly",
];

const issues = [
  {
    title: "No Clear Call-to-Action",
    description:
      'If visitors do not immediately know what to do next, they leave. Clear actions like "Get a Quote", "Call Now", or "Book a Call" need to be obvious and repeated.',
  },
  {
    title: "Poor Mobile Experience",
    description:
      "Most users are on mobile. If your site is hard to read, slow, or poorly structured on a phone, you lose them almost instantly.",
  },
  {
    title: "Slow Load Speed",
    description:
      "Even a short delay can significantly reduce conversions. Users usually will not wait for a slow website to catch up.",
  },
  {
    title: "No Trust Signals",
    description:
      "Without reviews, testimonials, real images, or visible proof of credibility, visitors will hesitate to contact you.",
  },
  {
    title: "Unclear Messaging",
    description:
      "If your website does not quickly explain what you do and who you help, visitors will not stay long enough to convert.",
  },
  {
    title: "Too Complicated",
    description:
      "Too many pages, too much text, or confusing layouts reduce action. Simpler websites usually convert better.",
  },
];

const goodNews = [
  "Increase enquiries",
  "Improve user experience",
  "Make your website actually work for your business",
];

const auditOutputs = [
  "Conversion issues",
  "Performance insights",
  "Actionable improvements",
];

const nextSteps = [
  "Fix it yourself",
  "Get help implementing improvements",
];

export default function WhyMyWebsiteIsntGettingEnquiriesPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    {
      name: "Why My Website Isn't Getting Enquiries",
      path: "/why-my-website-isnt-getting-enquiries",
    },
  ];

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8">
        <SchemaScript
          id="why-my-website-isnt-getting-enquiries-schema"
          value={[
            buildCollectionPageSchema({
              name: "Why Your Website Isn't Getting Enquiries",
              path: "/why-my-website-isnt-getting-enquiries",
              description:
                "A practical page explaining the most common reasons business websites fail to generate enquiries and what to fix first.",
              items: [
                { name: "Website Growth Check", path: "/website-growth-check" },
                { name: "Improve Existing Website", path: "/improve-existing-website" },
                { name: "Services", path: "/services" },
              ],
            }),
            buildBreadcrumbSchema(breadcrumbItems),
          ]}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Why My Website Isn't Getting Enquiries" },
          ]}
        />
      </div>

      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Website Conversion Problems
            </div>
            <div className="space-y-6">
              <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Why Your Website Isn&apos;t Getting Enquiries (And What&apos;s
                Causing It)
              </h1>
              <p className="max-w-4xl text-lg leading-8 text-stone-300">
                If your website is not bringing in enquiries, you are not
                alone.
              </p>
              <p className="max-w-4xl text-base leading-8 text-stone-300">
                A lot of businesses assume they just need more traffic, but in
                most cases the real issue is something else entirely.
              </p>
              <p className="max-w-4xl text-base leading-8 text-stone-300">
                Your website might already be getting visitors but failing to
                turn them into enquiries.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/website-growth-check"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Run a Free Audit
              </Link>
              <Link
                href="/contact#project-enquiry"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Request a Review
              </Link>
            </div>
          </div>

          <div className="self-start rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Usually a conversion problem rather than a traffic problem",
                "Often caused by clarity, trust, speed, or mobile issues",
                "Small changes can make a noticeable difference",
                "The audit tool helps identify what to fix first",
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
          eyebrow="The Real Problem"
          title="It's Usually Not a Traffic Problem"
          description="More traffic will not fix a website that does not convert."
        />
        <p className="max-w-4xl text-base leading-8 text-stone-300">
          If your site is not structured properly, even hundreds of visitors
          will not turn into leads.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {signs.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-4xl text-base leading-8 text-stone-300">
          This usually means your website is not guiding users to take action.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Common Reasons"
          title="The Most Common Reasons Websites Don't Convert"
            description="These issues come up repeatedly across business websites that are getting visits but not enough leads."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {issues.map((item) => (
              <article
                key={item.title}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6"
              >
                <h2 className="text-xl font-semibold text-stone-50">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-stone-300">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="The Good News"
          title="Most of These Problems Are Fixable"
          description="Once you know what to look for, small changes can make a website much more effective."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {goodNews.map((item) => (
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
          eyebrow="Find Out What's Wrong"
          title="Check Your Website Instead of Guessing"
            description="You can review your site in seconds and see what is most likely holding enquiries back."
          />
          <p className="max-w-4xl text-base leading-8 text-stone-300">
            The free tool highlights the practical issues that most commonly
            affect conversions, performance, and visibility.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {auditOutputs.map((item) => (
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
              href="/website-growth-check"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Run a Free Website Audit
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="What Happens Next"
          title="Once You Know What's Wrong, You Have Two Options"
          description="You can either work through the issues yourself or get help implementing the improvements."
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
          If you want, I can review your site and show exactly what I would
          change.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/contact#project-enquiry"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Request a Review
          </Link>
          <Link
            href="/improve-existing-website"
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Improve an Existing Website
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Want more enquiries from your website?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            Start by finding out what is holding it back, then decide whether
            you want to fix it yourself or get help.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/website-growth-check"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Run a Free Audit
            </Link>
            <Link
              href="/contact#project-enquiry"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Request a Review
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
