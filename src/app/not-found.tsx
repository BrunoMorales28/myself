import { headers } from "next/headers";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const copy = {
  en: {
    heading: "Page not found",
    body: "The page you're looking for doesn't exist.",
    homeLink: "Home",
  },
  es: {
    heading: "Página no encontrada",
    body: "La página que buscás no existe.",
    homeLink: "Inicio",
  },
} as const;

function preferredLocale(acceptLanguage: string | null): "en" | "es" {
  const primaryTag = acceptLanguage?.split(",")[0]?.trim().toLowerCase();
  return primaryTag?.startsWith("es") ? "es" : "en";
}

export default async function RootNotFound() {
  const acceptLanguage = (await headers()).get("accept-language");
  const first = preferredLocale(acceptLanguage);
  const second = first === "en" ? "es" : "en";

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h1" sx={{ fontSize: "2rem", mb: 3 }}>
        {copy[first].heading} / {copy[second].heading}
      </Typography>
      <Stack spacing={3}>
        {([first, second] as const).map((locale) => (
          <Stack key={locale} spacing={1}>
            <Typography variant="body1">{copy[locale].body}</Typography>
            <Button
              component="a"
              href={`/${locale}`}
              variant={locale === first ? "contained" : "outlined"}
              sx={{ alignSelf: "flex-start" }}
            >
              {copy[locale].homeLink} ({locale.toUpperCase()})
            </Button>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
}
