import Link from "next/link";

const primaryNavItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Audits" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/recurring-billing", label: "Billing" },
  { href: "/admin/reports", label: "Reports" },
];

const utilityNavItems = [
  { href: "/admin/provider-events", label: "Provider Events" },
  { href: "/admin/search", label: "Search" },
  { href: "/admin/package-templates", label: "Package Templates" },
  { href: "/admin/task-templates", label: "Task Templates" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" },
];

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-amber-600 text-stone-950"
          : "border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] text-stone-100 hover:bg-white/8"
      }`}
    >
      {label}
    </Link>
  );
}

export function AdminNav({ currentPath }: { currentPath: string }) {
  const utilitySectionActive = utilityNavItems.some(
    (item) => item.href === currentPath
  );

  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)]/70 p-4">
      <div className="overflow-x-auto">
        <div className="flex min-w-max flex-wrap gap-3">
          {primaryNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={currentPath === item.href}
            />
          ))}
        </div>
      </div>

      <details className="mt-4" open={utilitySectionActive}>
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 marker:text-stone-500">
          More Admin Tools
        </summary>
        <div className="mt-3 overflow-x-auto">
          <div className="flex min-w-max flex-wrap gap-3">
            {utilityNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={currentPath === item.href}
              />
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
