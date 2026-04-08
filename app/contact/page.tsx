import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { ExternalLink } from "@/components/external-link";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Contact | Freelance Full-Stack Developer UK",
  description:
    "Get in touch with a UK-based freelance full-stack developer specialising in web applications, technical SEO, and end-to-end project delivery.",
  openGraph: {
    title: "Contact | Full-Stack Developer UK",
    description:
      "Discuss your project and get support with development, SEO, and technical delivery.",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Contact"
            title="Let&apos;s Discuss Your Project"
            description="If you&apos;re looking for a freelance full-stack developer in the UK who can build, manage, and deliver your project end-to-end, let&apos;s discuss your project and next steps."
          />
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
            <div className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
                Start a Conversation
              </p>
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
            </div>
          </div>

        </div>

        <aside className="space-y-8">
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
          </div>
        </aside>
      </section>

      <section className="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Contact Options
        </p>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid content-start gap-4 self-start">
            <div className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] p-6">
              <h2 className="text-xl font-semibold text-stone-50">
                Send an Email
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Prefer email? Send over a brief outline of your project and
                I&apos;ll respond within 24 hours.
              </p>
              <a
                href="mailto:dean@deanlennard.com"
                className="mt-5 inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
              >
                dean@deanlennard.com
              </a>
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
            className="rounded-md border border-amber-500/30 bg-[color:var(--color-accent-soft)] p-6"
            aria-labelledby="book-a-call-heading"
          >
            <h2
              id="book-a-call-heading"
              className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase"
            >
              Book a Call
            </h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              The fastest way to get started is to book a 30-minute project
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
              If the embedded booking tool does not load, use the direct booking
              link below.
            </p>
            <ExternalLink
              href="https://calendly.com/psyberpixie77/30min"
              ariaLabel="Open Calendly booking page for a 30-minute project consultation"
              className="mt-5 inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            >
              Open Booking Page
            </ExternalLink>
            <div
              className="calendly-inline-widget mt-6 min-w-[320px]"
              data-url="https://calendly.com/psyberpixie77/30min"
              role="region"
              aria-labelledby="book-a-call-heading"
              style={{ height: "700px" }}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
