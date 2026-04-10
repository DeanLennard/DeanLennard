type PresetRange = "7d" | "30d" | "month" | "all" | "custom";

export type AdminDateRange = {
  preset: PresetRange;
  startDate?: string;
  endDate?: string;
};

function isValidDateOnly(value: string | undefined) {
  if (!value) {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function startOfCurrentMonth() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
}

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function resolveAdminDateRange(input: {
  range?: string;
  start?: string;
  end?: string;
}): AdminDateRange {
  const range = input.range?.trim();
  const start = input.start?.trim();
  const end = input.end?.trim();

  if (range === "custom" && isValidDateOnly(start) && isValidDateOnly(end)) {
    return {
      preset: "custom",
      startDate: start,
      endDate: end,
    };
  }

  if (range === "7d" || range === "30d" || range === "month" || range === "all") {
    return {
      preset: range,
    };
  }

  return {
    preset: "30d",
  };
}

export function getRangeLabel(range: AdminDateRange) {
  switch (range.preset) {
    case "7d":
      return "last 7 days";
    case "month":
      return "current month";
    case "all":
      return "all time";
    case "custom":
      return range.startDate && range.endDate
        ? `${range.startDate} to ${range.endDate}`
        : "custom range";
    default:
      return "last 30 days";
  }
}

export function buildRangeHref(
  pathname: string,
  range: AdminDateRange | { preset: PresetRange; startDate?: string; endDate?: string }
) {
  const params = new URLSearchParams();

  if (range.preset !== "30d") {
    params.set("range", range.preset);
  }

  if (range.preset === "custom" && range.startDate && range.endDate) {
    params.set("start", range.startDate);
    params.set("end", range.endDate);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function getRangeBounds(range: AdminDateRange) {
  const now = new Date();

  switch (range.preset) {
    case "7d": {
      const start = new Date(now);
      start.setUTCDate(start.getUTCDate() - 6);
      return {
        startDate: formatDateOnly(start),
        endDate: formatDateOnly(now),
      };
    }
    case "30d": {
      const start = new Date(now);
      start.setUTCDate(start.getUTCDate() - 29);
      return {
        startDate: formatDateOnly(start),
        endDate: formatDateOnly(now),
      };
    }
    case "month":
      return {
        startDate: startOfCurrentMonth(),
        endDate: formatDateOnly(now),
      };
    case "custom":
      return range.startDate && range.endDate
        ? {
            startDate: range.startDate,
            endDate: range.endDate,
          }
        : undefined;
    default:
      return undefined;
  }
}

export function isDateWithinRange(dateString: string, range: AdminDateRange) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const bounds = getRangeBounds(range);

  if (!bounds) {
    return true;
  }

  const start = new Date(`${bounds.startDate}T00:00:00Z`).getTime();
  const end = new Date(`${bounds.endDate}T23:59:59Z`).getTime();

  return date.getTime() >= start && date.getTime() <= end;
}
