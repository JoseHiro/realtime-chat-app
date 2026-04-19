import { randomUUID } from "crypto";
import { getUserVocabulary } from "./vocabularyService";
import { getGrammarPatterns } from "./grammarService";
import { buildQuestionSlots } from "./generateQuestions";
import { generateSentence } from "./sentenceGenerator";
import type { Direction, SessionQuestion, SessionResponse } from "./types";

type CreateSessionParams = {
  userId: string;
  wordIds: string[];
  grammarIds: string[];
  direction: Direction;
};

export async function createSession({
  userId,
  wordIds,
  grammarIds,
  direction,
}: CreateSessionParams): Promise<SessionResponse> {
  const [words, grammarPatterns] = await Promise.all([
    getUserVocabulary(userId, wordIds),
    getGrammarPatterns(grammarIds),
  ]);

  if (words.length === 0) {
    throw new Error("No vocabulary words found. Add some words first.");
  }

  const slots = buildQuestionSlots(words, grammarPatterns);

  const settled = await Promise.allSettled(
    slots.map(({ word, grammar }) => {
      const otherWords = words.filter((w) => w.id !== word.id);
      const sample = otherWords.sort(() => Math.random() - 0.5).slice(0, 10);
      return generateSentence(word, grammar, sample);
    }),
  );

  const questions: SessionQuestion[] = settled.flatMap((result, i) => {
    if (result.status !== "fulfilled" || !result.value.sentence) return [];
    const { word, grammar } = slots[i];
    return [{
      id: randomUUID(),
      sentence: result.value.sentence,
      translation: result.value.translation,
      furigana: result.value.furigana,
      wordInSentence: result.value.wordInSentence,
      wordReading: result.value.wordReading,
      supportingWords: result.value.supportingWords,
      wordUsed: word,
      grammarUsed: grammar ? { pattern: grammar.pattern, meaning: grammar.meaning } : null,
    } satisfies SessionQuestion];
  });

  return { sessionId: randomUUID(), questions, direction };
}
