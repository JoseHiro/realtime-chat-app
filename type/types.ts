import { JwtPayload } from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
  userId: string;
}

// JLPT レベルの型
export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

// Improvement taxonomy types
export type ImprovementType =
  | "complete_sentence"
  | "particle_usage"
  | "listing_and_conjunctions"
  | "politeness_and_register"
  | "opinion_expression"
  | "conversation_expansion"
  | "verb_forms"
  | "conditional_expressions"
  | "honorifics"
  | "vocabulary_choice"
  | "sentence_structure";

// 拡張サマリー型（新しいタイプ）
export type SummaryData = {
  summary: string;
  mistakes: Array<{
    kanji: string;
    kana: string;
  }>;
  corrections: Array<{
    kanji: string;
    kana: string;
  }>;
  goodPoints: string[];
  difficultyLevel: string;
  improvementPoints: string[];
  commonMistakes: string[];
  sentenceUpgrades: Array<{
    original: {
      kanji: string;
      kana: string;
    };
    upgraded: {
      kanji: string;
      kana: string;
    };
    advice: string;
  }>;
  vocabularySuggestions: string[];
  score: number;
};

export type ChatType = { role: string; content: string }[];

export type MessageType = {
  id: number;
  chatId: number;
  sender: string;
  message: string;
  createdAt: string;
};

export type ChatDataType = {
  id: number;
  userId: string;
  title: string;
  createdAt: string;
  message: MessageType[];
  theme?: string;
  level?: string;
  politeness?: string;
};

export type PricingType = {
  name: string;
  type: "trial" | "pro" | "premium";
  description: string;
  price: number | null;
  features: string[];
  limitations: string[];
  buttonText: string;
  buttonStyle: string;
  popular: boolean;
  color: "green" | "gray" | string;
  badge: string | null;
  disabled?: boolean; // Premiumだけ使ってるので optional
};

export type FAQType = {
  question: string;
  answer: string;
};

export type SentenceUpgrade = {
  advice: string;
  original: {
    kana: string;
    kanji: string;
  };
  upgraded: {
    kana: string;
    kanji: string;
  };
};

export type SummaryType = {
  meta: Meta;
  analysis: Analysis;
  feedback: Feedback;
  milestone: Milestone;
  conversation?: ConversationReview;
};

export type ConversationReview = {
  messages: ConversationMessage[];
  metadata?: {
    totalMessages: number;
    userMessages: number;
    improvementsGenerated: number;
    generatedAt?: string;
  };
};

export type ConversationMessage = {
  id: number;
  sender: "user" | "assistant";
  message: string;
  reading?: string;
  english?: string;
  createdAt: string;
  grammarCorrect?: boolean; // true if grammatically correct, false if has errors (only for user messages)
  grammarReason?: string; // explanation in English of why grammar is incorrect (only when grammarCorrect is false)
  improvements?: MessageImprovement[];
};

export type MessageImprovement = {
  text: string;
  reading: string;
  english: string;
  focus: string;
  level: string;
  type?: ImprovementType; // Optional taxonomy classification
};

export type GrammarPoint = {
  point: string;
  explanation: string;
  jlptLevel: string;
};

export type VocabularyItem = {
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  jlptLevel: string;
};

export type Meta = {
  title: string;
  level: {
    label: string;
    reason: string;
  };
  summary: string;
  selectedLevel: string;
  selectedTopic: string;
  chatDuration: number;
  createdAt?: string | Date;
};

export type Analysis = {
  overview: string;
  skills: {
    flow: string;
    comprehension: string;
    development: string;
  };
  vocabulary: {
    verbs: {
      word: string;
      reading: string;
      romaji: string;
      count: number;
    }[];
    adjectives: {
      word: string;
      reading: string;
      romaji: string;
      count: number;
    }[];
    adverbs: {
      word: string;
      reading: string;
      romaji: string;
      count: number;
    }[];
    conjunctions: {
      word: string;
      reading: string;
      romaji: string;
      count: number;
    }[];
  };
};

export type Feedback = {
  strengths: string[];
  improvements?: string[]; // Optional - now using improvement types from conversation instead
  commonMistakes: string[];
};

export type Milestone = {
  current: {
    milestone: string;
    ability: string;
  };
  next: {
    goal: string;
    steps: string[];
  };
};
