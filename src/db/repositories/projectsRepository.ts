import { hasNeonConfig, getNeonClient } from "src/db/neonClient";
import type { ProjectsRepository } from "src/db/contracts";
import type { ProjectSummary } from "src/db/types";

// ─── Mock data (used while Neon DB is not yet configured) ─────────────────────
const MOCK_PROJECTS: ProjectSummary[] = [
  {
    id: 1,
    slug: "linux-desktop-portfolio",
    title: "Linux Desktop Portfolio",
    description:
      "Interactive OS-style portfolio inspired by Hyprland tiling window managers. Draggable windows, terminal emulator, and full dark-mode glassmorphism UI.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "react-rnd"],
    status: "in-progress",
    featured: true,
    repo_url: "https://github.com/JosephAnderson234/my-portafolio",
    live_url: "https://joseph.dev",
  },
  {
    id: 2,
    slug: "ecommerce-platform",
    title: "Ecommerce Platform",
    description:
      "Full-stack modern storefront built for performance and UX. Features cart, checkout, product search, and an admin dashboard.",
    stack: ["React", "Node.js", "PostgreSQL", "Prisma", "Stripe"],
    status: "released",
    featured: true,
    repo_url: "https://github.com/JosephAnderson234/ecommerce",
    live_url: "https://shop.example.com",
  },
  {
    id: 3,
    slug: "cli-interface-generator",
    title: "CLI Interface Generator",
    description:
      "Toolkit that scaffolds typed command-line interfaces from JSON/YAML schema definitions. Supports plugins and auto-generated docs.",
    stack: ["TypeScript", "Bun", "Commander.js", "Zod"],
    status: "planned",
    featured: false,
    repo_url: "https://github.com/JosephAnderson234/cli-gen",
  },
  {
    id: 4,
    slug: "devblog",
    title: "Dev Blog",
    description:
      "Personal blog platform with MDX support, syntax highlighting, and RSS feed. Statically generated with ISR.",
    stack: ["Next.js", "MDX", "Contentlayer", "Tailwind CSS"],
    status: "released",
    featured: true,
    live_url: "https://blog.joseph.dev",
    repo_url: "https://github.com/JosephAnderson234/devblog",
  },
  {
    id: 5,
    slug: "realtime-chat",
    title: "Realtime Chat App",
    description:
      "WebSocket-based chat application with rooms, presence indicators, and message reactions.",
    stack: ["React", "Socket.io", "Express", "Redis"],
    status: "released",
    featured: false,
    repo_url: "https://github.com/JosephAnderson234/chat",
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
