import { JwtPayload } from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
  userId: string;
}

// JLPT レベルの型
export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

// 文章アップグレードの型
export type SentenceUpgrade = {
  original: string;
  upgraded: string;
};

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
