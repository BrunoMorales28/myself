import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// drizzle-kit is a standalone CLI, not part of Next.js's dev/build process —
// it never picks up .env.local automatically the way Next.js pages do, so
// it has to be loaded explicitly here.
config({ path: ".env.local" });

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL ?? "",
  },
} satisfies Config;
