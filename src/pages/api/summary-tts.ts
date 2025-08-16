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

  const { history } = req.body;
  console.log(history, "History received in summary-tts API");
  try {
    // モックのhistory（実際はreq.body.historyなどを使う）
    // const history = [
    //   {
    //     role: "user",
    //     content:
    //       "昨日、友達と映画見ましたけど、ちょっとつまらなかったです。ストーリーは分からなかったから。",
    //   },
    //   {
    //     role: "assistant",
    //     content: "そうなんですね。どんな映画だったんですか？",
    //   },
    //   {
    //     role: "user",
    //     content: "えっと…サスペンスの映画です。主人公が最後死んだです。",
    //   },
    //   {
    //     role: "assistant",
    //     content: "最後に主人公が亡くなったんですね。どんなシーンでしたか？",
    //   },
    //   {
    //     role: "user",
    //     content: "彼は車で逃げる時に、雨が強くて、道滑って事故になった。",
    //   },
    //   { role: "assistant", content: "なるほど、緊張感のあるシーンですね。" },
    //   {
    //     role: "user",
    //     content: "はい。でも俳優は有名じゃないだから、少し違和感ありました。",
    //   },
    // ];

    const conversationText = history
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const prompt = `あなたは日本語教師です。以下の会話を分析し、学習者にフィードバックを与えてください。
必ず次のJSON形式で出力してください。

JSONのキー:
- summary: 会話全体の簡潔な要約（英語で）
- mistakes: 学習者が犯した文法的な間違い（日本語の文字列配列）
- corrections: mistakes に対応する訂正例（mistakes と同じ順序で対応、日本語の文字列配列）
- goodPoints: 学習者がよくできている点（英語の文字列配列）
- difficultyLevel: 学習者の日本語レベル（N5, N4, N3, N2, N1 のいずれか）
- improvementPoints: 改善すべき点（英語の文字列配列）
- commonMistakes: 学習者が繰り返しやすい典型的な間違い（日本語の文字列配列）
- sentenceUpgrades: 間違いではないが、より自然で現実的に目指せるレベルの言い回し
  （オブジェクト配列で、必ず original と upgraded のペアを含める）
- vocabularySuggestions: 会話に関連して学習者に役立つ単語や表現（日本語の文字列配列）
- culturalNotes: 学習や会話に関わる日本文化的な注釈（英語の文字列配列）

出力例:
{
  "summary": "English summary here",
  "mistakes": ["間違い1", "間違い2"],
  "corrections": ["訂正版1", "訂正版2"],
  "goodPoints": ["Good point 1", "Good point 2"],
  "difficultyLevel": "N4",
  "improvementPoints": ["Improvement point 1", "Improvement point 2"],
  "commonMistakes": ["よくする間違い1", "よくする間違い2"],
  "sentenceUpgrades": [
    {"original": "オリジナル文1", "upgraded": "より自然な文1"},
    {"original": "オリジナル文2", "upgraded": "より自然な文2"}
  ],
  "vocabularySuggestions": ["単語1", "単語2"],
  "culturalNotes": ["Note 1", "Note 2"]
}

注意:
- sentenceUpgrades は飛躍的に難しい表現にせず、学習者が現実的にすぐ使えるレベルの自然な日本語にしてください。
- 出力は余計な説明を加えず、純粋なJSONのみ返してください。`;

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
