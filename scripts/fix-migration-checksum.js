/**
 * One-off script: update _prisma_migrations checksum so it matches the current
 * migration file. Run from project root: node scripts/fix-migration-checksum.js
 *
 * Use when Prisma says "The migration X was modified after it was applied"
 * and you've already restored the file (or the current file is the one you want).
 */

import { createHash } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const MIGRATION_NAME = "20251228084343_add_cascade_delete_chats";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = join(__dirname, "..");
const migrationPath = join(
  projectRoot,
  "prisma",
  "migrations",
  MIGRATION_NAME,
  "migration.sql"
);

const content = readFileSync(migrationPath, "utf8");
const checksum = createHash("sha256").update(content).digest("hex");

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$executeRawUnsafe(
    `UPDATE "_prisma_migrations" SET checksum = $1 WHERE migration_name = $2`,
    checksum,
    MIGRATION_NAME
  );
  console.log(
    `Updated checksum for ${MIGRATION_NAME}: ${result} row(s) updated.`
  );
  if (result === 0) {
    console.warn(
      "No row was updated. Check that this migration is in _prisma_migrations."
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
