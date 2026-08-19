import { getTranslations } from "next-intl/server";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { contact } from "@/content";
import { ContactForm } from "@/components/contact/ContactForm";
import { Section } from "@/components/layout/Section";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <>
      <Section tint="default">
        <Typography variant="h1" sx={{ mb: 2 }}>
          {t("heading")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {t("intro")}
        </Typography>

        <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
          <Link href={`mailto:${contact.email}`}>{contact.email}</Link>
          <Link
            href={contact.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("linkedinLabel")}
          </Link>
          <Link
            href={contact.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("githubLabel")}
          </Link>
        </Stack>
      </Section>

      <Section tint="light">
        <ContactForm
          labels={{
            nameLabel: t("nameLabel"),
            emailLabel: t("emailLabel"),
            messageLabel: t("messageLabel"),
            nameRequired: t("nameRequired"),
            emailRequired: t("emailRequired"),
            emailInvalid: t("emailInvalid"),
            messageRequired: t("messageRequired"),
            submitLabel: t("submitLabel"),
            submittingLabel: t("submittingLabel"),
            successMessage: t("successMessage"),
            errorMessage: t("errorMessage"),
          }}
        />
      </Section>
    </>
  );
}
