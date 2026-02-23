// Save message from Realtime API to database
import type { NextApiRequest, NextApiResponse } from "next";
import { saveMessage } from "../../../lib/message/messageService";
import { verifyAuth } from "../../../middleware/auth";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

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
    const { chatId, sender, message, reading, english } = req.body;

    if (!chatId || !sender || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate reading and english for assistant messages if not provided
    let finalReading = reading;
    let finalEnglish = english;

    if (sender === "assistant" && (!reading || !english)) {
      try {
        const { reading: genReading, english: genEnglish } =
          await addReadingAndEnglish(message, decodedToken.userId, chatId);
        finalReading = genReading;
        finalEnglish = genEnglish;
      } catch (error) {
        console.error("Failed to generate reading/english:", error);
        // Continue without reading/english
      }
    }

    // Save message to database
    const savedMessage = await saveMessage(
      chatId,
      sender,
      message,
      finalReading,
      finalEnglish
    );

    res.status(200).json({
      success: true,
      messageId: savedMessage.id,
      reading: finalReading,
      english: finalEnglish,
    });
  } catch (error: any) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: error.message || "Failed to save message" });
  }
}

// Helper function to generate reading and english translation
export async function addReadingAndEnglish(
  text: string,
  userId: string,
  chatId: number
) {
  const prompt = `以下の日本語を処理してください。出力フォーマットは必ずJSONで次の形にしてください:
{
  "reading": "ひらがなのみで表記",
  "english": "英訳"
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text },
    ],
  });

  const result = completion.choices[0]?.message?.content ?? "";

  try {
    const parsed = JSON.parse(result);
    return {
      reading: parsed.reading ?? "",
      english: parsed.english ?? "",
    };
  } catch {
    return { reading: "", english: "" };
  }
}
