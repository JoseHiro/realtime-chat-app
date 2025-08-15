import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const speechKey = process.env.AZURE_API_KEY || "";
const serviceRegion = process.env.AZURE_SERVICE_REGION;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { level, theme, politeness } = req.body;
  if (!level || !theme) {
    return res.status(400).json({ error: "Text is required" });
  }

  const prompt = `あなたは日本語会話の練習相手です。
以下の条件で会話を始めてください。

- 学習者のレベル: ${level}
- テーマ: ${theme}
- 会話の丁寧さ ${politeness}
- 最初の発話はシンプルで自然な質問にしてください。
- 会話は一文から始め、相手が答えやすいようにしましょう。

レベル別の制約:
- 初級: 語彙は日常的な単語だけを使用し、文は短く。
- 中級: 語彙は日常的＋少し抽象的な単語を使用し、文はやや長く。
- 上級: 難しい語彙や敬語も含め、複雑な構文を使ってもよい。

必ずレベルの条件を反映してください。
`;

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
    });
    const raw = completion.choices[0]?.message?.content ?? "";

    const reply = raw.replace(/^\d+\.\s*/, "").trim();
    console.log(reply);

    const tokenUrl = `https://${serviceRegion}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": speechKey,
        "Content-Length": "0",
      },
    });

    if (!tokenResponse.ok) {
      throw new Error(`Azure Token Error: ${tokenResponse.statusText}`);
    }

    const accessToken = await tokenResponse.text();
    // SSML構築
    const ssml = `
<speak version='1.0' xml:lang='ja-JP' xmlns:mstts="http://www.w3.org/2001/mstts">
  <voice xml:lang='ja-JP' xml:gender='Female' name='ja-JP-NanamiNeural'>
    <mstts:express-as style="sad" styledegree="1.0">
      <prosody rate="1.0">
        ${reply}
      </prosody>
    </mstts:express-as>
  </voice>
</speak>
`;
    const ttsUrl = `https://${serviceRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const ttsResponse = await fetch(ttsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "NodeJS-TTS",
      },
      body: ssml,
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      throw new Error(`TTS request failed: ${ttsResponse.status} ${errorText}`);
    }

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());

    console.log(reply);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      reply: reply,
      audio: audioBuffer.toString("base64"), // フロントでは base64 を再生用に変換
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "Failed to generate conversation" });
  }
};
