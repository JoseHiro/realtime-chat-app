import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { verifyAuth } from "../../../middleware/middleware";
import { PrismaClient } from "@prisma/client";
import { MyJwtPayload } from "../../../type/types";
import { logOpenAIEvent } from "../../../lib/cost/logUsageEvent";
import { ApiType } from "../../../lib/cost/constants";
import { classifyImprovement } from "../../../lib/improvements/classifyImprovement";

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

  const { chatId, politeness } = req.body;

  if (!chatId || !politeness) {
    return res
      .status(400)
      .json({ error: "chatId and politeness are required" });
  }

  try {
    // Verify chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: decodedToken.userId,
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Fetch all messages from database
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        sender: true,
        message: true,
        reading: true,
        english: true,
        createdAt: true,
      },
    });

    if (messages.length < 2) {
      return res.status(400).json({
        error: "Not enough messages to generate conversation review",
      });
    }

    // Generate conversation review
    const conversationReview = await generateConversationReview(
      messages,
      politeness,
      decodedToken.userId,
      chatId
    );

    return res.status(200).json(conversationReview);
  } catch (error) {
    console.error("Conversation review generation error:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate conversation review" });
  }
}

/**
 * Generate conversation review with improvements for each user message
 * Returns data in the format matching mockConversationFeedbackData.json
 */
