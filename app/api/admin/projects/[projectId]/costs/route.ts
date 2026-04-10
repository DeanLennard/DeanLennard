import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createProjectCost,
  type ProjectCostCategory,
  type ProjectCostRecurringInterval,
} from "@/lib/project-costs-store";
import { recalculateProjectCostsFromTasks } from "@/lib/projects-store";

const validCategories: ProjectCostCategory[] = [
  "hosting",
  "software",
  "contractor",
  "stock_assets",
  "domain",
  "ads",
  "other",
];

const validRecurringIntervals: ProjectCostRecurringInterval[] = [
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
];

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { projectId } = await params;
  const formData = await request.formData();
  const date = String(formData.get("date") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() as ProjectCostCategory;
  const amount = Number(formData.get("amount") ?? "0");
  const recurring = formData.get("recurring") === "on";
  const recurringInterval = String(
    formData.get("recurringInterval") ?? ""
  ).trim() as ProjectCostRecurringInterval;

  if (
    !date ||
    !validCategories.includes(category) ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    (recurring && !validRecurringIntervals.includes(recurringInterval))
  ) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, `/admin/projects/${projectId}?error=invalid-cost`),
      303
    );
  }

  await createProjectCost({
    projectId,
    date,
    category,
    amount,
    description: String(formData.get("description") ?? ""),
    recurring,
    recurringInterval: recurring ? recurringInterval : undefined,
  });
  await recalculateProjectCostsFromTasks(projectId);

  return NextResponse.redirect(
    toAbsoluteRedirect(request, `/admin/projects/${projectId}`),
    303
  );
}
