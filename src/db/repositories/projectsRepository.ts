import { hasNeonConfig, getNeonClient } from "src/db/neonClient";
import type { ProjectsRepository } from "src/db/contracts";
import type { ProjectSummary } from "src/db/types";

// ─── Mock data (used while Neon DB is not yet configured) ─────────────────────
const MOCK_PROJECTS: ProjectSummary[] = [
  {
    id: 1,
    slug: "sistema-compras-maftech",
    title: "Sistema de Compras + Landing",
    description:
      "Sistema web de compras y landing page desarrollado para Maftech con enfoque en rendimiento y experiencia de usuario.",
    stack: ["Next.js", "TypeScript", "Spring Boot", "PostgreSQL", "Vercel"],
    status: "released",
    featured: true,
  },
  {
    id: 2,
    slug: "ecosistema-club-software-libre",
    title: "Ecosistema Web del Club de Software Libre",
    description:
      "Conjunto de iniciativas tecnicas para estandarizar flujos de trabajo, colaboracion y herramientas del club estudiantil.",
    stack: ["React", "Next.js", "Node.js", "GitHub", "Docker"],
    status: "in-progress",
    featured: true,
  },
  {
    id: 3,
    slug: "frontend-api-gateway-jwt",
    title: "Frontend con API Gateway + JWT",
    description:
      "Implementacion de interfaces React conectadas a servicios backend con autenticacion JWT y control de acceso.",
    stack: ["React", "JavaScript", "JWT", "API Gateway"],
    status: "released",
    featured: false,
  },
  {
    id: 4,
    slug: "apps-tiempo-real-websockets",
    title: "Apps en Tiempo Real con WebSockets",
    description:
      "Desarrollo de funcionalidades en tiempo real para proyectos personales, optimizando interaccion y respuesta de la aplicacion.",
    stack: ["Node.js", "WebSockets", "React", "PostgreSQL"],
    status: "released",
    featured: true,
  },
  {
    id: 5,
    slug: "portfolio-linux-style",
    title: "Portfolio Interactivo Estilo Linux",
    description:
      "Portafolio interactivo con experiencia estilo escritorio para mostrar proyectos, experiencia y stack tecnico.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    status: "in-progress",
    featured: false,
    repo_url: "https://github.com/JosephAnderson234/portafolio",
  },
];

// ─── Neon DB implementation (ready for future use) ──────────────────────────
class NeonProjectsRepository implements ProjectsRepository {
  async list(): Promise<ProjectSummary[]> {
    const sql = getNeonClient();
    const rows = await sql`SELECT * FROM projects ORDER BY id ASC`;
    return rows as ProjectSummary[];
  }

  async getBySlug(slug: string): Promise<ProjectSummary | null> {
    const sql = getNeonClient();
    const rows = await sql`SELECT * FROM projects WHERE slug = ${slug} LIMIT 1`;
    const result = rows as ProjectSummary[];
    return result[0] ?? null;
  }

  async listFeatured(): Promise<ProjectSummary[]> {
    const sql = getNeonClient();
    const rows = await sql`SELECT * FROM projects WHERE featured = true ORDER BY id ASC`;
    return rows as ProjectSummary[];
  }
}

// ─── Mock fallback implementation ────────────────────────────────────────────
class MockProjectsRepository implements ProjectsRepository {
  async list(): Promise<ProjectSummary[]> {
    return MOCK_PROJECTS;
  }

  async getBySlug(slug: string): Promise<ProjectSummary | null> {
    return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  }

  async listFeatured(): Promise<ProjectSummary[]> {
    return MOCK_PROJECTS.filter((p) => p.featured);
  }
}

// ─── Export the active repository (Neon when configured, mock otherwise) ─────
export const projectsRepository: ProjectsRepository = hasNeonConfig()
  ? new NeonProjectsRepository()
  : new MockProjectsRepository();
