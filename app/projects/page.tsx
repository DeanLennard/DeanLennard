import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ExternalLink } from "@/components/external-link";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import { projectCaseStudies } from "@/data/site";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
} from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

const projectAnchors: Record<string, string> = {
  "Outbreak Interactive": "outbreak-interactive",
  "Crested Schoolwear": "crested-schoolwear",
  "Virgin Media O2": "virgin-media-o2",
  "Department for Work & Pensions": "department-for-work-and-pensions",
  "Barclays Bank": "barclays-bank",
  Arcbound: "arcbound",
  "Arcbound Community": "arcbound-community",
};

const featuredProjectLinks = [
  {
    title: "Outbreak Interactive",
    summary: "Full-stack platform",
  },
  {
    title: "Crested Schoolwear",
    summary: "Ecommerce platform",
  },
  {
    title: "Virgin Media O2",
    summary: "Enterprise delivery",
  },
  {
    title: "Department for Work & Pensions",
    summary: "Public sector platform",
  },
] as const;

const projectTags: Record<string, readonly string[]> = {
  "Outbreak Interactive": ["Full-Stack", "Next.js", "SEO"],
  "Crested Schoolwear": ["Ecommerce", "WordPress", "WooCommerce"],
  "Virgin Media O2": ["Enterprise", "Delivery", "Platform"],
  "Department for Work & Pensions": ["Public Sector", "Platform", "Delivery"],
  "Barclays Bank": ["Enterprise", "Transformation", "Delivery"],
  Arcbound: ["Game Dev", "Unity", "Cross-Platform"],
  "Arcbound Community": ["Community", "Next.js", "MongoDB"],
};

const visualContexts: Record<string, string> = {
  "Outbreak Interactive": "Marketing site and internal dashboard system",
  "Crested Schoolwear": "Ecommerce storefront and product catalogue experience",
  "Virgin Media O2": "Programme delivery and platform transformation work",
  "Department for Work & Pensions":
    "Platform transformation supporting a critical public service",
  "Barclays Bank":
    "Enterprise delivery leadership across digital products and teams",
  Arcbound: "Gameplay systems and cross-platform simulation experience",
  "Arcbound Community": "Community forum and chat platform for player engagement",
};

const projectTypes = [
  "Full-stack web applications",
  "Ecommerce platforms",
  "Enterprise systems",
  "Technical delivery programmes",
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: "Full-Stack Developer Portfolio UK | Web Development Case Studies",
  description:
    "Explore full-stack development projects, Next.js applications, and technical delivery case studies across web platforms, games, and enterprise systems.",
  path: "/projects",
  openGraph: {
    title: "Portfolio | Full-Stack Projects & Case Studies",
    description:
      "A selection of web development and delivery projects focused on real-world outcomes and performance.",
  },
});

export default function ProjectsPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <SchemaScript
        id="projects-page-schema"
        value={[
          buildCollectionPageSchema({
            name: "Full-Stack Development Projects & Technical Delivery Case Studies",
            path: "/projects",
            description:
              "A selection of web development and delivery case studies focused on practical outcomes, technical execution, and end-to-end delivery.",
            items: projectCaseStudies.map((project) => ({
              name: project.title,
              path: `/projects#${projectAnchors[project.title]}`,
            })),
          }),
          buildBreadcrumbSchema(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />
      <SectionHeading
        eyebrow="Projects"
        title="Full-Stack Development Projects & Technical Delivery Case Studies"
        description="Real-world projects across startups, ecommerce, and enterprise, delivering measurable outcomes, not just code. Each case study is structured around the challenge, solution, delivery approach, and business impact."
      />

      <section className="mt-10 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <SectionHeading
          eyebrow="Why These Case Studies Matter"
          title="Each project is structured to show the challenge, solution, delivery approach, and outcome."
          description="That makes the portfolio more useful for buyers, search engines, and AI systems looking for evidence-backed technical experience."
        />
      </section>

      <section className="mt-10 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Start with the projects most relevant to your brief."
          description="Quick links into the case studies covering full-stack platforms, ecommerce, enterprise delivery, and public sector transformation."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredProjectLinks.map((project) => (
            <Link
              key={project.title}
              href={`/projects#${projectAnchors[project.title]}`}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 transition hover:border-amber-500/40 hover:bg-white/6"
            >
              <p className="text-lg font-semibold text-stone-50">
                {project.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                {project.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <SectionHeading
          eyebrow="Types of Projects Delivered"
          title="A broad range of technical projects, from product builds to complex delivery programmes."
          description="Useful if you are scanning for relevant experience before reading the full case studies."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {projectTypes.map((type) => (
            <div
              key={type}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
            >
              {type}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 grid gap-6">
        {projectCaseStudies.map((project, index) => (
          <div key={project.title} className="grid gap-6">
            <article
              id={projectAnchors[project.title]}
              className="scroll-mt-28 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10"
            >
              <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
                <div className="space-y-6">
                  <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
                    {project.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(projectTags[project.title] ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-amber-500/25 bg-amber-600/10 px-3 py-1 text-xs font-medium text-amber-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-stone-50">
                    {project.title}
                  </h2>
                  {project.projectUrl && project.projectLinkLabel ? (
                    <div>
                      <ExternalLink
                        href={project.projectUrl}
                        ariaLabel={`${project.projectLinkLabel} for ${project.title}`}
                        className="inline-flex items-center justify-center rounded-md border border-amber-500/40 bg-amber-600/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-600 hover:text-stone-950"
                      >
                        {project.projectLinkLabel}
                      </ExternalLink>
                    </div>
                  ) : null}
                  <section className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-6">
                    <p className="text-sm font-semibold tracking-[0.2em] text-amber-300 uppercase">
                      Results Snapshot
                    </p>
                    <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                      {project.outcomes.slice(0, 3).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
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
                    {project.title === "Crested Schoolwear" && (
                      <Link
                        href="/web-application-development-uk"
                        className="underline decoration-amber-500/60 underline-offset-4"
                      >
                        Related: Web application development UK
                      </Link>
                    )}
                    {project.title === "Crested Schoolwear" && (
                      <Link
                        href="/improve-existing-website"
                        className="underline decoration-amber-500/60 underline-offset-4"
                      >
                        Related: Improve your existing website
                      </Link>
                    )}
                    {project.title === "Department for Work & Pensions" && (
                      <Link
                        href="/technical-delivery-consultant"
                        className="underline decoration-amber-500/60 underline-offset-4"
                      >
                        Related: Technical delivery consultant
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
                        What You&apos;re Seeing
                      </p>
                      <p className="mt-2 text-sm leading-7 text-stone-300">
                        {visualContexts[project.title] ?? project.imageLabel}
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

            {(index === 2 || index === 5) && (
              <section className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8">
                <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
                  Need Something Similar?
                </p>
                <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
                  If you need a similar platform, delivery programme, or web
                  application, let&apos;s discuss your project and the most
                  practical next step.
                </p>
                <div className="mt-8">
                  <Link
                    href="/contact#book-call"
                    className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
                  >
                    Book a Call
                  </Link>
                </div>
              </section>
            )}
          </div>
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
          Let&apos;s discuss your project and next steps. Most projects start
          with a short call to understand your requirements and outline next
          steps.
        </p>
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
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Book a Call
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>
    </main>
  );
}
