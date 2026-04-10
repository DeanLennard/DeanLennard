import Link from "next/link";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/website-growth-check", label: "Website Growth Check" },
];

const keyServiceLinks = [
  { href: "/nextjs-developer-uk", label: "Next.js Developer UK" },
  {
    href: "/web-application-development-uk",
    label: "Web Application Development UK",
  },
  {
    href: "/technical-seo-services-uk",
    label: "Technical SEO Services UK",
  },
  {
    href: "/technical-delivery-consultant",
    label: "Technical Delivery Consultant",
  },
] as const;

const localServiceLinks = [
  {
    href: "/web-developer-staffordshire",
    label: "Web Developer Staffordshire",
  },
  {
    href: "/web-designer-stafford",
    label: "Web Designer Stafford",
  },
  {
    href: "/web-designer-stoke-on-trent",
    label: "Web Designer Stoke-on-Trent",
  },
  {
    href: "/web-designer-cannock",
    label: "Web Designer Cannock",
  },
] as const;

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 flex-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.79.63 2.65a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6.27 6.27l1.25-1.29a2 2 0 0 1 2.11-.45c.86.3 1.75.51 2.65.63A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 flex-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.2fr_1.8fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
            Dean Lennard
          </p>
          <h2 className="max-w-2xl text-2xl font-semibold text-stone-50">
            Full-Stack Developer & Technical Delivery Specialist
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-stone-300">
            Architecture, application development, deployment, and delivery
            leadership in one reliable partner.
          </p>
          <div className="space-y-3 pt-2 text-sm text-stone-300">
            <a
              href="tel:07429545298"
              className="inline-flex items-center gap-2 transition hover:text-stone-50"
            >
              <PhoneIcon />
              <span>07429545298</span>
            </a>
            <a
              href="mailto:dean@deanlennard.com"
              className="flex items-center gap-2 break-all transition hover:text-stone-50"
            >
              <MailIcon />
              <span>dean@deanlennard.com</span>
            </a>
          </div>
          <p className="text-xs text-stone-400">
            &copy; 2026 Outbreak LTD. All rights reserved.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-3">
            <p className="text-sm font-semibold text-stone-100">Core Pages</p>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone-300 transition hover:text-stone-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-3">
            <p className="text-sm font-semibold text-stone-100">Key Services</p>
            {keyServiceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone-300 transition hover:text-stone-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-3">
            <p className="text-sm font-semibold text-stone-100">
              Local Services
            </p>
            {localServiceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone-300 transition hover:text-stone-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
