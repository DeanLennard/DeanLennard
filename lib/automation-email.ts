import { createActivityLog, hasActivityLogRecord } from "@/lib/activity-log";
import { getClientById } from "@/lib/clients-store";
import { formatDisplayDate } from "@/lib/date-format";
import { createEmailLog } from "@/lib/email-logs-store";
import {
  buildCarePlanRenewalEmailTemplate,
  buildMonthlyProjectSummaryEmailTemplate,
} from "@/lib/email-templates";
import { listInvoicesByProjectId } from "@/lib/invoices-store";
import { formatMoney } from "@/lib/money-format";
import { listProjects } from "@/lib/projects-store";
import { listRecurringInvoiceSchedules } from "@/lib/recurring-billing-store";
import { sendResendEmail } from "@/lib/resend-email";
import { listTasksByProjectId } from "@/lib/tasks-store";

function getMonthStart(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
    .toISOString();
}

function getDateOnly(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getDateOnlyDaysAgo(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

export async function sendMonthlyProjectSummaryEmails() {
  const projects = await listProjects();
  const since = getMonthStart();
  let sentCount = 0;

  for (const project of projects) {
    if (!["active", "review", "on_hold"].includes(project.status)) {
      continue;
    }

    const [client, tasks, invoices, alreadySent] = await Promise.all([
      getClientById(project.customerId),
      listTasksByProjectId(project.projectId),
      listInvoicesByProjectId(project.projectId),
      hasActivityLogRecord({
        entityType: "project",
        entityId: project.projectId,
        actionType: "monthly_project_summary_sent",
        since,
      }),
    ]);

    if (alreadySent || !client?.email) {
      continue;
    }

    const openTasks = tasks.filter((task) => task.status !== "done").length;
    const completedTasks = tasks.filter((task) => task.status === "done").length;
    const loggedHours = tasks.reduce((sum, task) => sum + (task.actualMinutes ?? 0), 0) / 60;
    const outstandingBalance = invoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0);
    const subject = `Monthly project summary for ${project.name}`;
    const html = buildMonthlyProjectSummaryEmailTemplate({
      recipientName: client.contactName || client.businessName,
      projectName: project.name,
      projectStatus: project.status.replaceAll("_", " "),
      openTasks: String(openTasks),
      completedTasks: String(completedTasks),
      loggedHours: loggedHours.toFixed(1),
      revenue: formatMoney(project.actualRevenue, client.defaultCurrency),
      outstandingBalance: formatMoney(outstandingBalance, client.defaultCurrency),
    });

    try {
      const result = await sendResendEmail({
        to: client.email,
        subject,
        html,
      });

      await createEmailLog({
        entityType: "project",
        entityId: project.projectId,
        recipient: client.email,
        subject,
        templateUsed: "monthly_project_summary",
        deliveryStatus: "sent",
        provider: "resend",
        providerMessageId: result.id,
      });

      await createActivityLog({
        entityType: "project",
        entityId: project.projectId,
        actionType: "monthly_project_summary_sent",
        description: `Monthly summary sent for ${project.name}.`,
        metadata: {
          customerId: client.clientId,
        },
      });

      sentCount += 1;
    } catch (error) {
      await createEmailLog({
        entityType: "project",
        entityId: project.projectId,
        recipient: client.email,
        subject,
        templateUsed: "monthly_project_summary",
        deliveryStatus: "failed",
        provider: "resend",
        failureReason: error instanceof Error ? error.message : "Monthly summary send failed.",
      });
    }
  }

  return sentCount;
}

export async function sendCarePlanRenewalNotices() {
  const today = getDateOnly();
  const renewalCutoff = addDays(today, 30);
  const schedules = await listRecurringInvoiceSchedules({ status: "active" });
  let sentCount = 0;

  for (const schedule of schedules) {
    if (schedule.frequency !== "yearly") {
      continue;
    }

    if (schedule.nextInvoiceDate < today || schedule.nextInvoiceDate > renewalCutoff) {
      continue;
    }

    const [client, alreadySent] = await Promise.all([
      getClientById(schedule.customerId),
      hasActivityLogRecord({
        entityType: "recurring_schedule",
        entityId: schedule.scheduleId,
        actionType: "care_plan_renewal_notice_sent",
        since: getDateOnlyDaysAgo(45),
      }),
    ]);

    if (!client?.email || alreadySent) {
      continue;
    }

    const subject = `${schedule.title} renewal notice`;
    const html = buildCarePlanRenewalEmailTemplate({
      recipientName: client.contactName || client.businessName,
      scheduleTitle: schedule.title,
      renewalDate: formatDisplayDate(schedule.nextInvoiceDate),
      amount: formatMoney(schedule.amount, schedule.currency),
      tierLabel: schedule.carePlanTier.replaceAll("_", " "),
    });

    try {
      const result = await sendResendEmail({
        to: client.email,
        subject,
        html,
      });

      await createEmailLog({
        entityType: "recurring_schedule",
        entityId: schedule.scheduleId,
        recipient: client.email,
        subject,
        templateUsed: "care_plan_renewal_notice",
        deliveryStatus: "sent",
        provider: "resend",
        providerMessageId: result.id,
      });

      await createActivityLog({
        entityType: "recurring_schedule",
        entityId: schedule.scheduleId,
        actionType: "care_plan_renewal_notice_sent",
        description: `Renewal notice sent for ${schedule.title}.`,
        metadata: {
          customerId: schedule.customerId,
          nextInvoiceDate: schedule.nextInvoiceDate,
        },
      });

      sentCount += 1;
    } catch (error) {
      await createEmailLog({
        entityType: "recurring_schedule",
        entityId: schedule.scheduleId,
        recipient: client.email,
        subject,
        templateUsed: "care_plan_renewal_notice",
        deliveryStatus: "failed",
        provider: "resend",
        failureReason: error instanceof Error ? error.message : "Renewal notice send failed.",
      });
    }
  }

  return sentCount;
}
