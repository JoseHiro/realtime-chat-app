// pages/api/tts.ts
import type { NextApiRequest, NextApiResponse } from "next";
const VOICE_ID = "hBWDuZMNs32sP5dKzMuc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVEN_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice_settings: { stability: 0.75, similarity_boost: 0.75 },
        }),
      }
    );

    if (!response.ok) {
      console.error("ElevenLabs TTS API error", await response.text());
      res.status(500).json({ error: "TTS API error" });
      return;
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buffer);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "TTS failed" });
  }
}
