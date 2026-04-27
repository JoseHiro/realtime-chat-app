import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import type { Direction } from "../../hooks/practice/usePractice";
import type { Deck, GrammarItem, VocabWord } from "../../hooks/practice/useSetupData";
import type { MasteryState, WordProgressSummary, Difficulty } from "../../features/practice/types";
import { GuideModal } from "./GuideModal";

interface SetupPhaseProps {
  direction: Direction;
  onDirectionChange: (d: Direction) => void;
  decks: Deck[];
  decksLoading: boolean;
  allVocab: VocabWord[];
  selectedVocabIds: Set<string>;
  progressMap: Record<string, WordProgressSummary>;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  allGrammar: GrammarItem[];
  selectedGrammarIds: Set<string>;
  grammarByJlpt: Record<string, GrammarItem[]>;
  jlptGroups: string[];
  grammarByGenki: Record<string, GrammarItem[]>;
  genkiGroups: string[];
  toggleGrammar: (id: string) => void;
  error: string;
  onStart: () => void;
}

type SectionKey = "genki" | "jlpt";

const masteryColors: Record<MasteryState, string> = {
  new:      "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  learning: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
  familiar: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
  strong:   "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
  mastered: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400",
};

const masteryLabel: Record<MasteryState, string> = {
  new: "New", learning: "Learning", familiar: "Familiar", strong: "Strong", mastered: "Mastered",
};

