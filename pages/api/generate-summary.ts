import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
// import { logUsage } from "../../lib/loggingData/logger";
import { verifyAuth } from "../../middleware/middleware";
import { PrismaClient } from "@prisma/client";
import { MyJwtPayload } from "../../type/types";
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token) as MyJwtPayload | null;
  if (!decodedToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { history, chatId, politeness } = req.body;

  if (!history || !chatId || !politeness) {
    return res.status(400).json({ error: "No data provided" });
  }

  // if not enough data in the history, no generate summary
  if (history.length < 3) {
    return res
      .status(204)
      .json({ message: "Not enough conversation for summary" });
  }

  try {
    const conversationText = history
      .map(
        (msg: { role: string; content: string }) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const prompt = `あなたは日本語教師です。以下の会話を分析し、学習者にフィードバックを与えてください。
会話は「${politeness}」な話し方で行われています。
提示する corrections, sentenceUpgrades はこの politeness（話し方のレベル）を保つようにしてください。
必ず次のJSON形式で出力してください。

JSONのキー:
- title : 内容によるこの会話のタイトル名
- summary: 会話全体の簡潔な要約（英語で）
- mistakes: 学習者が犯した文法的な間違い（オブジェクト配列形式、各要素は { "kanji": "漢字を含む文", "kana": "ひらがなの読み" }）
- corrections: mistakes に対応する訂正例（mistakes と同じ順序で対応、オブジェクト配列形式、各要素は { "kanji": "訂正後の文", "kana": "ひらがなの読み" }）
- goodPoints: 学習者がよくできている点（英語の文字列配列）
- difficultyLevel: 学習者の日本語レベル（N5, N4, N3, N2, N1 のいずれか）
- improvementPoints: 改善すべき点（英語の文字列配列）
- commonMistakes: 学習者が繰り返しやすい典型的な間違い（英語の文字列配列）
- sentenceUpgrades: 学習者の現在のレベル（difficultyLevel）を踏まえ、そこから一段階上の自然な表現を提示してください。さらにより良くするためのアドバイスも付けてください。
  （例: N5ならN4程度、N4ならN3程度、N3ならN2程度を目安にしてください）
  各要素は { "original": { "kanji": "...", "kana": "..." }, "upgraded": { "kanji": "...", "kana": "..." }, "advice": "..." } の形式で出力してください。
- topicDevelopment: 話題を広げる能力の評価（英語で、簡潔に）
- responseSkill: 相槌・反応スキルの評価（英語で、簡潔に）
- score (0-100): 学習者の会話の総合的なスコア（0-100の整数）
- difficultyReason: なぜその difficultyLevel と判定したのか、その具体的理由（英語で）

出力例:
{
  "title": "Chat title",
  "summary": "English summary here",
  "mistakes": [
    { "kanji": "映画見ました", "kana": "えいが みました" }
  ],
  "corrections": [
    { "kanji": "映画を見ました", "kana": "えいが を みました" }
  ],
  "goodPoints": ["Good point 1"],
  "difficultyLevel": "N4",
  "improvementPoints": ["Improvement point 1"],
  "commonMistakes": ["よくする間違い1"],
  "sentenceUpgrades":  [
    {
      "original": { "kanji": "映画見ました", "kana": "えいが みました" },
      "upgraded": { "kanji": "昨日久しぶりに友達と映画を見ました", "kana": "きのう ひさしぶりに ともだちと えいが を みました" },
      "advice": "Added context and time expressions to make the sentence more descriptive. You can also add extra details to enrich the sentence."
    },
    {
      "original": { "kanji": "私は寿司が好きじゃないです", "kana": "わたしは すし が すきじゃないです。" },
      "upgraded": { "kanji": "実は私は寿司が好きじゃないですが、今日の寿司は特別でした", "kana": "じつは わたしは すし が すきじゃないですが、きょうの すし は とくべつでした" },
      "advice": "Added contrast and extra detail to make the sentence more interesting and natural."
    }
  ],
  "topicDevelopment": "The learner can expand on basic topics but struggles with transitions.",
  "responseSkill": "The learner uses basic backchanneling but sometimes misses natural timing.",
  "score": 85,
  "difficultyReason": "Why the score is that score"
}

注意:
- mistakes, corrections, sentenceUpgrades は必ず { "kanji": "...", "kana": "..." } を含む形式で出力してください。
- sentenceUpgrades は飛躍的に難しい表現にせず、学習者が現実的にすぐ使えるレベルの自然な日本語にしてください。
- 出力は余計な説明を加えず、純粋なJSONのみ返してください。
- Only include sentences in "mistakes" and "corrections" if there is a grammatical or usage error.
- Sentences that are already correct, even if slightly informal or casual, should NOT appear in "mistakes" or "corrections".
- For "sentenceUpgrades", only suggest more advanced but realistic expressions, keeping the politeness style.
- "mistakes" と "corrections" には、文法や使い方の誤りがある文のみを含めること。
  自然で正しい文（カジュアルでも可）は含めないでください。
`;

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

    // if (process.env.NODE_ENV === "development") {
    //   const usage = completion.usage; // open ai usage
    //   const openaiCost = ((usage?.total_tokens ?? 0) / 1000) * 0.015;

    //   logUsage({
    //     timestamp: new Date().toISOString(),
    //     chatId,
    //     openai: {
    //       model: "gpt-4o-mini",
    //       prompt_tokens: usage?.prompt_tokens ?? 0,
    //       completion_tokens: usage?.completion_tokens ?? 0,
    //       total_tokens: usage?.total_tokens ?? 0,
    //       estimated_cost_usd: openaiCost,
    //     },
    //   });
    // }

    await increaseChatCount(decodedToken.userId);
    await storeAnalysisDB(chatId, parsed);
    await storeChatTitle(chatId, parsed.title);

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({ error: "Failed to summarize text" });
  }
}

export const increaseChatCount = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // trial ユーザーだけ増やす
  if (user.subscriptionStatus === "trialing") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        trialUsedChats: { increment: 1 }, // race condition 対策
      },
    });
  }
};

const storeAnalysisDB = async (chatId: number, analysisJson: any) => {
  // console.log(chatId, analysisJson);

  await prisma.analysis.create({
    data: {
      chatId,
      result: analysisJson, // JSONオブジェクトそのまま保存
    },
  });
};

const storeChatTitle = async (chatId: number, title: string) => {
  await prisma.chat.update({
    where: { id: chatId },
    data: { title }, // ← data の中に更新内容を入れる
  });
};
