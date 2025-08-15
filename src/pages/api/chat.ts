import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const speechKey = process.env.AZURE_API_KEY || "";
const serviceRegion = process.env.AZURE_SERVICE_REGION || "japaneast";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  try {
    const { messages, politeness, level, history } = req.body;

    const systemMessage = {
      role: "system",
      content: `
あなたは日本語会話の練習相手です。
- 学習者の日本語レベル: ${level}
- 丁寧さ: ${politeness}
- 返答は1〜2文程度で簡潔に。
- 会話が続くようにオープンエンドの質問を入れる。
- これまでの会話の文脈を踏まえて回答する。
`,
    };

    const messagesWithInstruction = [
      systemMessage,
      ...(history || []), // これまでの会話
      ...(messages || []), // 今回のやり取り
    ];

    // 1. GPTからテキスト生成
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messagesWithInstruction,
    });

    console.log(completion.choices[0].message);
    const reply = completion.choices[0].message?.content ?? "";

    // 2. Azure TTS用アクセストークン取得
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

    // 3. SSML作成
    const ssml = `
      <speak version='1.0' xml:lang='ja-JP'>
        <voice xml:lang='ja-JP' xml:gender='Female' name='ja-JP-NanamiNeural'>
          ${reply}
        </voice>
      </speak>
    `;

    // 4. Azure TTSで音声生成
    const ttsUrl = `https://${serviceRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ttsResponse = await fetch(ttsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "NextJS-TTS",
      },
      body: ssml,
    });

    if (!ttsResponse.ok) {
      throw new Error(`Azure TTS Error: ${await ttsResponse.text()}`);
    }

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());

    // 5. 音声とテキストを返す
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      reply: reply,
      audio: audioBuffer.toString("base64"), // フロントでは base64 を再生用に変換
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process request" });
  }
}
