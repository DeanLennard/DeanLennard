function getOrdinalSuffix(day: number) {
  const teen = day % 100;

  if (teen >= 11 && teen <= 13) {
    return "th";
  }

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatDateParts(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

export function formatDisplayDate(value: string | Date | null | undefined) {
  if (!value) {
    return "";
  }

  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T12:00:00`)
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "";
  }

  return formatDateParts(date);
}

export function formatDisplayDateTime(value: string | Date | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "";
  }

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formatDateParts(date)}, ${time}`;
}
