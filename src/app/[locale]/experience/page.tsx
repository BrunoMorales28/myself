import { getTranslations, getLocale } from "next-intl/server";
import Typography from "@mui/material/Typography";
import { experience, getLocalizedText } from "@/content";
import { formatDateRange } from "@/lib/dateRange";
import {
  ExperienceList,
  type ExperienceListEntry,
} from "@/components/experience/ExperienceList";

type ExperiencePageProps = {
  searchParams: Promise<{ highlight?: string }>;
};

export default async function ExperiencePage({
  searchParams,
}: ExperiencePageProps) {
  const locale = (await getLocale()) as "en" | "es";
  const t = await getTranslations("experience");
  const { highlight } = await searchParams;

  const toListEntry = (
    entry: (typeof experience)[number],
  ): ExperienceListEntry => ({
    id: entry.id,
    company: entry.company,
    logoUrl: entry.logoUrl,
    logoAlt: t("logoAlt", { company: entry.company }),
    role: getLocalizedText(entry.role, locale),
    dateRange: formatDateRange(
      entry.startDate,
      entry.endDate,
      locale,
      t("present"),
    ),
    description: getLocalizedText(entry.description, locale),
    bullets: entry.bullets.map((bullet) => getLocalizedText(bullet, locale)),
    tags: entry.tags,
  });

  const sortByDateDesc = (
    a: (typeof experience)[number],
    b: (typeof experience)[number],
  ) => b.startDate.localeCompare(a.startDate);

  const professionalEntries = experience
    .filter((entry) => entry.section === "professional")
    .sort(sortByDateDesc)
    .map(toListEntry);

  const earlyEntries = experience
    .filter((entry) => entry.section === "early")
    .sort(sortByDateDesc)
    .map(toListEntry);

  return (
    <>
      <Typography variant="h1" sx={{ mb: 3 }}>
        {t("heading")}
      </Typography>
      <ExperienceList
        professionalEntries={professionalEntries}
        earlyEntries={earlyEntries}
        professionalHeading={t("professionalHeading")}
        earlyHeading={t("earlyHeading")}
        tagsGroupLabel={t("tagsGroupLabel")}
        highlight={highlight}
      />
    </>
  );
}
