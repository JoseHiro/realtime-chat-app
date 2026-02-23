import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("[start_realtime_chat_session] OPENAI_API_KEY is not set");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: missing API key" });
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview",
          voice: "alloy",
        }),
      },
    );

    const data = await openaiRes.json().catch(() => ({}));

    if (!openaiRes.ok) {
      console.error(
        "[start_realtime_chat_session] OpenAI error:",
        openaiRes.status,
        data,
      );
      return res
        .status(openaiRes.status >= 500 ? 502 : openaiRes.status)
        .json({
          error: data?.error?.message ?? "Realtime session failed",
          details: data,
        });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("[start_realtime_chat_session]", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
