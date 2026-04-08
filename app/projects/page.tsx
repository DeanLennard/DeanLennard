import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { SectionHeading } from "@/components/section-heading";
import { projectCaseStudies } from "@/data/site";

export const metadata: Metadata = {
  title: "Full-Stack Developer Portfolio UK | Web Development Case Studies",
  description:
    "Explore full-stack development projects, Next.js applications, and technical delivery case studies across web platforms, games, and enterprise systems.",
  openGraph: {
    title: "Portfolio | Full-Stack Projects & Case Studies",
    description:
      "A selection of web development and delivery projects focused on real-world outcomes and performance.",
  },
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <SectionHeading
        eyebrow="Projects"
        title="Full-Stack Development Projects & Technical Delivery Case Studies"
        description="Case studies across full-stack web development, game systems, and enterprise technical delivery. Each project is structured around the challenge, solution, delivery approach, and outcome, focusing on business impact, not just implementation."
      />

      <div className="mt-12 grid gap-6">
        {projectCaseStudies.map((project) => (
          <article
            key={project.title}
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10"
          >
            <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
              <div className="space-y-6">
                <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
                  {project.category}
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-stone-50">
                  {project.title}
                </h2>
                <div>
                  <ExternalLink
                    href={project.projectUrl}
                    ariaLabel={`${project.projectLinkLabel} for ${project.title}`}
                    className="inline-flex items-center justify-center rounded-md border border-amber-500/40 bg-amber-600/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-600 hover:text-stone-950"
                  >
                    {project.projectLinkLabel}
                  </ExternalLink>
                </div>
                <div className="flex flex-col gap-2 text-sm text-stone-300">
                  {project.title === "Outbreak Interactive" && (
                    <Link
                      href="/nextjs-developer-uk"
                      className="underline decoration-amber-500/60 underline-offset-4"
                    >
                      Related: Next.js developer UK
                    </Link>
                  )}
                  {project.title === "Outbreak Interactive" && (
                    <Link
                      href="/technical-seo-services-uk"
                      className="underline decoration-amber-500/60 underline-offset-4"
                    >
                      Related: Technical SEO services UK
                    </Link>
                  )}
                  {project.title === "Arcbound" && (
                    <Link
                      href="/unity-developer-uk"
                      className="underline decoration-amber-500/60 underline-offset-4"
                    >
                      Related: Unity developer UK
                    </Link>
                  )}
                  {project.title === "Arcbound Community" && (
                    <Link
                      href="/web-application-development-uk"
                      className="underline decoration-amber-500/60 underline-offset-4"
                    >
                      Related: Web application development UK
                    </Link>
                  )}
                  {project.title === "Virgin Media O2" && (
                    <Link
                      href="/technical-delivery-consultant"
                      className="underline decoration-amber-500/60 underline-offset-4"
                    >
                      Related: Technical delivery consultant
                    </Link>
                  )}
                  {project.title === "Barclays Bank" && (
                    <Link
                      href="/technical-delivery-consultant"
                      className="underline decoration-amber-500/60 underline-offset-4"
                    >
                      Related: Technical delivery consultant
                    </Link>
                  )}
                </div>
                <div className="overflow-hidden rounded-md border border-amber-500/25 bg-[linear-gradient(180deg,rgba(217,119,6,0.08),rgba(17,24,39,0.28))]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={project.imageSrc}
                      alt={project.imageLabel}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="border-t border-[color:var(--color-border)] px-6 py-4">
                    <p className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">
                      Project Visual
                    </p>
                    <p className="mt-2 text-sm leading-7 text-stone-300">
                      {project.imageLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6">
                  <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
                    Overview
                  </p>
                  <p className="mt-4 text-base leading-8 text-stone-300">
                    {project.overview}
                  </p>
                </section>

                <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6">
                  <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
                    Problem / Challenge
                  </p>
                  <p className="mt-4 text-base leading-8 text-stone-300">
                    {project.challenge}
                  </p>
                </section>

                <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6">
                  <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
                    Solution
                  </p>
                  <p className="mt-4 text-base leading-8 text-stone-300">
                    {project.solution}
                  </p>
                </section>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
                  Technologies Used
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                  {project.technologies.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
                  Delivery Approach
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                  {project.deliveryApproach.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-amber-300 uppercase">
                  Outcome / Results
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                  {project.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
                  Key Takeaway
                </p>
                <p className="mt-4 text-sm leading-7 text-stone-300">
                  {project.takeaway}
                </p>
              </section>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16 rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
          Need a Similar Solution?
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-stone-50">
          Looking for a freelance full-stack developer to deliver a web application, platform, or technical project end-to-end?
        </h2>
        <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
          I&apos;m available for freelance, contract, and consulting work across{" "}
          <Link href="/services" className="text-stone-50 underline decoration-amber-500/60 underline-offset-4">
            full-stack development services
          </Link>
          ,{" "}
          <Link href="/services" className="text-stone-50 underline decoration-amber-500/60 underline-offset-4">
            technical SEO services
          </Link>
          , and{" "}
          <Link href="/services" className="text-stone-50 underline decoration-amber-500/60 underline-offset-4">
            delivery and project management
          </Link>
          .
        </p>
        <div className="mt-8">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>
    </main>
  );
}
