import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    company: "Globant (client: Sportian)",
    role: { en: "React.js Developer", es: "Desarrollador React.js" },
    startDate: "2025-11",
    endDate: "2026-06",
    section: "professional",
    description: {
      en: "Sole front-end owner for a virtual resource management platform, defining data products, domains, and accounts.",
      es: "Único responsable de front end de una plataforma de gestión de recursos virtuales, donde se definían productos de datos, dominios y cuentas.",
    },
    bullets: [
      {
        en: "Owned front-end development end-to-end as the only front-end developer on the project",
        es: "Responsable integral del front end como único desarrollador front end del proyecto",
      },
      {
        en: "First hands-on experience coding with AI-assisted tools",
        es: "Primera experiencia programando con herramientas asistidas por IA",
      },
      {
        en: "Built and maintained flows for defining data products, domains, and accounts",
        es: "Construcción y mantenimiento de flujos para definir productos de datos, dominios y cuentas",
      },
    ],
    tags: ["React", "TypeScript", "AI-assisted development"],
  },
  {
    company: "YPF (Y-Tracker)",
    role: { en: "React.js Developer", es: "Desarrollador React.js" },
    startDate: "2025-06",
    endDate: "2025-11",
    section: "professional",
    description: {
      en: "Sole front-end owner for Y-Tracker, a fleet management app tracking truck geolocation, travel times, arrivals, and delays.",
      es: "Único responsable de front end de Y-Tracker, un gestor de flota que trackea la geolocalización de camiones, tiempos de viaje, horarios de llegada y retrasos.",
    },
    bullets: [
      {
        en: "First project as sole front-end owner, from architecture to delivery",
        es: "Primer proyecto como único responsable de front end, desde la arquitectura hasta la entrega",
      },
      {
        en: "Learned and implemented SignalR for real-time geolocation queries",
        es: "Aprendizaje e implementación de SignalR para consultas de geolocalización en tiempo real",
      },
      {
        en: "Built dashboards for tracking fleet location, travel times, and delays",
        es: "Construcción de dashboards para trackear ubicación de la flota, tiempos de viaje y retrasos",
      },
    ],
    tags: ["React", "TypeScript", "SignalR", "Real-time data"],
  },
  {
    company: "Hootsuite",
    role: { en: "React.js Developer", es: "Desarrollador React.js" },
    startDate: "2023-11",
    endDate: "2025-06",
    section: "professional",
    description: {
      en: "Built a new workflow from scratch for client Hootsuite, including pages, components, styling, and full test coverage.",
      es: "Construcción de un nuevo flujo de trabajo desde cero para el cliente Hootsuite, incluyendo páginas, componentes, estilos y cobertura de tests completa.",
    },
    bullets: [
      {
        en: "Participated in creating a new workflow for the Hootsuite client",
        es: "Participación en la creación de un nuevo flujo de trabajo para el cliente Hootsuite",
      },
      {
        en: "Built pages from scratch: components, styling, unit/e2e/integration testing, i18n, and data fetching",
        es: "Construcción de páginas desde cero: componentes, estilos, tests unitarios/e2e/de integración, i18n y obtención de datos",
      },
      {
        en: "Used styled-components, MSW, Playwright, Jest, and React Testing Library",
        es: "Uso de styled-components, MSW, Playwright, Jest y React Testing Library",
      },
    ],
    tags: [
      "React",
      "styled-components",
      "Jest",
      "React Testing Library",
      "Playwright",
      "MSW",
      "i18n",
    ],
  },
  {
    company: "Nerdwallet",
    role: { en: "React.js Developer", es: "Desarrollador React.js" },
    startDate: "2021-10",
    endDate: "2023-02",
    section: "professional",
    description: {
      en: "Worked on the web flow for mortgage loan quoting and advice.",
      es: "Trabajo en el flujo web de cotización y asesoramiento de préstamos hipotecarios.",
    },
    bullets: [
      {
        en: "Created, styled, and refactored pages and components across the app",
        es: "Creación, estilizado y refactorización de páginas y componentes a lo largo de la app",
      },
      {
        en: "Contributed unit tests to the loan quoting flow",
        es: "Contribución con tests unitarios al flujo de cotización de préstamos",
      },
    ],
    tags: ["React", "TypeScript", "Unit testing"],
  },
  {
    company: "Mercado Libre",
    role: { en: "Front End Web Developer", es: "Desarrollador Web Front End" },
    startDate: "2020-12",
    endDate: "2021-09",
    section: "professional",
    description: {
      en: "Maintenance and new features for Mercado Pago's landing pages and main page across Latin America.",
      es: "Mantenimiento y nuevas funcionalidades para las landings y la página principal de Mercado Pago en toda Latinoamérica.",
    },
    bullets: [
      {
        en: "Built and maintained landing pages and the Mercado Pago main page for all Latin American countries",
        es: "Construcción y mantenimiento de landings y la página principal de Mercado Pago para todos los países de Latinoamérica",
      },
      {
        en: "Wrote unit tests for new features",
        es: "Escritura de tests unitarios para nuevas funcionalidades",
      },
    ],
    tags: ["React", "Unit testing"],
  },
  {
    company: "Santander Tecnología",
    role: { en: "Frontend Web Developer", es: "Desarrollador Web Frontend" },
    startDate: "2020-09",
    endDate: "2020-12",
    section: "professional",
    description: {
      en: "Front-end development for internal Santander banking projects.",
      es: "Desarrollo front end para proyectos internos bancarios de Santander.",
    },
    bullets: [
      {
        en: "Contributed front-end development on internal banking projects",
        es: "Contribución al desarrollo front end de proyectos bancarios internos",
      },
    ],
    tags: ["React"],
  },
  {
    company: "Iúnigo",
    role: { en: "Frontend Web Developer", es: "Desarrollador Web Frontend" },
    startDate: "2019-05",
    endDate: "2020-09",
    section: "professional",
    description: {
      en: "Front-end development for Iúnigo's website.",
      es: "Desarrollo front end para el sitio web de Iúnigo.",
    },
    bullets: [
      {
        en: "Built and maintained the company website using React.js, TypeScript, and Redux",
        es: "Construcción y mantenimiento del sitio web de la empresa usando React.js, TypeScript y Redux",
      },
      {
        en: "Used styled-components, Material UI, Sass, Bootstrap, and Tailwind CSS for styling",
        es: "Uso de styled-components, Material UI, Sass, Bootstrap y Tailwind CSS para el estilizado",
      },
      {
        en: "Implemented forms and validation with Formik and Yup, and i18n for translations",
        es: "Implementación de formularios y validación con Formik y Yup, e i18n para traducciones",
      },
    ],
    tags: [
      "React",
      "TypeScript",
      "Redux",
      "Material UI",
      "styled-components",
      "Sass",
      "Bootstrap",
      "Tailwind CSS",
      "Formik",
      "Yup",
      "i18n",
      "Moment.js",
      "date-fns",
      "Day.js",
    ],
  },
  {
    company: "IguanaFix",
    role: { en: "Front End Developer", es: "Desarrollador Front End" },
    startDate: "2018-11",
    endDate: "2019-04",
    section: "professional",
    description: {
      en: "Front-end development for IguanaFix's pages.",
      es: "Desarrollo front end para las páginas de IguanaFix.",
    },
    bullets: [
      {
        en: "Developed front-end pages using JavaScript (ES6) and Node.js",
        es: "Desarrollo de páginas front end usando JavaScript (ES6) y Node.js",
      },
      {
        en: "Used Bootstrap and React for UI development",
        es: "Uso de Bootstrap y React para el desarrollo de la interfaz",
      },
    ],
    tags: ["JavaScript", "React", "Node.js", "Bootstrap"],
  },
  {
    company: "Accenture",
    role: { en: "Java Developer", es: "Desarrollador Java" },
    startDate: "2017-06",
    endDate: "2018-11",
    section: "professional",
    description: {
      en: "Developed prototypes and small applications using an internal framework.",
      es: "Desarrollo de prototipos y aplicaciones pequeñas usando un framework interno.",
    },
    bullets: [
      {
        en: "Built application prototypes and small apps with Java and an internal framework",
        es: "Construcción de prototipos de aplicaciones y aplicaciones pequeñas con Java y un framework interno",
      },
      {
        en: "Worked with Bootstrap, HTML/CSS, PostgreSQL, SQL Server, MongoDB, Maven, and JBoss",
        es: "Trabajo con Bootstrap, HTML/CSS, PostgreSQL, SQL Server, MongoDB, Maven y JBoss",
      },
    ],
    tags: [
      "Java",
      "PostgreSQL",
      "SQL Server",
      "MongoDB",
      "Maven",
      "JBoss",
      "Bootstrap",
    ],
  },
  {
    company: "Indra",
    role: { en: "Tester", es: "Tester" },
    startDate: "2016-08",
    endDate: "2017-05",
    section: "early",
    description: {
      en: "Training in PL/SQL and Java programming, and manual testing for Indra's client organizations.",
      es: "Entrenamiento en programación PL/SQL y Java, y testeo manual de aplicaciones para organizaciones clientes de Indra.",
    },
    bullets: [
      {
        en: "Trained in PL/SQL and Java programming",
        es: "Entrenamiento en programación PL/SQL y Java",
      },
      {
        en: "Performed manual testing for client applications",
        es: "Testeo manual de aplicaciones para clientes",
      },
    ],
    tags: ["PL/SQL", "Java", "Manual testing"],
  },
  {
    company: "ZyS Factors S.A.",
    role: {
      en: "Internal Technical Assistant",
      es: "Asistente Técnico Interno",
    },
    startDate: "2016-03",
    endDate: "2016-07",
    section: "early",
    description: {
      en: "General tech equipment repair and maintenance, and external technical support liaison.",
      es: "Reparación y mantenimiento de equipo tecnológico general, y contacto con servicio técnico externo.",
    },
    bullets: [
      {
        en: "Repaired and maintained general tech equipment",
        es: "Reparación y mantenimiento de equipo tecnológico general",
      },
      {
        en: "Liaised with external technical support and managed accounts",
        es: "Contacto con servicio técnico externo y manejo de cuentas",
      },
    ],
    tags: ["IT support"],
  },
  {
    company: "Centerplate",
    role: {
      en: "General Resort Worker (Work & Travel)",
      es: "Trabajador General de Resort (Work & Travel)",
    },
    startDate: "2014-12",
    endDate: "2015-03",
    section: "early",
    description: {
      en: "Work & Travel program at Centerplate's ski resort in Lake Placid, NY.",
      es: "Programa Work & Travel en el resort de ski de Centerplate en Lake Placid, NY.",
    },
    bullets: [
      {
        en: "Assisted customers in the rental sector",
        es: "Atención al consumidor en el sector de rentas",
      },
      {
        en: "Worked in the kitchen and cafeteria service",
        es: "Trabajo en cocina y servicio de cafetería",
      },
    ],
    tags: ["Customer service"],
  },
  {
    company: "Focus",
    role: { en: "Digital Illustrator", es: "Dibujante Digital" },
    startDate: "2014-09",
    endDate: "2014-11",
    section: "early",
    description: {
      en: 'Digital illustration work for the animated series "Medialuna y las Aventuras en la Selva."',
      es: 'Trabajo de dibujo digital para la serie animada "Medialuna y las Aventuras en la Selva".',
    },
    bullets: [
      {
        en: "Illustrated props and backgrounds using Adobe Illustrator",
        es: "Ilustración de utilería y fondos usando Adobe Illustrator",
      },
    ],
    tags: ["Illustrator"],
  },
];
