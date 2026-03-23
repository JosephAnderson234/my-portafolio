import projectsData from "src/data/projects.json";
import type { ProjectsRepository } from "src/db/contracts";
import type { ProjectSummary } from "src/db/types";

class JsonProjectsRepository implements ProjectsRepository {
  async list(): Promise<ProjectSummary[]> {
    return projectsData as ProjectSummary[];
  }

  async getBySlug(slug: string): Promise<ProjectSummary | null> {
    const project = projectsData.find((item) => item.slug === slug);
    return (project as ProjectSummary) ?? null;
  }
}

// Future Neon implementation can replace this export while keeping the same contract.
export const projectsRepository: ProjectsRepository = new JsonProjectsRepository();
