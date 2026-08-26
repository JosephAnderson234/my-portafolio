import { hasNeonConfig, getNeonClient } from "src/db/neonClient";
import type { ExperienceRepository } from "src/db/contracts";
import type { ExperienceSummary } from "src/db/types";

// ─── Mock data (used while Neon DB is not yet configured) ─────────────────────
const MOCK_EXPERIENCE: ExperienceSummary[] = [
  {
    id: 1,
    company: "Mekánico",
    role: "Fullstack Developer",
    start_date: "2026-06",
    current: true,
    description:
      "Desarrollo funcionalidades full stack utilizando tecnologias modernas de frontend y backend en un sistema de gestion de flotas y unidades, siguiendo una estricta metodologia de trabajo.",
    achievements: [
      "Contribui al ciclo completo de desarrollo, desde el diseno hasta el despliegue de nuevas funcionalidades",
      "Trabaje sobre un sistema de gestion de flotas y unidades con estandares modernos de desarrollo",
    ],
    stack: ["React", "Next.js", "Node.js", "TypeScript"],
    location: "Lima, Perú",
  },
  {
    id: 2,
    company: "Cognitia",
    role: "Programador Full Stack",
    start_date: "2026-05",
    end_date: "2026-06",
    current: false,
    description:
      "Desarrolle funcionalidades full stack aportando al producto del equipo, aplicando buenas practicas en la integracion entre frontend y backend.",
    achievements: [
      "Aporte funcionalidades full stack al producto del equipo",
      "Aplique buenas practicas de desarrollo en la integracion frontend-backend",
    ],
    stack: ["React", "Node.js", "JavaScript"],
    location: "Lima, Perú",
  },
  {
    id: 3,
    company: "Universidad de Ingenieria y Tecnologia (UTEC)",
    role: "Asistente de Catedra y Laboratorio - Programacion II",
    start_date: "2026-04",
    end_date: "2026-07",
    current: false,
    description:
      "Guie a estudiantes en estructuras de datos, POO y resolucion de problemas, reforzando el aprendizaje practico en sesiones de laboratorio.",
    achievements: [
      "Brinde soporte tecnico en evaluaciones y desarrollo de ejercicios guiados",
      "Mejore la experiencia de aprendizaje mediante acompanamiento continuo",
    ],
    stack: ["Java", "Estructuras de Datos", "POO", "Mentoria"],
    location: "Lima, Perú",
  },
  {
    id: 4,
    company: "BioActiva",
    role: "Desarrollador de Back-end",
    start_date: "2026-03",
    end_date: "2026-07",
    current: false,
    description:
      "Desarrolle el sistema de backend para un CRM, definiendo requerimientos previamente con el cliente y aplicando la metodologia SCRUM durante todo el ciclo de desarrollo.",
    achievements: [
      "Defini requerimientos del sistema junto al cliente antes de iniciar el desarrollo",
      "Aplique la metodologia SCRUM durante todo el ciclo de desarrollo del producto",
    ],
    stack: ["Spring Boot", "Java", "PostgreSQL", "SCRUM"],
    location: "Lima, Perú",
  },
  {
    id: 5,
    company: "Club de Software Libre - UTEC",
    role: "Director de Sistemas",
    start_date: "2026-01",
    current: true,
    description:
      "Lidero el area tecnica gestionando infraestructura y herramientas del club, coordinando proyectos y promoviendo buenas practicas de desarrollo.",
    achievements: [
      "Coordine proyectos tecnologicos para mejorar la organizacion y eficiencia del equipo",
      "Menture a miembros en desarrollo web fortaleciendo su aprendizaje tecnico",
      "Implemente flujos de trabajo para estandarizar colaboracion y entregas",
    ],
    stack: ["React", "Next.js", "Node.js", "GitHub", "Docker"],
    location: "Lima, Perú",
  },
  {
    id: 6,
    company: "Universidad de Ingenieria y Tecnologia (UTEC)",
    role: "Asistente de Catedra - Programacion II",
    start_date: "2025-09",
    end_date: "2025-12",
    current: false,
    description:
      "Guie a estudiantes en estructuras de datos y resolucion de problemas, explicando conceptos complejos de forma clara y adaptandome a distintos niveles.",
    achievements: [
      "Explique conceptos complejos de forma clara adaptandome a distintos niveles",
      "Apoye en sesiones de laboratorio reforzando conceptos clave del curso",
    ],
    stack: ["Java", "Estructuras de Datos", "Mentoria"],
    location: "Lima, Perú",
  },
  {
    id: 7,
    company: "Maftech S.A.C.",
    role: "Desarrollador Full Stack",
    start_date: "2025-08",
    end_date: "2025-12",
    current: false,
    description:
      "Desarrolle sistema de compras y landing page en Next.js, integrando frontend con backend en Spring Boot y PostgreSQL.",
    achievements: [
      "Implemente SSR y CSR optimizando rendimiento y experiencia de usuario",
      "Disene arquitectura basada en componentes enfocada en escalabilidad",
      "Desplegue la aplicacion en Vercel asegurando disponibilidad continua",
    ],
    stack: ["Next.js", "TypeScript", "Spring Boot", "PostgreSQL", "Vercel"],
    location: "Remoto",
  },
  {
    id: 8,
    company: "Autónomo",
    role: "Desarrollo Web",
    start_date: "2024-08",
    end_date: "2025-02",
    current: false,
    description:
      "Desarrolle proyectos web como freelance para distintos clientes, aplicando tecnologias modernas de frontend y backend segun los requerimientos de cada proyecto.",
    achievements: [
      "Entregue proyectos web freelance a distintos clientes",
      "Aplique tecnologias modernas de frontend y backend segun cada requerimiento",
    ],
    stack: ["React", "Next.js", "Node.js"],
    location: "Lima, Perú",
  },
  {
    id: 9,
    company: "Cachimbo",
    role: "Desarrollador Front-end",
    start_date: "2024-04",
    end_date: "2024-12",
    current: false,
    description:
      "Desarrolle interfaces web en React integradas con API Gateway, implementando autenticacion y control de acceso basados en JWT.",
    achievements: [
      "Desarrolle interfaces React integradas con API Gateway",
      "Implemente autenticacion y control de acceso con JWT",
      "Optimice la interaccion frontend-backend para mejorar tiempos de respuesta",
    ],
    stack: ["React", "API Gateway", "JWT", "JavaScript"],
    location: "Lima, Perú",
  },
  {
    id: 10,
    company: "Proyectos Personales",
    role: "Desarrollador Independiente",
    start_date: "2022-01",
    current: true,
    description:
      "Desarrollo sistemas completos de forma autodidacta aplicando patrones de arquitectura y mejora continua.",
    achievements: [
      "Implemente autenticacion segura con JWT y Spring Security",
      "Disene APIs REST e integre servicios externos",
      "Construi funcionalidades en tiempo real con WebSockets",
    ],
    stack: ["React", "Next.js", "Spring Boot", "REST", "WebSockets"],
    location: "Lima, Perú",
  },
];

// ─── Neon DB implementation (ready for future use) ──────────────────────────
class NeonExperienceRepository implements ExperienceRepository {
  async list(): Promise<ExperienceSummary[]> {
    const sql = getNeonClient();
    const rows = await sql`SELECT * FROM experience ORDER BY start_date DESC`;
    return rows as ExperienceSummary[];
  }
}

// ─── Mock fallback implementation ────────────────────────────────────────────
class MockExperienceRepository implements ExperienceRepository {
  async list(): Promise<ExperienceSummary[]> {
    return MOCK_EXPERIENCE;
  }
}

// ─── Export the active repository (Neon when configured, mock otherwise) ─────
export const experienceRepository: ExperienceRepository = hasNeonConfig()
  ? new NeonExperienceRepository()
  : new MockExperienceRepository();
