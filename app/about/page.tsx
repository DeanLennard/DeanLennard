import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About | Freelance Full-Stack Developer UK & Delivery Specialist",
  description:
    "Learn more about a UK-based freelance full-stack developer with expertise in Next.js, technical SEO, and end-to-end project delivery.",
  openGraph: {
    title: "About Dean Lennard | Full-Stack Developer UK",
    description:
      "Full-stack developer combining technical expertise with project delivery and leadership experience.",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="About"
            title="Freelance Full-Stack Developer UK with Technical Delivery Expertise"
            description="Development expertise with delivery leadership built in."
          />
          <div className="space-y-5 text-base leading-8 text-stone-300">
            <p>
              I&apos;m a freelance full-stack developer based in the UK, with a
              strong background in technical delivery and project leadership.
            </p>
            <p>
              My work sits at the intersection of full-stack development and
              project execution, ensuring that web applications and digital
              platforms are not only built well, but delivered successfully.
            </p>
            <p>
              I&apos;ve worked across a range of web development projects, from
              scalable web applications and business systems to performance
              optimisation and technical SEO.
            </p>
          </div>
        </div>

        <aside className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Technical Background & Delivery Experience
          </p>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {[
              "Architecture and system design decisions",
              "Technical project delivery and planning",
              "Stakeholder coordination across teams",
              "End-to-end execution of web development projects",
            ].map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-7 text-stone-300">
            This allows me to bridge the gap between technical teams and
            business objectives, ensuring that development work aligns with
            real-world outcomes.
          </p>
        </aside>
      </section>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Full-Stack Development & Technical Skillset"
          title="Broad technical capability across modern web development, infrastructure, and performance optimisation."
          description="A full-stack skillset supported by practical experience across both product delivery and operational setup."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Build",
              copy: "Full-stack development using Next.js, Node.js, MongoDB, WordPress, PHP, and API integrations.",
            },
            {
              title: "Optimise",
              copy: "Technical SEO, performance optimisation, and platform improvements that support search visibility, speed, and conversion.",
            },
            {
              title: "Support",
              copy: "Hosting, deployment, infrastructure setup, and Unity (C#) development for interactive and game-focused projects.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-8"
            >
              <h2 className="text-xl font-semibold text-stone-50">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                {item.copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Technical Delivery & Project Experience"
          title="Structured delivery experience alongside hands-on development."
          description="Alongside full-stack development, I bring a delivery mindset that helps ensure projects are completed on time and aligned with business goals."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            "Agile / Scrum methodologies",
            "Roadmap and sprint planning",
            "Stakeholder communication and coordination",
            "Risk management and problem solving",
          ].map((item) => (
            <article
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8"
            >
              <p className="text-base leading-8 text-stone-300">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-8">
          <SectionHeading
            eyebrow="My Approach"
            title="Clear, practical, and built to last."
            description="Every project is approached with the same mindset: deliver scalable, maintainable solutions that perform in real-world environments."
          />
          <ul className="mt-8 space-y-4 text-sm leading-7 text-stone-300">
            {[
              "Clarity over complexity",
              "Practical, scalable solutions",
              "Strong communication",
              "Ownership from start to finish",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8">
          <SectionHeading
            eyebrow="What Makes Me Different"
            title="Responsibility beyond implementation."
            description="Most developers focus purely on coding."
          />
          <p className="mt-8 text-base leading-8 text-stone-300">
            I take responsibility for the full solution, including
            architecture, full-stack development, infrastructure, and
            technical project delivery. That means fewer gaps, fewer delays,
            and a smoother path from idea to execution.
          </p>
        </article>
      </section>

      <section className="mt-20 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <SectionHeading
          eyebrow="Specialist Areas"
          title="Explore the specific areas I work across."
          description="If you want to go deeper into a specific capability, these pages break out the services and delivery approach in more detail."
        />
        <div className="mt-8 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
          <Link
            href="/nextjs-developer-uk"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Next.js developer UK
          </Link>
          <Link
            href="/web-application-development-uk"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Web application development UK
          </Link>
          <Link
            href="/technical-seo-services-uk"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Technical SEO services UK
          </Link>
          <Link
            href="/technical-delivery-consultant"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Technical delivery consultant
          </Link>
          <Link
            href="/unity-developer-uk"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Unity developer UK
          </Link>
          <Link
            href="/startup-full-stack-developer"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Startup and SaaS development
          </Link>
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
      </section>
    </main>
  );
}
