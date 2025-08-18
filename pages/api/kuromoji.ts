import type { NextApiRequest, NextApiResponse } from "next";
import kuromoji from "kuromoji";
import * as wanakana from "wanakana";
import path from "path";

const dictPath = path.join(process.cwd(), "public/kuromoji_dict");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  kuromoji.builder({ dicPath: dictPath }).build((err, tokenizer) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const tokens = tokenizer.tokenize(text);
    const hiragana = tokens
      .map((token) =>
        token.reading ? wanakana.toHiragana(token.reading) : token.surface_form
      )
      .join("");

    res.status(200).json({ hiragana });
  });
}
