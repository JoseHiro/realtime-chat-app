import { getAllCharacters, getElevenLabsVoiceId } from "../lib/voice/voiceMapping";
import { promises as fs } from "fs";
import path from "path";
import { config } from "dotenv";

// Load environment variables from .env file
config({ path: path.join(process.cwd(), ".env") });

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

async function generateSamples() {
  try {
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

    for (const character of characters) {
      try {
        // Get phrases for this character
        const phrases = CHARACTER_PHRASES[character.characterName] || [
          "こんにちは！一緒に日本語を練習しましょう。",
        ];
        const filePaths: string[] = [];

        // Generate audio for each phrase
        for (let i = 0; i < phrases.length; i++) {
          const phrase = phrases[i];
          let audioBuffer: Buffer | undefined;

          if (character.voiceProvider === "elevenlabs") {
            // Generate using ElevenLabs
            if (!elevenLabsApiKey) {
              throw new Error("ELEVEN_API_KEY is not set");
            }

            const elevenLabsVoiceId = getElevenLabsVoiceId(character.characterName) || "hBWDuZMNs32sP5dKzMuc";

            try {
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
                let errorData;
                try {
                  errorData = JSON.parse(errorText);
                } catch {
                  errorData = {};
                }

                // Log the actual error for debugging
                const errorStatus = errorData.detail?.status || errorData.detail?.message || errorText;
                console.log(`⚠️  ElevenLabs error for ${character.characterName} (voice: ${elevenLabsVoiceId}):`, errorStatus);

                // If custom voice limit reached, fallback to Azure TTS
                // Exception: For Aiko, if the voice is set, try to use it even if there's an error (user may have added it)
                if (character.characterName === "Aiko" && elevenLabsVoiceId === "WQz3clzUdMqvBf0jswZQ") {
                  // Check if it's a different error (not voice_limit_reached) - if so, throw it
                  if (errorData.detail?.status !== "voice_limit_reached" && errorData.detail?.status !== "subscription_voice_limit_reached") {
                    throw new Error(`ElevenLabs TTS failed for Aiko: ${elevenLabsResponse.status} ${errorText}`);
                  }
                  // If it's voice_limit_reached, still try fallback but warn user
                  console.log(`⚠️  Voice limit reached for Aiko. Make sure voice ${elevenLabsVoiceId} is added to your ElevenLabs account. Using Azure TTS fallback...`);
                } else if (errorData.detail?.status === "voice_limit_reached" || errorData.detail?.status === "subscription_voice_limit_reached") {
                  console.log(`⚠️  Custom voice limit reached for ${character.characterName}, using Azure TTS fallback...`);
                } else {
                  throw new Error(`ElevenLabs TTS failed: ${elevenLabsResponse.status} ${errorText}`);
                }
              } else {
                audioBuffer = Buffer.from(await elevenLabsResponse.arrayBuffer());
                console.log(`✅ Successfully generated with ElevenLabs voice ${elevenLabsVoiceId} for ${character.characterName}`);
              }
            } catch (error: any) {
              // If it's not a voice_limit_reached error, re-throw it
              if (!error.message?.includes("voice_limit_reached")) {
                throw error;
              }
              console.log(`⚠️  Using Azure TTS fallback for ${character.characterName}...`);
            }
          }

          // Use Azure TTS if ElevenLabs failed or if voiceProvider is azure
          if (!audioBuffer) {
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

    console.log("\n📊 Summary:");
    console.log(`Total processed: ${results.length}`);
    console.log(`Successful: ${results.filter((r) => r.success).length}`);
    console.log(`Failed: ${results.filter((r) => !r.success).length}`);

    if (results.filter((r) => !r.success).length > 0) {
      console.log("\n❌ Failed characters:");
      results.filter((r) => !r.success).forEach((r) => {
        console.log(`  - ${r.characterName}: ${r.error}`);
      });
    }

    console.log("\n✅ Done! Files saved to public/audio/characters/");
  } catch (error: any) {
    console.error("Error generating character samples:", error);
    process.exit(1);
  }
}

generateSamples();
