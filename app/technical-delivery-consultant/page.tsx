import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Technical Delivery Consultant UK | Agile, Web & Platform Delivery",
  description:
    "Technical delivery consultant specialising in Agile delivery, web platforms, and end-to-end project execution across engineering teams and digital products.",
  openGraph: {
    title: "Technical Delivery Consultant UK | Agile, Web & Platform Delivery",
    description:
      "Technical delivery consultant specialising in Agile delivery, web platforms, and end-to-end project execution across engineering teams and digital products.",
  },
};

const deliveryPrinciples = [
  "Projects are clearly defined",
  "Teams are aligned",
  "Delivery is structured and measurable",
  "Outcomes are achieved on time",
];

const commonProblems = [
  "Unclear requirements and shifting priorities",
  "Lack of alignment between stakeholders and technical teams",
  "Missed deadlines and delivery delays",
  "Poor communication across teams",
  "Projects that start but do not complete successfully",
];

const services = [
  "Agile / Scrum delivery leadership",
  "Roadmap and milestone planning",
  "Stakeholder coordination and communication",
  "Cross-functional team alignment",
  "Risk management and issue resolution",
  "Delivery oversight from concept to launch",
];

const differentiators = [
  "Technical decisions are grounded in real implementation",
  "Delivery plans reflect actual engineering constraints",
  "Communication between teams is clearer and more effective",
  "Execution is faster and more reliable",
];

const experienceAreas = [
  "Multi-team engineering coordination",
  "Platform migrations and system redesigns",
  "Governance and reporting structures",
  "Agile transformation and coaching",
];

const audiences = [
  "Organisations delivering complex technical projects",
  "Teams lacking structured delivery leadership",
  "Projects that are delayed, at risk, or unclear",
  "Businesses scaling platforms or systems",
];

const outcomes = [
  "Clearer project direction and structure",
  "Improved delivery consistency",
  "Better communication across teams",
  "Reduced risk and delays",
  "Successful project outcomes",
];

export default function TechnicalDeliveryConsultantPage() {
  return (
    <main>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Technical Delivery Consultant
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Technical Delivery Consultant - End-to-End Project Execution
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I provide technical delivery consulting for organisations that
                need reliable execution across web development, platforms, and
                digital products.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                Combining hands-on development experience with programme and
                project leadership, I help ensure complex technical work is
                delivered successfully, not just started.
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
                View Delivery Case Studies
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Agile and programme delivery",
                "Developer + delivery consultant",
                "Platform and digital product execution",
                "Structured, measurable outcomes",
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
          eyebrow="What Is Technical Delivery?"
          title="What Is Technical Delivery?"
          description="Technical delivery sits between engineering, product, and business."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {deliveryPrinciples.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          Without strong delivery, even well-funded projects fail to produce
          results.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Common Problems"
            title="Common Delivery Challenges"
            description="Many organisations struggle with the same delivery blockers, and they often lead to wasted time, budget overruns, and underperforming products."
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
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="What I Do"
          title="Technical Delivery Consulting Services"
          description="I provide structured delivery support across the full lifecycle of a project."
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
            eyebrow="Development + Delivery"
            title="Development + Delivery in One Role"
            description="Most delivery consultants do not write code. Most developers do not manage delivery. I do both."
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
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="Delivery Experience Across Complex Organisations"
          description="I&apos;ve worked across large-scale delivery environments involving engineering coordination, migration work, governance, and Agile transformation."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {experienceAreas.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
          This includes experience within enterprise environments such as
          telecoms and financial services.
        </p>
        <div className="mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            View Delivery Case Studies
          </Link>
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Who This Is For"
            title="Who This Is For"
            description="Delivery support for organisations and teams that need stronger structure, clearer execution, and better alignment."
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
          eyebrow="Outcomes"
          title="What You Can Expect"
          description="The aim is to bring structure, clarity, and consistent execution to complex technical work."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
            Need Reliable Technical Delivery?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you need a technical delivery consultant who understands both
            development and execution, I can help bring structure and clarity
            to your project.
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
              Delivery and project management services
            </Link>
            <Link
              href="/projects"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Programme delivery case studies
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
