import type { VocabWord, GrammarPattern, QuestionSlot } from "./types";

const MAX_WORDS = 10;
const GRAMMAR_PROBABILITY = 0.6;

export function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * (copy.length - i));
    result.push(copy[idx]);
    copy[idx] = copy[copy.length - i - 1];
  }
  return result;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuestionSlots(
  words: VocabWord[],
  grammarPatterns: GrammarPattern[],
): QuestionSlot[] {
  const selected = sample(words, Math.min(words.length, MAX_WORDS));
  const slots = shuffle([...selected, ...selected]); // each word × 2
  return slots.map((word) => {
    const useGrammar = grammarPatterns.length > 0 && Math.random() < GRAMMAR_PROBABILITY;
    const grammar = useGrammar
      ? grammarPatterns[Math.floor(Math.random() * grammarPatterns.length)]
      : null;
    return { word, grammar };
  });
}
