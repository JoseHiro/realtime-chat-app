const kuromoji = require("kuromoji");
const wanakana = require("wanakana");

// 辞書ビルド
function buildTokenizer() {
  return new Promise((resolve, reject) => {
    kuromoji
      .builder({ dicPath: "node_modules/kuromoji/dict" })
      .build((err, tokenizer) => {
        if (err) return reject(err);
        resolve(tokenizer);
      });
  });
}

// 日本語の品詞を英語のキーに変換
function mapPosToKey(pos) {
  if (pos.startsWith("名詞")) return "noun";
  if (pos.startsWith("動詞")) return "verb";
  if (pos.startsWith("形容詞")) return "adjective";
  if (pos.startsWith("副詞")) return "adverb";
  if (pos.startsWith("連体詞")) return "adnominal";
  if (pos.startsWith("接続詞")) return "conjunction";
  if (pos.startsWith("感動詞")) return "interjection";
  return "other";
}



function normalize(token) {
  const exclude = ["助詞", "助動詞", "記号"];
  if (exclude.includes(token.pos)) return null;

  const posKey = mapPosToKey(token.pos);
  console.log(posKey, '0000000000');


  // ✅ 基本形（例: "楽しい", "行く"）を使う
  const basic = token.basic_form === "*" ? token.surface_form : token.basic_form;

  // ✅ 読み（カタカナ）をひらがなに変換
  const rawReading = token.reading || token.surface_form;
  const readingHira = wanakana.toHiragana(rawReading);

  // ✅ word（基本形）もひらがな化（例: "楽しい" → "たのしい"）
  const wordHira = wanakana.toHiragana(basic);

  // ✅ ローマ字
  const romaji = wanakana.toRomaji(readingHira);

  return { word: wordHira, reading: readingHira, romaji, posKey };
}

async function analyzeUserVocabulary(history) {
  const tokenizer = await buildTokenizer();
  const result = {};

  for (const item of history) {
    if (item.role !== "user") continue;
    const tokens = tokenizer.tokenize(item.content);

    for (const t of tokens) {
      const normalized = normalize(t);
      if (!normalized) continue;
      const { word, reading, romaji, posKey } = normalized;

      if (!result[posKey]) result[posKey] = {};

      if (!result[posKey][word]) {
        // romaji を忘れずに渡す
        result[posKey][word] = { word, reading, romaji, count: 0 };
      }
      result[posKey][word].count++;
    }
  }

  // 内部オブジェクトを配列に変換
  for (const key in result) {
    result[key] = Object.values(result[key]);
  }

  return result;
}

// --- 使用例 ---
(async () => {
  const history = [
    { role: "assistant", content: "こんにちは！今日はどこか行った？" },
    {
      role: "user",
      content:
        "うん、今日は山の公園へ行きました。天気がとてもきれいだった！行った。",
    },
    {
      role: "user",
      content:
        "友達とピクニックをしたり、少しサッカーをしました。でも私はサッカー下手から、すぐ疲れた。食べたことがある。食べられません。食べさせる。食べさせられる",
    },
    {
      role: "user",
      content:
        "はい、サンドイッチを作った。ちょっと塩っぱいでしたけど、美味しかった！サッカーは楽しかったよ。",
    },
    {
      role: "user",
      content: "たまごとハムのサンド。あとフルーツも持ってた、りんごとバナナ。",
    },
    {
      role: "user",
      content:
        "たぶん４時間ぐらい。でも帰りのバスが遅くて、家に着いたは７時くらい。",
    },
    {
      role: "user",
      content: "はい、とても楽しかったです。また来週も行きたい思います！",
    },
  ];

  const vocabData = await analyzeUserVocabulary(history);
  console.log(JSON.stringify(vocabData, null, 2));
})();
