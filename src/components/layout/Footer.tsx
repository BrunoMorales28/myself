import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <Box
      component="footer"
      sx={{ borderTop: 1, borderColor: "divider", py: 3, mt: "auto" }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            {t("copyright", { year: new Date().getFullYear() })}
          </Typography>
          <Link
            href="https://github.com/BrunoMorales28/myself"
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
          >
            {t("viewSource")}
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
