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

  const { chatId, politeness, history } = req.body;

  // console.log(history);

  const wordData = await wordAnalyzer(history);
  // console.log(wordData);

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

    const prompt = `
    You are a Japanese teacher and conversation evaluator.
    Analyze the following learner conversation and return the analysis as a single valid JSON object.

    Instructions:
    - You MUST output ONLY one valid JSON object.
    - Do NOT include any explanations, text, comments, markdown, or backticks.
    - Do NOT wrap JSON inside any key like "result" or "data".
    - Output must be **machine-parseable JSON only**.
    - Maintain politeness level: "${politeness}"

    JSONのキー:
    - title : title name based on the content
    - level : { label: Choose exactly one JLPT level from N5, N4, N3, N2, N1 that best represents the user's Japanese ability, reason: detailed reason in English }

    Output Example:
    {
      "meta": {
        "title": "Chat title",
        "level": {
          "label": "Between N5-N1",
          "reason": "Detailed reason explaining why this level was assigned (English)",
        },
        "summary": "Overall summary of the conversation in English",
      },
      "analysis": {
        "overview": "Performance assessment summary",
        "skills": {
          "flow": "Evaluation of the smoothness and naturalness of conversation (English)",
          "comprehension": "Evaluation of the learner's understanding (English)",
          "development": "Assessment of ability to expand conversation topics (English)",
          "example": "Example of a notable interaction (English)",
        },
      },
      "feedback": {
        "strengths": [
          "Strengths of the learner (English array)"
        ],
        "improvements": [
          "Suggestions to improve conversation skills (English array)"
        ]
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
        "enhancements": [
          {
            "advice": "Advice to make expression more natural (English)",
            "original": { "kanji": "Original short/simple sentence", "kana": "かな読み" },
            "upgraded": { "kanji": "Improved, more natural sentence", "kana": "かな読み" }
          }
        ],
      },
      "milestone": {
        "current": {
          "milestone": "Current achievement level (English)",
          "ability": "Description of current ability (English)",
        },
        "next": {
        "goal": "Specific next goal for improvement (English)",
        "steps": [
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
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    let parsed;
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to summarize text", details: error });
      }
    } else {
      res.status(500).json({ error: "Failed to summarize text" });
    }

    console.log(parsed, "=================parsed summary==================");

    const title = parsed.meta?.title || "Untitled Conversation";
    const chat = await storeChatTitle(chatId, title); // store new title
    const { level, theme, time } = chat;

    if (parsed.meta) {
      parsed.meta.selectedLevel = level;
      parsed.meta.selectedTopic = theme;
      parsed.meta.chatDuration = time;
    }

    if (parsed.analysis) {
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
      // const nounsArray = Array.isArray(wordData.noun) ? wordData.noun : [];

      const vocabularyAnalysis = {
        verbs: verbsArray.slice(0, 4),
        adjectives: adjectivesArray.slice(0, 4),
        adverbs: adverbsArray.slice(0, 4),
        conjunctions: conjunctionsArray.slice(0, 4),
      };
      parsed.analysis.vocabulary = vocabularyAnalysis;
      console.log(parsed, "--------------------------------------");
    }

    await increaseChatCount(decodedToken.userId);
    await storeAnalysisDB(chatId, parsed);
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
  console.log("Updating chat title to:", title);
  const chat = await prisma.chat.update({
    where: { id: chatId },
    data: { title }, // ← data の中に更新内容を入れる
  });

  return chat;
};

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
