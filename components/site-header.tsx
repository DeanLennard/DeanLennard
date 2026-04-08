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
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-md border border-amber-600/40 bg-amber-600/10">
            <Image
              src="/profile-image.png"
              alt="Profile portrait"
              fill
              className="object-cover"
            />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-stone-100 uppercase">
              Dean Lennard
            </p>
            <p className="text-sm text-stone-400">
              Full-Stack Developer & Technical Delivery Specialist
            </p>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
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
          href="/contact"
          className="inline-flex items-center rounded-md border border-amber-500/50 bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
        >
          Start a Project
        </Link>
      </div>
    </header>
  );
}
