import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-6 py-24 lg:px-8">
      <section className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-50">
          Page not found
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-stone-300">
          The page you&apos;re looking for does not exist or may have moved.
          You can head back to the homepage, review services, or get in touch.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
          >
            Go to Homepage
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/8"
          >
            View Services
          </Link>
        </div>
      </section>
    </main>
  );
}
