export type LocalizedText = {
  en: string;
  es: string;
};

export type ExperienceEntry = {
  company: string;
  role: LocalizedText;
  startDate: string; // YYYY-MM
  endDate: string | null; // YYYY-MM, null = present
  section: "professional" | "early";
  description: LocalizedText;
  bullets: LocalizedText[];
  tags: string[];
};

export type StudyEntry = {
  institution: string;
  degree: LocalizedText;
  startDate: string; // YYYY-MM
  endDate: string | null;
  description?: LocalizedText;
};

export type SkillCategory = {
  category: LocalizedText;
  items: string[];
};

export type AboutContent = {
  bio: LocalizedText;
  hobbies: LocalizedText[];
};
