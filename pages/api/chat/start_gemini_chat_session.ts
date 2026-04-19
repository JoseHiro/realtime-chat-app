import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);
  if (
    !decodedToken ||
    typeof decodedToken === "string" ||
    !("userId" in decodedToken)
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("[start_gemini_chat_session] GEMINI_API_KEY is not set");
    return res.status(500).json({ error: "Server misconfiguration: missing API key" });
  }

  return res.status(200).json({ apiKey: process.env.GEMINI_API_KEY });
}
