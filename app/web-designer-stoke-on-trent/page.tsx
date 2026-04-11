import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Web Designer Stoke-on-Trent | Professional Website Development",
  description:
    "Freelance web designer in Stoke-on-Trent building fast, reliable, SEO-friendly websites for local businesses and growing companies.",
  path: "/web-designer-stoke-on-trent",
  openGraph: {
    title: "Web Designer Stoke-on-Trent | Professional Website Development",
    description:
      "Freelance web designer in Stoke-on-Trent building fast, reliable, SEO-friendly websites for local businesses and growing companies.",
  },
});

const services = [
  "Custom website design and development",
  "Full-stack web applications",
  "WordPress and PHP builds",
  "Website redesign and improvements",
  "Technical SEO and performance optimisation",
  "Mobile-friendly and responsive design",
];

const commonProblems = [
  "Load slowly or perform poorly",
  "Do not rank well in Google",
  "Fail to convert visitors into enquiries",
  "Are difficult to update or maintain",
];

const differentiators = [
  "Performance and speed",
  "Technical SEO",
  "Clean, maintainable development",
  "Scalability and long-term usability",
];

const processAreas = [
  "Planning and structure",
  "Development and implementation",
  "Deployment and optimisation",
  "Ongoing improvements",
];

const audiences = [
  "Businesses in Stoke-on-Trent",
  "Local service providers",
  "Startups and growing companies",
  "Organisations needing a better website",
];

export default function WebDesignerStokeOnTrentPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Web Designer Stoke-on-Trent", path: "/web-designer-stoke-on-trent" },
  ];

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8">
        <SchemaScript
          id="web-designer-stoke-on-trent-schema"
          value={[
            buildServiceSchema({
              name: "Web Designer Stoke-on-Trent",
              path: "/web-designer-stoke-on-trent",
              description:
                "Freelance web design and development services for Stoke-on-Trent businesses, including custom builds, SEO, performance, and ongoing support.",
              serviceType: "Web design and development services",
              areaServed: "Stoke-on-Trent, Staffordshire, United Kingdom",
            }),
            buildBreadcrumbSchema(breadcrumbItems),
          ]}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Web Designer Stoke-on-Trent" },
          ]}
        />
      </div>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Web Designer Stoke-on-Trent
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Web Designer Stoke-on-Trent - Websites That Perform
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I&apos;m a freelance web designer and developer working with
                businesses in Stoke-on-Trent to design, build, and improve
                websites that are fast, reliable, and built to support real
                business growth.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                Whether you&apos;re launching a new site or improving an
                existing one, I focus on delivering websites that do not just
                look good, they perform.
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
                "Freelance web designer in Stoke-on-Trent",
                "Fast, reliable websites for local businesses",
                "SEO and performance-focused development",
                "Structured support for growth and improvement",
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
          eyebrow="Local Context"
          title="Supporting Businesses in Stoke-on-Trent"
          description="I work with businesses across Stoke-on-Trent and the surrounding areas, helping companies build and improve their online presence."
        />
        <div className="mt-8 max-w-4xl space-y-5 text-base leading-8 text-stone-300">
          <p>
            From smaller local businesses to growing companies, I provide
            development support that focuses on reliability, performance, and
            long-term value.
          </p>
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="What I Offer"
            title="Website Design & Development in Stoke-on-Trent"
            description="Professional website development services for local businesses that need stronger performance, better structure, and reliable long-term support."
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
          eyebrow="Is Your Website Underperforming?"
          title="Is Your Website Underperforming?"
          description="Many businesses in Stoke-on-Trent struggle with websites that hold back visibility, credibility, and growth."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {commonProblems.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          These issues directly impact visibility, credibility, and growth.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="More Than a Web Designer"
            title="More Than a Web Designer"
            description="I take a broader approach than typical web designers, combining design, development, SEO, and long-term maintainability."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {differentiators.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
            This ensures your website works as a business tool, not just a
            static page.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="Development + Delivery"
          title="Development + Delivery"
          description="I do not just build websites. I take ownership of the process so projects are completed properly and perform as expected."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {processAreas.map((item) => (
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
            description="Best suited to businesses in Stoke-on-Trent that need a stronger website and more dependable technical support."
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
          eyebrow="Projects"
          title="Example Work"
          description="I&apos;ve delivered websites and platforms focused on performance, SEO, and structured delivery."
        />
        <div className="mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            View Projects
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Need a Website That Delivers Results?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re looking for a web designer in Stoke-on-Trent who can
            build or improve your website properly, let&apos;s discuss your
            website and next steps.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            Most projects start with a short call to understand your
            requirements and outline next steps.
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
              href="/web-developer-staffordshire"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Web developer Staffordshire
            </Link>
            <Link
              href="/web-designer-stafford"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Web designer Stafford
            </Link>
            <Link
              href="/improve-existing-website"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Improve your existing website
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
