// JLPT レベルの型
export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

// 文章アップグレードの型
export type SentenceUpgrade = {
  original: string;
  upgraded: string;
};

// 拡張サマリー型（新しいタイプ）
export type SummaryData = {
  summary: string; // English summary
  mistakes: string[]; // 日本語の誤り
  corrections: string[]; // 対応する訂正（mistakes と同じ順序）
  goodPoints: string[]; // English
  difficultyLevel: JLPTLevel;
  improvementPoints: string[]; // English
  commonMistakes: string[]; // 学習者がよくする傾向
  sentenceUpgrades: SentenceUpgrade[]; // {original, upgraded}
  vocabularySuggestions: string[]; // 単語提案（日本語 or 英語どちらでもOK運用に合わせて）
  culturalNotes: string[]; // 文化ノート（English推奨）
};
