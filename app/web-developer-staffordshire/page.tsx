import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Web Developer Staffordshire | Websites for Local Businesses",
  description:
    "Freelance web developer in Staffordshire building reliable, high-performance websites for local businesses, startups, and growing companies.",
  path: "/web-developer-staffordshire",
  openGraph: {
    title: "Web Developer Staffordshire | Websites for Local Businesses",
    description:
      "Freelance web developer in Staffordshire building reliable, high-performance websites for local businesses, startups, and growing companies.",
  },
});

const locations = [
  "Stafford",
  "Cannock",
  "Stoke-on-Trent",
  "Uttoxeter",
  "Surrounding areas",
];

const services = [
  "Custom website development",
  "Full-stack web applications",
  "WordPress and PHP websites",
  "Website redesign and improvements",
  "Technical SEO and performance optimisation",
  "Ongoing support and updates",
];

const commonProblems = [
  "Are slow or poorly built",
  "Do not rank well in search engines",
  "Are difficult to update",
  "Do not support business growth",
];

const betterApproach = [
  "Perform well and load quickly",
  "Are structured for SEO and visibility",
  "Are scalable and maintainable",
  "Support your business long-term",
];

const processAreas = [
  "Planning and structure",
  "Design and development",
  "Deployment and hosting",
  "Performance and SEO",
  "Ongoing support",
];

const audiences = [
  "Small businesses needing a professional website",
  "Local companies improving an existing site",
  "Startups launching new products or services",
  "Organisations needing reliable technical support",
];

export default function WebDeveloperStaffordshirePage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Web Developer Staffordshire", path: "/web-developer-staffordshire" },
  ];

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8">
        <SchemaScript
          id="web-developer-staffordshire-schema"
          value={[
            buildServiceSchema({
              name: "Web Developer Staffordshire",
              path: "/web-developer-staffordshire",
              description:
                "Freelance web development services for businesses across Staffordshire, including custom websites, web applications, SEO, and ongoing support.",
              serviceType: "Web development services",
              areaServed: "Staffordshire, United Kingdom",
            }),
            buildBreadcrumbSchema(breadcrumbItems),
          ]}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Web Developer Staffordshire" },
          ]}
        />
      </div>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Web Developer Staffordshire
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Web Developer Staffordshire - Websites Built Properly
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I&apos;m a freelance web developer based in Staffordshire,
                working with local businesses, startups, and organisations to
                design, build, and deliver reliable websites and web
                applications.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                Whether you need a new website or improvements to an existing
                one, I focus on building solutions that perform well, scale
                properly, and support your business long-term.
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
                View Website Projects
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Freelance web developer in Staffordshire",
                "Websites for local businesses and startups",
                "SEO and performance-focused builds",
                "Reliable delivery and ongoing support",
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
          eyebrow="Local Trust"
          title="Local Web Development for Staffordshire Businesses"
          description="I work with businesses across Staffordshire and the surrounding area, combining local understanding with reliable technical delivery."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {locations.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          Working locally means clearer communication, better understanding of
          your business, and a more reliable working relationship.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="What I Offer"
            title="Website Development Services"
            description="A practical set of web development services tailored to local businesses that need more than a basic brochure site."
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
          eyebrow="More Than Just a Website"
          title="Websites should support growth, not create new problems."
          description="Many local businesses end up with websites that are hard to manage, slow to use, and not built with search visibility or long-term maintainability in mind."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <h2 className="text-xl font-semibold text-stone-50">
              Common Problems
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
              {commonProblems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-6">
            <h2 className="text-xl font-semibold text-stone-50">
              What I Focus On Instead
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
              {betterApproach.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Development + Delivery"
            title="Development + Delivery in One Place"
            description="I do not just build websites. I take responsibility for the full process so the work is delivered properly, not just launched."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {processAreas.map((item) => (
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
          eyebrow="Who This Is For"
          title="Who This Is For"
          description="Best suited to businesses and organisations that need a dependable web presence with proper technical foundations."
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
            eyebrow="Projects"
            title="Recent Work"
            description="I&apos;ve delivered a range of web platforms and websites combining performance, SEO, and structured delivery."
          />
          <div className="mt-8">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Need a Website That Actually Works?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re looking for a web developer in Staffordshire who can
            build or improve your website properly, let&apos;s discuss your
            website and next steps.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            Most projects start with a short call to understand your
            requirements and outline next steps.
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
              href="/services"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Web development services
            </Link>
            <Link
              href="/improve-existing-website"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Improve your existing website
            </Link>
            <Link
              href="/projects"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Projects page
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
