import type { Metadata } from "next";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminRole } from "@/lib/admin-auth";
import { listAdminUsers } from "@/lib/admin-users";

export const metadata: Metadata = {
  title: "User Access",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminUsersPage() {
  await requireAdminRole(["admin"]);
  const users = await listAdminUsers();

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      <section className="mb-8">
        <AdminNav currentPath="/admin/users" />
      </section>
      <section className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 lg:p-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
          Users
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
          Internal access and roles
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          Approve internal users and assign roles for admin, contractor, accountant,
          or read-only access.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        {users.map((user) => (
          <article
            key={user.normalizedUsername}
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6"
          >
            <form
              action={`/api/admin/users/${user.normalizedUsername}`}
              method="post"
              className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-stone-100">{user.username}</p>
                <p className="mt-1 text-sm leading-7 text-stone-400">
                  {user.approved ? "Approved" : "Pending"} | Role {user.role}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-stone-100">Role</span>
                  <select
                    name="role"
                    defaultValue={user.role}
                    className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-100"
                  >
                    <option value="admin">Admin</option>
                    <option value="contractor">Contractor</option>
                    <option value="accountant">Accountant</option>
                    <option value="readonly">Read-only</option>
                  </select>
                </label>
                <label className="inline-flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 text-sm text-stone-200">
                  <input
                    type="checkbox"
                    name="approved"
                    defaultChecked={user.approved}
                    className="h-4 w-4"
                  />
                  Approved
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-500"
                >
                  Save Access
                </button>
              </div>
            </form>
          </article>
        ))}
      </section>
    </main>
  );
}
