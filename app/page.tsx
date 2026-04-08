import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { featuredProjects, servicePillars, stats, techGroups } from "@/data/site";

const featuredProjectAnchors: Record<string, string> = {
  "Outbreak Interactive": "outbreak-interactive",
  "Crested Schoolwear": "crested-schoolwear",
  "Department for Work & Pensions": "department-for-work-and-pensions",
  Arcbound: "arcbound",
  "Arcbound Community": "arcbound-community",
  "Virgin Media O2": "virgin-media-o2",
};

export const metadata: Metadata = {
  title: "Full-Stack Developer UK | Next.js & Technical Delivery Specialist",
  description:
    "Freelance full-stack developer in the UK specialising in Next.js, web applications, technical SEO, and end-to-end project delivery. Build and deliver with confidence.",
  openGraph: {
    title: "Full-Stack Developer UK | End-to-End Technical Delivery",
    description:
      "I design, build, and deliver scalable web applications, combining full-stack development with technical project leadership.",
  },
};

export default function Home() {
  return (
    <main>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-16">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Full-stack development, technical SEO, and delivery
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Full-Stack Developer UK & Technical Delivery Specialist
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                Building scalable web applications and delivering digital
                projects end-to-end.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                I work with startups, SMEs, and agencies to design, build, and
                deliver reliable web development solutions, combining full-stack
                development with Next.js, Node.js, and MongoDB alongside
                hands-on project leadership.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact#book-call"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Book a Call
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                View My Work
              </Link>
            </div>
            <div className="space-y-3 text-sm leading-7 text-stone-300">
              <p>
                Happy to discuss projects at any stage, even if you&apos;re
                still figuring things out.
              </p>
              <p>
                Most projects start with a short call to understand your
                requirements and outline next steps.
              </p>
              <p>No obligation — just a practical conversation about what you need.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
              >
                <p className="text-2xl font-semibold text-stone-50">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-stone-300">{stat.label}</p>
              </div>
            ))}
            <div className="rounded-md border border-amber-500/25 bg-[color:var(--color-accent-soft)] p-6 sm:col-span-2">
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
                Advisory Angle
              </p>
              <p className="mt-4 text-base leading-7 text-stone-200">
                Most developers focus on code. I focus on delivering the
                complete solution, from architecture and full-stack development
                through to infrastructure, deployment, and project execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <SectionHeading
          eyebrow="Introduction"
          title="Successful outcomes need more than implementation alone."
          description="I&apos;m Dean Lennard, a freelance full-stack developer based in the UK, specialising in building scalable web applications and delivering technical projects end-to-end."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <p className="text-base leading-8 text-stone-300">
            I don&apos;t just write code. I take ownership of the entire
            process, from architecture and development through to deployment,
            infrastructure, and delivery.
          </p>
          <p className="text-base leading-8 text-stone-300">
            Whether you need a high-performance web application, technical SEO
            improvements, or a reliable technical partner, I bring both the
            development expertise and delivery discipline to ensure successful
            outcomes.
          </p>
          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Outcome Focused
            </p>
            <p className="mt-4 text-base leading-8 text-stone-300">
              Architecture, full-stack development, infrastructure, and
              delivery leadership working together in a single service.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <SectionHeading
          eyebrow="Services Overview"
          title="Full-Stack Development, Technical SEO & Delivery Services"
          description="Full-stack development, technical SEO, infrastructure, and delivery services designed for businesses that need both technical capability and reliable execution."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {servicePillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-lg font-semibold text-stone-50">
                  {pillar.title}
                </p>
                <span className="text-sm font-medium text-stone-300">
                  0{index + 1}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                {pillar.description}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-stone-300">
                {pillar.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  href={
                    [
                      "/web-application-development-uk",
                      "/technical-seo-services-uk",
                      "/services",
                      "/unity-developer-uk",
                      "/technical-delivery-consultant",
                    ][index]
                  }
                  className="text-sm font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                >
                  Explore this service area
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
            <SectionHeading
              eyebrow="Website Review"
              title="Website Performance & Technical Review"
              description="If you already have a website or platform, I can review it and highlight the key issues affecting performance, technical SEO, structure, and usability."
            />
            <p className="mt-6 max-w-4xl text-base leading-8 text-stone-300">
              You&apos;ll get a clear, practical summary of what&apos;s working,
              what isn&apos;t, and where improvements can be made.
            </p>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-stone-300">
              This is a quick, focused review — not a generic audit.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact#project-enquiry"
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                Request a Review
              </Link>
              <Link
                href="/contact#book-call"
                className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          <SectionHeading
            eyebrow="Featured Projects"
            title="Full-Stack Development & Technical Delivery Projects"
            description="A selection of projects combining full-stack development with end-to-end delivery, focused on real-world outcomes rather than implementation alone."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <article
                key={project.title}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-8"
              >
                <p className="text-sm font-medium text-amber-400">
                  {project.category}
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                  <Link
                    href={`/projects#${featuredProjectAnchors[project.title] ?? "projects"}`}
                    className="transition hover:text-amber-300"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-4 text-sm leading-7 text-stone-300">
                  {project.summary}
                </p>
                <ul className="mt-6 space-y-3 text-sm text-stone-300">
                  {project.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              View All Projects
            </Link>
          </div>
          <div className="mt-6 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              href="/nextjs-developer-uk"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Next.js projects
            </Link>
            <Link
              href="/technical-delivery-consultant"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Programme delivery experience
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-12">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Key Differentiator"
            title="Not Just a Developer — A Delivery Partner"
            description="Most developers focus on implementation. I focus on outcomes."
          />
        </div>
        <div className="grid gap-4">
          {[
            "Defining the right technical approach",
            "Building scalable solutions",
            "Managing delivery from start to finish",
            "Ensuring projects are completed successfully",
          ].map((point) => (
            <div
              key={point}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-base leading-7 text-stone-200"
            >
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          <SectionHeading
            eyebrow="Tech Stack"
            title="Modern tooling backed by broad platform experience."
            description="Comfortable across contemporary JavaScript stacks, traditional CMS and PHP work, backend systems, databases, and game development tooling."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {techGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-8"
              >
                <h3 className="text-lg font-semibold text-stone-50">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-stone-300">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-10">
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-stone-50">
            Have a project in mind or need reliable technical support?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
            Let&apos;s discuss your project and the most practical way forward.
            Most projects start with a short call to understand your
            requirements and outline a clear approach.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
            No obligation — just a practical conversation about what you need.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact#book-call"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Book a Call
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              View Services
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              href="/improve-existing-website"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Improve an existing website
            </Link>
            <Link
              href="/freelance-developer-for-agencies"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Freelance developer for agencies
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-10 lg:px-8 lg:pb-12">
        <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Not Sure Where to Start?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re unsure what you need or whether your current setup is
            working, I can help.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            Most projects start with a short call to understand your
            requirements and outline next steps.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            No obligation — just a practical conversation about your options.
          </p>
          <div className="mt-8">
            <Link
              href="/contact#book-call"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
