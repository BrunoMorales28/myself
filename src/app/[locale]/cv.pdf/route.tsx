import { renderToBuffer } from "@react-pdf/renderer";
import { getTranslations } from "next-intl/server";
import {
  experience,
  studies,
  skills,
  contact,
  getLocalizedText,
} from "@/content";
import { formatDateRange } from "@/lib/dateRange";
import { CvDocument } from "@/lib/pdf/CvDocument";

type RouteParams = { params: Promise<{ locale: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { locale } = (await params) as { locale: "en" | "es" };
  const landingT = await getTranslations({ locale, namespace: "landing" });
  const experienceT = await getTranslations({
    locale,
    namespace: "experience",
  });
  const studiesT = await getTranslations({ locale, namespace: "studies" });
  const skillsT = await getTranslations({ locale, namespace: "skills" });

  const experienceEntries = experience
    .filter((entry) => entry.section === "professional")
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .map((entry) => ({
      company: entry.company,
      role: getLocalizedText(entry.role, locale),
      dateRange: formatDateRange(
        entry.startDate,
        entry.endDate,
        locale,
        experienceT("present"),
      ),
      description: getLocalizedText(entry.description, locale),
      bullets: entry.bullets.map((bullet) => getLocalizedText(bullet, locale)),
    }));

  const studiesEntries = [...studies]
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .map((entry) => ({
      institution: entry.institution,
      degree: getLocalizedText(entry.degree, locale),
      dateRange: formatDateRange(
        entry.startDate,
        entry.endDate,
        locale,
        studiesT("present"),
      ),
      description: getLocalizedText(entry.description, locale),
    }));

  const skillCategories = skills.map((category) => ({
    label: getLocalizedText(category.category, locale),
    items: category.items,
  }));

  const buffer = await renderToBuffer(
    <CvDocument
      headerLine={landingT("heroTitle")}
      contact={contact}
      experienceHeading={experienceT("professionalHeading")}
      experienceEntries={experienceEntries}
      studiesHeading={studiesT("heading")}
      studiesEntries={studiesEntries}
      skillsHeading={skillsT("heading")}
      skillCategories={skillCategories}
    />,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="bruno-morales-cv-${locale}.pdf"`,
    },
  });
}
