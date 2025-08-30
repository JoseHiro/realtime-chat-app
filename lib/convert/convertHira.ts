import kuromoji from "kuromoji";
import * as wanakana from "wanakana";
import path from "path";

const dictPath = path.join(process.cwd(), "public/kuromoji_dict");

export const convertHira = (text: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: dictPath }).build((err, tokenizer) => {
      if (err) {
        reject(err);
        return;
      }

      const tokens = tokenizer.tokenize(text);
      const hiragana = tokens
        .map((token) =>
          token.reading
            ? wanakana.toHiragana(token.reading)
            : token.surface_form
        )
        .join("");

      resolve(hiragana);
    });
  });
};
