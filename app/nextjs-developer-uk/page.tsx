import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Next.js Developer UK | Freelance Full-Stack Web Applications",
  description:
    "Freelance Next.js developer in the UK building scalable, high-performance web applications with full-stack expertise and end-to-end delivery.",
  openGraph: {
    title: "Next.js Developer UK | Freelance Full-Stack Web Applications",
    description:
      "Freelance Next.js developer in the UK building scalable, high-performance web applications with full-stack expertise and end-to-end delivery.",
  },
};

const services = [
  "Custom web application development",
  "SaaS platforms and dashboards",
  "Marketing websites with SEO foundations",
  "API integrations and backend systems",
  "Performance-focused builds using modern frameworks",
];

const benefits = [
  "Server-side rendering (SSR) and static generation (SSG)",
  "Excellent performance and Core Web Vitals",
  "Built-in SEO advantages",
  "Scalable architecture for growing platforms",
  "Seamless integration with APIs and backend services",
];

const stack = [
  "Next.js",
  "React",
  "Node.js",
  "MongoDB",
  "REST APIs and integrations",
  "Vultr and cloud deployment platforms",
];

const audiences = [
  "Startups building new web applications",
  "SMEs needing scalable platforms",
  "Agencies requiring reliable development support",
  "Teams needing both development and delivery expertise",
];

export default function NextJsDeveloperUkPage() {
  return (
    <main>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Next.js Developer UK
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Next.js Developer UK - Scalable Full-Stack Web Applications
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I&apos;m a freelance Next.js developer based in the UK,
                specialising in building high-performance web applications with
                full-stack architecture and end-to-end delivery.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                From initial concept through to deployment, I design and build
                scalable platforms using Next.js, Node.js, and modern web
                technologies.
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
                View Next.js Case Studies
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Freelance Next.js developer",
                "Full-stack web applications",
                "SEO and performance focus",
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
          eyebrow="What I Do"
          title="Full-Stack Next.js Development Services"
          description="I build modern web applications using Next.js, combining frontend performance with backend capability to deliver fast, scalable, and maintainable platforms."
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
            eyebrow="Why Next.js"
            title="Why Use Next.js for Web Applications?"
            description="Next.js provides a strong foundation for modern web development, particularly where performance, SEO, and scalability matter."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
            This makes it ideal for startups, SaaS platforms, and
            high-performance websites.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="My Approach"
          title="More Than Development - End-to-End Delivery"
          description="Most Next.js developers focus on implementation. I take responsibility for the full solution."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Architecture and technical decisions",
            "Full-stack development (frontend + backend)",
            "Infrastructure and deployment",
            "Technical SEO and performance",
            "Project delivery and execution",
          ].map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          This ensures your project moves from idea to production without gaps
          or delays.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Technology Stack"
            title="Technologies I Use"
            description="A practical stack for building scalable Next.js web applications with backend capability and reliable deployment."
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
          eyebrow="Who I Work With"
          title="Who This Is For"
          description="This service is designed for teams that need both strong implementation and dependable delivery support."
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
            eyebrow="Project Proof"
            title="Relevant Next.js Projects"
            description="I&apos;ve delivered a range of full-stack web applications using Next.js, combining frontend performance with backend systems and delivery ownership."
          />
          <div className="mt-8">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              View Full Project Case Studies
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Need a Next.js Developer You Can Rely On?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re looking for a freelance Next.js developer in the UK
            who can design, build, and deliver your project end-to-end, I&apos;d
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
              href="/services"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Full-stack development services
            </Link>
            <Link
              href="/projects"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Next.js projects
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
