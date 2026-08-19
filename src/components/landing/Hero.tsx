import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "@/i18n/navigation";

type HeroProps = {
  name: string;
  role: string;
  intro: string;
  downloadCvLabel: string;
  downloadCvHref: string;
  contactLabel: string;
  contactHref: string;
};

export function Hero({
  name,
  role,
  intro,
  downloadCvLabel,
  downloadCvHref,
  contactLabel,
  contactHref,
}: HeroProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: { xs: "70vh", md: "75vh" },
      }}
    >
      <Typography
        variant="h1"
        sx={{ mb: 1, fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" } }}
      >
        {name}
      </Typography>
      <Typography
        sx={{
          mb: 3,
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 500,
          color: "text.secondary",
          fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
        }}
      >
        {role}
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
