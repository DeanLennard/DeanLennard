import Link from "next/link";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Audits" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/recurring-billing", label: "Recurring Billing" },
  { href: "/admin/package-templates", label: "Package Templates" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({ currentPath }: { currentPath: string }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {navItems.map((item) => {
        const active = currentPath === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-amber-600 text-stone-950"
                : "border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] text-stone-100 hover:bg-white/8"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
