import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
// import { logUsage } from "../../lib/loggingData/logger";
import { verifyAuth } from "../../middleware/middleware";
import { PrismaClient } from "@prisma/client";
import { MyJwtPayload } from "../../type/types";
import { wordAnalyzer } from "../../lib/chatAnalize";

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

  const { chatId, politeness } = req.body; // history later

  const history = [
    { role: "assistant", content: "こんにちは！今日はどこか行った？" },
    {
      role: "user",
      content: "うん、今日は山の公園へ行きました。天気がとてもきれいだった！",
    },
    { role: "assistant", content: "いいね〜。公園で何をしたの？" },
    {
      role: "user",
      content:
        "友達とピクニックをしたり、少しサッカーをしました。でも私はサッカー下手から、すぐ疲れた。",
    },
    { role: "assistant", content: "そうなんだ（笑）。お弁当は食べた？" },
    {
      role: "user",
      content:
        "はい、サンドイッチを作った。ちょっと塩っぱいでしたけど、美味しかった！サッカーは楽しかったよ。",
    },
    { role: "assistant", content: "手作りなんてすごい！どんなサンドイッチ？" },
    {
      role: "user",
      content: "たまごとハムのサンド。あとフルーツも持ってた、りんごとバナナ。",
    },
    { role: "assistant", content: "健康的だね！何時間くらい公園にいたの？" },
    {
      role: "user",
      content:
        "たぶん４時間ぐらい。でも帰りのバスが遅くて、家に着いたは７時くらい。",
    },
    { role: "assistant", content: "なるほど〜。いい一日だったね！" },
    {
      role: "user",
      content: "はい、とても楽しかったです。また来週も行きたい思います！",
    },
  ];

  const wordData = await wordAnalyzer(history);
  console.log(wordData);

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

    // const prompt = `あなたは日本語教師です。以下の会話を分析し、学習者にフィードバックを与えてください。
    // 会話は「${politeness}」な話し方で行われています。
    // 提示する corrections, sentenceUpgrades はこの politeness（話し方のレベル）を保つようにしてください。
    // 必ず次のJSON形式で出力してください。

    // JSONのキー:
    // - title : 内容によるこの会話のタイトル名
    // - summary: 会話全体の簡潔な要約（英語で）
    // - mistakes: 学習者が犯した文法的な間違い（オブジェクト配列形式、各要素は { "kanji": "漢字を含む文", "kana": "ひらがなの読み" }）
    // - corrections: mistakes に対応する訂正例（mistakes と同じ順序で対応、オブジェクト配列形式、各要素は { "kanji": "訂正後の文", "kana": "ひらがなの読み" }）
    // - goodPoints: 学習者がよくできている点（英語の文字列配列）
    // - difficultyLevel: 学習者の日本語レベル（N5, N4, N3, N2, N1 のいずれか）
    // - improvementPoints: 改善すべき点（英語の文字列配列）
    // - commonMistakes: 学習者が繰り返しやすい典型的な間違い（英語の文字列配列）
    // - sentenceUpgrades: 学習者の現在のレベル（difficultyLevel）を踏まえ、そこから一段階上の自然な表現を提示してください。さらにより良くするためのアドバイスも付けてください。
    //   （例: N5ならN4程度、N4ならN3程度、N3ならN2程度を目安にしてください）
    //   各要素は { "original": { "kanji": "...", "kana": "..." }, "upgraded": { "kanji": "...", "kana": "..." }, "advice": "..." } の形式で出力してください。
    // - topicDevelopment: 話題を広げる能力の評価（英語で、簡潔に）
    // - responseSkill: 相槌・反応スキルの評価（英語で、簡潔に）
    // - score (0-100): 学習者の会話の総合的なスコア（0-100の整数）
    // - difficultyReason: なぜその difficultyLevel と判定したのか、その具体的理由（英語で）

    // 出力例:
    // {
    //   "title": "Chat title",
    //   "summary": "English summary here",
    //   "mistakes": [
    //     { "kanji": "映画見ました", "kana": "えいが みました" }
    //   ],
    //   "corrections": [
    //     { "kanji": "映画を見ました", "kana": "えいが を みました" }
    //   ],
    //   "goodPoints": ["Good point 1"],
    //   "difficultyLevel": "N4",
    //   "improvementPoints": ["Improvement point 1"],
    //   "commonMistakes": ["よくする間違い1"],
    //   "sentenceUpgrades":  [
    //     {
    //       "original": { "kanji": "映画見ました", "kana": "えいが みました" },
    //       "upgraded": { "kanji": "昨日久しぶりに友達と映画を見ました", "kana": "きのう ひさしぶりに ともだちと えいが を みました" },
    //       "advice": "Added context and time expressions to make the sentence more descriptive. You can also add extra details to enrich the sentence."
    //     },
    //     {
    //       "original": { "kanji": "私は寿司が好きじゃないです", "kana": "わたしは すし が すきじゃないです。" },
    //       "upgraded": { "kanji": "実は私は寿司が好きじゃないですが、今日の寿司は特別でした", "kana": "じつは わたしは すし が すきじゃないですが、きょうの すし は とくべつでした" },
    //       "advice": "Added contrast and extra detail to make the sentence more interesting and natural."
    //     }
    //   ],
    //   "topicDevelopment": "The learner can expand on basic topics but struggles with transitions.",
    //   "responseSkill": "The learner uses basic backchanneling but sometimes misses natural timing.",
    //   "score": 85,
    //   "difficultyReason": "Why the score is that score"
    // }

    // 注意:
    // - mistakes, corrections, sentenceUpgrades は必ず { "kanji": "...", "kana": "..." } を含む形式で出力してください。
    // - sentenceUpgrades は飛躍的に難しい表現にせず、学習者が現実的にすぐ使えるレベルの自然な日本語にしてください。
    // - 出力は余計な説明を加えず、純粋なJSONのみ返してください。
    // - Only include sentences in "mistakes" and "corrections" if there is a grammatical or usage error.
    // - Sentences that are already correct, even if slightly informal or casual, should NOT appear in "mistakes" or "corrections".
    // - For "sentenceUpgrades", only suggest more advanced but realistic expressions, keeping the politeness style.
    // - "mistakes" と "corrections" には、文法や使い方の誤りがある文のみを含めること。
    //   自然で正しい文（カジュアルでも可）は含めないでください。
    // `;

    const prompt = `
    You are a Japanese teacher and conversation evaluator.
    Analyze the following learner conversation and return the analysis as a single valid JSON object.

    Instructions:
    - You MUST output ONLY one valid JSON object.
    - Do NOT include any explanations, text, comments, markdown, or backticks.
    - Do NOT wrap JSON inside any key like "result" or "data".
    - Output must be **machine-parseable JSON only**.
    - Maintain politeness level: "${politeness}"

    Schema:
    {
      "meta": {
        "title": "Conversation title (e.g., Casual Check-In)",
        "level": {
          label: "N5-N1",
          reason:
            "Learner can use past tense and descriptive expressions with fair accuracy, but sentence connectors and topic elaboration are limited. This corresponds to N4 ability, where learners can handle everyday topics with simple grammar.",
        },
        "conversationLength": {
          "totalWords": 0,
          "uniqueWords": 0
        }
      },
      "evaluation": {
        "summary": "Overall summary of the conversation in English",
        "responseSkill": {
          "overall": "Overall assessment of the learner's responses (English)",
          "conversationFlow": "Evaluation of the smoothness and naturalness of conversation (English)",
          "comprehension": "Evaluation of the learner's understanding (English)",
          "example": "Example of a notable interaction (English)"
        },
        "accuracy": {
          "grammarMistakes": 0,
          "examples": [
            {
              "original": "Incorrect learner sentence in Japanese",
              "correction": "Corrected sentence in Japanese",
              "note": "Why it was incorrect (English)"
            }
          ]
        },
      },
      "feedback": {
        "goodPoints": [
          "Strengths of the learner (English array)"
        ],
        "commonMistakes": [
          "Typical repeated errors (English array)"
        ],
        "corrections": [
          {
            "advice": "How to correct the mistake (English)",
            "before": "Incorrect sentence in Japanese",
            "after": "Corrected sentence in Japanese"
          }
        ],
        "sentenceUpgrades": [
          {
            "advice": "Advice to make expression more natural (English)",
            "original": { "kanji": "Original short/simple sentence", "kana": "かな読み" },
            "upgraded": { "kanji": "Improved, more natural sentence", "kana": "かな読み" }
          }
        ],
        "topicDevelopment": "Assessment of ability to expand conversation topics (English)",
        "improvementPoints": [
          "Suggestions to improve conversation skills (English array)"
        ]
      },
      "growth": {
        "milestone": "Current achievement level (English)",
        "currentAbility": "Description of current ability (English)",
        "nextLevelGoal": "Specific next goal for improvement (English)",
        "strengthEnhancement": [
          "Actions to enhance learner's strengths (English array)"
        ]
      }
    }

    Rules:
    - Japanese examples (original, correction, upgrade) must respect the politeness level.
    - Only include Japanese sentences with grammatical errors or unnatural expressions. Do not include correct sentences or stylistic variations.
    - Provide detailed, specific feedback, not vague comments.
    - All evaluations and explanations are in English except the Japanese learner sentences.
    - Japanese sentence corrections must preserve the indicated politeness (casual/formal).
    - vocabularySuggestions: include words the learner should learn or use more frequently.
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
    const createFallbackSummary = (raw: string) => ({
      meta: {
        title: "",
        level: { label: "", reason: "" },
        conversationLength: { totalWords: 0, uniqueWords: 0 },
      },
      evaluation: { summary: raw },
      feedback: {
        goodPoints: [],
        commonMistakes: [],
        corrections: [],
        sentenceUpgrades: [],
      },
      growth: {},
    });
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    let parsed;

    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (error) {
        parsed = createFallbackSummary(raw);
      }
    } else {
      parsed = createFallbackSummary(raw);
    }

    const chat = await storeChatTitle(chatId, parsed.title); // store new title
    const { level, theme, time } = chat;

    if (parsed.meta) {
      parsed.meta.selectedLevel = level;
      parsed.meta.selectedTopic = theme;
      parsed.meta.chatDuration = time;
    }

    if (parsed.evaluation) {
      const verbsArray = Array.isArray(wordData.verb) ? wordData.verb : [];
      const adjectivesArray = Array.isArray(wordData.adjective)
        ? wordData.adjective
        : [];
      const adverbsArray = Array.isArray(wordData.adverb)
        ? wordData.adverb
        : [];
      const conjunctionsArray = Array.isArray(wordData.conjunction)
        ? wordData.conjunction
        : [];
      const nounsArray = Array.isArray(wordData.noun) ? wordData.noun : [];

      const vocabularyAnalysis = {
        verbs: verbsArray.slice(0, 3),
        adjectives: adjectivesArray.slice(0, 3),
        adverbs: adverbsArray.slice(0, 3),
        conjunctions: conjunctionsArray.slice(0, 3),
        counts: {
          verb: verbsArray.length,
          adjective: adjectivesArray.length,
          adverb: adverbsArray.length,
          conjunction: conjunctionsArray.length,
          noun: nounsArray.length,
          total:
            verbsArray.length +
            adjectivesArray.length +
            adverbsArray.length +
            conjunctionsArray.length +
            nounsArray.length,
        },
      };
      parsed.evaluation.vocabularyAnalysis = vocabularyAnalysis;
      console.log(parsed, "--------------------------------------");
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
    // await storeChatTitle(chatId, parsed.title);

    return res.status(200).json(parsed);
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
  const chat = await prisma.chat.update({
    where: { id: chatId },
    data: { title }, // ← data の中に更新内容を入れる
  });

  return chat;
};
