// ── Practice session types ────────────────────────────────────────────────────

export type MasteryState = "new" | "learning" | "familiar" | "strong" | "mastered";

export type Direction = "jp-to-en" | "en-to-jp";

export type VocabWord = {
  id: string;
  jp: string;
  en: string;
};

export type GrammarPattern = {
  id: string;
  pattern: string;
  meaning: string;
  example: string | null;
};

export type QuestionSlot = {
  word: VocabWord;
  grammar: GrammarPattern | null;
};

export type SupportingWord = {
  word: string;
  reading: string;
  meaning: string;
};

export type SessionQuestion = {
  id: string;
  sentence: string;
  translation: string;
  furigana: string;
  wordInSentence: string;
  wordReading: string;
  supportingWords: SupportingWord[];
  wordUsed: VocabWord;
  grammarUsed: { pattern: string; meaning: string } | null;
};

export type SessionResponse = {
  sessionId: string;
  questions: SessionQuestion[];
  direction: Direction;
};

// ── Progress types ────────────────────────────────────────────────────────────

export interface WordProgress {
  wordId: string;
  userId: string;
  lifetimeAttempts: number;
  lifetimeCorrect: number;
  recentSessionScores: number[];
  lastSessionScore: number | null;
  lastSeen: Date | null;
}

export interface QuestionResult {
  wordId: string;
  correct: boolean;
}

export interface WordSessionStats {
  wordId: string;
  attempts: number;
  correct: number;
  score: number;
}

export type WordProgressSummary = {
  wordId: string;
  mastery: MasteryState;
  lifetimeAttempts: number;
  lifetimeCorrect: number;
  lastSeen: string | null;
};
