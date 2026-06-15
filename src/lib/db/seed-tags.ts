import { config } from "dotenv";

// Load env before importing the db module, which reads DATABASE_URL at import
// time. The db import is therefore deferred into main() (after config runs).
config({ path: ".env.local" });

// Seed the tags the existing posts already reference so the master list isn't
// empty and old posts keep their colors. Idempotent: re-running is a no-op.
const DEFAULT_TAGS = [
  { name: "Product", color: "blue", orderIndex: 0 },
  { name: "Academy", color: "emerald", orderIndex: 1 },
  { name: "Company", color: "violet", orderIndex: 2 },
];

async function main() {
  const { db } = await import("./index");
  const { tags } = await import("./schema");

  await db.insert(tags).values(DEFAULT_TAGS).onConflictDoNothing({ target: tags.name });
  console.log(`Seeded ${DEFAULT_TAGS.length} default tags (existing ones skipped).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
