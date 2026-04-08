import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Freelance Developer for Agencies | Reliable Delivery Partner UK",
  description:
    "Freelance full-stack developer for agencies in the UK. Reliable development support, white-label delivery, and end-to-end project execution.",
  openGraph: {
    title: "Freelance Developer for Agencies | Reliable Delivery Partner UK",
    description:
      "Freelance full-stack developer for agencies in the UK. Reliable development support, white-label delivery, and end-to-end project execution.",
  },
};

const painPoints = [
  "Inconsistent or unreliable freelance developers",
  "Missed deadlines and delivery pressure",
  "Gaps between design, development, and deployment",
  "Lack of technical ownership",
  "Scaling delivery without increasing internal headcount",
];

const services = [
  "Full-stack web development (Next.js, Node.js, WordPress)",
  "Building client websites and web applications",
  "API integrations and backend systems",
  "Technical SEO and performance optimisation",
  "Deployment and infrastructure setup",
];

const differentiators = [
  "Clear communication and accountability",
  "Understanding project goals, not just tickets",
  "Supporting end-to-end delivery",
  "Helping ensure projects are completed successfully",
];

const collaborationModes = [
  "White-label development support",
  "Project-based work",
  "Ongoing freelance or contract support",
  "Collaboration with designers, PMs, and internal teams",
];

const stack = [
  "Next.js and React",
  "Node.js and backend systems",
  "MongoDB and APIs",
  "WordPress and PHP",
  "Cloud deployment and hosting",
];

const audiences = [
  "Digital agencies needing development support",
  "Creative agencies without in-house developers",
  "Teams scaling delivery capacity",
  "Agencies needing reliable freelance partners",
];

export default function FreelanceDeveloperForAgenciesPage() {
  return (
    <main>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Freelance Developer for Agencies
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Freelance Developer for Agencies - Reliable Delivery Support
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I work with agencies as a freelance full-stack developer,
                providing reliable development and delivery support across web
                projects, platforms, and ongoing client work.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                Whether you need additional capacity or a dependable technical
                partner, I help ensure projects are delivered on time and to a
                high standard.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Discuss a Project
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
                "Agency development support",
                "White-label delivery",
                "Reliable freelance capacity",
                "End-to-end project execution",
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
          eyebrow="Agency Pain Points"
          title="When Delivery Becomes the Bottleneck"
          description="Agencies often face recurring delivery challenges that affect timelines, client relationships, and growth."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {painPoints.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          These issues impact client relationships and business growth.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="What I Offer"
            title="Freelance Development Support for Agencies"
            description="I provide structured, reliable development support that integrates smoothly into your workflow."
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
          eyebrow="Your Differentiator"
          title="More Than a Freelancer - A Delivery Partner"
          description="I do not just complete tasks. I take ownership of delivery."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {differentiators.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          This reduces risk and makes delivery more predictable.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="How I Work"
            title="Flexible & Reliable Collaboration"
            description="Support can be shaped around the way your agency delivers work."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {collaborationModes.map((item) => (
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
          eyebrow="Technology Stack"
          title="Technologies"
          description="A broad stack that supports agency delivery across websites, platforms, integrations, and hosting."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stack.map((item) => (
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
            description="Best suited to agencies that need dependable technical support and predictable delivery."
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
          title="Relevant Work"
          description="I&apos;ve supported projects across web platforms, applications, and delivery-focused builds."
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
            Need a Reliable Development Partner?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re looking for a freelance developer who can integrate
            with your team and help deliver projects consistently, I&apos;d be
            happy to support your agency.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Discuss a Project
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
              Web development services
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
            <Link
              href="/technical-delivery-consultant"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Technical delivery consultant
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
