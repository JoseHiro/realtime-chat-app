/**
 * Generate TTS audio for drill tasks and save to public/audio/drills/.
 * Updates Task.audioUrl in the database.
 *
 * Requires: AZURE_API_KEY (and optionally AZURE_SERVICE_REGION) in .env
 *
 * Usage:
 *   npx tsx scripts/generate-task-audio.ts              # only tasks without audioUrl
 *   npx tsx scripts/generate-task-audio.ts --force        # regenerate all
 *   npx tsx scripts/generate-task-audio.ts --dry-run      # print what would be done
 */

import path from "path";
import { config } from "dotenv";
import { promises as fs } from "fs";
import { PrismaClient } from "@prisma/client";
import { generateAzureAudio } from "../lib/tts/ttsService";

config({ path: path.join(process.cwd(), ".env") });

const prisma = new PrismaClient();

const AZURE_API_KEY = process.env.AZURE_API_KEY || "";

function escapeSsml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getTextToSpeak(
  type: string,
  targetJapanese: string | null,
  mainVocabulary: { kanji: string | null; hiragana: string } | null
): string | null {
  if (type === "VOCAB" && mainVocabulary) {
    return mainVocabulary.kanji ?? mainVocabulary.hiragana;
  }
  if (type === "SENTENCE" && targetJapanese) {
    return targetJapanese;
  }
  return null;
}

async function main() {
  const force = process.argv.includes("--force");
  const dryRun = process.argv.includes("--dry-run");

  if (!AZURE_API_KEY) {
    console.error("❌ AZURE_API_KEY is not set. Add it to .env");
    process.exit(1);
  }

  const audioDir = path.join(process.cwd(), "public", "audio", "drills");
  if (!dryRun) {
    await fs.mkdir(audioDir, { recursive: true });
  }

  const tasks = await prisma.task.findMany({
    where: force ? undefined : { audioUrl: null },
    include: { mainVocabulary: true },
  });

  const toGenerate: { id: string; text: string; type: string }[] = [];
  for (const t of tasks) {
    const text = getTextToSpeak(t.type, t.targetJapanese, t.mainVocabulary);
    if (!text || !text.trim()) continue;
    toGenerate.push({ id: t.id, text: text.trim(), type: t.type });
  }

  console.log(
    `📋 Found ${toGenerate.length} task(s) to generate audio for${force ? " (--force: all)" : " (missing audioUrl only)"}.`
  );
  if (dryRun) {
    toGenerate.forEach(({ id, text, type }) =>
      console.log(`  [${type}] ${id}: "${text.slice(0, 40)}${text.length > 40 ? "…" : ""}"`)
    );
    console.log("Run without --dry-run to generate files and update the database.");
    return;
  }

  let ok = 0;
  let err = 0;
  for (const { id, text, type } of toGenerate) {
    try {
      const safeText = escapeSsml(text);
      const buffer = await generateAzureAudio(safeText);
      const fileName = `${id}.mp3`;
      const filePath = path.join(audioDir, fileName);
      await fs.writeFile(filePath, buffer);
      const audioUrl = `/audio/drills/${fileName}`;
      await prisma.task.update({
        where: { id },
        data: { audioUrl },
      });
      ok++;
      console.log(`  ✅ [${type}] ${id}`);
    } catch (e) {
      err++;
      console.error(`  ❌ ${id}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log(`\n✅ Done. Generated: ${ok}, failed: ${err}. Files in public/audio/drills/`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
