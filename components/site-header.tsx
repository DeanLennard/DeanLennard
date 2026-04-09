"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </>
      )}
    </svg>
  );
}

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]/94 backdrop-blur">
      <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-panel)]/80">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2 lg:px-8">
          <p className="text-xs text-stone-300">
            Available for freelance projects and technical delivery support
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-300">
            <a
              href="tel:07429545298"
              className="inline-flex items-center gap-2 transition hover:text-stone-50"
            >
              <PhoneIcon />
              <span>07429545298</span>
            </a>
            <a
              href="mailto:dean@deanlennard.com"
              className="inline-flex items-center gap-2 transition hover:text-stone-50"
            >
              <MailIcon />
              <span>dean@deanlennard.com</span>
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link
          href="/"
          aria-label="Dean Lennard home"
          className="flex items-center gap-3"
          onClick={closeMobileMenu}
        >
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

        <div className="order-2 flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-primary-navigation"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen((previous) => !previous)}
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-2 text-stone-100 transition hover:bg-white/8"
          >
            <MenuIcon open={isMobileMenuOpen} />
          </button>
          <Link
            href="/contact#book-call"
            className="inline-flex items-center rounded-md border border-amber-500/50 bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
            onClick={closeMobileMenu}
          >
            Book a Call
          </Link>
        </div>

        <nav
          id="mobile-primary-navigation"
          aria-label="Primary"
          className={`${isMobileMenuOpen ? "order-4 flex" : "hidden"} w-full flex-col gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-3 md:order-2 md:flex md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0`}
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className="rounded-md px-4 py-2 text-sm font-medium text-stone-300 transition hover:bg-white/6 hover:text-stone-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact#book-call"
          className="order-3 hidden items-center rounded-md border border-amber-500/50 bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-500 md:inline-flex"
        >
          Book a Call
        </Link>
      </div>
    </header>
  );
}
