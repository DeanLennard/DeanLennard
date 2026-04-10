import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthenticatedPortalUser } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Client Portal Login",
  robots: {
    index: false,
    follow: false,
  },
};

type PortalLoginPageSearchParams = Promise<{
  error?: string | string[];
  sent?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams: PortalLoginPageSearchParams;
}) {
  if (await getAuthenticatedPortalUser()) {
    redirect("/portal");
  }

  const resolvedSearchParams = await searchParams;
  const error = getSingleValue(resolvedSearchParams.error) ?? "";
  const sent = getSingleValue(resolvedSearchParams.sent) === "1";

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-20 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Client portal
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Sign in to view your project documents
        </h1>
        <p className="mt-4 text-base leading-8 text-stone-300">
          Enter your email and I will send you a secure magic link to access your portal.
        </p>

        {sent ? (
          <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
            If that email has portal access, a sign-in link is on its way.
          </div>
        ) : null}

        {error === "email" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            I could not send the sign-in email right now. Please try again shortly or contact me directly.
          </div>
        ) : null}

        {error && error !== "email" ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            That sign-in link is invalid or has expired. Request a fresh one below.
          </div>
        ) : null}

        <form action="/api/portal/login" method="post" className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="portal-login-email" className="text-sm font-semibold text-stone-100">
              Email
            </label>
            <input
              id="portal-login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Email Me a Sign-In Link
          </button>
        </form>

        <div className="mt-8 text-sm leading-7 text-stone-300">
          <p>
            Need access?{" "}
            <Link
              href="/contact"
              className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
            >
              Contact me
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
