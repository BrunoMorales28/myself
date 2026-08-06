import type { LocalizedText } from "./types";

export { experience } from "./experience";
export { studies } from "./studies";
export { skills } from "./skills";
export { about } from "./about";
export type {
  LocalizedText,
  ExperienceEntry,
  StudyEntry,
  SkillCategory,
  AboutContent,
} from "./types";

export function getLocalizedText(
  value: LocalizedText,
  locale: "en" | "es",
): string {
  return value[locale];
}
