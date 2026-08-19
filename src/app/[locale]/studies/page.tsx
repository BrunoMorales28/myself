import { getTranslations, getLocale } from "next-intl/server";
import Typography from "@mui/material/Typography";
import { studies, getLocalizedText } from "@/content";
import { formatDateRange } from "@/lib/dateRange";
import { StudiesList } from "@/components/studies/StudiesList";
import { Section } from "@/components/layout/Section";

type StudiesPageProps = {
  searchParams: Promise<{ highlight?: string }>;
};

export default async function StudiesPage({ searchParams }: StudiesPageProps) {
  const locale = (await getLocale()) as "en" | "es";
  const t = await getTranslations("studies");
  const { highlight } = await searchParams;

  const entries = [...studies]
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .map((entry) => ({
      id: entry.id,
      institution: entry.institution,
      logoUrl: entry.logoUrl,
      logoAlt: t("logoAlt", { institution: entry.institution }),
      degree: getLocalizedText(entry.degree, locale),
      dateRange: formatDateRange(
        entry.startDate,
        entry.endDate,
        locale,
        t("present"),
      ),
      description: getLocalizedText(entry.description, locale),
    }));

  return (
    <>
      <Section tint="default">
        <Typography variant="h1">{t("heading")}</Typography>
      </Section>
      <Section tint="light">
        <StudiesList entries={entries} highlight={highlight} />
      </Section>
    </>
  );
}
