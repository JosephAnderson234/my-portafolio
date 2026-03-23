import type { ProfileSummary, ProjectSummary } from "src/db/types";

export interface ProjectsRepository {
  list(): Promise<ProjectSummary[]>;
  getBySlug(slug: string): Promise<ProjectSummary | null>;
}

export interface ProfileRepository {
  getProfile(): Promise<ProfileSummary>;
}

export interface PortfolioRepositories {
  projects: ProjectsRepository;
  profile: ProfileRepository;
}
