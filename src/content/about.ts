import type { AboutContent } from "./types";

export const about: AboutContent = {
  bio: {
    en: "React.js developer skilled in building responsive, user-focused web applications with clean, maintainable code. Proficient in modern JavaScript frameworks, agile methodologies, Git, and API integration. Collaborative team player with a passion for delivering high-quality, scalable solutions and staying up to date with industry trends.",
    es: "Desarrollador React.js especializado en construir aplicaciones web responsivas y centradas en el usuario, con código limpio y mantenible. Con experiencia en frameworks modernos de JavaScript, metodologías ágiles, Git e integración de APIs. Colaborativo en equipo, con pasión por entregar soluciones escalables de alta calidad y mantenerse al día con las tendencias de la industria.",
  },
  hobbies: [
    {
      id: "videogames",
      label: { en: "Videogames", es: "Videojuegos" },
      description: {
        en: "A mix of story-driven RPGs and competitive titles — a lot of Bruno's interest in systems and UX comes from here.",
        es: "Una mezcla de RPGs narrativos y títulos competitivos — de ahí viene buena parte del interés de Bruno por los sistemas y la UX.",
      },
      icon: "videogames",
    },
    {
      id: "tabletop",
      label: { en: "Tabletop roleplaying", es: "Rol de mesa" },
      description: {
        en: "A regular player and occasional game master, running long campaigns with the same group of friends for years.",
        es: "Jugador habitual y narrador ocasional, con campañas largas junto al mismo grupo de amigos desde hace años.",
      },
      icon: "tabletop",
    },
    {
      id: "combat",
      label: {
        en: "Medieval combat",
        es: "Combate medieval",
      },
      description: {
        en: "Practices historical medieval combat and takes part in renaissance fairs — full armor included.",
        es: "Practica combate medieval histórico y participa en ferias renacentistas, con armadura completa incluida.",
      },
      icon: "combat",
    },
    {
      id: "reading",
      label: { en: "Reading", es: "Lectura" },
      description: {
        en: "Mostly fantasy and sci-fi, with the occasional non-fiction book about how things — or people — actually work.",
        es: "Sobre todo fantasía y ciencia ficción, con algún libro de no ficción de vez en cuando sobre cómo funcionan las cosas (o las personas).",
      },
      icon: "reading",
    },
  ],
};
