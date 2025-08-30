import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { logUsage } from "../../lib/loggingData/logger";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { history, chatId } = req.body;
  try {
    const conversationText = history
      .map(
        (msg: { role: string; content: string }) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const prompt = `あなたは日本語教師です。以下の会話を分析し、学習者にフィードバックを与えてください。
必ず次のJSON形式で出力してください。

JSONのキー:
- summary: 会話全体の簡潔な要約（英語で）
- mistakes: 学習者が犯した文法的な間違い（オブジェクト配列形式、各要素は { "kanji": "漢字を含む文", "kana": "ひらがなの読み" }）
- corrections: mistakes に対応する訂正例（mistakes と同じ順序で対応、オブジェクト配列形式、各要素は { "kanji": "訂正後の文", "kana": "ひらがなの読み" }）
- goodPoints: 学習者がよくできている点（英語の文字列配列）
- difficultyLevel: 学習者の日本語レベル（N5, N4, N3, N2, N1 のいずれか）
- improvementPoints: 改善すべき点（英語の文字列配列）
- commonMistakes: 学習者が繰り返しやすい典型的な間違い（英語の文字列配列）
- sentenceUpgrades: 学習者の現在のレベル（difficultyLevel）を踏まえ、そこから一段階上の自然な表現を提示してください。
  （例: N5ならN4程度、N4ならN3程度、N3ならN2程度を目安にしてください）
  各要素は { "original": { "kanji": "...", "kana": "..." }, "upgraded": { "kanji": "...", "kana": "..." } } の形式で出力してください。
- vocabularySuggestions: 会話に関連して学習者に役立つ単語や表現（日本語の文字列配列、漢字 + 読み仮名を () 内に表記）
- score (0-100): 学習者の会話の総合的なスコア（0-100の整数）

出力例:
{
  "summary": "English summary here",
  "mistakes": [
    { "kanji": "映画見ました", "kana": "えいが みました" },
    { "kanji": "かっこいでした", "kana": "かっこいでした" }
  ],
  "corrections": [
    { "kanji": "映画を見ました", "kana": "えいが を みました" },
    { "kanji": "かっこよかったです", "kana": "かっこよかったです" }
  ],
  "goodPoints": ["Good point 1", "Good point 2"],
  "difficultyLevel": "N4",
  "improvementPoints": ["Improvement point 1", "Improvement point 2"],
  "commonMistakes": ["よくする間違い1", "よくする間違い2"],
  "sentenceUpgrades": [
    {
      "original": { "kanji": "映画見ました", "kana": "えいが みました" },
      "upgraded": { "kanji": "昨日映画を見ました", "kana": "きのう えいが を みました" }
    }
  ],
  "vocabularySuggestions": ["旅行 (りょこう)", "友達 (ともだち)"],
  "score": 85
}

注意:
- mistakes, corrections, sentenceUpgrades は必ず { "kanji": "...", "kana": "..." } を含む形式で出力してください。
- sentenceUpgrades は飛躍的に難しい表現にせず、学習者が現実的にすぐ使えるレベルの自然な日本語にしてください。
- 出力は余計な説明を加えず、純粋なJSONのみ返してください。`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: conversationText,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    let parsed;
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        parsed = { summary: raw, mistakes: [], goodPoints: [] };
      }
    } else {
      parsed = { summary: raw, mistakes: [], goodPoints: [] };
    }

    const usage = completion.usage; // open ai usage
    const openaiCost = (usage.total_tokens / 1000) * 0.015;
    console.log("Open AI usage", usage);

    logUsage({
      timestamp: new Date().toISOString(),
      chatId,
      openai: {
        model: "gpt-4o-mini",
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        estimated_cost_usd: openaiCost,
      },
    });

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({ error: "Failed to summarize text" });
  }
}
