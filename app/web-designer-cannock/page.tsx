import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Web Designer Cannock | Professional Website Development",
  description:
    "Freelance web designer in Cannock building fast, reliable, SEO-friendly websites for local businesses. Custom builds, redesigns, and ongoing support.",
  path: "/web-designer-cannock",
  openGraph: {
    title: "Web Designer Cannock | Professional Website Development",
    description:
      "Freelance web designer in Cannock building fast, reliable, SEO-friendly websites for local businesses. Custom builds, redesigns, and ongoing support.",
  },
});

const services = [
  "Custom website design and development",
  "WordPress and PHP websites",
  "Full-stack web development where needed",
  "Website redesign and improvements",
  "Technical SEO and performance optimisation",
  "Mobile-friendly and responsive websites",
];

const commonProblems = [
  "Are outdated or difficult to manage",
  "Do not appear in search results",
  "Load slowly or perform poorly",
  "Do not generate enquiries",
];

const differentiators = [
  "Clean, reliable development",
  "Performance and speed optimisation",
  "SEO-friendly structure",
  "Scalable and maintainable builds",
];

const processAreas = [
  "Planning and structure",
  "Development and build",
  "Deployment and setup",
  "Performance and optimisation",
];

const audiences = [
  "Small businesses in Cannock",
  "Trades and service-based businesses",
  "Startups and new ventures",
  "Companies needing a more reliable website",
];

export default function WebDesignerCannockPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Web Designer Cannock", path: "/web-designer-cannock" },
  ];

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8">
        <SchemaScript
          id="web-designer-cannock-schema"
          value={[
            buildServiceSchema({
              name: "Web Designer Cannock",
              path: "/web-designer-cannock",
              description:
                "Freelance web design and development services for Cannock businesses, including custom builds, redesigns, SEO, and ongoing support.",
              serviceType: "Web design and development services",
              areaServed: "Cannock, Staffordshire, United Kingdom",
            }),
            buildBreadcrumbSchema(breadcrumbItems),
          ]}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Web Designer Cannock" },
          ]}
        />
      </div>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Web Designer Cannock
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Web Designer Cannock - Websites That Support Your Business
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I&apos;m a freelance web designer and developer working with
                businesses in Cannock to design, build, and improve websites
                that are reliable, fast, and built to support real business
                growth.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                Whether you need a new website or want to improve an existing
                one, I focus on delivering practical solutions that work.
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
                "Freelance web designer in Cannock",
                "Reliable websites for local businesses",
                "SEO and performance-focused builds",
                "Practical support for growth and enquiries",
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
          eyebrow="Local Relevance"
          title="Supporting Businesses in Cannock"
          description="I work with businesses in Cannock and the surrounding areas, helping local companies improve their online presence through well-built, reliable websites."
        />
        <div className="mt-8 max-w-4xl space-y-5 text-base leading-8 text-stone-300">
          <p>
            I understand the needs of local businesses, whether you&apos;re a
            service provider, small company, or growing business, and focus on
            delivering work that supports your day-to-day operations.
          </p>
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="What I Offer"
            title="Website Design & Development in Cannock"
            description="A practical range of website services for local businesses that need stronger performance, better structure, and more reliable ongoing support."
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
          eyebrow="Common Website Issues"
          title="Common Website Issues"
          description="Many businesses in Cannock have websites that do not support visibility, enquiries, or day-to-day use properly."
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
          I focus on identifying these issues and improving your website so it
          actually supports your business.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Built Properly"
            title="Built Properly, Not Just Designed"
            description="A lot of local websites are built quickly using templates without much thought for performance or long-term use. I take a more structured approach."
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
            This ensures your website continues to work as your business grows.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="Development + Delivery"
          title="Development + Delivery"
          description="I take responsibility for the full process so you get fewer issues, clearer communication, and better results."
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
            description="Best suited to local businesses in Cannock that need a stronger, more dependable website and practical ongoing support."
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
          description="I&apos;ve delivered websites and platforms designed to perform well, support SEO, and grow with the business."
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
            Need a Website That Works Properly?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re looking for a web designer in Cannock who can build
            or improve your website properly, let&apos;s discuss your website
            and next steps.
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
              href="/web-designer-stoke-on-trent"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Web designer Stoke-on-Trent
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
