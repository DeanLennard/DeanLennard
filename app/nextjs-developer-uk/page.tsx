import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
} from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Next.js Developer UK | Freelance Full-Stack Web Applications",
  description:
    "Freelance Next.js developer in the UK building scalable, high-performance web applications with full-stack expertise and end-to-end delivery.",
  path: "/nextjs-developer-uk",
  openGraph: {
    title: "Next.js Developer UK | Freelance Full-Stack Web Applications",
    description:
      "Freelance Next.js developer in the UK building scalable, high-performance web applications with full-stack expertise and end-to-end delivery.",
  },
});

const services = [
  "Custom web application development",
  "SaaS platforms and dashboards",
  "Marketing websites with SEO foundations",
  "API integrations and backend systems",
  "Performance-focused builds using modern frameworks",
];

const benefits = [
  "Server-side rendering (SSR) and static generation (SSG)",
  "Excellent performance and Core Web Vitals",
  "Built-in SEO advantages",
  "Scalable architecture for growing platforms",
  "Seamless integration with APIs and backend services",
];

const stack = [
  "Next.js",
  "React",
  "Node.js",
  "MongoDB",
  "REST APIs and integrations",
  "Vultr and cloud deployment platforms",
];

const audiences = [
  "Startups building new web applications",
  "SMEs needing scalable platforms",
  "Agencies requiring reliable development support",
  "Teams needing both development and delivery expertise",
];

const faqs = [
  {
    question: "What does a Next.js developer do?",
    answer:
      "A Next.js developer builds web applications using the Next.js framework, covering frontend performance, routing, SEO foundations, backend integrations, and deployment.",
  },
  {
    question: "Why use Next.js over React alone?",
    answer:
      "Next.js builds on React with routing, server rendering, static generation, metadata support, and performance features that make it a stronger fit for production web applications.",
  },
  {
    question: "How much does a Next.js project cost in the UK?",
    answer:
      "That depends on scope, complexity, and delivery requirements. Simpler builds are more focused, while full-stack platforms and SaaS products are scoped around a clearer roadmap and outcome.",
  },
  {
    question: "Why hire a freelance Next.js developer instead of an agency?",
    answer:
      "A freelance Next.js developer can provide direct technical ownership, faster communication, and less delivery overhead, while still supporting architecture, implementation, and launch.",
  },
];

