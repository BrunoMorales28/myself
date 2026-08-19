"use client";

import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/layout/Section";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <Section tint="default">
      <Typography variant="h1" sx={{ mb: 2 }}>
        {t("heading")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {t("body")}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button onClick={reset} variant="contained">
          {t("tryAgain")}
        </Button>
        <Button component={Link} href="/" variant="outlined">
          {t("homeLink")}
        </Button>
      </Stack>
    </Section>
  );
}
