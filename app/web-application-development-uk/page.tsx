import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Web Application Development UK | Custom Full-Stack Solutions",
  description:
    "Custom web application development services in the UK. Scalable full-stack solutions using Next.js, Node.js, and modern technologies with end-to-end delivery.",
  openGraph: {
    title: "Web Application Development UK | Custom Full-Stack Solutions",
    description:
      "Custom web application development services in the UK. Scalable full-stack solutions using Next.js, Node.js, and modern technologies with end-to-end delivery.",
  },
};

const applicationTypes = [
  "SaaS platforms",
  "Internal business systems",
  "Dashboards and reporting tools",
  "Booking or workflow systems",
  "Community platforms",
];

const serviceItems = [
  "Custom web application development",
  "SaaS platforms and subscription systems",
  "Dashboards and data-driven systems",
  "API integrations and backend architecture",
  "Secure authentication and user management",
  "Performance-focused frontend development",
];

const approachItems = [
  "Clear architecture from the start",
  "Structured build and iteration",
  "Aligned stakeholders and expectations",
  "Reliable deployment and launch",
];

const stack = [
  "Next.js and React",
  "Node.js backend systems",
  "MongoDB and database design",
  "REST APIs and integrations",
  "Cloud deployment (Vultr, VPS)",
];

const audiences = [
  "Startups building SaaS products",
  "SMEs replacing manual processes with systems",
  "Businesses needing scalable platforms",
  "Agencies outsourcing web application development",
];

export default function WebApplicationDevelopmentUkPage() {
  return (
    <main>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Web Application Development UK
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Web Application Development UK - Custom Full-Stack Solutions
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I provide custom web application development services in the UK,
                helping businesses design, build, and deliver scalable digital
                platforms.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                From initial concept through to deployment, I combine full-stack
                development with technical delivery to ensure your application
                is built properly and delivered successfully.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Discuss Your Project
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                View Web Application Case Studies
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Custom web application development",
                "Scalable full-stack solutions",
                "Business systems and platforms",
                "End-to-end delivery",
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
          eyebrow="What Is a Web Application?"
          title="What Is a Web Application?"
          description="A web application is more than a website. It is a system designed to handle business logic, user interaction, and data processing."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {applicationTypes.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          These require structured development, backend systems, and long-term
          scalability.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="What I Build"
            title="Custom Web Application Development Services"
            description="I build scalable, full-stack web applications tailored to specific business needs."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serviceItems.map((item) => (
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
          eyebrow="My Approach"
          title="Development + Delivery = Successful Outcomes"
          description="Many web applications fail due to poor planning, unclear requirements, or lack of delivery structure."
        />
        <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
          I combine development with technical delivery to reduce risk and
          ensure your project moves forward with clarity.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {approachItems.map((item) => (
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
            eyebrow="Technology Stack"
            title="Technologies Used"
            description="A practical stack for custom web application development, backend systems, and scalable deployment."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stack.map((item) => (
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
          eyebrow="Who It&apos;s For"
          title="Who This Is For"
          description="This service is designed for businesses and teams that need robust systems, scalable platforms, and reliable delivery support."
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
            eyebrow="Project Examples"
            title="Web Application Projects"
            description="I&apos;ve built a range of full-stack web applications, combining backend systems, frontend performance, and delivery ownership."
          />
          <div className="mt-8">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              View Web Application Case Studies
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Need a Web Application Built Properly?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re looking for a web application developer in the UK who
            can design, build, and deliver your platform end-to-end, I&apos;d
            be happy to help.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Discuss Your Project
            </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Contact Dean Lennard
              </Link>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              href="/nextjs-developer-uk"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Next.js development services
            </Link>
            <Link
              href="/services"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Web development services UK
            </Link>
            <Link
              href="/projects"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Web application projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
