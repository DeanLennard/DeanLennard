import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Full-Stack Developer for Startups | SaaS & MVP Development UK",
  description:
    "Freelance full-stack developer for startups and SaaS products. Build MVPs, platforms, and scalable applications with end-to-end technical delivery.",
  openGraph: {
    title: "Full-Stack Developer for Startups | SaaS & MVP Development UK",
    description:
      "Freelance full-stack developer for startups and SaaS products. Build MVPs, platforms, and scalable applications with end-to-end technical delivery.",
  },
};

const serviceItems = [
  "MVP development for startups",
  "SaaS platform development",
  "Dashboards and user systems",
  "API integrations and backend architecture",
  "Subscription and payment systems",
  "Scalable frontend and backend systems",
];

const mvpBenefits = [
  "Define the right feature set",
  "Build a working MVP quickly",
  "Avoid over-engineering",
  "Create a foundation for scaling",
];

const differentiators = [
  "Clear technical direction from day one",
  "Structured development and iteration",
  "Alignment between product goals and engineering",
  "Delivery that stays on track",
];

const technologies = [
  "Next.js and React",
  "Node.js backend systems",
  "MongoDB and database design",
  "API integrations",
  "Cloud deployment and infrastructure",
];

const scalability = [
  "Support increasing users and data",
  "Allow new features to be added easily",
  "Maintain performance under load",
  "Remain maintainable over time",
];

const audiences = [
  "Early-stage startups building MVPs",
  "Founders with validated ideas",
  "SaaS products needing development support",
  "Teams needing a reliable technical partner",
];

export default function StartupFullStackDeveloperPage() {
  return (
    <main>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Full-Stack Developer for Startups
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Full-Stack Developer for Startups & SaaS Products
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I work with startups and founders to design, build, and deliver
                scalable SaaS platforms and web applications.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                From MVP development through to full product builds, I combine
                full-stack development with technical delivery to help turn
                ideas into working products.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Discuss Your Product
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                View SaaS and Platform Projects
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "MVP and SaaS product development",
                "Full-stack architecture and delivery",
                "Startup-focused product builds",
                "Scalable systems from day one",
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
          title="SaaS & Startup Development Services"
          description="I build web applications designed for real-world use, not just prototypes, but platforms that can grow."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceItems.map((item) => (
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
            eyebrow="MVP Development"
            title="MVP Development for Startups"
            description="For early-stage startups, the focus is speed, clarity, and validation."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {mvpBenefits.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
            The goal is simple: get a working product into users&apos; hands as
            efficiently as possible.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="Your Differentiator"
          title="More Than Development - Product Delivery"
          description="Many startups struggle because development and delivery are disconnected. I combine both."
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
          You&apos;re not just getting code. You&apos;re getting a partner focused
          on building a working product.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Technology Stack"
            title="Technologies Used"
            description="A practical stack for MVP development, SaaS applications, and scalable product platforms."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {technologies.map((item) => (
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
          eyebrow="Built to Scale"
          title="Built to Scale"
          description="Startups do not just need something that works. They need something that can grow."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {scalability.map((item) => (
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
            eyebrow="Who It&apos;s For"
            title="Who This Is For"
            description="This page is for founders and product teams that need strong implementation and dependable technical ownership."
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
          eyebrow="Project Examples"
          title="Relevant Projects"
          description="I&apos;ve delivered full-stack platforms combining frontend performance, backend systems, and structured delivery."
        />
        <div className="mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            View SaaS & Platform Projects
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Ready to Build Your Product?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re looking for a full-stack developer who can take
            ownership of your startup or SaaS product from concept through to
            delivery, I&apos;d be happy to help.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Discuss Your Product
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
              href="/web-application-development-uk"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Web application development
            </Link>
            <Link
              href="/nextjs-developer-uk"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Next.js developer UK
            </Link>
            <Link
              href="/projects"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Projects
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
