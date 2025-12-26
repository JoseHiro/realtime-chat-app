import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { verifyAuth } from "../../middleware/middleware";
import { PrismaClient } from "@prisma/client";
import { MyJwtPayload } from "../../type/types";
import { wordAnalyzer } from "../../lib/chatAnalize";
import { logOpenAIEvent } from "../../lib/cost/logUsageEvent";
import { ApiType } from "../../lib/cost/constants";

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

  if (!chatId || !politeness) {
    return res.status(400).json({ error: "No data provided" });
  }

  console.log(chatId, politeness, history);

  try {
    // Fetch actual messages from database to get reading and english fields
    const dbMessages = await prisma.message.findMany({
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

    // Check actual database messages instead of history from request
    console.log("dbMessages", dbMessages);
    if (!dbMessages || dbMessages.length < 3) {
      return res
        .status(204)
        .json({ message: "Not enough conversation for summary" });
    }

    const wordData = await wordAnalyzer(dbMessages);

    // Use dbMessages to generate conversation text instead of history from request
    const conversationText = dbMessages
      .map(
        (msg) =>
          `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.message}`
      )
      .join("\n");

    // Generate conversation review with improvements (can be called separately via /api/chat/conversation-review)
    // For now, we'll generate it here but it can be moved to a separate endpoint call if needed
    let conversationReview = null;
    try {
      conversationReview = await generateConversationReview(
        dbMessages,
        politeness,
        decodedToken.userId,
        chatId
      );
    } catch (error) {
      console.error("Failed to generate conversation review:", error);
      // Continue without conversation review if it fails
    }

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
    - Japanese sentence corrections must preserve the indicated politeness (casual/formal).    `;

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

    // Log usage for summary generation
    if (completion.usage) {
      await logOpenAIEvent({
        userId: decodedToken.userId,
        chatId: chatId,
        apiType: ApiType.SUMMARY,
        model: "gpt-4o-mini",
        inputTokens: completion.usage.prompt_tokens || 0,
        outputTokens: completion.usage.completion_tokens || 0,
      });
    }

    const raw = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    let parsed;
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Failed to summarize text", details: error });
      }
    } else {
      return res.status(500).json({ error: "Failed to summarize text" });
    }

    if (!parsed) {
      return res
        .status(500)
        .json({ error: "Failed to parse summary response" });
    }

    const title = parsed.meta?.title || "Untitled Conversation";
    const chat = await storeChatTitle(chatId, title);
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
    }

    await increaseChatCount(decodedToken.userId);

    // Store analysis with conversation review included
    // Use "conversation" key to match frontend expectation
    const analysisWithReview = {
      ...parsed,
      conversation: conversationReview || undefined, // Include if generated, matches SummaryType.conversation
    };

    await storeAnalysisDB(chatId, analysisWithReview);

    // Return analysis with conversation review (can also be fetched separately via /api/chat/conversation-review)
    return res.status(200).json(analysisWithReview);
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
        trialUsedChats: { increment: 1 },
      },
    });
  }
};

const storeAnalysisDB = async (chatId: number, analysisJson: any) => {
  await prisma.analysis.create({
    data: {
      chatId,
      result: analysisJson,
    },
  });
};

const storeChatTitle = async (chatId: number, title: string) => {
  console.log("Updating chat title to:", title);
  const chat = await prisma.chat.update({
    where: { id: chatId },
    data: { title },
  });

  return chat;
};

/**
 * Generate conversation review with improvements for each user message
 * This creates a separate API call to analyze each user message and suggest improvements
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
    // Map messages to match the expected format
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      sender: msg.sender as "user" | "assistant",
      message: msg.message,
      reading: msg.reading || "",
      english: msg.english || "",
      createdAt: msg.createdAt.toISOString(),
    }));

    // Extract only user messages for improvement suggestions
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

    // Create prompt for generating improvements - only send user messages
    // We'll merge improvements with ALL messages from DB later (no duplication)
    const improvementPrompt = `You are a Japanese language teacher. Analyze the following USER messages and provide improvement suggestions.

CRITICAL RULES:
- Maintain politeness level: "${politeness}" (casual uses plain forms like だ/する, polite uses です・ます)
- Output ONLY valid JSON object, no explanations, markdown, code blocks, or backticks
- For EACH user message below, provide:
  1. grammarCorrect: boolean - true if the message is grammatically correct, false if there are grammar errors
  2. EXACTLY 3 improvement suggestions:
     - Improvements 1-2: Grammar/vocabulary improvements (more natural or advanced ways to express the same idea)
     - Improvement 3: Conversation development (show how to ask back or develop the conversation further)

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

For each improvement, provide:
- text: Improved Japanese sentence (with kanji)
- reading: Hiragana reading (ひらがな)
- english: English translation
- focus: Grammar point or improvement explanation (English, be specific)
- level: One of: "beginner", "beginner-intermediate", "intermediate", "intermediate-advanced", "advanced"

Full conversation context (for reference - note the assistant message before each user message):
${JSON.stringify(formattedMessages, null, 2)}

User messages to analyze:
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

Output format (JSON only - return ONLY user messages with improvements):
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
          "level": "<difficulty level>"
        },
        {
          "text": "<second grammar/vocabulary improvement>",
          "reading": "<hiragana>",
          "english": "<english>",
          "focus": "<grammar or vocabulary explanation>",
          "level": "<level>"
        },
        {
          "text": "<third improvement - respond to assistant's message (if they asked, answer first) then add a question to develop conversation>",
          "reading": "<hiragana>",
          "english": "<english>",
          "focus": "<explanation of how this responds to assistant and develops conversation with a question in English>",
          "level": "<level>"
        }
      ]
    }
  ]
}

IMPORTANT:
- Only return user messages with grammarCorrect flag and improvements
- Do not include assistant messages or duplicate message content
- Improvement 3 should show how to continue/develop the conversation (asking back, adding context, etc.)
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: improvementPrompt,
        },
      ],
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

            // Store improvements
            if (
              msg.improvements &&
              Array.isArray(msg.improvements) &&
              msg.improvements.length > 0
            ) {
              improvementsByMessageId[msg.id] = msg.improvements.slice(0, 3); // Ensure max 3
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

      return {
        conversationId: chatId,
        messages: mergedMessages, // All messages (user + assistant) with improvements merged
        metadata: {
          totalMessages: mergedMessages.length,
          userMessages: userMessages.length,
          improvementsGenerated: improvementsCount,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Failed to parse conversation review JSON:", error);
      // Fallback: return messages without improvements
      return {
        conversationId: chatId,
        messages: formattedMessages,
        metadata: {
          totalMessages: formattedMessages.length,
          userMessages: userMessages.length,
          improvementsGenerated: 0,
          generatedAt: new Date().toISOString(),
        },
      };
    }
  } catch (error) {
    console.error("Error generating conversation review:", error);
    // Fallback: return messages without improvements
    return {
      conversationId: chatId,
      messages: messages.map((msg) => ({
        id: msg.id,
        sender: msg.sender as "user" | "assistant",
        message: msg.message,
        reading: msg.reading || "",
        english: msg.english || "",
        createdAt: msg.createdAt.toISOString(),
      })),
      metadata: {
        totalMessages: messages.length,
        userMessages: messages.filter((m) => m.sender === "user").length,
        improvementsGenerated: 0,
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
