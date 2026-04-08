import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Technical SEO Services UK | Performance, Speed & Core Web Vitals",
  description:
    "Technical SEO services in the UK including audits, performance optimisation, indexing fixes, and Core Web Vitals improvements to improve rankings and speed.",
  openGraph: {
    title: "Technical SEO Services UK | Performance, Speed & Core Web Vitals",
    description:
      "Technical SEO services in the UK including audits, performance optimisation, indexing fixes, and Core Web Vitals improvements to improve rankings and speed.",
  },
};

const seoAreas = [
  "Site speed and performance",
  "Indexing and crawlability",
  "Site structure and internal linking",
  "Metadata and SEO foundations",
  "Core Web Vitals and user experience",
];

const commonProblems = [
  "Slow page load speeds",
  "Poor Core Web Vitals scores",
  "Pages not being indexed correctly",
  "Broken internal linking structures",
  "Inefficient or bloated codebases",
  "Lack of proper metadata and SEO setup",
];

const services = [
  "Full technical SEO audits",
  "Performance optimisation and speed improvements",
  "Core Web Vitals fixes",
  "Site structure and internal linking improvements",
  "Indexing and crawlability fixes",
  "Analytics and tracking setup",
];

const tools = [
  "Lighthouse and Core Web Vitals analysis",
  "Google Search Console insights",
  "Performance profiling and optimisation",
  "Real-world testing across devices",
];

const audiences = [
  "Businesses struggling with search visibility",
  "Websites with slow performance",
  "Platforms needing technical improvements",
  "Teams without in-house SEO or development support",
];

const outcomes = [
  "Improved site speed and performance",
  "Better indexing and crawlability",
  "Stronger search visibility",
  "Improved user experience and engagement",
];

export default function TechnicalSeoServicesUkPage() {
  return (
    <main>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Technical SEO Services UK
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Technical SEO Services UK & Website Performance Optimisation
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I provide technical SEO services in the UK focused on improving
                website performance, search visibility, and indexing.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                From technical audits through to implementation, I help
                identify and fix the issues that prevent websites from ranking,
                loading quickly, and performing effectively.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Discuss Your Website
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                View My Work
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Technical SEO audits",
                "Performance and speed fixes",
                "Core Web Vitals optimisation",
                "Implementation-led improvements",
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
          eyebrow="What Is Technical SEO?"
          title="What Is Technical SEO?"
          description="Technical SEO focuses on how well your website is structured, performs, and can be understood by search engines."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {seoAreas.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          Without strong technical SEO, even well-designed websites struggle
          to rank.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Common Problems"
            title="Common Technical SEO Issues"
            description="Many websites suffer from hidden technical issues that limit their performance."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {commonProblems.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
            These issues directly impact rankings, traffic, and conversions.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="What I Do"
          title="Technical SEO Services"
          description="I provide hands-on technical SEO support, not just audits."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((item) => (
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
            eyebrow="Development + SEO"
            title="Development-Led SEO Implementation"
            description="Many SEO providers identify issues but rely on developers to fix them."
          />
          <div className="mt-8 max-w-4xl space-y-5 text-base leading-8 text-stone-300">
            <p>
              I combine technical SEO with full-stack development, meaning
              issues are identified and resolved directly.
            </p>
            <p>
              Performance improvements are implemented properly, and SEO is
              built into the platform rather than added later.
            </p>
            <p>
              This leads to faster improvements and more reliable results.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="Tools & Approach"
          title="Tools & Approach"
          description="A practical approach to finding issues, prioritising fixes, and implementing improvements that make a measurable difference."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tools.map((item) => (
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
            eyebrow="Who This Is For"
            title="Who This Is For"
            description="Technical SEO support for businesses and teams that need practical fixes, not just recommendations."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((item) => (
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
          eyebrow="Results / Impact"
          title="What You Can Expect"
          description="The goal is to improve how your website performs for both search engines and users."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {outcomes.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Improve Your Website Performance & SEO
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If your website isn&apos;t performing as it should, I can help
            identify the issues and implement the fixes.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Discuss Your Website
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Get in Touch
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              href="/services"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Technical SEO services
            </Link>
            <Link
              href="/nextjs-developer-uk"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Performance-focused web development
            </Link>
            <Link
              href="/projects"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              SEO-focused builds
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
