import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]/94 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link href="/" aria-label="Dean Lennard home" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-md border border-amber-600/40 bg-amber-600/10">
            <Image
              src="/profile-image.png"
              alt="Dean Lennard profile portrait"
              fill
              className="object-cover"
            />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-stone-100 uppercase">
              Dean Lennard
            </p>
            <p className="text-sm text-stone-300">
              Full-Stack Developer & Technical Delivery Specialist
            </p>
          </div>
        </Link>

        <nav
          aria-label="Primary"
          className="order-3 flex w-full flex-wrap items-center gap-1 md:order-2 md:w-auto"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-4 py-2 text-sm font-medium text-stone-300 transition hover:bg-white/6 hover:text-stone-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact#book-call"
          className="order-2 inline-flex items-center rounded-md border border-amber-500/50 bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-500 md:order-3"
        >
          Book a Call
        </Link>
      </div>
    </header>
  );
}