async function generateConversationReview(
  messages: Array<{
    id: number;
    sender: string;
    message: string;
    reading: string | null;
    english: string | null;
    createdAt: Date;
  }>,
  politeness: string,
  userId: string,
  chatId: number
) {
  try {
    // Format messages for the prompt
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      sender: msg.sender as "user" | "assistant",
      message: msg.message,
      reading: msg.reading || "",
      english: msg.english || "",
      createdAt: msg.createdAt.toISOString(),
    }));

    const userMessages = formattedMessages.filter(
      (msg) => msg.sender === "user"
    );

    if (userMessages.length === 0) {
      return {
        conversationId: chatId,
        messages: formattedMessages,
        metadata: {
          totalMessages: formattedMessages.length,
          userMessages: 0,
          improvementsGenerated: 0,
          generatedAt: new Date().toISOString(),
        },
      };
    }

    // Create focused prompt - only send user messages for improvements
    // We'll merge improvements back with all messages later to avoid duplication
    const improvementPrompt = `You are a Japanese language teacher. Analyze and provide improvement suggestions for the following USER messages from a conversation.

CRITICAL RULES:
- Maintain politeness level: "${politeness}" (casual uses plain forms like だ/する, polite uses です・ます)
- Output ONLY valid JSON object, no explanations, markdown, code blocks, or backticks
- For EACH user message below, provide:
  1. grammarCorrect: true if grammatically correct, false if there are grammar errors
  2. EXACTLY 3 improvement suggestions

For improvements 1-2: Focus on grammar or vocabulary improvements (more natural or advanced ways to express the same idea)
For improvement 3: Focus on conversation development - show how to ask back or develop the conversation further

For each improvement, provide:
- text: Improved Japanese sentence (with kanji)
- reading: Hiragana reading (ひらがな)
- english: English translation
- focus: Grammar point or improvement explanation (English, be specific)
- level: One of: "beginner", "beginner-intermediate", "intermediate", "intermediate-advanced", "advanced"
- type: Classification category (REQUIRED, choose ONE from the following):
  * "complete_sentence" - For incomplete sentences, fragments, or sentence structure issues
  * "particle_usage" - For particle (を, が, は, に, で, etc.) mistakes or improvements
  * "listing_and_conjunctions" - For listing items (や, そして) or connecting sentences
  * "politeness_and_register" - For politeness level (です・ます vs plain form) or formality
  * "opinion_expression" - For expressing opinions (と思います, と感じる, etc.)
  * "conversation_expansion" - For developing conversation, asking follow-up questions (IMPROVEMENT 3 ONLY)
  * "verb_forms" - For verb conjugation, て-form, た-form, potential, causative, passive
  * "conditional_expressions" - For conditional forms (ば, たら, なら, と)
  * "honorifics" - For keigo (尊敬語, 謙譲語)
  * "vocabulary_choice" - For better word choice or more natural vocabulary
  * "sentence_structure" - For word order, complex sentences, or general syntax

IMPORTANT for Improvement 3 - Conversation Development:
- MUST ALWAYS include a QUESTION to develop/continue the conversation
- Should RESPOND APPROPRIATELY to what the assistant said first, THEN add a question
- If assistant asked a question: MUST respond to that question FIRST, THEN add a new question to develop the conversation further
- If assistant made a statement/comment: Should acknowledge/respond to it, THEN add a question to continue the conversation
- The goal is to show how to engage naturally in dialogue by both responding appropriately AND asking questions to keep the conversation going
- Examples:
  * If assistant asks "きょうはなにしたの？" and user replied "よかったよ", the 3rd improvement should be: "今日はたいへんだったよ。あなたはどうでした？" (responding to assistant's question + asking back)
  * If assistant says "今日はいい天気ですね", user could respond: "そうですね。散歩するのにいい日ですね。どこかおすすめの場所はありますか？" (acknowledging statement + asking question)
  * The improvement should always end with a question mark (？) to develop the conversation

Full conversation context (for reference - note the assistant message before each user message):
${JSON.stringify(formattedMessages, null, 2)}

User messages to analyze (with previous assistant message context):
${JSON.stringify(
  formattedMessages
    .map((msg, idx) => {
      // Include previous assistant message for context on how to develop conversation
      const prevMsg = idx > 0 ? formattedMessages[idx - 1] : null;
      if (msg.sender === "user") {
        return {
          id: msg.id,
          message: msg.message,
          reading: msg.reading,
          english: msg.english,
          previousAssistantMessage:
            prevMsg && prevMsg.sender === "assistant"
              ? {
                  message: prevMsg.message,
                  english: prevMsg.english,
                }
              : null,
        };
      }
      return null;
    })
    .filter((msg): msg is NonNullable<typeof msg> => msg !== null),
  null,
  2
)}

Output format (JSON only):
{
  "messages": [
    {
      "id": <user message id>,
      "grammarCorrect": <true if grammatically correct, false if has errors>,
      "improvements": [
        {
          "text": "<grammar/vocabulary improvement with kanji>",
          "reading": "<hiragana reading>",
          "english": "<english translation>",
          "focus": "<grammar or vocabulary explanation in English>",
          "level": "<difficulty level>",
          "type": "<classification category - see list above>"
        },
        {
          "text": "<second grammar/vocabulary improvement>",
          "reading": "<hiragana>",
          "english": "<english>",
          "focus": "<grammar or vocabulary explanation>",
          "level": "<level>",
          "type": "<classification category>"
        },
        {
          "text": "<third improvement - respond to assistant's message (if they asked, answer first) then add a question to develop conversation>",
          "reading": "<hiragana>",
          "english": "<english>",
          "focus": "<explanation of how this responds to assistant and develops conversation with a question in English>",
          "level": "<level>",
          "type": "conversation_expansion"
        }
      ]
    }
  ]
}

IMPORTANT:
- Only return user messages with grammarCorrect flag and improvements
- Do not include assistant messages or duplicate message content
- Improvement 3 should show how to continue/develop the conversation (asking back, adding context, etc.)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: improvementPrompt,
        },
      ],
      temperature: 0.7, // Slightly higher for more varied improvements
    });

    // Log usage for conversation review generation
    if (completion.usage) {
      await logOpenAIEvent({
        userId,
        chatId,
        apiType: ApiType.SUMMARY,
        model: "gpt-4o-mini",
        inputTokens: completion.usage.prompt_tokens || 0,
        outputTokens: completion.usage.completion_tokens || 0,
      });
    }

    const raw = completion.choices[0]?.message?.content ?? "";

    // Extract JSON from response (handle markdown code blocks if present)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    let parsed;

    try {
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(raw);

      // Extract improvements and grammarCorrect from AI response
      const improvementsByMessageId: Record<number, any[]> = {};
      const grammarCorrectByMessageId: Record<number, boolean> = {};

      if (parsed.messages && Array.isArray(parsed.messages)) {
        parsed.messages.forEach((msg: any) => {
          if (msg.id) {
            // Store grammar correctness flag
            if (typeof msg.grammarCorrect === "boolean") {
              grammarCorrectByMessageId[msg.id] = msg.grammarCorrect;
            } else {
              // Default to true if not specified
              grammarCorrectByMessageId[msg.id] = true;
            }

            // Store improvements and apply fallback classification if needed
            if (
              msg.improvements &&
              Array.isArray(msg.improvements) &&
              msg.improvements.length > 0
            ) {
              // Apply fallback classification for improvements missing type
              const classifiedImprovements = msg.improvements.slice(0, 3).map((improvement: any) => {
                // If AI didn't provide type, use fallback classification
                if (!improvement.type && improvement.focus) {
                  const classifiedType = classifyImprovement(improvement.focus);
                  return {
                    ...improvement,
                    type: classifiedType, // Will be undefined if no match, which is fine
                  };
                }
                return improvement;
              });
              improvementsByMessageId[msg.id] = classifiedImprovements;
            }
          }
        });
      }

      // Merge improvements and grammarCorrect with ALL messages from database (user + assistant)
      // This avoids duplicating message data - messages come from DB, only improvements from AI
      const mergedMessages = formattedMessages.map((msg) => {
        if (msg.sender === "user") {
          // Add improvements and grammarCorrect to user messages (message data from DB, analysis from AI)
          const result: any = {
            ...msg,
          };

          // Add grammar correctness (default to true if not analyzed)
          result.grammarCorrect = grammarCorrectByMessageId[msg.id] ?? true;

          // Add improvements if available
          if (improvementsByMessageId[msg.id]) {
            result.improvements = improvementsByMessageId[msg.id];
          }

          return result;
        }
        // Assistant messages - return as-is from database (no improvements, no duplication)
        return msg;
      });

      // Calculate metadata
      const improvementsCount = Object.values(improvementsByMessageId).reduce(
        (sum, improvements) => sum + (improvements?.length || 0),
        0
      );

      const result = {
        conversationId: chatId,
        messages: mergedMessages, // All messages (user + assistant) with improvements merged
        metadata: {
          totalMessages: mergedMessages.length,
          userMessages: userMessages.length,
          improvementsGenerated: improvementsCount,
          generatedAt: new Date().toISOString(),
        },
      };

      return result;
    } catch (error) {
      console.error("Failed to parse conversation review JSON:", error);
      console.error("Raw response:", raw.substring(0, 500));
      throw new Error("Failed to parse AI response as JSON");
    }
  } catch (error: any) {
    console.error("Error generating conversation review:", error);
    throw error;
  }
}
