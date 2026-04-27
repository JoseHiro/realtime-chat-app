import OpenAI from "openai";
import type { VocabWord, GrammarPattern, SupportingWord, Difficulty } from "./types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export type GeneratedSentence = {
  sentence: string;
  translation: string;
  furigana: string;
  wordInSentence: string;
  wordReading: string;
  supportingWords: SupportingWord[];
};

const SCENARIOS = [
  "学校・大学で", "職場・オフィスで", "家族と家で", "週末に友達と",
  "レストランやカフェで", "旅行中・出張中に", "病院やクリニックで",
  "スポーツや運動中に", "買い物中に", "朝のルーティンで",
  "深夜に", "電話やビデオ通話中に", "駅や電車の中で",
  "公園や屋外で", "お祝いやパーティーで", "料理中や食事中に",
  "悪天候の日に", "コンビニで",
];

const SUBJECTS = [
  "私（一人称）", "友達", "姉", "弟", "お母さん", "お父さん",
  "クラスメート", "同僚", "私たち（複数）", "先生", "知らない人",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const DIFFICULTY_RULES: Record<Difficulty, string[]> = {
  easy: [
    "- 短い文（5〜8語程度）にすること。",
    "- JLPT N5レベルの基本的な語彙のみ使うこと。",
    "- 「〜です」「〜ます」などシンプルな文末表現のみ使うこと。",
    "- 複雑な文構造（複文・従属節）は避けること。",
  ],
  medium: [
    "- 中程度の長さの文（8〜14語程度）にすること。",
    "- JLPT N4〜N3レベルの語彙を使ってよい。",
    "- 複文や接続表現（〜から・〜ので・〜て）を適度に使ってよい。",
  ],
  hard: [
    "- やや長い・複雑な文（15語以上を目安）にすること。",
    "- JLPT N2〜N1レベルの難易度の高い語彙・表現を積極的に使うこと。",
    "- 複雑な文構造（複文・条件節・引用節など）を使うこと。",
    "- 丁寧語・敬語・書き言葉的表現など、文体的バリエーションを持たせること。",
  ],
};

export async function generateSentence(
  word: VocabWord,
  grammar: GrammarPattern | null,
  knownWords: VocabWord[] = [],
  difficulty: Difficulty = "medium",
): Promise<GeneratedSentence> {
  const scenario = pick(SCENARIOS);
  const subject = pick(SUBJECTS);

  const systemPrompt = [
    "あなたは日本語教師です。学習者のために、バリエーション豊かな練習文を一文作成してください。",
    "ルール：",
    "- 指定された単語を必ず文中に使うこと。",
    "- シナリオと主語は参考にするが、不自然な日本語になる場合は調整してよい。",
    "- 文法的に自然な文にすること。例えば「私は〜ましょう」のように主語と文末表現が合わない組み合わせは避けること。",
    "- ましょう・てください・ませんかなど、勧誘・依頼・提案の表現を使う場合は、主語を省略するか複数形にすること。",
    "- 最もよく使われる典型的な文は避け、文脈に合った自然な使い方をすること。",
    ...DIFFICULTY_RULES[difficulty],
    grammar
      ? `- 文法パターン「${grammar.pattern}（${grammar.meaning}）」を文中で明確に使うこと。`
      : "",
    "以下のフィールドを含むJSONオブジェクトを返してください：",
    "  sentence       — 日本語の文",
    "  translation    — 自然な英語訳",
    "  furigana       — 文全体のひらがな読み",
    "  wordInSentence — 文中に実際に登場する単語の表層形（活用形のまま）",
    "  wordReading    — wordInSentence のひらがな読みのみ",
    "  supportingWords — 文中で使った主要な単語（指定単語を除く）の配列。最大5個。各要素は { word, reading, meaning } の形式。",
  ].filter(Boolean).join("\n");

  const knownWordsBlock = knownWords.length > 0
    ? `\n既知単語リスト：\n${knownWords.map((w) => `${w.jp}（${w.en}）`).join("、")}`
    : "";

  const userPrompt = grammar
    ? `単語：${word.jp}（${word.en}）\n文法：${grammar.pattern}（${grammar.meaning}）${grammar.example ? `\n例文：${grammar.example}` : ""}\n\nシナリオ：${scenario}\n主語の参考：${subject}${knownWordsBlock}`
    : `単語：${word.jp}（${word.en}）\n\nシナリオ：${scenario}\n主語の参考：${subject}${knownWordsBlock}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(completion.choices[0].message.content ?? "{}");
  return {
    sentence: result.sentence ?? "",
    translation: result.translation ?? "",
    furigana: result.furigana ?? "",
    wordInSentence: result.wordInSentence ?? word.jp,
    wordReading: result.wordReading ?? "",
    supportingWords: Array.isArray(result.supportingWords) ? result.supportingWords : [],
  };
}
