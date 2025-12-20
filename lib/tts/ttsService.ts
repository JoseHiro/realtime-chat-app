import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ELEVEN_LABS_VOICE_ID = "hBWDuZMNs32sP5dKzMuc";
const AZURE_SERVICE_REGION = process.env.AZURE_SERVICE_REGION || "japaneast";
const AZURE_API_KEY = process.env.AZURE_API_KEY || "";

/**
 * Check if a user has premium access (pro plan with active status)
 */
export async function isPremiumUser(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
      },
    });

    return (
      user?.subscriptionPlan === "pro" && user?.subscriptionStatus === "active"
    );
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
}

/**
 * Generate TTS audio using Eleven Labs API
 */
async function generateElevenLabsAudio(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVEN_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVEN_API_KEY is not set");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice_settings: { stability: 0.75, similarity_boost: 0.75 },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("ElevenLabs TTS API error:", errorText);
    throw new Error(`ElevenLabs TTS API error: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generate TTS audio using Azure TTS API
 */
async function generateAzureAudio(text: string): Promise<Buffer> {
  // 1. Get Azure access token
  const tokenUrl = `https://${AZURE_SERVICE_REGION}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;
  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": AZURE_API_KEY,
      "Content-Length": "0",
    },
  });

  if (!tokenResponse.ok) {
    throw new Error(`Azure Token Error: ${tokenResponse.statusText}`);
  }

  const accessToken = await tokenResponse.text();

  // 2. Create SSML
  const ssml = `
    <speak version='1.0' xml:lang='ja-JP'>
      <voice xml:lang='ja-JP' xml:gender='Female' name='ja-JP-NanamiNeural'>
        ${text}
      </voice>
    </speak>
  `;

  // 3. Generate audio using Azure TTS
  const ttsUrl = `https://${AZURE_SERVICE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
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
    const errorText = await ttsResponse.text();
    throw new Error(`Azure TTS Error: ${errorText}`);
  }

  const arrayBuffer = await ttsResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generate TTS audio based on user's subscription plan
 * Premium users get Eleven Labs, free users get Azure
 */
export async function generateTTSAudio(
  text: string,
  userId?: string
): Promise<Buffer> {
  // If userId is provided, check premium status
  if (userId) {
    const isPremium = await isPremiumUser(userId);
    if (isPremium) {
      return generateElevenLabsAudio(text);
    }
  }

  // Default to Azure TTS for free users or when userId is not provided
  return generateAzureAudio(text);
}
