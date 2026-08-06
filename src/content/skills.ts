import type { SkillCategory } from "./types";

export const skills: SkillCategory[] = [
  {
    category: { en: "Frontend Core", es: "Frontend Core" },
    items: ["React.js", "TypeScript", "JavaScript (ES6+)", "Redux", "Next.js"],
  },
  {
    category: { en: "Testing", es: "Testing" },
    items: ["Jest", "React Testing Library", "Playwright", "MSW", "Storybook"],
  },
  {
    category: { en: "Styling & UI", es: "Estilos e Interfaz" },
    items: [
      "Material UI",
      "styled-components",
      "Sass",
      "Bootstrap",
      "Tailwind CSS",
    ],
  },
  {
    category: {
      en: "Forms, Dates & i18n",
      es: "Formularios, Fechas e i18n",
    },
    items: ["Formik", "Yup", "Moment.js", "date-fns", "Day.js", "next-intl"],
  },
  {
    category: {
      en: "AI & Agents (emerging)",
      es: "IA y Agentes (en desarrollo)",
    },
    items: ["Claude API", "AI-assisted development", "Agentic tool use"],
  },
  {
    category: {
      en: "Tooling & Workflow",
      es: "Herramientas y Flujo de Trabajo",
    },
    items: ["Git", "npm / yarn / pnpm", "Agile"],
  },
  {
    category: {
      en: "Early Career: Java & Backend",
      es: "Inicios: Java y Backend",
    },
    items: ["Java", "PostgreSQL", "SQL Server", "MongoDB", "Maven", "JBoss"],
  },
];
