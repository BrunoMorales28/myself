import { useTranslations, useLocale } from "next-intl";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import {
  experience,
  studies,
  skills,
  about,
  getLocalizedText,
  hobbyIcons,
} from "@/content";
import { getInitials } from "@/lib/initials";
import { Hero } from "@/components/landing/Hero";
import { ItemListSection } from "@/components/landing/ItemListSection";
import { FeaturedSectionCard } from "@/components/landing/FeaturedSectionCard";

const EXPERIENCE_LIMIT = 4;

export default function Home() {
  const locale = useLocale() as "en" | "es";
  const t = useTranslations("landing");

  const experienceItems = experience
    .filter((entry) => entry.section === "professional")
    .slice(0, EXPERIENCE_LIMIT)
    .map((entry) => ({
      id: entry.id,
      title: entry.company,
      href: `/experience?highlight=${entry.id}`,
      avatar: (
        <Avatar
          src={entry.logoUrl}
          alt={t("experienceLogoAlt", { company: entry.company })}
        >
          {getInitials(entry.company)}
        </Avatar>
      ),
    }));

  const studiesItems = studies.map((entry) => ({
    id: entry.id,
    title: entry.institution,
    href: `/studies?highlight=${entry.id}`,
    avatar: (
      <Avatar
        src={entry.logoUrl}
        alt={t("studiesLogoAlt", { institution: entry.institution })}
      >
        {getInitials(entry.institution)}
      </Avatar>
    ),
  }));

  const hobbyItems = about.hobbies.map((hobby) => {
    const HobbyIcon = hobbyIcons[hobby.icon];
    return {
      id: hobby.id,
      title: getLocalizedText(hobby.label, locale),
      href: `/about?highlight=${hobby.id}`,
      avatar: (
        <Avatar>
          <HobbyIcon fontSize="small" />
        </Avatar>
      ),
    };
  });

  const [firstSkillCategory, secondSkillCategory] = skills;

  return (
    <Box>
      <Hero
        title={t("heroTitle")}
        intro={t("heroIntro")}
        downloadCvLabel={t("downloadCv")}
        downloadCvHref={`/${locale}/cv.pdf`}
        contactLabel={t("contact")}
        contactHref="/contact"
      />

      <ItemListSection
        title={t("experienceTitle")}
        items={experienceItems}
        viewAllHref="/experience"
        viewAllLabel={t("experienceViewAll")}
      />

      <ItemListSection title={t("studiesTitle")} items={studiesItems} />

      <ItemListSection title={t("hobbiesTitle")} items={hobbyItems} />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, py: 2 }}>
        {firstSkillCategory && secondSkillCategory && (
          <FeaturedSectionCard
            title={t("skillsTitle")}
            description={t("skillsTeaser", {
              first: getLocalizedText(firstSkillCategory.category, locale),
              second: getLocalizedText(secondSkillCategory.category, locale),
            })}
            href="/experience#skills"
          />
        )}
        <FeaturedSectionCard
          title={t("contactTeaserTitle")}
          description={t("contactTeaser")}
          href="/contact"
        />
      </Box>
    </Box>
  );
}
