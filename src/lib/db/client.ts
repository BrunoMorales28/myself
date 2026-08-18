import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let cachedDb: Db | undefined;

// Lazily constructed so importing this module (e.g. for a request that
// never reaches the database, like a failed validation) never throws just
// because POSTGRES_URL isn't set — the connection string is only required
// once a query actually runs.
export function getDb(): Db {
  if (!cachedDb) {
    const sql = neon(process.env.POSTGRES_URL ?? "");
    cachedDb = drizzle(sql, { schema });
  }
  return cachedDb;
}
