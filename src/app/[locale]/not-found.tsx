import { getTranslations } from "next-intl/server";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <>
      <Typography variant="h1" sx={{ mb: 2 }}>
        {t("heading")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {t("body")}
      </Typography>
      <Button component={Link} href="/" variant="contained">
        {t("homeLink")}
      </Button>
    </>
  );
}
