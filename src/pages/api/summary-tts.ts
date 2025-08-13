import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // モックのhistory（実際はreq.body.historyなどを使う）
    const history = [
      {
        role: "user",
        content:
          "昨日、友達と映画見ましたけど、ちょっとつまらなかったです。ストーリーは分からなかったから。",
      },
      {
        role: "assistant",
        content: "そうなんですね。どんな映画だったんですか？",
      },
      {
        role: "user",
        content: "えっと…サスペンスの映画です。主人公が最後死んだです。",
      },
      {
        role: "assistant",
        content: "最後に主人公が亡くなったんですね。どんなシーンでしたか？",
      },
      {
        role: "user",
        content: "彼は車で逃げる時に、雨が強くて、道滑って事故になった。",
      },
      { role: "assistant", content: "なるほど、緊張感のあるシーンですね。" },
      {
        role: "user",
        content: "はい。でも俳優は有名じゃないだから、少し違和感ありました。",
      },
    ];

    const conversationText = history
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const prompt = `あなたは日本語教師です。以下の会話の要約、文法ミスの指摘、その訂正例、よくできている点を【必ず】JSON形式で返してください。
JSONのキーは summary, mistakes, corrections, goodPoints, difficultyLevel, improvementPoints とし、
mistakes, corrections, goodPoints, improvementPoints は文字列の配列で出力してください。
mistakes と corrections はインデックスが対応するようにしてください。
difficultyLevel は N5, N4, N3, N2, N1 のいずれかを返してください。
例:
{
  "summary": "要約文",
  "mistakes": ["間違い1", "間違い2"],
  "corrections": ["訂正版1", "訂正版2"],
  "goodPoints": ["良い点1", "良い点2"],
  "difficultyLevel": "N4",
  "improvementPoints": ["改善できる点1", "改善できる点2"]
}
余計な説明や文章を含めず、純粋なJSONだけを返してください。`;

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

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({ error: "Failed to summarize text" });
  }
}
