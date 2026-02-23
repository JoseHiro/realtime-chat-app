import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { verifyAuth } from "../../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { MyJwtPayload } from "../../types/types";
import { wordAnalyzer } from "../../lib/chatAnalyze";
import { logOpenAIEvent } from "../../lib/cost/logUsageEvent";
import { ApiType } from "../../lib/cost/constants";
import { deductCreditsForChat } from "../../lib/credits/creditService";
import {
  getVoiceProvider,
  type CharacterName,
} from "../../lib/voice/voiceMapping";
import { classifyImprovement } from "../../lib/improvements/classifyImprovement";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Configure API route timeout (Vercel allows up to 60s for Pro, 10s for Hobby)
// For longer operations, consider using background jobs or streaming
export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "10mb",
    },
    // Note: maxDuration is set via route segment config in Next.js 13+
    // For Vercel: Hobby plan = 10s, Pro = 60s, Enterprise = 300s
  },
};

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

  // Ensure chatId is a number
  const chatIdNumber =
    typeof chatId === "string" ? parseInt(chatId, 10) : chatId;
  if (isNaN(chatIdNumber)) {
    return res.status(400).json({ error: "Invalid chatId" });
  }

  console.log(
    `[Summary] Starting generation for chatId: ${chatIdNumber}, politeness: ${politeness}`
  );

  // Set a longer timeout for the response (if supported by platform)
  // Note: This doesn't work on Vercel serverless - use route segment config instead
  res.setTimeout(300000); // 5 minutes (may not work on all platforms)

  try {
    // Fetch actual messages from database to get reading and english fields
    const dbMessages = await prisma.message.findMany({
      where: { chatId: chatIdNumber },
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
    console.log(
      `[Summary] Found ${
        dbMessages?.length || 0
      } messages for chatId ${chatIdNumber}`
    );
    if (!dbMessages || dbMessages.length < 3) {
      console.log(
        `[Summary] Not enough messages: ${dbMessages?.length || 0} < 3`
      );
      return res
        .status(204)
        .json({ message: "Not enough conversation for summary" });
    }

    // Transform dbMessages to match wordAnalyzer's expected format (role/content)
    const messagesForAnalysis = dbMessages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.message,
    }));

    let wordData: any = {};
    try {
      console.log("[Summary] Starting vocabulary analysis...");
      wordData = await wordAnalyzer(messagesForAnalysis);
      console.log("[Summary] Vocabulary analysis completed");
    } catch (error) {
      console.error("[Summary] Error analyzing vocabulary:", error);
      // Continue with empty vocabulary if analysis fails
      wordData = {};
    }

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
      console.log("[Summary] Starting conversation review generation...");
      // Add timeout wrapper for conversation review generation
      const reviewPromise = generateConversationReview(
        dbMessages,
        politeness,
        decodedToken.userId,
        chatIdNumber
      );

      // Set a timeout of 45 seconds for conversation review (to leave time for main summary)
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(new Error("Conversation review timeout after 45 seconds")),
          45000
        )
      );

      conversationReview = await Promise.race([reviewPromise, timeoutPromise]);
      console.log("[Summary] Conversation review generated successfully");
    } catch (error) {
      console.error("[Summary] Failed to generate conversation review:", error);
      console.error(
        "[Summary] Error details:",
        error instanceof Error ? error.message : String(error)
      );
      // Continue without conversation review if it fails - this is not critical
      conversationReview = null;
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
    - title : title name based on the content (in English)
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
        "overview": "Comprehensive performance assessment analyzing vocabulary richness, grammar variety, conversation development, sentence complexity, and linguistic elements (English, 4-6 sentences)",
      },
      "feedback": {
        "strengths": [
          "Detailed strength with explanation, reasons, and examples from the conversation (English array - include as 1-3different strengths as genuinely observed in the conversation)"
        ],
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
    - Japanese sentence corrections must preserve the indicated politeness (casual/formal).

    IMPORTANT - Overview Format (analysis.overview):
    The "overview" field should be a comprehensive, BALANCED performance assessment that evaluates the learner's linguistic and conversational performance. This is DIFFERENT from "summary" (in meta.summary), which describes what the conversation was about. The "overview" should analyze HOW the learner performed.

    CRITICAL: The overview MUST be BALANCED - include BOTH strengths (what the learner did well) AND areas for improvement (what could be better). Do NOT focus only on negatives or only on positives. A balanced assessment acknowledges both what the learner is doing well and what they can improve.

    The overview must evaluate the following aspects in a cohesive 4-6 sentence assessment, ensuring balance:
    1. Vocabulary richness: How diverse and varied was the vocabulary usage? Did the learner use varied words or repeat the same terms? Did the user use advanced vocabulary? (Acknowledge both strengths and limitations)
    2. Grammar variety: Did the learner use multiple grammatical structures or repeat the same sentence patterns/structures? (Highlight what structures were used well AND what could be expanded)
    3. Conversation development: Did the learner actively develop the conversation (asking questions, introducing topics, elaborating) or wait passively for the assistant to lead? (Recognize active participation AND suggest ways to engage more)
    4. Sentence complexity: What was the typical sentence length (short/simple vs longer/complex sentences)? (Note appropriate complexity where present AND opportunities for more sophisticated structures)
    5. Linguistic elements: How was the usage of conjunctions (そして、でも、しかし、etc.) and particles (は、が、を、に、で、etc.)? (Acknowledge correct usage AND areas where usage could be enhanced)
    6. Politeness consistency: Did the learner consistently use the selected politeness level (${politeness}) throughout the conversation? (Note consistency where present AND any inconsistencies)

    Example format (BALANCED):
    "The learner demonstrated [vocabulary assessment: acknowledge both strengths like 'used appropriate technical terms' AND areas for growth like 'could expand vocabulary range']. [Grammar variety: recognize structures used well AND suggest expansion]. In terms of conversation flow, [development: highlight active participation AND suggest further engagement techniques]. Sentences were generally [complexity: note appropriate complexity where present AND opportunities for more sophisticated structures], and the learner [conjunction/particle usage: acknowledge correct usage AND suggest enhancements]. Throughout the conversation, [politeness consistency: note consistency AND any areas for improvement]."

    BALANCE REQUIREMENTS:
    - If you mention a limitation, also mention a corresponding strength
    - If you highlight a strength, also note an area for growth
    - Use phrases like "while... could also..." or "demonstrated... though could enhance..." to create balance
    - Avoid all-negative or all-positive assessments
    - Provide specific, observable examples for both strengths and areas for improvement (e.g., "used particles like を and に correctly, though could incorporate more complex particles like によって" or "tended to use short sentences averaging 5-7 words, which were clear and appropriate, though could experiment with longer, more complex structures")

    IMPORTANT - Strengths Format:
    - CRITICAL: Strengths must focus ONLY on JAPANESE LANGUAGE SKILLS and CONVERSATION ABILITY, NOT on topic knowledge, domain expertise, or understanding of the subject matter.
    - DO NOT evaluate: understanding of topics, critical thinking about subjects, domain knowledge, or content expertise.
    - DO evaluate: Japanese vocabulary usage, grammar accuracy, sentence structure, conversation skills, linguistic elements (particles, conjunctions), politeness usage, question formation, dialogue development, sentence complexity, etc.

    - Identify and list the learner's strengths based on what is ACTUALLY observed in the conversation. The number of strengths should reflect the learner's actual performance - do NOT force a specific number.
    - Include as many different strengths as are genuinely present (could be 1, 2, 3, or more, depending on what the learner demonstrated).
    - Each strength must be a detailed explanation (2-3 sentences) that includes:
      1. What the LANGUAGE/CONVERSATION strength is (e.g., "The student demonstrated effective use of question particles" or "The student showed good conversational engagement through follow-up questions")
      2. Why it demonstrates LANGUAGE skill - explain the reasoning behind why this is a linguistic/conversational strength (e.g., "by using appropriate question particles like か and の, which shows understanding of Japanese question formation" or "by asking follow-up questions using natural Japanese structures, which demonstrates active conversation participation")
      3. Where it was observed - provide specific examples from the conversation showing the JAPANESE LANGUAGE usage (e.g., "For example, the student asked '日本で個人アプリを開発してそれだけ食べていけるぐらいの開発をした人はいる？' which demonstrates correct use of complex sentence structure with relative clauses and appropriate question formation")
    - Do NOT use simple bullet points like "Engagement in conversation" or "Ability to ask questions"
    - Instead, provide full explanatory sentences that clearly state what LANGUAGE skill, why it's a linguistic strength, and where it was observed: "The student demonstrated strong conversational engagement in Japanese by asking follow-up questions using natural sentence structures, which helped develop the dialogue naturally. For example, when discussing topics, the student actively participated by asking 'どうですか？' using appropriate question formation, showing ability to maintain conversation flow in Japanese."
    - Always include reasons (why it's a LANGUAGE strength) and specific references to the JAPANESE LANGUAGE used in the conversation (what Japanese structures, vocabulary, or conversation techniques the student demonstrated).
    - Focus on observable LANGUAGE behaviors and their positive impact on the Japanese conversation.
    - Each strength should be DIFFERENT from the others - identify various aspects of the learner's JAPANESE LANGUAGE performance (e.g., conversation engagement in Japanese, grammar accuracy, vocabulary variety, particle usage, sentence complexity, politeness consistency, question formation, etc.).
    - Quality over quantity: It's better to have fewer genuine, well-explained LANGUAGE strengths than to force multiple strengths that are not clearly demonstrated in the conversation.

    Examples of CORRECT strengths (focus on language structures used in follow-up questions):
    - "The student demonstrated effective use of complex sentence structures when asking follow-up questions by combining multiple clauses with relative clauses, as seen in '日本で個人アプリを開発してそれだけ食べていけるぐらいの開発をした人はいる？' which shows mastery of Japanese relative clause formation (連体修飾) and appropriate question particle usage (か)."
    - "The learner showed good conversational engagement in Japanese by asking follow-up questions using natural Japanese structures like 'どうですか？', demonstrating ability to use appropriate question formation patterns and maintain dialogue flow through proper use of question particles."
    - "The student effectively used follow-up questions to develop the conversation, demonstrating strong Japanese language skills through the use of appropriate question structures. For example, when asking 'それだけ食べていけるぐらいの開発をした人はいる？', the student correctly used the relative clause structure with ぐらい to express degree, showing mastery of complex Japanese grammar in question formation."
    - "The learner demonstrated natural Japanese conversation flow by asking follow-up questions using appropriate sentence structures. For instance, the question '日本で個人アプリを開発して...' shows effective use of topic markers (で), verb forms (開発して), and complex relative clauses, demonstrating advanced Japanese sentence construction skills."

    Key points for evaluating follow-up questions as strengths:
    - Focus on the Japanese language structures used (particles, verb forms, sentence patterns, relative clauses, etc.)
    - Highlight the grammatical complexity or accuracy of the question formation
    - Note how the Japanese structures demonstrate language skill, not topic knowledge
    - Reference specific Japanese elements: particles (か, の, は, が, を, に, で), verb forms, sentence patterns, relative clauses, etc.

    Examples of INCORRECT strengths (focus on topic knowledge - DO NOT USE):
    - "The student showed understanding of app development concepts" (this is about topic knowledge, not language)
    - "The learner demonstrated critical thinking about the subject matter" (this is about thinking, not Japanese skills)
    - "The student understood the importance of user feedback" (this is about domain knowledge, not language ability)
    - "The learner actively engaged by asking relevant questions about app development" (focuses on topic relevance, not Japanese language structures)
    - "The student showed curiosity about the subject" (focuses on interest/topic, not language skills)    `;

    console.log("[Summary] Starting main summary generation...");
    // Add timeout for main summary generation (60 seconds)
    const summaryPromise = openai.chat.completions.create({
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

    const summaryTimeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Summary generation timeout after 60 seconds")),
        60000
      )
    );

    const completion = await Promise.race([
      summaryPromise,
      summaryTimeoutPromise,
    ]);
    console.log("[Summary] Main summary generated successfully");

    // Log usage for summary generation
    if (completion.usage) {
      await logOpenAIEvent({
        userId: decodedToken.userId,
        chatId: chatIdNumber,
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
        console.error("[Summary] Failed to parse JSON:", error);
        return res
          .status(500)
          .json({ error: "Failed to summarize text", details: error });
      }
    } else {
      console.error("[Summary] No JSON found in response");
      return res.status(500).json({ error: "Failed to summarize text" });
    }

    if (!parsed) {
      console.error("[Summary] Parsed result is null or undefined");
      return res
        .status(500)
        .json({ error: "Failed to parse summary response" });
    }

    // Ensure meta object exists
    if (!parsed.meta) {
      parsed.meta = {};
    }

    const title = parsed.meta.title || "Untitled Conversation";
    const chat = await storeChatTitle(chatIdNumber, title);
    const { level, theme, time, createdAt } = chat;

    // Add chat metadata to meta object (matching previous version format)
    parsed.meta.title = title;
    parsed.meta.selectedLevel = level;
    parsed.meta.selectedTopic = theme;
    parsed.meta.chatDuration = time;
    parsed.meta.createdAt = createdAt;

    // Ensure level object exists with label and reason
    if (!parsed.meta.level || typeof parsed.meta.level !== "object") {
      parsed.meta.level = {
        label: parsed.meta.level || "N5",
        reason: "Level assessment not available",
      };
    }

    // Ensure summary exists
    if (!parsed.meta.summary) {
      parsed.meta.summary = "No summary available.";
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

    // Ensure meta object is properly structured (matching previous version format)
    if (!parsed.meta) {
      parsed.meta = {};
    }

    // Validate and ensure all required meta fields exist
    if (!parsed.meta.level || typeof parsed.meta.level !== "object") {
      parsed.meta.level = {
        label: typeof parsed.meta.level === "string" ? parsed.meta.level : "N5",
        reason: "Level assessment not available",
      };
    }

    if (!parsed.meta.title) {
      parsed.meta.title = "Untitled Conversation";
    }

    if (!parsed.meta.summary) {
      parsed.meta.summary = "No summary available.";
    }

    // Store analysis with conversation review included
    // Use "conversation" key to match frontend expectation
    const analysisWithReview = {
      ...parsed,
      conversation: conversationReview || undefined, // Include if generated, matches SummaryType.conversation
    };

    // Log the structure for debugging
    console.log(
      "[Summary] Analysis with review structure:",
      JSON.stringify(analysisWithReview.meta, null, 2)
    );

    await storeAnalysisDB(chatIdNumber, analysisWithReview);

    // Deduct credits after chat ends (after summary is successfully generated)
    try {
      // Get chat details to determine duration and character name
      const durationMinutes = time || 3; // Default to 3 minutes if not set

      // Fetch chat to get characterName
      const chatForCredits = await prisma.chat.findUnique({
        where: { id: chatIdNumber },
        select: { characterName: true },
      });

      if (chatForCredits?.characterName) {
        const characterName = chatForCredits.characterName as CharacterName;
        const voiceProvider = getVoiceProvider(characterName);

        await deductCreditsForChat(
          decodedToken.userId,
          chatIdNumber,
          durationMinutes,
          voiceProvider
        );
      }
    } catch (creditError) {
      // Log error but don't fail the summary generation
      console.error("[Summary] Error deducting credits:", creditError);
      // Credit deduction failure shouldn't block the summary response
    }

    console.log(`[Summary] Successfully completed for chatId: ${chatIdNumber}`);
    // Return analysis with conversation review (can also be fetched separately via /api/chat/conversation-review)
    return res.status(200).json(analysisWithReview);
  } catch (error) {
    console.error("[Summary] Summarization error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("[Summary] Error details:", {
      errorMessage,
      errorStack,
      chatId: chatIdNumber,
    });
    res.status(500).json({
      error: "Failed to summarize text",
      details: errorMessage,
    });
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
  console.log("[Summary] Updating chat title to:", title);
  const chat = await prisma.chat.update({
    where: { id: chatId },
    data: { title, time: 3 },
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
  2. grammarReason: string (only when grammarCorrect is false) - brief explanation in English of why the grammar is incorrect (e.g., "Wrong particle usage: should use を instead of が", "Missing subject marker は", "Verb conjugation error")
  3. EXACTLY 3 improvement suggestions:
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
      "grammarReason": <if grammarCorrect is false, provide a brief explanation in English of why it's incorrect (e.g., "Wrong particle usage: should use を instead of が"), if true, omit this field>,
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
- Improvement 3 should show how to continue/develop the conversation (asking back, adding context, etc.)
`;

    console.log(
      `[Summary] Generating improvements for ${userMessages.length} user messages...`
    );
    // Add timeout for conversation review OpenAI call (45 seconds)
    const reviewCompletionPromise = openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: improvementPrompt,
        },
      ],
    });

    const reviewTimeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error("Conversation review OpenAI timeout after 45 seconds")
          ),
        45000
      )
    );

    const completion = await Promise.race([
      reviewCompletionPromise,
      reviewTimeoutPromise,
    ]);
    console.log("[Summary] Conversation review OpenAI call completed");

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
      const grammarReasonByMessageId: Record<number, string> = {};

      if (parsed.messages && Array.isArray(parsed.messages)) {
        parsed.messages.forEach((msg: any) => {
          if (msg.id) {
            // Store grammar correctness flag
            if (typeof msg.grammarCorrect === "boolean") {
              grammarCorrectByMessageId[msg.id] = msg.grammarCorrect;
              // Store grammar reason if provided and grammarCorrect is false
              if (msg.grammarCorrect === false && msg.grammarReason) {
                grammarReasonByMessageId[msg.id] = msg.grammarReason;
              }
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
              const classifiedImprovements = msg.improvements
                .slice(0, 3)
                .map((improvement: any) => {
                  // If AI didn't provide type, use fallback classification
                  if (!improvement.type && improvement.focus) {
                    const classifiedType = classifyImprovement(
                      improvement.focus
                    );
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

          // Add grammar reason if grammar is incorrect
          if (
            result.grammarCorrect === false &&
            grammarReasonByMessageId[msg.id]
          ) {
            result.grammarReason = grammarReasonByMessageId[msg.id];
          }

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
      console.error(
        "[Summary] Failed to parse conversation review JSON:",
        error
      );
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
    console.error("[Summary] Error generating conversation review:", error);
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
