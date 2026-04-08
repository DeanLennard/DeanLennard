import Link from "next/link";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const specialistLinks = [
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
  { href: "/unity-developer-uk", label: "Unity Developer UK" },
  {
    href: "/startup-full-stack-developer",
    label: "Full-Stack Developer for Startups",
  },
  {
    href: "/improve-existing-website",
    label: "Improve Existing Website",
  },
  {
    href: "/freelance-developer-for-agencies",
    label: "Freelance Developer for Agencies",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.4fr_1fr] lg:px-8">
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
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
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
            <p className="text-sm font-semibold text-stone-100">
              Specialist Pages
            </p>
            {specialistLinks.map((link) => (
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
