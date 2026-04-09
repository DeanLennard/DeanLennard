import Link from "next/link";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
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
          <p className="text-xs text-stone-400">&copy; Dean Lennard 2026</p>
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
