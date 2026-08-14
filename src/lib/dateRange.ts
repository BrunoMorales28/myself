const MONTH_FORMATTERS: Record<"en" | "es", Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }),
  es: new Intl.DateTimeFormat("es", { month: "short", year: "numeric" }),
};

function formatMonth(value: string, locale: "en" | "es"): string {
  const [year, month] = value.split("-").map(Number);
  return MONTH_FORMATTERS[locale].format(new Date(year!, month! - 1));
}

export function formatDateRange(
  startDate: string,
  endDate: string | null,
  locale: "en" | "es",
  presentLabel: string,
): string {
  const start = formatMonth(startDate, locale);
  const end = endDate ? formatMonth(endDate, locale) : presentLabel;
  return `${start} – ${end}`;
}
