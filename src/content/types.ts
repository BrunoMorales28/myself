export type LocalizedText = {
  en: string;
  es: string;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  logoUrl: string;
  role: LocalizedText;
  startDate: string; // YYYY-MM
  endDate: string | null; // YYYY-MM, null = present
  section: "professional" | "early";
  description: LocalizedText;
  bullets: LocalizedText[];
  tags: string[];
};

export type StudyEntry = {
  id: string;
  institution: string;
  logoUrl: string;
  degree: LocalizedText;
  startDate: string; // YYYY-MM
  endDate: string | null;
  description: LocalizedText;
};

export type SkillCategory = {
  category: LocalizedText;
  items: string[];
};

export type HobbyIconKey = "videogames" | "tabletop" | "combat" | "reading";

export type Hobby = {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  icon: HobbyIconKey;
};

export type AboutContent = {
  bio: LocalizedText;
  hobbies: Hobby[];
};
