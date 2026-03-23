import profileData from "src/data/profile.json";
import type { ProfileRepository } from "src/db/contracts";
import type { ProfileSummary } from "src/db/types";

class JsonProfileRepository implements ProfileRepository {
  async getProfile(): Promise<ProfileSummary> {
    return profileData as ProfileSummary;
  }
}

export const profileRepository: ProfileRepository = new JsonProfileRepository();
