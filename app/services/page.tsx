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
      title: "Build scalable, high-performance web applications",
      serviceName: "Full-Stack Web Design & Development Services",
      intro:
        "Full-stack development support for businesses building new products, platforms, and customer-facing web applications.",
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
      ctaLabel: "Discuss Your Web Application",
      ctaHref: "/contact#project-enquiry",
    },
    {
      number: "02" as const,
      title: "Improve visibility, speed, and technical SEO performance",
      serviceName: "Technical SEO Services & Performance Optimisation",
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
      ctaLabel: "Request a Technical SEO Review",
      ctaHref: "/contact#project-enquiry",
    },
    {
      number: "03" as const,
      title: "Launch and support reliable infrastructure",
      serviceName: "Web Hosting, Deployment & Cloud Infrastructure Services",
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
      ctaLabel: "Talk Through Your Infrastructure",
      ctaHref: "/contact#project-enquiry",
    },
    {
      number: "04" as const,
      title: "Build gameplay systems and prototypes with structure",
      serviceName: "Unity Game Design & Development",
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
      ctaLabel: "Discuss Your Interactive Project",
      ctaHref: "/contact#project-enquiry",
    },
    {
      number: "05" as const,
      title: "Keep projects moving with stronger delivery leadership",
      serviceName: "Technical Delivery, Project & Programme Management",
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
      ctaLabel: "Talk Through Your Project",
      ctaHref: "/contact#project-enquiry",
    },
  ];

  const faqs = [
    {
      question: "How much does web development cost in the UK?",
      answer:
        "It depends on scope, complexity, and delivery requirements. Smaller projects are usually more focused, while web applications and delivery-led engagements are scoped around a clearer build plan and outcome.",
    },
    {
      question: "Do you work with startups or only established businesses?",
      answer:
        "Both. I work with startups building new products, SMEs improving existing platforms, and agencies or larger organisations that need delivery support.",
    },
    {
      question: "Can you improve an existing website?",
      answer:
        "Yes. That can include performance issues, technical SEO improvements, codebase clean-up, infrastructure work, and more structured delivery support.",
    },
    {
      question: "Do you offer ongoing support?",
      answer:
        "Yes. Ongoing support, delivery consulting, and structured technical input are all available where a project needs continuity after launch.",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <SectionHeading
        eyebrow="Services"
        title="Build, Scale & Deliver Web Applications That Actually Work"
        description="Full-stack development, technical SEO, and delivery leadership for businesses that need more than just code."
      />
      <p className="mt-6 max-w-4xl text-base leading-8 text-stone-300">
        From idea to launch, I design, build, and deliver reliable digital
        products that perform.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/contact#project-enquiry"
          className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
        >
          Get a Project Estimate
        </Link>
        <Link
          href="/contact#book-call"
          className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
        >
          Talk Through Your Project
        </Link>
      </div>

      <section className="mt-10 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Jump To
        </p>
        <div className="mt-6 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
          <a href="#web-development" className="underline decoration-amber-500/60 underline-offset-4">
            Web Development
          </a>
          <a href="#technical-seo" className="underline decoration-amber-500/60 underline-offset-4">
            Technical SEO
          </a>
          <a href="#hosting-infrastructure" className="underline decoration-amber-500/60 underline-offset-4">
            Hosting & Infrastructure
          </a>
          <a href="#unity-development" className="underline decoration-amber-500/60 underline-offset-4">
            Unity Development
          </a>
          <a href="#delivery-consulting" className="underline decoration-amber-500/60 underline-offset-4">
            Delivery Consulting
          </a>
        </div>
      </section>

      <section className="mt-10 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <SectionHeading
          eyebrow="Who I Work With"
          title="The best fit is projects that need strong technical execution and clearer delivery."
          description="If your project needs both technical execution and structured delivery, you&apos;re in the right place."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Startups building new platforms or SaaS products",
            "SMEs needing reliable, scalable websites",
            "Agencies looking for experienced freelance support",
            "Businesses struggling with performance or SEO",
          ].map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
        <SectionHeading
          eyebrow="Recent Outcomes"
          title="A stronger fit for businesses that need results, not just implementation."
          description="Recent work spans full-stack platforms, technical SEO improvements, and enterprise delivery leadership."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Delivered a full-stack platform combining website, telemetry, and reporting for Outbreak Interactive",
            "Reduced downtime by 40% and increased platform stability by 35% at Virgin Media O2",
            "Improved governance and delivery coordination across the DWP Health Assessments Service platform",
            "Built a scalable ecommerce platform for Crested Schoolwear",
            "Delivered technical SEO, performance, and platform improvements across multiple projects",
            "Led enterprise delivery, transformation, and cross-team execution in regulated environments",
          ].map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <SectionHeading
          eyebrow="Typical Engagements"
          title="Useful budgeting context before we scope anything properly."
          description="Every project is scoped individually, but the ranges below help set expectations."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "Small projects: GBP 1,000 - GBP 5,000",
            "Web applications: GBP 5,000 - GBP 25,000+",
            "Ongoing support and consulting available",
          ].map((item) => (
            <div
              key={item}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <SectionHeading
          eyebrow="End-to-End Technical Partner"
          title="More than a freelance developer, this is delivery support across the whole outcome."
          description="Most developers focus on code. I focus on delivering the full outcome, from architecture and development through to infrastructure, performance, and successful project delivery."
        />
        <div className="mt-8 flex flex-col gap-3 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-6">
          <Link
            href="/nextjs-developer-uk"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Next.js Developer UK
          </Link>
          <Link
            href="/web-application-development-uk"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Freelance Full-Stack Developer UK
          </Link>
          <Link
            href="/technical-seo-services-uk"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Technical SEO Consultant UK
          </Link>
        </div>
      </section>

      <div className="mt-12 grid gap-6">
        {services.map((service) => (
          <article
            key={service.title}
            id={
              {
                "01": "web-development",
                "02": "technical-seo",
                "03": "hosting-infrastructure",
                "04": "unity-development",
                "05": "delivery-consulting",
              }[service.number]
            }
            className="scroll-mt-28 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
              <div className="space-y-4">
                <p className="text-sm font-medium text-stone-300">
                  {service.number}
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-stone-50">
                  {service.title}
                </h2>
                <p className="text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
                  {service.serviceName}
                </p>
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
            <div className="mt-6">
              <Link
                href={service.ctaHref}
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
              >
                {service.ctaLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <SectionHeading
          eyebrow="FAQs"
          title="Common questions before getting started."
          description="A quick overview of the questions that usually come up before a project is scoped."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6"
            >
              <h2 className="text-lg font-semibold text-stone-50">
                {faq.question}
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/website-growth-check"
            className="text-sm font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
          >
            Try the Website Growth Check before getting in touch
          </Link>
        </div>
      </section>

      <section className="mt-16 rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
          Need a Reliable Technical Partner?
        </p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
          If you&apos;re looking for a freelance full-stack developer in the UK
          who can build, manage, and deliver your project end-to-end, let&apos;s
          discuss your project and next steps.
        </p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
          Most projects start with a short call to understand your requirements
          and outline next steps.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/contact#project-enquiry"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Get a Project Estimate
          </Link>
          <Link
            href="/contact#book-call"
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            Talk Through Your Project
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
            href="/website-growth-check"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Website Growth Check
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
