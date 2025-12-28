import { config } from "dotenv";
import path from "path";

// Load environment variables
config({ path: path.join(process.cwd(), ".env") });

const elevenLabsApiKey = process.env.ELEVEN_API_KEY;

async function listVoices() {
  if (!elevenLabsApiKey) {
    console.error("❌ ELEVEN_API_KEY is not set in .env file");
    process.exit(1);
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": elevenLabsApiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch voices: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const voices = data.voices || [];

    console.log(`\n📢 Found ${voices.length} voices in your ElevenLabs account\n`);

    // Filter for voices that might be Japanese or multilingual
    const japaneseVoices = voices.filter((voice: any) => {
      const name = voice.name?.toLowerCase() || "";
      const description = voice.description?.toLowerCase() || "";
      const labels = voice.labels || {};

      return (
        name.includes("japanese") ||
        name.includes("japan") ||
        name.includes("aiko") ||
        name.includes("haruki") ||
        name.includes("chica") ||
        name.includes("ryo") ||
        description.includes("japanese") ||
        labels.language?.includes("ja") ||
        labels.language?.includes("jp")
      );
    });

    console.log("🎌 Potentially Japanese voices:");
    if (japaneseVoices.length > 0) {
      japaneseVoices.forEach((voice: any) => {
        console.log(`\n  Name: ${voice.name}`);
        console.log(`  ID: ${voice.voice_id}`);
        console.log(`  Description: ${voice.description || "N/A"}`);
        console.log(`  Labels: ${JSON.stringify(voice.labels || {})}`);
        console.log(`  Category: ${voice.category || "N/A"}`);
      });
    } else {
      console.log("  No explicitly Japanese voices found.");
      console.log("\n💡 Tip: ElevenLabs multilingual voices can speak Japanese.");
      console.log("   Look for voices with 'multilingual' in the name or description.\n");
    }

    console.log("\n📋 All available voices (first 20):");
    voices.slice(0, 20).forEach((voice: any, index: number) => {
      console.log(`\n  ${index + 1}. ${voice.name}`);
      console.log(`     ID: ${voice.voice_id}`);
      console.log(`     Category: ${voice.category || "N/A"}`);
      if (voice.description) {
        console.log(`     Description: ${voice.description.substring(0, 100)}...`);
      }
    });

    if (voices.length > 20) {
      console.log(`\n  ... and ${voices.length - 20} more voices`);
    }

    console.log("\n💡 To use a voice, update the voice ID in lib/voice/voiceMapping.ts");
    console.log("💡 Make sure to use 'eleven_multilingual_v2' model for Japanese text\n");
  } catch (error: any) {
    console.error("❌ Error listing voices:", error.message);
    process.exit(1);
  }
}

listVoices();
