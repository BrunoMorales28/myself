import { useTranslations } from "next-intl";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Home() {
  const t = useTranslations("home");

  return (
    <Stack spacing={3}>
      <Typography variant="h1">{t("title")}</Typography>
      <Typography variant="h4">{t("subtitle")}</Typography>
      <Typography variant="body1">{t("body")}</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="primary">
          Primary
        </Button>
        <Button variant="contained" color="secondary">
          Secondary
        </Button>
        <Button variant="outlined" color="primary">
          Outlined
        </Button>
      </Stack>
    </Stack>
  );
}
