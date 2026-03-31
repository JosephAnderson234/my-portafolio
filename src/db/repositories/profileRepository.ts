import profileData from "src/data/profile.json";
import type { ProfileRepository } from "src/db/contracts";
import type { ProfileSummary } from "src/db/types";

// Profile is always served from static JSON as it's mostly static content.
class StaticProfileRepository implements ProfileRepository {
  async getProfile(): Promise<ProfileSummary> {
    return {
      name: profileData.name,
      role: profileData.role,
      tagline: profileData.tagline,
      bio: profileData.bio,
      location: profileData.location,
      email: profileData.email,
    };
  }
}

export const profileRepository: ProfileRepository = new StaticProfileRepository();
