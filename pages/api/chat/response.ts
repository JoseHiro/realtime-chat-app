// Generate response for a chat application using OpenAI and Azure TTS
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
// import { logUsage } from "../../../lib/loggingData/logger";
import { saveMessage } from "../../../lib/message/messageService";

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
    const { messages, politeness, level, checkGrammarMode, chatId } =
      req.body;

    saveMessage(chatId, "user", messages[messages.length - 1].content);
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
        あなたは日本語会話の練習相手です。
        - 学習者の日本語レベル: ${level}
        - 丁寧さ: ${politeness}
        - 返答は短めで1〜2文で自然に。
        - 会話が続くようにオープンエンドの質問を入れる。
        - これまでの会話の文脈を踏まえて回答する。
        - ${formality}
        ${fixGrammar}
      `,
    };

    console.log(messages);

    const messagesWithInstruction = [
      systemMessage,
      ...(messages || []), // 今回のやり取り
    ];

    // 1. GPTからテキスト生成
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messagesWithInstruction,
    });

    const reply = completion.choices[0].message?.content ?? "";
    const { reading, english } = await addReading(reply);
    const message = await saveMessage(
      chatId,
      "assistant",
      reply,
      reading,
      english
    );

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
      reading: reading,
      messageId: message.id,
      english: english,
    });

    // if(process.env === 'development'){

    // }

    // const usage = completion.usage; // open ai usage
    // const charCount = reply.length; // azure usage
    // const openaiCost = usage ? (usage.total_tokens / 1000) * 0.015 : 0;
    // const azureCost = (charCount / 1000000) * 16;

    // logUsage({
    //   timestamp: new Date().toISOString(),
    //   chatId,
    //   level,
    //   politeness,
    //   openai: {
    //     model: "gpt-4o-mini",
    //     prompt_tokens: usage?.prompt_tokens ?? 0,
    //     completion_tokens: usage?.completion_tokens ?? 0,
    //     total_tokens: usage?.total_tokens ?? 0,
    //     estimated_cost_usd: openaiCost,
    //   },
    //   azure_tts: {
    //     voice: "ja-JP-NanamiNeural",
    //     characters: charCount,
    //     estimated_cost_usd: azureCost,
    //   },
    // });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process request" });
  }
}

// Add reading japanese since some might have kanji
const addReading = async (text: string) => {
  const prompt = `以下の文章の漢字をひらがなに変換してください。
- 元々ひらがな・カタカナの部分はそのまま残す
- 句読点などはそのまま残す
- 出力は文章全体をひらがなで返す
例: "ラーメン、美味しいよね！好きなラーメンの種類はある？"
→ "ラーメン、おいしいよね！すきならーめんのしゅるいはある？"

英語の翻訳もください
出力フォーマットは必ずJSONで次の形にしてください:
{
  "reading": "ひらがな文章",
  "english": "英訳"
}
;`;

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
};
