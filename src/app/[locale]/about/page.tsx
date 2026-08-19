import { getTranslations, getLocale } from "next-intl/server";
import Typography from "@mui/material/Typography";
import { about, hobbyIcons, getLocalizedText } from "@/content";
import { HobbiesList } from "@/components/about/HobbiesList";
import { Section } from "@/components/layout/Section";

type AboutPageProps = {
  searchParams: Promise<{ highlight?: string }>;
};

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const locale = (await getLocale()) as "en" | "es";
  const t = await getTranslations("about");
  const { highlight } = await searchParams;

  const entries = about.hobbies.map((hobby) => ({
    id: hobby.id,
    label: getLocalizedText(hobby.label, locale),
    description: getLocalizedText(hobby.description, locale),
    icon: hobbyIcons[hobby.icon],
  }));

  return (
    <>
      <Section tint="default">
        <Typography variant="h1" sx={{ mb: 3 }}>
          {t("heading")}
        </Typography>
        <Typography variant="body1">
          {getLocalizedText(about.bio, locale)}
        </Typography>
      </Section>
      <Section tint="light">
        <Typography variant="h2" sx={{ mb: 2 }}>
          {t("hobbiesHeading")}
        </Typography>
        <HobbiesList entries={entries} highlight={highlight} />
      </Section>
    </>
  );
}
