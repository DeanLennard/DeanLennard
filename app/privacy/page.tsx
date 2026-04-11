import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SchemaScript } from "@/components/schema-script";
import { SectionHeading } from "@/components/section-heading";
import { buildBreadcrumbSchema } from "@/lib/geo-schema";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | Outbreak LTD",
  description:
    "Privacy Policy for Outbreak LTD covering contact enquiries, analytics, scheduling tools, and how website visitor data is handled.",
  path: "/privacy",
  openGraph: {
    title: "Privacy Policy | Outbreak LTD",
    description:
      "Privacy information for Outbreak LTD, including how enquiry details, analytics data, and scheduling information are handled.",
  },
});

const informationCollected = [
  "Information you provide directly, such as your name, email address, company details, and project information.",
  "Basic technical and usage information collected through analytics tools, including page visits, clicks, and similar interaction data.",
  "Scheduling information you provide when booking a call through Calendly.",
];

const informationUse = [
  "Responding to enquiries and discussing potential projects.",
  "Providing technical services, estimates, or follow-up support.",
  "Improving website performance, usability, and marketing effectiveness.",
  "Understanding how visitors use the site through analytics.",
];

const thirdParties = [
  "Google Analytics, for website analytics and event tracking.",
  "PostHog, for website and product analytics.",
  "Calendly, for scheduling calls.",
  "Email services used to receive and respond to enquiries.",
];

export default function PrivacyPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
  ];

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-20 lg:px-8">
      <SchemaScript
        id="privacy-page-schema"
        value={buildBreadcrumbSchema(breadcrumbItems)}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <SectionHeading
        eyebrow="Privacy"
        title="Privacy Policy"
        description="This page explains what information may be collected through this website, how it is used, and how to get in touch about privacy-related questions."
      />

      <section className="mt-10 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
        <p className="text-sm leading-7 text-stone-300">
          This website is operated by Outbreak LTD. Registered in England and
          Wales. Company No. 10977129.
        </p>
        <p className="mt-4 text-sm leading-7 text-stone-300">
          Registered office: 241 Tixall Road, Stafford, ST16 3XS
        </p>
        <p className="mt-4 text-sm leading-7 text-stone-300">
          For privacy-related questions, contact{" "}
          <a
            href="mailto:dean@deanlennard.com"
            className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
          >
            dean@deanlennard.com
          </a>
          .
        </p>
      </section>

      <div className="mt-8 space-y-8">
        <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
          <h2 className="text-2xl font-semibold text-stone-50">
            Information collected
          </h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {informationCollected.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
          <h2 className="text-2xl font-semibold text-stone-50">
            How information is used
          </h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {informationUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
          <h2 className="text-2xl font-semibold text-stone-50">
            Analytics and third-party services
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            This site uses third-party services to help understand usage,
            improve performance, and manage enquiries or scheduling.
          </p>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            {thirdParties.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-7 text-stone-300">
            These providers may process data according to their own privacy
            policies and terms.
          </p>
        </section>

        <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
          <h2 className="text-2xl font-semibold text-stone-50">
            Data retention and your rights
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Personal data is only kept for as long as reasonably necessary for
            responding to enquiries, providing services, meeting legal
            obligations, or maintaining business records.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Depending on your circumstances and applicable law, you may have
            rights relating to access, correction, deletion, restriction, or
            objection to the processing of your personal data.
          </p>
        </section>

        <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
          <h2 className="text-2xl font-semibold text-stone-50">
            Contact
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            If you have questions about this Privacy Policy or how your
            information is handled, please get in touch via{" "}
            <a
              href="mailto:dean@deanlennard.com"
              className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
            >
              dean@deanlennard.com
            </a>
            .
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            You can also use the{" "}
            <Link
              href="/contact"
              className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
            >
              contact page
            </Link>{" "}
            for general enquiries.
          </p>
        </section>
      </div>
    </main>
  );
}
