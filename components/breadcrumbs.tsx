import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-stone-400">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span className="text-stone-600">/</span> : null}
            {item.href ? (
              <Link
                href={item.href}
                className="transition hover:text-stone-100"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-stone-200">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
