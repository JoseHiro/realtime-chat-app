import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { RoundedButton } from "../../shared/button";
import { Mic } from "lucide-react";

type Mastery = "new" | "learning" | "familiar" | "strong" | "mastered";
type Phase = "question" | "correct";

const MASTERY: Record<Mastery, { label: string; cls: string }> = {
  new:      { label: "New",      cls: "bg-gray-100 text-gray-500" },
  learning: { label: "Learning", cls: "bg-amber-100 text-amber-700" },
  familiar: { label: "Familiar", cls: "bg-blue-100 text-blue-700" },
  strong:   { label: "Strong",   cls: "bg-green-100 text-green-700" },
  mastered: { label: "Mastered", cls: "bg-violet-100 text-violet-700" },
};

const EXAMPLES = [
  {
    dir: "JP → EN",
    dirCls: "bg-blue-50 text-blue-600",
    sentence: "昨日、友達とカフェに行きました。",
    target: "友達",
    reading: "ともだち",
    answer: "Yesterday, I went to a café with a friend.",
    mastery: "learning" as Mastery,
    next: "familiar" as Mastery,
    q: 2,
    total: 5,
  },
  {
    dir: "EN → JP",
    dirCls: "bg-purple-50 text-purple-600",
    sentence: "I eat breakfast every morning.",
    target: "eat breakfast",
    reading: "",
    answer: "毎朝、朝ごはんを食べます。",
    mastery: "new" as Mastery,
    next: "learning" as Mastery,
    q: 4,
    total: 5,
  },
];

const WORD_LIST: { jp: string; en: string; mastery: Mastery }[] = [
  { jp: "友達", en: "friend",    mastery: "familiar" },
  { jp: "食べる", en: "to eat", mastery: "learning" },
  { jp: "楽しい", en: "fun",     mastery: "new" },
];

const AUDIO_BARS = [3, 5, 8, 6, 4, 8, 5, 3, 7, 5, 4, 6];

function splitSentence(sentence: string, target: string): [string, string] {
  const i = sentence.indexOf(target);
  if (i === -1) return [sentence, ""];
  return [sentence.slice(0, i), sentence.slice(i + target.length)];
}

export function FlashcardShowcaseSection() {
  const router = useRouter();
  const [exIdx, setExIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    async function run() {
      while (!cancelled) {
        await delay(2800);
        if (cancelled) break;
        setPhase("correct");
        await delay(2000);
        if (cancelled) break;
        setVisible(false);
        await delay(300);
        if (cancelled) break;
        setExIdx((i) => (i + 1) % EXAMPLES.length);
        setPhase("question");
        setVisible(true);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const ex = EXAMPLES[exIdx];
  const [before, after] = splitSentence(ex.sentence, ex.target);

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left: Practice UI mockup */}
        <div className="flex flex-col items-center gap-4">

          {/* Main practice card */}
          <div
            className={`bg-white rounded-3xl shadow-2xl p-5 w-full max-w-sm transition-all duration-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {/* Progress + direction */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-400 shrink-0">
                Q{ex.q}/{ex.total}
              </span>
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${(ex.q / ex.total) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${ex.dirCls}`}>
                {ex.dir}
              </span>
            </div>

            {/* Question card */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              {/* Audio wave */}
              <div className="flex items-center gap-0.5 mb-3 h-6">
                {AUDIO_BARS.map((h, i) => (
                  <div
                    key={i}
                    className="rounded-full bg-violet-300"
                    style={{
                      width: 2,
                      height: h * 2,
                      opacity: phase === "question" ? 0.5 + (i % 3) * 0.15 : 0.25,
                      transition: "opacity 0.4s",
                    }}
                  />
                ))}
                <span className="ml-2 text-xs text-gray-400">Audio</span>
              </div>

              {/* Sentence */}
              <p className="text-base text-gray-900 leading-relaxed font-medium">
                {before}
                <span className="underline underline-offset-4 decoration-dotted decoration-violet-400">
                  {ex.target}
                </span>
                {after}
              </p>

              {ex.reading && (
                <button className="mt-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Show reading
                </button>
              )}
            </div>

            {/* Input or result */}
            <div
              className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
            >
              {phase === "question" ? (
                <div className="flex flex-col items-center gap-3 py-2">
                  <button className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg shadow-black/30">
                    <Mic className="w-6 h-6 text-white" />
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Hold to speak, or hold Space
                  </p>
                  <button className="text-xs text-gray-400 underline underline-offset-2">
                    Use keyboard
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50 border border-green-200">
                  <span className="text-green-600 font-bold text-lg leading-none mt-0.5">✓</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 italic mb-2 leading-relaxed">
                      {ex.answer}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${MASTERY[ex.mastery].cls}`}>
                        {MASTERY[ex.mastery].label}
                      </span>
                      <span className="text-xs text-gray-400">→</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${MASTERY[ex.next].cls}`}>
                        {MASTERY[ex.next].label}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Word list with mastery badges */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 w-full max-w-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Your words
            </p>
            <div className="divide-y divide-gray-50">
              {WORD_LIST.map((word) => (
                <div key={word.jp} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{word.jp}</span>
                    <span className="text-xs text-gray-400">{word.en}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${MASTERY[word.mastery].cls}`}>
                    {MASTERY[word.mastery].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Text */}
        <div className="font-quicksand">
          <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Flashcard Practice
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-gray-900">
            Practice that{" "}
            <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              actually tests you
            </span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            Your words become sentences. Hear them, answer in real time, and let AI
            judge if you got it right. Watch your mastery grow with every session.
          </p>
          <ul className="space-y-3 mb-10">
            {[
              "Words become real AI-generated sentences in context",
              "Practice both ways — English to Japanese and back",
              "Speak or type — AI judges your answer instantly",
              "Track mastery: New → Learning → Familiar → Strong → Mastered",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-600">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <RoundedButton
            onClick={() => router.push("/signup?plan=trial")}
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-md"
          >
            Try it free →
          </RoundedButton>
        </div>

      </div>
    </section>
  );
}
