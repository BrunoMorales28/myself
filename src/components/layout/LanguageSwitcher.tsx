"use client";

import { useLocale, useTranslations } from "next-intl";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
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
    >
      {routing.locales.map((loc) => (
        <ToggleButton key={loc} value={loc} aria-label={loc}>
          {loc.toUpperCase()}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
