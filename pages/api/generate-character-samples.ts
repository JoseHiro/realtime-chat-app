import type { NextApiRequest, NextApiResponse } from "next";
import { getAllCharacters, getElevenLabsVoiceId, type CharacterName } from "../../lib/voice/voiceMapping";
import { promises as fs } from "fs";
import path from "path";

const speechKey = process.env.AZURE_API_KEY || "";
const serviceRegion = process.env.AZURE_SERVICE_REGION || "japaneast";
const elevenLabsApiKey = process.env.ELEVEN_API_KEY;

// Different phrases for each character to showcase their personality
const CHARACTER_PHRASES: Record<string, string[]> = {
  Sakura: [
    "こんにちは！今日はいい天気ですね。一緒に日本語を練習しましょう。",
    "お元気ですか？最近何か面白いことがありましたか？",
    "日本語の勉強、頑張っていますね！質問があれば何でも聞いてください。",
  ],
  Ken: [
    "こんにちは。今日も日本語の練習をしましょう。",
    "ビジネス日本語について学びたいことがあれば、お手伝いします。",
    "丁寧な日本語を身につけることは、とても大切です。一緒に頑張りましょう。",
  ],
  Chica: [
    "やっほー！元気？今日も楽しく日本語を話そうよ！",
    "わあ、すごいね！もっと話してみて！",
    "一緒に日本語を練習するの、とっても楽しい！何か話したいことある？",
  ],
  Haruki: [
    "こんにちは。温かく迎えてくれてありがとう。一緒に日本語を学びましょう。",
    "あなたの日本語、とても良いですね。もっと上達するようにサポートします。",
    "表現豊かな日本語を一緒に練習しましょう。何か質問があれば遠慮なくどうぞ。",
  ],
  Aiko: [
    "こんにちは。優しく、ゆっくり日本語を練習しましょうね。",
    "落ち着いた雰囲気で、日本語を学ぶことができます。",
    "あなたのペースで、無理せず日本語を上達させましょう。",
  ],
  Ryo: [
    "よお！元気か？今日もダイナミックに日本語を練習しようぜ！",
    "おっ、いい感じだな！もっと積極的に話してみよう！",
    "エネルギッシュに日本語を学ぼう！何でも聞いてくれ！",
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { characterName } = req.body;

    // Create audio directory if it doesn't exist
    const audioDir = path.join(process.cwd(), "public", "audio", "characters");
    await fs.mkdir(audioDir, { recursive: true });

    const characters = getAllCharacters();
    const results: Array<{
      characterName: string;
      filePaths: string[];
      success: boolean;
      error?: string;
    }> = [];

    // If specific character is requested, only generate for that one
    const charactersToProcess = characterName
      ? characters.filter((c) => c.characterName === characterName)
      : characters;

    for (const character of charactersToProcess) {
      try {
        // Get phrases for this character
        const phrases = CHARACTER_PHRASES[character.characterName] || [
          "こんにちは！一緒に日本語を練習しましょう。",
        ];
        const filePaths: string[] = [];

        // Generate audio for each phrase
        for (let i = 0; i < phrases.length; i++) {
          const phrase = phrases[i];
          let audioBuffer: Buffer;

          if (character.voiceProvider === "elevenlabs") {
            // Generate using ElevenLabs
            if (!elevenLabsApiKey) {
              throw new Error("ELEVEN_API_KEY is not set");
            }

            const elevenLabsVoiceId = getElevenLabsVoiceId(character.characterName) || "hBWDuZMNs32sP5dKzMuc";

            const elevenLabsResponse = await fetch(
              `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`,
              {
                method: "POST",
                headers: {
                  "xi-api-key": elevenLabsApiKey,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  text: phrase,
                  model_id: "eleven_multilingual_v2", // Use multilingual model for Japanese
                  voice_settings: { stability: 0.75, similarity_boost: 0.75 },
                }),
              }
            );

            if (!elevenLabsResponse.ok) {
              const errorText = await elevenLabsResponse.text();
              throw new Error(`ElevenLabs TTS failed: ${elevenLabsResponse.status} ${errorText}`);
            }

            audioBuffer = Buffer.from(await elevenLabsResponse.arrayBuffer());
          } else {
            // Generate using Azure TTS
            if (!speechKey) {
              throw new Error("AZURE_API_KEY is not set");
            }

            // Get Azure access token
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

            // Create SSML with appropriate style based on character
            const style = character.characterName === "Chica" ? "cheerful"
              : character.characterName === "Ryo" ? "energetic"
              : character.characterName === "Aiko" ? "gentle"
              : "friendly";

            const ssml = `
              <speak version='1.0' xml:lang='ja-JP' xmlns:mstts="http://www.w3.org/2001/mstts">
                <voice xml:lang='ja-JP' xml:gender='${character.azureVoiceGender}' name='${character.azureVoiceName}'>
                  <mstts:express-as style="${style}" styledegree="1.0">
                    <prosody rate="1.0">
                      ${phrase}
                    </prosody>
                  </mstts:express-as>
                </voice>
              </speak>
            `;

            // Generate audio using Azure TTS
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
              throw new Error(`Azure TTS Error: ${errorText}`);
            }

            audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
          }

          // Save the audio file with index
          const fileName = `${character.characterName.toLowerCase()}_${i + 1}.mp3`;
          const filePath = path.join(audioDir, fileName);
          await fs.writeFile(filePath, audioBuffer);

          filePaths.push(`/audio/characters/${fileName}`);
          console.log(`✅ Generated audio ${i + 1}/${phrases.length} for ${character.characterName}: ${filePath}`);
        }

        results.push({
          characterName: character.characterName,
          filePaths,
          success: true,
        });

        console.log(`✅ Completed all audio files for ${character.characterName}`);
      } catch (error: any) {
        console.error(`❌ Error generating audio for ${character.characterName}:`, error);
        results.push({
          characterName: character.characterName,
          filePaths: [],
          success: false,
          error: error.message || "Unknown error",
        });
      }
    }

    return res.status(200).json({
      message: "Character audio samples generated",
      results,
      totalProcessed: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    });
  } catch (error: any) {
    console.error("Error generating character samples:", error);
    return res.status(500).json({
      error: "Failed to generate character samples",
      message: error.message,
    });
  }
}
