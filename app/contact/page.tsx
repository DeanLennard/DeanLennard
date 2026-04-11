import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ExternalLink } from "@/components/external-link";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
} from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact | Freelance Full-Stack Developer UK",
  description:
    "Get in touch with a UK-based freelance full-stack developer specialising in web applications, technical SEO, and end-to-end project delivery.",
  path: "/contact",
  openGraph: {
    title: "Contact | Full-Stack Developer UK",
    description:
      "Discuss your project and get support with development, SEO, and technical delivery.",
  },
});

type ContactPageSearchParams = Promise<{
  auditId?: string | string[];
  website?: string | string[];
  business?: string | string[];
  location?: string | string[];
  conversionScore?: string | string[];
  performanceScore?: string | string[];
  visibilityScore?: string | string[];
  sent?: string | string[];
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const faqs = [
  {
    question: "What does a typical project cost?",
    answer:
      "That depends on scope, complexity, and delivery needs. I can usually give a practical view on likely budget ranges once I understand the brief.",
  },
  {
    question: "Do you work with startups?",
    answer:
      "Yes. I work with startups, SMEs, agencies, and larger organisations where technical ownership and delivery support are needed.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. Ongoing development support, optimisation work, and delivery consulting are all available where they add value.",
  },
  {
    question: "Do you work remotely?",
    answer:
      "Yes. I work remotely with businesses across the UK and can support projects regardless of location.",
  },
] as const;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: ContactPageSearchParams;
}) {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];
  const resolvedSearchParams = await searchParams;
  const auditId = getSingleValue(resolvedSearchParams.auditId)?.trim() ?? "";
  const website = getSingleValue(resolvedSearchParams.website)?.trim() ?? "";
  const business = getSingleValue(resolvedSearchParams.business)?.trim() ?? "";
  const location = getSingleValue(resolvedSearchParams.location)?.trim() ?? "";
  const conversionScore =
    getSingleValue(resolvedSearchParams.conversionScore)?.trim() ?? "";
  const performanceScore =
    getSingleValue(resolvedSearchParams.performanceScore)?.trim() ?? "";
  const visibilityScore =
    getSingleValue(resolvedSearchParams.visibilityScore)?.trim() ?? "";
  const sent = getSingleValue(resolvedSearchParams.sent)?.trim() === "1";
  const error = getSingleValue(resolvedSearchParams.error)?.trim() ?? "";
  const hasAuditContext = Boolean(
    auditId ||
    website ||
      business ||
      location ||
      conversionScore ||
      performanceScore ||
      visibilityScore
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <SchemaScript
        id="contact-page-schema"
        value={[
          buildServiceSchema({
            name: "Contact Dean Lennard",
            path: "/contact",
            description:
              "Contact page for freelance full-stack development, technical SEO, and delivery support enquiries.",
            serviceType: "Project enquiries and technical consultation",
          }),
          buildBreadcrumbSchema(breadcrumbItems),
          buildFaqSchema([...faqs]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Contact"
            title="Let&apos;s Discuss Your Project & How to Deliver It Successfully"
            description="If you&apos;re looking to hire a freelance full-stack developer in the UK who can build, manage, and deliver your project end-to-end, let&apos;s discuss your project and the most practical next step."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Quick response within 24 hours",
              "No obligation",
              "Clear next steps after our first conversation",
            ].map((item) => (
              <div
                key={item}
                className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 text-sm leading-7 text-stone-300"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="#book-call"
              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Book a Call
            </Link>
            <Link
              href="#project-enquiry"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
            >
              Send a Project Enquiry
            </Link>
          </div>
          <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-8">
            <p className="text-base leading-8 text-stone-200">
              I work with startups, SMEs, and agencies on web development
              projects, technical SEO improvements, and delivery-focused
              engagements, from initial concept through to deployment and
              ongoing support.
            </p>
            <p className="mt-6 text-base leading-8 text-stone-200">
              Whether you need a new web application, help improving
              performance and visibility, or structured technical delivery, I
              can support you at any stage.
            </p>
            <p className="mt-6 text-base leading-8 text-stone-200">
              You&apos;ll be speaking directly with me, with no middle layers or
              account managers.
            </p>
            <div
              className="mt-8 scroll-mt-28 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
            >
              <h2
                id="project-enquiry"
                className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase"
              >
                Project Enquiry
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                Tell me a bit about your project, goals, and timeline, and
                I&apos;ll come back with a clear, practical next step.
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                Most projects start with a short call to understand your
                requirements and outline next steps.
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                Happy to discuss projects at any stage, even if you&apos;re
                still figuring things out.
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                I&apos;ll review your message and come back with initial thoughts,
                suggested next steps, and whether a call makes sense.
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                By getting in touch, you are sharing the details needed for a
                reply. Read the{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                >
                  Privacy Policy
                </Link>{" "}
                for how enquiry information is handled.
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                If you want a quick starting point first, you can run the{" "}
                <Link
                  href="/website-growth-check"
                  className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
                >
                  Website Growth Check
                </Link>{" "}
                and bring the results into the conversation.
              </p>
            </div>
          </div>

        </div>

        <aside className="space-y-8">
          <div className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-6">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
              Availability
            </p>
            <p className="mt-4 text-base leading-8 text-stone-300">
              Currently available for new projects in April 2026.
            </p>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Trusted By
            </p>
            <p className="mt-4 text-base leading-8 text-stone-300">
              Trusted by startups, agencies, and public sector or enterprise
              organisations that need both technical execution and structured
              delivery.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Outbreak Interactive",
                "Virgin Media O2",
                "Department for Work & Pensions",
                "Barclays Bank",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-4 text-sm leading-7 text-stone-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              What to Expect
            </p>
            <ul className="mt-6 space-y-5 text-sm leading-7 text-stone-300">
              {[
                "Open to freelance, contract, and consulting work",
                "Typically respond within 24 hours",
                "Happy to discuss projects at any stage, even if you're still figuring things out",
                "Clear, practical communication with a focus on delivery",
              ].map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-amber-500/40 bg-amber-600/12 text-xs font-semibold text-amber-300">
                    +
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="/services"
                className="inline-flex items-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                View Web Development & Technical Services
              </Link>
            </div>
            <div className="mt-4">
              <Link
                href="/website-growth-check"
                className="text-sm font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
              >
                Try the Website Growth Check
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Who This Is For
          </p>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {[
              "Need a full-stack developer who can own delivery",
              "Have an existing product or website that needs improving",
              "Want technical leadership, not just coding",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Not the Best Fit If
          </p>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {[
              "You are looking for the cheapest option",
              "You need a quick one-off fix with no context",
              "You do not need delivery input or technical ownership",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Contact Options
        </p>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid content-start gap-4 self-start">
            <div
              id="send-email"
              className="scroll-mt-28 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6"
            >
              <h2 className="text-xl font-semibold text-stone-50">
                Send a Project Enquiry
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Share a few details about your project and I&apos;ll review it
                personally, then come back with the most practical next step.
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                This now goes through a proper contact form, so your enquiry and
                any linked audit context are sent straight through without
                relying on the visitor&apos;s email app.
              </p>
              {sent ? (
                <div className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
                  Your enquiry has been sent. I&apos;ll usually come back within
                  24 hours.
                </div>
              ) : null}
              {error === "invalid-input" ? (
                <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
                  Please add your name, a valid email address, and a project
                  summary before sending the form.
                </div>
              ) : null}
              {error === "send-failed" ? (
                <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
                  The enquiry could not be sent right now. Please try again in a
                  moment or use LinkedIn if it keeps happening.
                </div>
              ) : null}
              {hasAuditContext ? (
                <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-7 text-stone-200">
                  <p className="font-semibold text-stone-100">
                    Audit details will be added to your enquiry automatically
                  </p>
                  {auditId ? (
                    <p className="mt-2">
                      Audit ID: <span className="text-stone-100">{auditId}</span>
                    </p>
                  ) : null}
                  {website ? (
                    <p className={auditId ? "" : "mt-2"}>
                      Website: <span className="text-stone-100">{website}</span>
                    </p>
                  ) : null}
                  {business ? (
                    <p>
                      Business: <span className="text-stone-100">{business}</span>
                    </p>
                  ) : null}
                  {location ? (
                    <p>
                      Location: <span className="text-stone-100">{location}</span>
                    </p>
                  ) : null}
                  {conversionScore || performanceScore || visibilityScore ? (
                    <div className="mt-2">
                      {conversionScore ? (
                        <p>
                          Conversion score:{" "}
                          <span className="text-stone-100">
                            {conversionScore}/100
                          </span>
                        </p>
                      ) : null}
                      {performanceScore ? (
                        <p>
                          Performance score:{" "}
                          <span className="text-stone-100">
                            {performanceScore}/100
                          </span>
                        </p>
                      ) : null}
                      {visibilityScore ? (
                        <p>
                          Visibility score:{" "}
                          <span className="text-stone-100">
                            {visibilityScore}/100
                          </span>
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <form action="/api/contact" method="post" className="mt-5 grid gap-4">
                <input type="hidden" name="auditId" value={auditId} />
                <input type="hidden" name="conversionScore" value={conversionScore} />
                <input type="hidden" name="performanceScore" value={performanceScore} />
                <input type="hidden" name="visibilityScore" value={visibilityScore} />
                <label className="hidden">
                  <span>Leave this field empty</span>
                  <input name="faxNumber" type="text" autoComplete="off" tabIndex={-1} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-stone-100">Name</span>
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-stone-100">Email</span>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-stone-100">Phone</span>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-stone-100">Company</span>
                    <input
                      name="company"
                      type="text"
                      defaultValue={business}
                      className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-stone-100">Website</span>
                    <input
                      name="website"
                      type="text"
                      defaultValue={website}
                      className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-stone-100">Location</span>
                    <input
                      name="location"
                      type="text"
                      defaultValue={location}
                      className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400"
                    />
                  </label>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-stone-100">Project summary</span>
                  <textarea
                    name="message"
                    rows={7}
                    required
                    defaultValue={
                      hasAuditContext
                        ? `I would like to discuss my project.\n\nAudit context:\n- Audit ID: ${auditId || "N/A"}\n- Website: ${website || "N/A"}\n- Business: ${business || "N/A"}\n- Location: ${location || "N/A"}\n\nProject summary:\n`
                        : ""
                    }
                    className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
                >
                  Send Enquiry
                </button>
              </form>
            </div>

            <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6">
              <h2 className="text-xl font-semibold text-stone-50">
                Connect on LinkedIn
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                If you&apos;d prefer to connect first, you can reach out on
                LinkedIn.
              </p>
              <ExternalLink
                href="https://www.linkedin.com/in/deanlennard/"
                ariaLabel="Open Dean Lennard LinkedIn profile"
                className="mt-5 inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                LinkedIn Profile
              </ExternalLink>
            </div>
          </div>

          <section
            className="scroll-mt-28 rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-6"
            aria-labelledby="book-a-call-heading"
          >
            <h2
              id="book-a-call-heading"
              className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase"
            >
              Book a Call
            </h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              The fastest way to get started is to book a short project
              consultation.
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Most projects start with a short call to understand your
              requirements and outline next steps.
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              There&apos;s no obligation, just a practical conversation about
              what you need.
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              This is a focused discussion on your project, goals, and next
              steps, not a generic intro call.
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              I&apos;ll also let you know whether a fuller project enquiry or a
              follow-up estimate makes sense after the call.
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              If the embedded booking tool does not load, use the direct booking
              link below.
            </p>
            {hasAuditContext ? (
              <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-7 text-stone-200">
                  <p className="font-semibold text-stone-100">
                    Audit summary for reference during the call
                  </p>
                  {auditId ? (
                    <p className="mt-2">
                      Audit ID: <span className="text-stone-100">{auditId}</span>
                    </p>
                  ) : null}
                  {website ? (
                    <p className={auditId ? "" : "mt-2"}>
                      Website: <span className="text-stone-100">{website}</span>
                    </p>
                  ) : null}
                {business ? (
                  <p>
                    Business: <span className="text-stone-100">{business}</span>
                  </p>
                ) : null}
                {location ? (
                  <p>
                    Location: <span className="text-stone-100">{location}</span>
                  </p>
                ) : null}
                {conversionScore || performanceScore || visibilityScore ? (
                  <div className="mt-2">
                    {conversionScore ? (
                      <p>
                        Conversion score:{" "}
                        <span className="text-stone-100">
                          {conversionScore}/100
                        </span>
                      </p>
                    ) : null}
                    {performanceScore ? (
                      <p>
                        Performance score:{" "}
                        <span className="text-stone-100">
                          {performanceScore}/100
                        </span>
                      </p>
                    ) : null}
                    {visibilityScore ? (
                      <p>
                        Visibility score:{" "}
                        <span className="text-stone-100">
                          {visibilityScore}/100
                        </span>
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <p className="mt-2">
                  The booking link itself will not carry these details, so it is
                  usually best to email if you want the audit context included
                  automatically.
                </p>
              </div>
            ) : null}
            <ExternalLink
              href="https://calendly.com/psyberpixie77/30min"
              ariaLabel="Open Calendly booking page for a 30-minute project consultation"
              data-audit-id={auditId || undefined}
              data-audit-intent="book_call"
              className="mt-5 inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Open Booking Page
            </ExternalLink>
            <div
              id="book-call"
              className="calendly-inline-widget calendly-embed mt-6 w-full max-w-full overflow-hidden"
              data-url="https://calendly.com/psyberpixie77/30min"
              role="region"
              aria-labelledby="book-a-call-heading"
              style={{ height: "700px" }}
            />
          </section>
        </div>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <SectionHeading
          eyebrow="FAQs"
          title="Common questions before getting in touch."
          description="A few quick answers to the questions that often come up before a project starts."
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
      </section>
    </main>
  );
}
