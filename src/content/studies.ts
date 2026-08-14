import type { StudyEntry } from "./types";

export const studies: StudyEntry[] = [
  {
    id: "digital-house",
    institution: "Digital House",
    logoUrl: "/logos/digital-house.svg",
    degree: {
      en: "Native Android Development",
      es: "Desarrollo Nativo Android",
    },
    startDate: "2016-03",
    endDate: "2016-09",
    description: {
      en: "Intensive course covering native Android app development, from UI fundamentals to publishing on the Play Store.",
      es: "Curso intensivo de desarrollo de apps nativas para Android, desde los fundamentos de UI hasta la publicación en Play Store.",
    },
  },
  {
    id: "escuelas-tecnicas-ort",
    institution: "Escuelas Técnicas ORT",
    logoUrl: "/logos/ort.svg",
    degree: {
      en: "Technical Baccalaureate",
      es: "Bachiller con Orientación Técnica",
    },
    startDate: "2009-03",
    endDate: "2013-12",
    description: {
      en: "Secondary education with a technical orientation, including an early introduction to programming and electronics.",
      es: "Educación secundaria con orientación técnica, con una primera introducción a la programación y la electrónica.",
    },
  },
];
