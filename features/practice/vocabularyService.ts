import { prisma } from "../../lib/prisma";
import type { VocabWord } from "./types";

export async function getUserVocabulary(
  userId: string,
  wordIds: string[] = [],
): Promise<VocabWord[]> {
  return prisma.practiceWord.findMany({
    where: {
      userId,
      ...(wordIds.length > 0 ? { id: { in: wordIds } } : {}),
    },
    select: { id: true, jp: true, en: true },
  });
}
