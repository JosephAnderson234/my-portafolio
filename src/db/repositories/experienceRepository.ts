import { hasNeonConfig, getNeonClient } from "src/db/neonClient";
import type { ExperienceRepository } from "src/db/contracts";
import type { ExperienceSummary } from "src/db/types";

// ─── Mock data (used while Neon DB is not yet configured) ─────────────────────
const MOCK_EXPERIENCE: ExperienceSummary[] = [
  {
    id: 1,
    company: "TechCorp Solutions",
    role: "Senior Frontend Developer",
    start_date: "2023-03",
    current: true,
    description:
      "Leading the frontend architecture migration from a legacy CRA monolith to a modern Next.js micro-frontend setup.",
    achievements: [
      "Reduced Time-to-Interactive by 48% through code splitting and ISR",
      "Introduced Storybook + Chromatic for design-system documentation",
      "Mentored 3 junior developers on TypeScript and React patterns",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "React Query", "Storybook"],
    location: "Lima, Perú (Remote)",
  },
  {
    id: 2,
    company: "StartupXYZ",
    role: "Full Stack Developer",
    start_date: "2021-06",
    end_date: "2023-02",
    current: false,
    description:
      "Built and maintained the core product — a SaaS analytics platform — from MVP to a production system serving 10k+ users.",
    achievements: [
      "Architected the multi-tenant PostgreSQL schema with row-level security",
      "Delivered a real-time dashboard using WebSockets and React",
      "Set up CI/CD pipelines with GitHub Actions + Docker",
    ],
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Docker", "Redis"],
    location: "Lima, Perú",
  },
  {
    id: 3,
    company: "Freelance",
    role: "Web Developer",
    start_date: "2020-01",
    end_date: "2021-05",
    current: false,
    description:
      "Designed and developed websites and web apps for clients across e-commerce, education, and hospitality sectors.",
    achievements: [
      "Delivered 12+ client projects on time and within budget",
      "Integrated payment gateways (PayPal, Culqi) for Peruvian market",
      "Built a custom CMS for a local education startup",
    ],
    stack: ["React", "Vue.js", "WordPress", "PHP", "MySQL"],
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
