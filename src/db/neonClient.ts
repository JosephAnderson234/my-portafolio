import { neon } from "@neondatabase/serverless";

let cachedClient: ReturnType<typeof neon> | null = null;

export function hasNeonConfig(): boolean {
  return Boolean(process.env.NEON_DATABASE_URL);
}

export function getNeonClient() {
  const connectionString = process.env.NEON_DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "NEON_DATABASE_URL is not configured. Set this env variable to connect to your Neon DB."
    );
  }

  if (!cachedClient) {
    cachedClient = neon(connectionString);
  }

  return cachedClient;
}
