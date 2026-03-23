import { neon } from "@neondatabase/serverless";

let cachedClient: ReturnType<typeof neon> | null = null;

export function hasNeonConfig(): boolean {
  return Boolean(process.env.POSTGRES_URL);
}

export function getNeonClient() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error("POSTGRES_URL is not configured.");
  }

  if (!cachedClient) {
    cachedClient = neon(connectionString);
  }

  return cachedClient;
}
