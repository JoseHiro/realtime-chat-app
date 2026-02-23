import kuromoji from "kuromoji";
import wanakana from "wanakana";

// 辞書ビルド
const buildTokenizer = () => {
  return new Promise((resolve, reject) => {
    kuromoji
      .builder({ dicPath: "node_modules/kuromoji/dict" })
      .build((err, tokenizer) => {
        if (err) return reject(err);
        resolve(tokenizer);
      });
  });
};

// 日本語の品詞を英語のキーに変換
const mapPosToKey = (pos: string) => {
  if (pos.startsWith("名詞")) return "noun";
  if (pos.startsWith("動詞")) return "verb";
  if (pos.startsWith("形容詞")) return "adjective";
  if (pos.startsWith("副詞")) return "adverb";
  if (pos.startsWith("連体詞")) return "adnominal";
  if (pos.startsWith("接続詞")) return "conjunction";
  if (pos.startsWith("感動詞")) return "interjection";
  return "other";
};

const normalize = (token: any) => {
  const exclude = ["助詞", "助動詞", "記号"];
  if (exclude.includes(token.pos)) return null;
  const posKey = mapPosToKey(token.pos); // word type

  // ✅ 基本形（例: "楽しい", "行く"）を使う
  const basic =
    token.basic_form === "*" ? token.surface_form : token.basic_form;

  // ✅ 読み（カタカナ）をひらがなに変換
  const rawReading = token.reading || token.surface_form;
  const readingHira = wanakana.toHiragana(rawReading);

  // ✅ word（基本形）もひらがな化（例: "楽しい" → "たのしい"）
  const wordHira = wanakana.toHiragana(basic);

  // ✅ ローマ字
  const romaji = wanakana.toRomaji(readingHira);

  return { word: wordHira, reading: readingHira, romaji, posKey };
};

type ChatHistoryItem = { role: string; content: string };

const analyzeUserVocabulary = async (history: ChatHistoryItem[]) => {
  const tokenizer =
    (await buildTokenizer()) as kuromoji.Tokenizer<kuromoji.IpadicFeatures>;
  const result: {
    [posKey: string]:
      | { word: string; reading: string; romaji: string; count: number }[]
      | {
          [word: string]: {
            word: string;
            reading: string;
            romaji: string;
            count: number;
          };
        };
  } = {};

  for (const item of history) {
    if (item.role !== "user") continue;
    const tokens = tokenizer.tokenize(item.content);

    for (const t of tokens) {
      console.log();
      const normalized =
        t.pos === "動詞" || t.pos === "形容詞"
          ? normalize(tokenizer.tokenize(t.basic_form)[0])
          : normalize(t);

      if (!normalized) continue;
      const { word, reading, romaji, posKey } = normalized;

      // Ensure result[posKey] is an object before converting to array later
      if (!result[posKey] || Array.isArray(result[posKey])) result[posKey] = {};

      if (!(result[posKey] as { [word: string]: any })[word]) {
        // romaji を忘れずに渡す
        (result[posKey] as { [word: string]: any })[word] = {
          word,
          reading,
          romaji,
          count: 0,
        };
      }
      (result[posKey] as { [word: string]: any })[word].count++;
    }
  }

  // 内部オブジェクトを配列に変換
  for (const key in result) {
    if (!Array.isArray(result[key])) {
      result[key] = Object.values(result[key] as { [word: string]: any });
    }

    // ✅ この中でソートする（countの降順）
    result[key].sort((a, b) => b.count - a.count);
  }

  return result;
};

export const wordAnalyzer = async (chat: any) => {
  const vocabData = await analyzeUserVocabulary(chat);
  return vocabData;
};
// --- 使用例 ---
// (async () => {
//   const history = [
//     { role: "assistant", content: "こんにちは！今日はどこか行った？" },
//     {
//       role: "user",
//       content:
//         "うん、今日は山の公園へ行きました。天気がとてもきれいだった！行った。",
//     },
//     {
//       role: "user",
//       content:
//         "友達とピクニックをしたり、少しサッカーをしました。でも私はサッカー下手から、すぐ疲れた。食べたことがある。食べられません。食べさせる。食べさせられる",
//     },
//     {
//       role: "user",
//       content:
//         "はい、サンドイッチを作った。ちょっと塩っぱいでしたけど、美味しかった！サッカーは楽しかったよ。",
//     },
//     {
//       role: "user",
//       content: "たまごとハムのサンド。あとフルーツも持ってた、りんごとバナナ。",
//     },
//     {
//       role: "user",
//       content:
//         "たぶん４時間ぐらい。でも帰りのバスが遅くて、家に着いたは７時くらい。",
//     },
//     {
//       role: "user",
//       content: "はい、とても楽しかったです。また来週も行きたい思います！",
//     },
//   ];

//   const vocabData = await analyzeUserVocabulary(history);
//   console.log(JSON.stringify(vocabData, null, 2));
// })();
