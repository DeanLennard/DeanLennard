import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLoginPageSearchParams = Promise<{
  error?: string | string[];
  registered?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getErrorMessage(error: string) {
  if (error === "invalid") {
    return "The admin login details were not recognised.";
  }

  if (error === "config") {
    return "Admin access is not configured yet. Add the admin session secret first.";
  }

  if (error === "pending") {
    return "Your account is waiting for approval in the database before login is allowed.";
  }

  return "";
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: AdminLoginPageSearchParams;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const resolvedSearchParams = await searchParams;
  const error = getErrorMessage(getSingleValue(resolvedSearchParams.error) ?? "");
  const hasRegistered = getSingleValue(resolvedSearchParams.registered) === "1";

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-20 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Admin
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Audit backend login
        </h1>
        <p className="mt-4 text-base leading-8 text-stone-300">
          Sign in to review stored website audits, follow-up consent, and intent
          signals from the checker.
        </p>

        {error ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            {error}
          </div>
        ) : null}

        {hasRegistered ? (
          <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-7 text-emerald-100">
            Registration submitted. Approve the user in MongoDB, then sign in here.
          </div>
        ) : null}

        <form action="/api/admin/login" method="post" className="mt-8 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="admin-username"
              className="text-sm font-semibold text-stone-100"
            >
              Username
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="text-sm font-semibold text-stone-100"
            >
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-sm leading-7 text-stone-300">
          <p>
            Need access?{" "}
            <Link
              href="/admin/register"
              className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
            >
              Register an admin account
            </Link>
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
          >
            Return to the main site
          </Link>
        </div>
      </section>
    </main>
  );
}
