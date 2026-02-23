// Generate ephemeral client token for OpenAI Realtime API
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/auth";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify authentication
  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);
  if (
    !decodedToken ||
    typeof decodedToken === "string" ||
    !("userId" in decodedToken)
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Generate ephemeral client secret for Realtime API
    // This creates a short-lived token that can be used client-side safely
    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          session: {
            type: "realtime",
            model: "gpt-4o-realtime-preview-2024-12-17",
          },
          expires_after: {
            anchor: "created_at",
            seconds: 3600, // 1 hour expiration (max 7200 seconds)
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI client_secrets error:", errorText);
      throw new Error(
        `Failed to generate ephemeral token: ${response.statusText}`
      );
    }

    const data = await response.json();

    res.status(200).json({
      clientToken: data.value, // The ephemeral client secret
      expiresAt: data.expires_at,
      model: "gpt-4o-realtime-preview-2024-12-17",
    });
  } catch (error: any) {
    console.error("Error generating client token:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to generate token" });
  }
}
