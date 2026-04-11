import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Technical Delivery Consultant UK | Agile, Web & Platform Delivery",
  description:
    "Technical delivery consultant specialising in Agile delivery, web platforms, and end-to-end project execution across engineering teams and digital products.",
  path: "/technical-delivery-consultant",
  openGraph: {
    title: "Technical Delivery Consultant UK | Agile, Web & Platform Delivery",
    description:
      "Technical delivery consultant specialising in Agile delivery, web platforms, and end-to-end project execution across engineering teams and digital products.",
  },
});

const deliveryPainPoints = [
  "Projects delayed or unclear",
  "Teams not aligned",
  "Delivery slipping",
  "Roadmaps not turning into shipped work",
];

const commonProblems = [
  "Requirements change weekly, but nothing ships",
  "Stakeholders and engineering teams are pulling in different directions",
  "Delivery slips, deadlines move, and confidence drops",
  "Communication breaks down across teams and programmes",
  "Projects start with momentum but stall before anything useful lands",
];

const services = [
  "Recover failing or stalled technical delivery",
  "Turn unclear roadmaps into structured milestones",
  "Align stakeholders and engineering so delivery moves",
  "Improve delivery flow across cross-functional teams",
  "Reduce risk, blockers, and avoidable delivery delays",
  "Take projects from unclear scope to launch-ready execution",
];

const differentiators = [
  "Technical decisions are grounded in real implementation",
  "Delivery plans reflect actual engineering constraints",
  "Communication between teams is clearer and more effective",
  "Execution is faster and more reliable",
];

const experienceAreas = [
  "Multi-team engineering coordination across 15+ teams",
  "Platform migrations and system redesigns in complex environments",
  "Governance, reporting, and compliance delivery structures",
  "Agile transformation, coaching, and organisational change",
];

const audiences = [
  "CTOs inheriting messy delivery or stalled engineering work",
  "Teams lacking structured delivery leadership",
  "Projects that are delayed, at risk, or unclear",
  "Businesses scaling platforms, migrations, or system rebuilds",
];

const outcomes = [
  "Clear delivery plan within weeks",
  "Improved delivery consistency across teams",
  "Better communication between engineering and stakeholders",
  "Reduced risk, blockers, and avoidable delays",
  "Shipped platforms and more reliable outcomes",
];

export default function TechnicalDeliveryConsultantPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Technical Delivery Consultant", path: "/technical-delivery-consultant" },
  ];

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8">
        <SchemaScript
          id="technical-delivery-consultant-schema"
          value={[
            buildServiceSchema({
              name: "Technical Delivery Consultant UK",
              path: "/technical-delivery-consultant",
              description:
                "Technical delivery consulting for agile delivery, web platforms, migrations, and end-to-end project execution.",
              serviceType: "Technical delivery consulting",
            }),
            buildBreadcrumbSchema(breadcrumbItems),
          ]}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Technical Delivery Consultant" },
          ]}
        />
      </div>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Technical Delivery Consultant
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Technical Delivery Consultant for Complex Web & Platform Projects
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I fix delivery issues, align teams, and get technical projects
                shipped, from early-stage builds to large-scale platform
                migrations.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                Combining hands-on development experience with technical
                programme delivery, I help organisations recover unclear,
                delayed, or failing web and platform projects before more time
                and budget are lost.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact#book-call"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Book a 30-minute call
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
              {deliveryPainPoints.map((item) => (
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
          eyebrow="Why Delivery Fails"
          title="Where complex technical delivery usually starts to break down."
          description="The problems below are usually a mix of unclear ownership, weak communication, and delivery structures that do not match technical reality."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Roadmaps look fine on paper, but delivery is not moving",
            "Engineering work starts before priorities are stable",
            "Platform migrations introduce risk without enough structure",
            "Stakeholders expect progress, but visibility is weak",
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
          Without stronger delivery leadership, even well-funded projects can
          drift, stall, or fail to produce usable outcomes.
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
        <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
          This is the point of difference. Delivery plans reflect engineering
          constraints, technical decisions are grounded in implementation, and
          communication improves because the technical and delivery context sit
          together.
        </p>
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
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "Virgin Media O2: GBP 6M+ cost-saving migration over 12 months",
            "35 engineering reports across delivery, product, frontend, backend, and QA",
            "Enterprise delivery across regulated and high-dependency platforms",
          ].map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
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
          description="The aim is to reduce delivery delays, recover unclear projects, and move technical work towards shipped outcomes faster."
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
            If your project is slipping, unclear, or harder to control than it
            should be, let&apos;s bring structure to it quickly.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            Book a 30-minute call to get clarity on the delivery issues,
            likely next steps, and where support would make the biggest
            difference.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            There&apos;s no obligation, just a practical conversation about what
            is blocking delivery and how to move forward.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact#book-call"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Book a 30-minute call
            </Link>
            <Link
              href="/contact#project-enquiry"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Discuss Your Project
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              href="/services#delivery-consulting"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Delivery and project management services
            </Link>
            <Link
              href="/projects#virgin-media-o2"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Platform migrations and delivery leadership
            </Link>
            <Link
              href="/projects#department-for-work-and-pensions"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Public sector platform delivery
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
