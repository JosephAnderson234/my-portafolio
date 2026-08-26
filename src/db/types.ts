export type ProjectStatus = "planned" | "in-progress" | "released";

export interface ProjectSummary {
  id: number;
  slug: string;
  title: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  featured: boolean;
  repo_url?: string;
  live_url?: string;
  thumbnail?: string;
}

export interface ExperienceSummary {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  achievements: string[];
  stack: string[];
  location: string;
}

export interface ProfileSummary {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location?: string;
  email?: string;
  phone?: string;
  resume?: string;
}
