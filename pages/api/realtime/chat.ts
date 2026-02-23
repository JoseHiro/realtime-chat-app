// Realtime chat API using Server-Sent Events (SSE) for streaming responses
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import { saveMessage } from "../../../lib/message/messageService";
import { PrismaClient } from "@prisma/client";
import {
  getAzureVoiceGender,
  getAzureVoiceName,
  getVoiceProvider,
  getElevenLabsVoiceId,
  type CharacterName,
} from "../../../lib/voice/voiceMapping";
import { logOpenAIEvent, logTTSEvent } from "../../../lib/cost/logUsageEvent";
import { ApiType, Provider } from "../../../lib/cost/constants";
import { verifyAuth } from "../../../middleware/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify authentication
  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);
  if (
    !decodedToken ||
    typeof decodedToken === "string" ||
    !("userId" in decodedToken)
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const {
      messages,
      politeness,
      level,
      checkGrammarMode,
      chatId,
      characterName: requestedCharacter,
    } = req.body;

    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Helper function to send SSE events
    const sendEvent = (event: string, data: any) => {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      res.write(message);
      // Force flush in Node.js
      if (typeof (res as any).flush === "function") {
        (res as any).flush();
      }
    };

    let chat;
    let characterName: CharacterName = requestedCharacter || "Sakura";

    if (chatId) {
      // Fetch chat to get character name and userId
      chat = await prisma.chat.findUnique({
        where: { id: chatId },
        select: { characterName: true, userId: true },
      });

      if (!chat) {
        sendEvent("error", { message: "Chat not found" });
        res.end();
        return;
      }

      characterName = (chat.characterName as CharacterName) || "Sakura";
    } else {
      // For test page without chatId, use default values
      chat = { userId: decodedToken.userId, characterName: characterName };
    }

    // Save user message if chatId exists
    if (chatId && messages && messages.length > 0) {
      await saveMessage(chatId, "user", messages[messages.length - 1].content);
    }

    const formality =
      politeness === "casual"
        ? "話し方はカジュアルで、です・ます調は使わない。"
        : "話し方は丁寧で、です・ます調を使う。";

    const fixGrammar = checkGrammarMode
      ? "- あなたは学習者の発話に文法の誤りがあれば、友達のように自然に訂正して正しい文を提示してください。訂正後も会話は自然に続けてください。"
      : "";

    const systemMessage = {
      role: "system",
      content: `
        あなたは日本語会話の練習相手です。あなたの名前は${characterName}です。
        - 学習者の日本語レベル: ${level || "N3"}
        - 丁寧さ: ${politeness || "polite"}
        - 返答は短めで1〜2文で自然に。
        - 会話が続くようにオープンエンドの質問を入れる。
        - これまでの会話の文脈を踏まえて回答する。
        - 自分の名前は${characterName}であることを覚えておいてください。会話の中で名前自然に教えてあげてください。
        - ${formality}
        ${fixGrammar}
      `,
    };

    const messagesWithInstruction = [systemMessage, ...(messages || [])];

    // Send start event
    sendEvent("start", { message: "Generating response..." });

    // Use OpenAI streaming API
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messagesWithInstruction,
      stream: true,
    });

    let fullResponse = "";
    let inputTokens = 0;
    let outputTokens = 0;

    // Stream the response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        sendEvent("chunk", { content });
      }

      // Track token usage
      if (chunk.usage) {
        inputTokens = chunk.usage.prompt_tokens || 0;
        outputTokens = chunk.usage.completion_tokens || 0;
      }
    }

    // Log OpenAI usage
    if (chatId) {
      await logOpenAIEvent({
        userId: chat.userId,
        chatId: chatId,
        apiType: ApiType.CHAT,
        model: "gpt-4o-mini",
        inputTokens: inputTokens || messagesWithInstruction.length * 10, // Estimate if not provided
        outputTokens: outputTokens || fullResponse.length / 4, // Estimate if not provided
        messageCount: messages.length,
      });
    }

    // Save assistant message if chatId exists
    if (chatId && fullResponse) {
      await saveMessage(chatId, "assistant", fullResponse);
    }

    // Send completion event with full response
    sendEvent("complete", {
      message: fullResponse,
      chatId: chatId || null,
    });

    res.end();
  } catch (error: any) {
    console.error("Realtime chat error:", error);
    res.write(`event: error\n`);
    res.write(
      `data: ${JSON.stringify({
        message: error.message || "An error occurred",
      })}\n\n`
    );
    res.end();
  }
}
