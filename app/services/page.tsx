import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

type ServiceNumber = "01" | "02" | "03" | "04" | "05";

export const metadata: Metadata = {
  title: "Web Development Services UK | Full-Stack, SEO & Technical Delivery",
  description:
    "Freelance web development services in the UK including full-stack development, Next.js, technical SEO, hosting, and project delivery consulting.",
  openGraph: {
    title: "Web Development & Technical Services UK",
    description:
      "Full-stack development, SEO, infrastructure, and delivery services designed to support projects from concept to completion.",
  },
};

export default function ServicesPage() {
  const specialistPageByServiceNumber: Record<ServiceNumber, string> = {
    "01": "/web-application-development-uk",
    "02": "/technical-seo-services-uk",
    "03": "/web-application-development-uk",
    "04": "/unity-developer-uk",
    "05": "/technical-delivery-consultant",
  };

  const services = [
    {
      number: "01" as const,
      title: "Full-Stack Web Design & Development Services",
      intro:
        "Modern full-stack development services designed for scalable, maintainable, and high-performing web applications.",
      included: [
        "Full-stack web development (Next.js, Node.js, MongoDB)",
        "Custom web application development",
        "WordPress and PHP development",
        "Responsive and accessible UI development",
        "API integrations and backend systems",
        "Performance-focused architecture",
      ],
      whoItsFor: [
        "Startups building web applications",
        "SMEs needing reliable web development services",
        "Agencies requiring freelance development support",
      ],
      value:
        "Scalable, high-performance web applications built to support business growth and long-term maintainability.",
    },
    {
      number: "02" as const,
      title: "Technical SEO Services & Performance Optimisation",
      intro:
        "Technical SEO services designed to improve search visibility, site performance, and indexing.",
      included: [
        "Technical SEO audits and optimisation",
        "Core Web Vitals and performance improvements",
        "Site structure and internal linking optimisation",
        "Indexing, crawlability, and metadata fixes",
        "Analytics, tracking, and reporting setup",
      ],
      whoItsFor: [
        "Businesses struggling with organic visibility",
        "Websites with slow performance",
        "Platforms needing technical SEO improvements",
      ],
      value:
        "Improved rankings, faster load times, and stronger search performance.",
    },
    {
      number: "03" as const,
      title: "Web Hosting, Deployment & Cloud Infrastructure Services",
      intro:
        "Deployment and infrastructure services that support secure, scalable, and reliable web applications.",
      included: [
        "Cloud deployment (Vultr, VPS, and cloud platforms)",
        "CI/CD pipelines and deployment workflows",
        "Domain, DNS, and environment configuration",
        "Performance tuning and monitoring",
        "Ongoing support and maintenance",
      ],
      whoItsFor: [
        "Teams launching new platforms",
        "Projects moving from development to production",
        "Businesses needing reliable hosting and support",
      ],
      value:
        "Stable, scalable infrastructure that supports performance and growth.",
    },
    {
      number: "04" as const,
      title: "Unity Game Design & Development",
      intro:
        "Unity-based development for gameplay systems, prototypes, and interactive experiences.",
      included: [
        "Unity (C#) development",
        "Gameplay systems",
        "Rapid prototyping",
        "Indie and experimental projects",
      ],
      whoItsFor: [
        "Indie developers",
        "Startups exploring game concepts",
        "Creative projects",
      ],
      value:
        "Playable, functional prototypes and systems built efficiently.",
    },
    {
      number: "05" as const,
      title: "Technical Delivery, Project & Programme Management",
      intro:
        "Technical delivery services that ensure web development projects are completed successfully from concept to launch.",
      included: [
        "Agile / Scrum delivery management",
        "Roadmap and milestone planning",
        "Stakeholder coordination",
        "Technical project delivery oversight",
        "End-to-end execution",
      ],
      whoItsFor: [
        "Organisations lacking technical leadership",
        "Teams needing structured delivery",
        "Projects at risk or behind schedule",
      ],
      value:
        "Reliable project execution, aligned stakeholders, and successful delivery outcomes.",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <SectionHeading
        eyebrow="Services"
        title="Web Development Services UK, Technical SEO & Delivery Consulting"
        description="I provide freelance web development services, technical SEO, infrastructure setup, and technical delivery consulting for startups, SMEs, and agencies across the UK."
      />
      <p className="mt-6 max-w-4xl text-base leading-8 text-stone-300">
        My work focuses on delivering complete digital solutions, combining
        full-stack development, performance optimisation, and structured
        project delivery to ensure successful outcomes.
      </p>

      <div className="mt-12 grid gap-6">
        {services.map((service) => (
          <article
            key={service.title}
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
              <div className="space-y-4">
                <p className="text-sm text-stone-500">{service.number}</p>
                <h2 className="text-3xl font-semibold tracking-tight text-stone-50">
                  {service.title}
                </h2>
                <p className="text-base leading-8 text-stone-300">
                  {service.intro}
                </p>
              </div>
              <div className="grid gap-6 xl:grid-cols-3">
                <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6">
                  <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
                    What&apos;s Included
                  </p>
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                    {service.included.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6">
                  <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
                    Who It&apos;s For
                  </p>
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                    {service.whoItsFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-6">
                  <p className="text-sm font-semibold tracking-[0.2em] text-amber-300 uppercase">
                    Value Delivered
                  </p>
                  <p className="mt-5 text-sm leading-7 text-stone-300">
                    {service.value}
                  </p>
                </section>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href={specialistPageByServiceNumber[service.number]}
                className="text-sm font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
              >
                View related specialist page
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16 rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
          Need a Reliable Technical Partner?
        </p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
          If you&apos;re looking for a freelance full-stack developer in the UK
          who can build, manage, and deliver your project end-to-end, I&apos;d
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
            Get in Touch
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
            href="/web-application-development-uk"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Web application development
          </Link>
          <Link
            href="/technical-seo-services-uk"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Technical SEO services
          </Link>
          <Link
            href="/technical-delivery-consultant"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Delivery consulting
          </Link>
          <Link
            href="/unity-developer-uk"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Unity game development
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
