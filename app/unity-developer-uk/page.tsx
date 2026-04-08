import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Unity Developer UK | Game Development & Interactive Systems",
  description:
    "Freelance Unity developer in the UK building gameplay systems, prototypes, and cross-platform games with a strong focus on delivery and technical structure.",
  openGraph: {
    title: "Unity Developer UK | Game Development & Interactive Systems",
    description:
      "Freelance Unity developer in the UK building gameplay systems, prototypes, and cross-platform games with a strong focus on delivery and technical structure.",
  },
};

const services = [
  "Gameplay systems and mechanics",
  "Unity (C#) development",
  "Cross-platform builds (PC, iOS, Android)",
  "Prototype development and rapid iteration",
  "Systems-driven game design",
  "Tools and supporting systems",
];

const projectTypes = [
  "Indie game development",
  "Simulation and systems-driven games",
  "Prototype development for new ideas",
  "Gameplay system design and implementation",
  "Interactive tools and experiences",
];

const approachItems = [
  "Systems-first development approach",
  "Clear technical structure for scalability",
  "Iterative development with playable milestones",
  "Alignment between gameplay design and implementation",
];

const systemsThinking = [
  "Modular gameplay systems",
  "Scalable mechanics and interactions",
  "Reusable architecture",
  "Performance-aware implementation",
];

const technologies = [
  "Unity",
  "C#",
  "Cross-platform development (PC, iOS, Android)",
  "Performance optimisation techniques",
  "Version control and structured builds",
];

const audiences = [
  "Indie developers and small studios",
  "Startups exploring game concepts",
  "Teams needing gameplay system support",
  "Projects requiring structured technical development",
];

export default function UnityDeveloperUkPage() {
  return (
    <main>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Unity Developer UK
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Unity Developer UK - Game Development & Interactive Systems
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I&apos;m a freelance Unity developer based in the UK,
                specialising in gameplay systems, prototypes, and cross-platform
                game development using C#.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                I combine technical development with structured delivery,
                helping turn game ideas into playable, scalable products.
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
                View Game Projects
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Freelance Unity developer",
                "Gameplay systems and prototypes",
                "Cross-platform game development",
                "Structured technical delivery",
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
          title="Unity Game Development Services"
          description="I develop games and interactive systems in Unity, focusing on building solid technical foundations that support gameplay, iteration, and long-term development."
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
            eyebrow="Types of Projects"
            title="Types of Projects I Work On"
            description="Support for game and interactive projects that need structure, systems thinking, and dependable implementation."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projectTypes.map((item) => (
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
          title="Structured Development & Delivery"
          description="Many game projects fail due to lack of structure or unclear technical direction."
        />
        <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
          I approach Unity development with both engineering and delivery in
          mind, ensuring your project is not only built, but progresses
          properly.
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
            eyebrow="Systems Thinking"
            title="Systems-Driven Game Development"
            description="I focus on building systems that support gameplay rather than one-off features."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {systemsThinking.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
            This approach allows projects to evolve without needing to be
            rebuilt.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="Technologies"
          title="Technologies Used"
          description="A practical Unity development stack for structured, scalable, cross-platform game work."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {technologies.map((item) => (
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
            eyebrow="Project Example"
            title="Example: Arcbound"
            description="A systems-driven sci-fi colony simulation game built in Unity, focused on pressure management, chaos, and player-driven outcomes."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Built cross-platform gameplay systems",
              "Developed core simulation mechanics",
              "Aligned technical systems with gameplay design",
              "Created a foundation for continued iteration",
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
              View Full Case Study
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="Who It&apos;s For"
          title="Who This Is For"
          description="This work is best suited to projects that need technical structure, gameplay systems thinking, and reliable execution."
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

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Need a Unity Developer Who Can Deliver?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re looking for a freelance Unity developer in the UK
            who can build gameplay systems and support your project from concept
            to playable product, I&apos;d be happy to help.
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
              Get in Touch
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              href="/projects"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Unity game projects
            </Link>
            <Link
              href="/services"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Game development services
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
