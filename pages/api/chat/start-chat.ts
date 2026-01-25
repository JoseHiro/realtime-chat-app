import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
// import { logUsage } from "../../../lib/loggingData/logger";
import { verifyAuth } from "../../../middleware/middleware";
import { PrismaClient } from "@prisma/client";
import { MyJwtPayload } from "../../../type/types";
import {
  getCharacterName,
  getVoiceConfig,
  getVoiceConfigByCharacter,
  getVoiceProvider,
  getElevenLabsVoiceId,
  type VoiceGender,
  type CharacterName,
} from "../../../lib/voice/voiceMapping";
import { logOpenAIEvent, logTTSEvent } from "../../../lib/cost/logUsageEvent";
import { ApiType, Provider } from "../../../lib/cost/constants";

const prisma = new PrismaClient();
const speechKey = process.env.AZURE_API_KEY || "";
const serviceRegion = process.env.AZURE_SERVICE_REGION;
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

  const { level, theme, politeness, characterName: requestedCharacterName, chatDuration, voiceGender } = req.body;
  if (!level || !theme) {
    return res.status(400).json({ error: "Text is required" });
  }

  // Get character name - either from characterName or fallback to voiceGender (for backward compatibility)
  let characterName: CharacterName;
  if (requestedCharacterName && ["Sakura", "Ken", "Chica", "Haruki", "Aiko", "Ryo"].includes(requestedCharacterName)) {
    characterName = requestedCharacterName as CharacterName;
  } else {
    // Fallback to legacy voiceGender mapping
    const gender: VoiceGender = voiceGender || "female";
    characterName = getCharacterName(gender);
  }

  const voiceConfig = getVoiceConfigByCharacter(characterName);
  const chatVoiceProvider = getVoiceProvider(characterName);

  // Get time from request (default: 3 minutes)
  const time = chatDuration || 3;

  const prompt = `あなたは日本語会話の練習相手です。あなたの名前は${characterName}です。
以下の条件で会話を始めてください。
- 学習者のレベル: ${level}
- テーマ: ${theme}
- 会話の丁寧さ ${politeness}
- 最初の発話はシンプルで自然な質問にしてください。
- 会話は一文から始め、相手が答えやすいようにしましょう。
- 自分の名前は${characterName}であることを覚えておいてください。名前を聞かれたら「${characterName}です」または「${characterName}と言います」と自然に答えてください。

レベル別の制約:
- 初級: 語彙は日常的な単語だけを使用し、文は短く。
- 中級: 語彙は日常的＋少し抽象的な単語を使用し、文はやや長く。
- 上級: 難しい語彙や敬語も含め、複雑な構文を使ってもよい。

会話スタイルの指定:
- "casual" の場合: 「〜だ」「〜する」などカジュアルな口調を使い、「です・ます調」は使わない。
- "polite" の場合: 「〜です」「〜ます」などの丁寧語を使う。

必ずレベルの条件を反映してください。
`;

  try {
    // initiate chat
    const chat = await prisma.chat.create({
      data: {
        userId: decodedToken.userId,
        title: "Free chat",
        theme: theme,
        politeness: politeness,
        level: level,
        characterName: characterName,
        time: time,
        voiceProvider: chatVoiceProvider,
      },
    });

    if (!chat) {
      return res.status(400).json({ error: "Failed to created chat" });
    }

    // For Realtime API, we skip TTS generation and initial message
    // The Realtime API will handle all audio and messages
    // Just return the chat ID so the frontend can start the Realtime session

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      chatId: chat.id,
      characterName: characterName,
      level: level,
      theme: theme,
      politeness: politeness,
      time: time,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "Failed to generate conversation" });
  }
}

// Add reading japanese since some might have kanji
const addReading = async (text: string, userId?: string, chatId?: number) => {
  const prompt = `以下の日本語を処理してください。出力フォーマットは必ずJSONで次の形にしてください:
{
  "reading": "ひらがなのみで表記",
  "english": "英訳"
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text },
    ],
  });

  // Log OpenAI usage for reading/translation
  if (completion.usage && userId && chatId) {
    await logOpenAIEvent({
      userId,
      chatId,
      apiType: ApiType.READING_TRANSLATION,
      model: "gpt-4o-mini",
      inputTokens: completion.usage.prompt_tokens || 0,
      outputTokens: completion.usage.completion_tokens || 0,
    });
  }

  const result = completion.choices[0]?.message?.content ?? "";

  try {
    const parsed = JSON.parse(result);
    return {
      reading: parsed.reading ?? "",
      english: parsed.english ?? "",
    };
  } catch {
    return { reading: "", english: "" }; // JSONパース失敗時のフォールバック
  }
};
