import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "text is required" });
  }

  // Strip furigana annotations: 私（わたし） → 私
  const cleanText = text.replace(/（[^）]*）/g, "");

  const region = process.env.AZURE_SERVICE_REGION;
  const apiKey = process.env.AZURE_API_KEY;

  if (!region || !apiKey) {
    return res.status(500).json({ error: "Azure TTS not configured" });
  }

  const voice = Math.random() < 0.5 ? "ja-JP-NanamiNeural" : "ja-JP-KeitaNeural";
  const ssml = `<speak version="1.0" xml:lang="ja-JP"><voice name="${voice}"><prosody rate="-10%">${cleanText}</prosody></voice></speak>`;

  const response = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
      },
      body: ssml,
    },
  );

  if (!response.ok) {
    const err = await response.text();
    return res.status(500).json({ error: `Azure TTS error: ${err}` });
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.send(buffer);
}
