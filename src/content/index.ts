import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CasinoIcon from "@mui/icons-material/Casino";
import ShieldIcon from "@mui/icons-material/Shield";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import type { LocalizedText, HobbyIconKey } from "./types";

export { experience } from "./experience";
export { studies } from "./studies";
export { skills } from "./skills";
export { about } from "./about";
export type {
  LocalizedText,
  ExperienceEntry,
  StudyEntry,
  SkillCategory,
  Hobby,
  HobbyIconKey,
  AboutContent,
} from "./types";

export function getLocalizedText(
  value: LocalizedText,
  locale: "en" | "es",
): string {
  return value[locale];
}

export const hobbyIcons: Record<HobbyIconKey, typeof SportsEsportsIcon> = {
  videogames: SportsEsportsIcon,
  tabletop: CasinoIcon,
  combat: ShieldIcon,
  reading: MenuBookIcon,
};