export function SetupPhase({
  direction, onDirectionChange,
  difficulty, onDifficultyChange,
  decks, decksLoading,
  allVocab, selectedVocabIds, progressMap,
  allGrammar, selectedGrammarIds,
  grammarByJlpt, jlptGroups,
  grammarByGenki, genkiGroups,
  toggleGrammar,
  error, onStart,
}: SetupPhaseProps) {
  const router = useRouter();
  const deck = decks[0] ?? null;
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(new Set());
  const [grammarSearch, setGrammarSearch] = useState("");
  const [showWords, setShowWords] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("practice_guide_dismissed") !== "1") {
      setShowGuide(true);
    }
  }, []);

  function closeGuide() {
    localStorage.setItem("practice_guide_dismissed", "1");
    setShowGuide(false);
  }

  const deckWords = useMemo(
    () => allVocab.filter((w) => selectedVocabIds.has(w.id)),
    [allVocab, selectedVocabIds],
  );

  const filteredGrammar = useMemo(() => {
    const q = grammarSearch.trim().toLowerCase();
    if (!q) return null;
    return allGrammar.filter(
      (g) => g.pattern.toLowerCase().includes(q) || g.meaning.toLowerCase().includes(q),
    );
  }, [grammarSearch, allGrammar]);

  function toggleSection(s: SectionKey) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  }

  function handleGroupSelectAll(items: GrammarItem[]) {
    const allSelected = items.every((g) => selectedGrammarIds.has(g.id));
    items.forEach((g) => {
      const isSelected = selectedGrammarIds.has(g.id);
      if (allSelected ? isSelected : !isSelected) toggleGrammar(g.id);
    });
  }

  function renderItems(items: GrammarItem[]) {
    return items.map((g) => (
      <button
        key={g.id}
        onClick={() => toggleGrammar(g.id)}
        title={g.meaning}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
          selectedGrammarIds.has(g.id)
            ? "bg-black dark:bg-white text-white dark:text-gray-900 border-black dark:border-white"
            : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        {g.pattern}
      </button>
    ));
  }

  function renderGroups(groups: string[], byGroup: Record<string, GrammarItem[]>) {
    return (
      <div className="space-y-4 pt-1">
        {groups.map((group) => {
          const items = byGroup[group] ?? [];
          const selectedCount = items.filter((g) => selectedGrammarIds.has(g.id)).length;
          const allSelected = selectedCount === items.length;
          return (
            <div key={group}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {group}
                  {selectedCount > 0 && (
                    <span className="ml-1.5 text-gray-400 dark:text-gray-500 font-normal">
                      · {selectedCount}/{items.length}
                    </span>
                  )}
                </p>
                <button
                  onClick={() => handleGroupSelectAll(items)}
                  className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">{renderItems(items)}</div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderSection(key: SectionKey, label: string, groups: string[], byGroup: Record<string, GrammarItem[]>) {
    const allItems = groups.flatMap((g) => byGroup[g] ?? []);
    const selectedCount = allItems.filter((g) => selectedGrammarIds.has(g.id)).length;
    const isOpen = openSections.has(key);
    return (
      <div key={key} className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
            {selectedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-black dark:bg-white text-white dark:text-gray-900 text-[10px] font-semibold">
                {selectedCount}
              </span>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800">
            {renderGroups(groups, byGroup)}
          </div>
        )}
      </div>
    );
  }

  if (decksLoading) {
    return <p className="text-sm text-gray-400 animate-pulse">Loading…</p>;
  }

  const setupGuideSteps = [
    {
      title: "Welcome to Flashcards",
      body: <p>Practice Japanese with AI-generated sentences built from your own vocabulary. Let&apos;s get you set up in 3 steps.</p>,
    },
    {
      title: "Step 1 — Add vocabulary",
      body: (
        <>
          <p>Go to the <strong className="text-gray-700 dark:text-gray-300">Vocabulary</strong> tab and add Japanese words you want to study.</p>
          <p className="mt-2">Each word will be used to generate unique practice sentences just for you.</p>
        </>
      ),
    },
    {
      title: "Step 2 — Create a deck",
      body: <p>Group your words into a <strong className="text-gray-700 dark:text-gray-300">deck</strong>. You can only have one deck for now, so add all the words you want to practice.</p>,
    },
    {
      title: "Step 3 — Start practicing",
      body: (
        <>
          <p>Choose a <strong className="text-gray-700 dark:text-gray-300">difficulty</strong> level and optionally add grammar patterns.</p>
          <p className="mt-2">The AI will generate sentences using your deck words. You type or speak your answer.</p>
        </>
      ),
    },
  ];

  if (!deck) {
    return (
      <>
        {showGuide && <GuideModal steps={setupGuideSteps} onClose={closeGuide} />}
        <div className="py-12 space-y-8">
          <div className="space-y-4">
            {[
              { step: "1", title: "Add vocabulary", desc: "Go to the Vocabulary tab and add Japanese words to your collection." },
              { step: "2", title: "Create a deck", desc: "Create a deck and add your words to it." },
              { step: "3", title: "Practice", desc: "Choose difficulty and grammar patterns, then start your session." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-semibold flex items-center justify-center">
                  {step}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push({ pathname: "/flashcards", query: { tab: "vocabulary" } })}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Go to Vocabulary →
            </button>
            <button
              onClick={() => setShowGuide(true)}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              View guide
            </button>
          </div>
        </div>
      </>
    );
  }

  const practiceGuideSteps = [
    {
      title: "How to practice",
      body: <p>Choose your settings below and the AI will generate Japanese sentences using words from your deck. Type or speak your answer to each one.</p>,
    },
    {
      title: "Your deck",
      body: <p>Tap the deck card to see all words and their current mastery level. The AI will use these words to build your practice sentences.</p>,
      targetId: "guide-deck",
    },
    {
      title: "Grammar (optional)",
      body: (
        <>
          <p>Select patterns from <strong className="text-gray-700 dark:text-gray-300">Genki</strong> or <strong className="text-gray-700 dark:text-gray-300">JLPT</strong> to focus on in your sentences.</p>
          <p className="mt-2">If none are selected, the AI picks grammar naturally based on the difficulty level.</p>
        </>
      ),
      targetId: "guide-grammar",
    },
    {
      title: "Difficulty",
      body: (
        <ul className="space-y-1.5">
          <li><strong className="text-gray-700 dark:text-gray-300">Easy</strong> — Short sentences with N5-level vocabulary.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Medium</strong> — Intermediate length, N4–N3 vocabulary.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Hard</strong> — Complex structures, N2–N1 vocabulary and keigo.</li>
        </ul>
      ),
      targetId: "guide-difficulty",
    },
    {
      title: "Answering & scoring",
      body: (
        <>
          <p>Type your answer or use voice input. Hints are available if you get stuck.</p>
          <p className="mt-2"><strong className="text-gray-700 dark:text-gray-300">Try again</strong> lets you redo the session without affecting your streak or mastery progress.</p>
        </>
      ),
    },
  ];

  return (
    <>
      {showGuide && <GuideModal steps={practiceGuideSteps} onClose={closeGuide} />}
      <div className="space-y-6">
      {/* Deck info */}
      <div id="guide-deck" className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <button
          onClick={() => setShowWords((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        >
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Deck</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{deck.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {selectedVocabIds.size} {selectedVocabIds.size === 1 ? "word" : "words"}
            </p>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${showWords ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showWords && (
          <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800/60">
            {deckWords.map((word) => {
              const mastery = progressMap[word.id]?.mastery ?? "new";
              return (
                <div key={word.id} className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{word.jp}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 truncate">{word.en}</span>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${masteryColors[mastery]}`}>
                    {masteryLabel[mastery]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Direction */}
      <div id="guide-direction">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Direction</p>
        <div className="flex gap-2">
          {(["jp-to-en", "en-to-jp"] as Direction[]).map((d) => (
            <button
              key={d}
              onClick={() => onDirectionChange(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                direction === d
                  ? "bg-black dark:bg-white text-white dark:text-gray-900 border-black dark:border-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {d === "jp-to-en" ? "Japanese → English" : "English → Japanese"}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div id="guide-difficulty">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Difficulty</p>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">· results may vary due to AI</span>
        </div>
        <div className="flex gap-2">
          {([
            { value: "easy",   label: "Easy",   sub: "Short & simple"   },
            { value: "medium", label: "Medium", sub: "Intermediate"      },
            { value: "hard",   label: "Hard",   sub: "Complex & longer"  },
          ] as { value: Difficulty; label: string; sub: string }[]).map(({ value, label, sub }) => (
            <button
              key={value}
              onClick={() => onDifficultyChange(value)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border text-left ${
                difficulty === value
                  ? "bg-black dark:bg-white text-white dark:text-gray-900 border-black dark:border-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {label}
              <span className={`block text-[10px] font-normal mt-0.5 ${difficulty === value ? "text-white/70 dark:text-gray-900/60" : "text-gray-400 dark:text-gray-500"}`}>
                {sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grammar */}
      {allGrammar.length > 0 && (
        <div id="guide-grammar" className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Grammar</p>
            {selectedGrammarIds.size > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {selectedGrammarIds.size} selected
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            <input
              type="text"
              value={grammarSearch}
              onChange={(e) => setGrammarSearch(e.target.value)}
              placeholder="Search grammar…"
              className="w-full pl-8 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
            />
            {grammarSearch && (
              <button
                onClick={() => setGrammarSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search results or accordion */}
          {filteredGrammar ? (
            filteredGrammar.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No results</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {renderItems(filteredGrammar)}
              </div>
            )
          ) : (
            <div className="space-y-2">
              {genkiGroups.length > 0 && renderSection("genki", "Genki", genkiGroups, grammarByGenki)}
              {jlptGroups.length > 0 && renderSection("jlpt", "JLPT", jlptGroups, grammarByJlpt)}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={onStart}
          disabled={selectedVocabIds.size === 0}
          className="px-5 py-2.5 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {selectedVocabIds.size === 0
            ? "No words in deck"
            : `Start practice (${selectedVocabIds.size} ${selectedVocabIds.size === 1 ? "word" : "words"})`}
        </button>
        <button
          onClick={() => setShowGuide(true)}
          title="How to use"
          className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-xs font-medium"
        >
          ?
        </button>
      </div>
    </div>
    </>
  );
}
