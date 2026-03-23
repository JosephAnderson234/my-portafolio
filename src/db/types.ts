export type ProjectStatus = "planned" | "in-progress" | "released";

export interface ProjectSummary {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  featured: boolean;
  href?: string;
}

export interface ProfileSummary {
  name: string;
  role: string;
  tagline: string;
  location?: string;
  email?: string;
}
