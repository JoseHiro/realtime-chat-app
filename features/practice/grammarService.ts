import { prisma } from "../../lib/prisma";
import type { GrammarPattern } from "./types";

export async function getGrammarPatterns(grammarIds: string[]): Promise<GrammarPattern[]> {
  if (grammarIds.length === 0) return [];
  return prisma.grammar.findMany({
    where: { id: { in: grammarIds } },
    select: { id: true, pattern: true, meaning: true, example: true },
  });
}
