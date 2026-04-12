import type { NextApiRequest, NextApiResponse } from "next";
import { convertHira } from "../../../lib/convert/convertHira";

/** Katakana to hiragana (same as drill page) */
function kanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

function normalize(str: string): string {
  return kanaToHiragana(str.trim().toLowerCase());
}

/**
 * POST body: { transcript: string, acceptedAnswers: string[] }
 * Converts transcript to hiragana (kanji → reading via kuromoji), then compares to acceptedAnswers.
 * Response: { correct: boolean, normalized?: string }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ correct: boolean; normalized?: string } | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { transcript, acceptedAnswers } = req.body ?? {};
  if (typeof transcript !== "string" || !Array.isArray(acceptedAnswers)) {
    return res.status(400).json({ error: "Missing transcript or acceptedAnswers" });
  }
  if (transcript.length > 500 || acceptedAnswers.length > 50) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const hiragana = await convertHira(transcript);
    const normalizedUser = normalize(hiragana);
    const correct = acceptedAnswers.some(
      (a: string) => normalize(String(a)) === normalizedUser
    );
    return res.status(200).json({ correct, normalized: normalizedUser });
  } catch (e) {
    console.error("check-voice:", e);
    return res.status(500).json({ error: "Failed to check answer" });
  }
}
