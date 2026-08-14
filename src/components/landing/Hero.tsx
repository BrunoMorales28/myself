import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "@/i18n/navigation";

type HeroProps = {
  title: string;
  intro: string;
  downloadCvLabel: string;
  downloadCvHref: string;
  contactLabel: string;
  contactHref: string;
};

export function Hero({
  title,
  intro,
  downloadCvLabel,
  downloadCvHref,
  contactLabel,
  contactHref,
}: HeroProps) {
  return (
    <Box component="section" sx={{ py: 4 }}>
      <Typography
        variant="h1"
        sx={{ mb: 2, fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" } }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 640 }}
      >
        {intro}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
        <Button variant="contained" color="primary" href={downloadCvHref}>
          {downloadCvLabel}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          href={contactHref}
        >
          {contactLabel}
        </Button>
      </Stack>
    </Box>
  );
}
