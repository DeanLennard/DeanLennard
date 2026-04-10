import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createPackageTemplate,
  getPackageTemplateById,
} from "@/lib/package-templates-store";

function toAbsoluteRedirect(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(toAbsoluteRedirect(request, "/admin/login"), 303);
  }

  const { templateId } = await params;
  const template = await getPackageTemplateById(templateId);

  if (!template) {
    return NextResponse.redirect(
      toAbsoluteRedirect(request, "/admin/package-templates?error=missing-template"),
      303
    );
  }

  await createPackageTemplate({
    name: `${template.name} Copy`,
    description: template.description,
    packageType: template.packageType,
    billingType: template.billingType,
    defaultPrice: template.defaultPrice,
    currency: template.currency,
    defaultNotes: template.defaultNotes,
    lineItems: template.lineItems.map((item) => ({
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    projectTasks: template.projectTasks.map((task) => ({
      title: task.title,
      description: task.description,
      priority: task.priority,
      estimatedMinutes: task.estimatedMinutes,
    })),
    repeatingTasks: template.repeatingTasks.map((task) => ({
      title: task.title,
      description: task.description,
      priority: task.priority,
      estimatedMinutes: task.estimatedMinutes,
      frequencyType: task.frequencyType,
      frequencyInterval: task.frequencyInterval,
    })),
  });

  return NextResponse.redirect(
    toAbsoluteRedirect(request, "/admin/package-templates?duplicated=1"),
    303
  );
}
