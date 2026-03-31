import type { ExperienceSummary, ProfileSummary, ProjectSummary } from "src/db/types";

export interface ProjectsRepository {
  list(): Promise<ProjectSummary[]>;
  getBySlug(slug: string): Promise<ProjectSummary | null>;
  listFeatured(): Promise<ProjectSummary[]>;
}

export interface ExperienceRepository {
  list(): Promise<ExperienceSummary[]>;
}

export interface ProfileRepository {
  getProfile(): Promise<ProfileSummary>;
}

export interface PortfolioRepositories {
  projects: ProjectsRepository;
  experience: ExperienceRepository;
  profile: ProfileRepository;
}
