import { NextApiRequest, NextApiResponse } from "next";

const speechKey = process.env.AZURE_API_KEY || "";
const serviceRegion = process.env.AZURE_SERVICE_REGION;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text) {
      console.log("Error: No text provided");
      return res.status(400).json({ error: "Text is required" });
    }

    if (!speechKey) {
      console.log("Error: No Azure API key configured");
      return res.status(500).json({ error: "Azure API key not configured" });
    }

    // アクセストークン取得
    const tokenUrl = `https://${serviceRegion}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": speechKey,
        "Content-Length": "0",
      },
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      throw new Error(
        `Failed to get access token: ${tokenResponse.status} ${tokenResponse.statusText}`
      );
    }

    const accessToken = await tokenResponse.text();

    // SSML構築
    const ssml = `
      <speak version='1.0' xml:lang='ja-JP'>
        <voice xml:lang='ja-JP' xml:gender='Female' name='ja-JP-NanamiNeural'>
          <mstts:express-as style="sad" styledegree="1.0">
            <prosody rate="1.0">
              ${text}
            </prosody>
          </mstts:express-as>
        </voice>
      </speak>
    `;

    // 音声合成
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

    const audioBuffer = await ttsResponse.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.byteLength);
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("Azure TTS Error:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
      res.status(500).json({
        error: "Failed to generate speech",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Failed to generate speech",
        details: String(error),
      });
    }
  }
}
