import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Register",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminRegisterPageSearchParams = Promise<{
  error?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getErrorMessage(error: string) {
  if (error === "missing") {
    return "Username and password are required.";
  }

  if (error === "mismatch") {
    return "The passwords did not match.";
  }

  if (error === "exists") {
    return "That username is already registered.";
  }

  if (error === "failed") {
    return "Registration could not be completed right now.";
  }

  return "";
}

export default async function AdminRegisterPage({
  searchParams,
}: {
  searchParams: AdminRegisterPageSearchParams;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const resolvedSearchParams = await searchParams;
  const error = getErrorMessage(getSingleValue(resolvedSearchParams.error) ?? "");

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-20 lg:px-8">
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Admin
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Register for backend access
        </h1>
        <p className="mt-4 text-base leading-8 text-stone-300">
          Create an admin account request. It will stay pending until you approve
          it directly in MongoDB.
        </p>

        {error ? (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
            {error}
          </div>
        ) : null}

        <form
          action="/api/admin/register"
          method="post"
          className="mt-8 space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="admin-register-username"
              className="text-sm font-semibold text-stone-100"
            >
              Username
            </label>
            <input
              id="admin-register-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-register-password"
              className="text-sm font-semibold text-stone-100"
            >
              Password
            </label>
            <input
              id="admin-register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-register-confirm-password"
              className="text-sm font-semibold text-stone-100"
            >
              Confirm password
            </label>
            <input
              id="admin-register-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Register
          </button>
        </form>

        <div className="mt-8 text-sm leading-7 text-stone-300">
          <p>
            Already approved?{" "}
            <Link
              href="/admin/login"
              className="font-semibold text-stone-100 underline decoration-amber-500/60 underline-offset-4"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
