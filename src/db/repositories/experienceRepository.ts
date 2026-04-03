import { hasNeonConfig, getNeonClient } from "src/db/neonClient";
import type { ExperienceRepository } from "src/db/contracts";
import type { ExperienceSummary } from "src/db/types";

// ─── Mock data (used while Neon DB is not yet configured) ─────────────────────
const MOCK_EXPERIENCE: ExperienceSummary[] = [
  {
    id: 1,
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
    id: 2,
    company: "Universidad de Ingenieria y Tecnologia (UTEC)",
    role: "Asistente de Catedra y Laboratorio - Programacion II",
    start_date: "2026-01",
    current: true,
    description:
      "Guio a estudiantes en estructuras de datos, POO y resolucion de problemas, reforzando el aprendizaje practico en sesiones de laboratorio.",
    achievements: [
      "Brinde soporte tecnico en evaluaciones y desarrollo de ejercicios guiados",
      "Mejore la experiencia de aprendizaje mediante acompanamiento continuo",
      "Adapte explicaciones tecnicas a distintos niveles de conocimiento",
    ],
    stack: ["Java", "Estructuras de Datos", "POO", "Mentoria"],
    location: "Lima, Perú",
  },
  {
    id: 3,
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
    id: 4,
    company: "Club de Software Libre - UTEC",
    role: "Miembro del Area Tecnica",
    start_date: "2024-01",
    end_date: "2025-12",
    current: false,
    description:
      "Participe en el area tecnica del club desarrollando interfaces web e integraciones con servicios backend.",
    achievements: [
      "Desarrolle interfaces React integradas con API Gateway",
      "Implemente autenticacion y control de acceso con JWT",
      "Optimice la interaccion frontend-backend para mejorar tiempos de respuesta",
    ],
    stack: ["React", "API Gateway", "JWT", "JavaScript"],
    location: "Lima, Perú",
  },
  {
    id: 5,
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
