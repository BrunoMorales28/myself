"use client";

import { useLocale, useTranslations } from "next-intl";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher({ onDark = false }: { onDark?: boolean }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ToggleButtonGroup
      value={locale}
      exclusive
      size="small"
      aria-label={t("languageSwitcher")}
      onChange={(_, nextLocale: string | null) => {
        if (nextLocale) {
          router.replace(pathname, { locale: nextLocale });
        }
      }}
      sx={
        onDark
          ? {
              "& .MuiToggleButton-root": {
                color: "primary.contrastText",
                borderColor: "rgba(255,255,255,0.4)",
              },
              "& .MuiToggleButton-root.Mui-selected": {
                color: "primary.dark",
                backgroundColor: "primary.contrastText",
                "&:hover": { backgroundColor: "primary.contrastText" },
              },
            }
          : undefined
      }
    >
      {routing.locales.map((loc) => (
        <ToggleButton key={loc} value={loc} aria-label={loc}>
          {loc.toUpperCase()}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
