import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { sentence, userAnswer, expectedTranslation, direction } = req.body;
  if (!sentence || !userAnswer) {
    return res.status(400).json({ error: "sentence and userAnswer are required" });
  }

  const isEnToJp = direction === "en-to-jp";

  // jp-to-en: reject answers containing Japanese characters
  if (!isEnToJp && /[぀-ゟ゠-ヿ一-鿿]/.test(userAnswer)) {
    return res.status(200).json({
      correct: false,
      feedback: "Please answer in English.",
      correctTranslation: expectedTranslation ?? "",
    });
  }

  // en-to-jp: reject answers that contain no Japanese characters
  if (isEnToJp && !/[぀-ゟ゠-ヿ一-鿿]/.test(userAnswer)) {
    return res.status(200).json({
      correct: false,
      feedback: "Please answer in Japanese.",
      correctTranslation: sentence ?? "",
    });
  }

  let systemPrompt: string;
  let userContent: string;

  if (isEnToJp) {
    const context = sentence ? `The original Japanese sentence is: "${sentence}"` : "";
    systemPrompt = `You are grading an English→Japanese translation exercise. Your ONLY job is to check whether the student wrote a Japanese sentence that correctly conveys the meaning of the English sentence shown.

ALWAYS mark correct if the student got the right meaning, even if their Japanese phrasing differs.
IGNORE completely: politeness level (plain vs polite), minor particle choices, alternative vocab for the same meaning.
Only mark WRONG if the student confused a core element: wrong subject, wrong verb, wrong object, or opposite meaning.

${context}
Respond with JSON: correct (boolean), feedback (if wrong: one sentence; if correct: ""), correctTranslation (the Japanese sentence)`;
    userContent = `English sentence shown to student: ${expectedTranslation}\nStudent's Japanese translation: ${userAnswer}`;
  } else {
    const context = expectedTranslation ? `The correct translation is: "${expectedTranslation}"` : "";
    systemPrompt = `You are grading a Japanese→English translation exercise. Your ONLY job is to check whether the student understood the meaning of the Japanese sentence.

ALWAYS mark correct if the student got the right idea, even if their English is imperfect.
IGNORE completely: articles (a/an/the), tense, plurals, politeness level, word order.
Only mark WRONG if the student confused a core element: wrong subject, wrong verb, wrong object, or opposite meaning.

${context}
Respond with JSON: correct (boolean), feedback (if wrong: one sentence; if correct: ""), correctTranslation (a natural English translation)`;
    userContent = `Japanese sentence: ${sentence}\nStudent's translation: ${userAnswer}`;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(completion.choices[0].message.content ?? "{}");
  return res.status(200).json({
    correct: result.correct,
    feedback: result.feedback,
    correctTranslation: result.correctTranslation,
  });
}