export default function NextJsDeveloperUkPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Next.js Developer UK", path: "/nextjs-developer-uk" },
  ];

  return (
    <main>
      <SchemaScript
        id="nextjs-developer-uk-schema"
        value={[
          buildServiceSchema({
            name: "Next.js Developer UK",
            path: "/nextjs-developer-uk",
            description:
              "Freelance Next.js development services in the UK for scalable web applications, performance-focused websites, and full-stack platforms.",
            serviceType: "Next.js development services",
          }),
          buildBreadcrumbSchema(breadcrumbItems),
          buildFaqSchema(faqs),
        ]}
      />
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Next.js Developer UK" },
          ]}
        />
      </div>
      <section className="hero-grid">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-300">
              Next.js Developer UK
            </div>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
                Next.js Developer UK - Scalable Full-Stack Web Applications
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                I&apos;m a freelance Next.js developer in the UK, helping
                startups and SMEs build scalable web applications with
                full-stack architecture and end-to-end delivery.
              </p>
              <p className="max-w-3xl text-base leading-8 text-stone-300">
                Based in Staffordshire and working remotely across the UK, I
                design and build scalable platforms using Next.js, Node.js, and
                modern web technologies.
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
                View Next.js development case studies
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              At a Glance
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
              {[
                "Freelance Next.js developer",
                "Full-stack web applications",
                "SEO and performance focus",
                "End-to-end delivery",
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
          eyebrow="UK Delivery"
          title="Working with UK startups, SMEs, and agencies that need dependable technical delivery."
          description="Based in Staffordshire and working across the UK, I support businesses that need strong implementation, clearer ownership, and reliable project delivery."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Based in Staffordshire, UK",
            "Remote support across the UK",
            "Freelance Next.js developer for startups and SMEs",
            "Direct communication with no agency layers",
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

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Credibility"
            title="Trusted delivery backed by practical outcomes."
            description="The strongest Next.js pages need proof, not just positioning."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Trusted by startups, SMEs, agencies, and enterprise teams across the UK",
              "Outbreak Interactive platform built in Next.js with full-stack telemetry and reporting",
              "Arcbound Community delivered as a Next.js and MongoDB web application",
              "Technical delivery experience across Virgin Media O2, DWP, and Barclays programmes",
            ].map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-sm leading-7 text-stone-300"
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
          title="Full-Stack Next.js Development Services"
          description="I build modern web applications using Next.js, combining frontend performance with backend capability to deliver fast, scalable, and maintainable platforms."
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
            eyebrow="Why Next.js"
            title="Why Use Next.js for Web Applications?"
            description="Next.js provides a strong foundation for modern web development, particularly where performance, SEO, and scalability matter."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-stone-300">
            This makes it ideal for startups, SaaS platforms, and
            high-performance websites.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="My Approach"
          title="More Than Development - End-to-End Delivery"
          description="Most Next.js developers focus on implementation. I take responsibility for the full solution."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Architecture and technical decisions",
            "Full-stack development (frontend + backend)",
            "Infrastructure and deployment",
            "Technical SEO and performance",
            "Project delivery and execution",
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
          This ensures your project moves from idea to production without gaps
          or delays.
        </p>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Why Hire a Freelancer?"
            title="Why hire a freelance Next.js developer instead of an agency?"
            description="A lot of buyers at this stage are comparing agency support against direct freelance delivery."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
              <h2 className="text-xl font-semibold text-stone-50">
                Direct freelance support
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                {[
                  "Direct communication with the developer doing the work",
                  "Less delivery overhead and fewer handoffs",
                  "Technical decisions tied closely to implementation",
                  "A practical fit for startups, SMEs, and focused product teams",
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-6">
              <h2 className="text-xl font-semibold text-stone-50">
                When this works best
              </h2>
              <p className="mt-5 text-sm leading-7 text-stone-300">
                This is often the right fit when you want to hire a Next.js
                developer in the UK for a SaaS build, a web application, a
                performance-led rebuild, or delivery support without the
                overhead of a larger agency structure.
              </p>
            </section>
          </div>
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Technology Stack"
            title="Technologies I Use"
            description="A practical stack for building scalable Next.js web applications with backend capability and reliable deployment."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stack.map((item) => (
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
          eyebrow="Who I Work With"
          title="Who This Is For"
          description="This service is designed for teams that need both strong implementation and dependable delivery support."
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

      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Project Proof"
            title="Relevant Next.js Project Proof"
            description="A practical example of Next.js development work, combining frontend performance, backend systems, and delivery ownership."
          />
          <div className="mt-8 rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
              Outbreak Interactive
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-stone-50">
              Next.js platform combining marketing, content, telemetry, and reporting
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-stone-300">
              <li>Built as a full-stack system using Next.js, Node.js, and MongoDB</li>
              <li>Combined public-facing marketing with internal operational tooling</li>
              <li>Delivered one platform covering SEO, blog publishing, telemetry, and reporting</li>
            </ul>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              View Next.js development case studies
            </Link>
            <Link
              href="/projects#outbreak-interactive"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              View the Outbreak Interactive case study
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="FAQs"
          title="Common questions about hiring a Next.js developer in the UK."
          description="Useful for comparison-stage buyers who are weighing framework, cost, and delivery options."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
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
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
            Need a Next.js Developer You Can Rely On?
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            If you&apos;re looking for a freelance Next.js developer in the UK
            who can design, build, and deliver your project end-to-end,
            let&apos;s discuss your project and next steps.
          </p>
          <p className="mt-4 max-w-4xl text-base leading-8 text-stone-300">
            Most projects start with a short call to understand your
            requirements and outline next steps.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact#book-call"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Book a Call
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
              href="/services"
              className="underline decoration-amber-500/60 underline-offset-4"
            >
              Full-stack development services
            </Link>
          <Link
            href="/projects"
            className="underline decoration-amber-500/60 underline-offset-4"
          >
            Next.js development case studies
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
