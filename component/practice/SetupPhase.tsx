import { useMemo, useState } from "react";
import { MasteryBadge } from "./MasteryBadge";
import type { Direction } from "../../hooks/practice/usePractice";
import type { VocabWord, GrammarItem, Deck } from "../../hooks/practice/useSetupData";
import type { WordProgressSummary } from "../../features/practice/types";

const JLPT_RANK: Record<string, number> = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 };

function isGenkiRow(g: GrammarItem): boolean {
  return Boolean(g.source?.startsWith("Genki"));
}

type GrammarCatalog = "jlpt" | "genki";

function filterGrammar(
  items: GrammarItem[],
  query: string,
  catalog: GrammarCatalog,
  jlpt: string,
  genki: string,
): GrammarItem[] {
  const q = query.trim().toLowerCase();
  return items.filter((g) => {
    if (catalog === "genki") {
      if (!isGenkiRow(g)) return false;
      if (genki && g.source !== genki) return false;
    } else {
      if (isGenkiRow(g)) return false;
      if (jlpt && g.jlptLevel !== jlpt) return false;
    }
    if (q) {
      const inPat = g.pattern.toLowerCase().includes(q);
      const inMean = g.meaning.toLowerCase().includes(q);
      if (!inPat && !inMean) return false;
    }
    return true;
  });
}

function filterVocabWords(words: VocabWord[], query: string): VocabWord[] {
  const q = query.trim().toLowerCase();
  if (!q) return words;
  return words.filter(
    (w) => w.jp.toLowerCase().includes(q) || w.en.toLowerCase().includes(q),
  );
}

function sortGrammarForCatalog(a: GrammarItem, b: GrammarItem, catalog: GrammarCatalog): number {
  if (catalog === "genki") {
    return (a.source ?? "").localeCompare(b.source ?? "", "en");
  }
  const ra = a.jlptLevel != null ? (JLPT_RANK[a.jlptLevel] ?? 99) : 99;
  const rb = b.jlptLevel != null ? (JLPT_RANK[b.jlptLevel] ?? 99) : 99;
  if (ra !== rb) return ra - rb;
  return a.pattern.localeCompare(b.pattern, "ja");
}

interface SetupPhaseProps {
  direction: Direction;
  onDirectionChange: (d: Direction) => void;
  allVocab: VocabWord[];
  selectedVocabIds: Set<string>;
  vocabLoading: boolean;
  onToggleVocab: (id: string) => void;
  onToggleAllVocab: () => void;
  decks: Deck[];
  decksLoading: boolean;
  selectedDeckId: string | null;
  onDeckChange: (deckId: string | null) => void;
  allGrammar: GrammarItem[];
  selectedGrammarIds: Set<string>;
  grammarLoading: boolean;
  onToggleGrammar: (id: string) => void;
  grammarByJlpt: Record<string, GrammarItem[]>;
  jlptGroups: string[];
  grammarByGenki: Record<string, GrammarItem[]>;
  genkiGroups: string[];
  progressMap: Record<string, WordProgressSummary>;
  onFocusWeak: () => void;
  weakCount: number;
  onFocusDue: () => void;
  dueCount: number;
  error: string;
  onStart: () => void;
}

export function SetupPhase({
  direction, onDirectionChange,
  allVocab, selectedVocabIds, vocabLoading, onToggleVocab, onToggleAllVocab,
  decks, decksLoading, selectedDeckId, onDeckChange,
  allGrammar, selectedGrammarIds, grammarLoading, onToggleGrammar,
  grammarByJlpt, jlptGroups, grammarByGenki, genkiGroups,
  progressMap, onFocusWeak, weakCount, onFocusDue, dueCount,
  error, onStart,
}: SetupPhaseProps) {
  const [vocabQuery, setVocabQuery] = useState("");
  const [grammarCatalog, setGrammarCatalog] = useState<GrammarCatalog>("jlpt");
  const [grammarQuery, setGrammarQuery] = useState("");
  const [grammarJlptFilter, setGrammarJlptFilter] = useState("");
  const [grammarGenkiFilter, setGrammarGenkiFilter] = useState("");

  const filteredVocab = useMemo(() => filterVocabWords(allVocab, vocabQuery), [allVocab, vocabQuery]);

  const filteredGrammar = useMemo(() => {
    const list = filterGrammar(allGrammar, grammarQuery, grammarCatalog, grammarJlptFilter, grammarGenkiFilter);
    return [...list].sort((a, b) => sortGrammarForCatalog(a, b, grammarCatalog));
  }, [allGrammar, grammarQuery, grammarCatalog, grammarJlptFilter, grammarGenkiFilter]);

  function switchGrammarCatalog(next: GrammarCatalog) {
    setGrammarCatalog(next);
    setGrammarJlptFilter("");
    setGrammarGenkiFilter("");
  }

  return (
    <div className="space-y-6">
      {/* Direction */}
      <div>
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

      {/* Deck */}
      {!decksLoading && decks.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Use deck</p>
          <select
            value={selectedDeckId ?? ""}
            onChange={(e) => onDeckChange(e.target.value || null)}
            className="w-full max-w-xs px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="">No deck</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name} ({deck.wordIds.length})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Vocabulary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Vocabulary</p>
          {allVocab.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {dueCount > 0 && (
                <button onClick={onFocusDue} className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">
                  Review due ({dueCount})
                </button>
              )}
              {weakCount > 0 && (
                <button onClick={onFocusWeak} className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                  Focus weak ({weakCount})
                </button>
              )}
              <button onClick={onToggleAllVocab} className="text-xs text-green-600 dark:text-green-400 hover:underline">
                {selectedVocabIds.size === allVocab.length ? "Deselect all" : "Select all"}
              </button>
            </div>
          )}
        </div>
        {vocabLoading ? (
          <p className="text-sm text-gray-400 animate-pulse">Loading…</p>
        ) : allVocab.length === 0 ? (
          <p className="text-sm text-gray-400">No words added yet.</p>
        ) : (
          <>
            <input
              type="search"
              value={vocabQuery}
              onChange={(e) => setVocabQuery(e.target.value)}
              placeholder="Search words…"
              className="w-full mb-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              autoComplete="off"
            />
            {filteredVocab.length === 0 ? (
              <p className="text-sm text-gray-400">No matches.</p>
            ) : (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                {filteredVocab.map((w) => (
                  <label
                    key={w.id}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedVocabIds.has(w.id)}
                      onChange={() => onToggleVocab(w.id)}
                      className="accent-green-600 w-4 h-4 shrink-0"
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{w.jp}</span>
                    <span className="text-sm text-gray-400 dark:text-gray-500 flex-1">{w.en}</span>
                    <MasteryBadge mastery={progressMap[w.id]?.mastery ?? "new"} variant="dot" />
                  </label>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Session size indicator */}
      {selectedVocabIds.size > 0 && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            {selectedVocabIds.size} {selectedVocabIds.size === 1 ? "word" : "words"} selected
            · {selectedVocabIds.size * 2} questions
          </span>
          {selectedVocabIds.size < 5 && (
            <span className="text-amber-500 dark:text-amber-400">— add more for a fuller session</span>
          )}
          {selectedVocabIds.size > 20 && (
            <span className="text-amber-500 dark:text-amber-400">— consider splitting into shorter sessions</span>
          )}
        </div>
      )}

      {/* Grammar */}
      <div>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Grammar</p>
          <span className="text-xs text-gray-400 dark:text-gray-500">(optional)</span>
        </div>

        {grammarLoading ? (
          <p className="text-sm text-gray-400 animate-pulse">Loading…</p>
        ) : allGrammar.length === 0 ? (
          <p className="text-sm text-gray-400">No grammar patterns loaded.</p>
        ) : (
          <>
            <div className="flex gap-1 mb-3 border-b border-gray-100 dark:border-gray-800">
              {(["jlpt", "genki"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => switchGrammarCatalog(cat)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                    grammarCatalog === cat
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {cat === "jlpt" ? "By JLPT level" : "By Genki chapter"}
                </button>
              ))}
            </div>

            <input
              type="search"
              value={grammarQuery}
              onChange={(e) => setGrammarQuery(e.target.value)}
              placeholder="Search grammar…"
              className="w-full mb-3 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              autoComplete="off"
            />

            {grammarCatalog === "jlpt" ? (
              <div className="mb-3">
                <select
                  value={grammarJlptFilter}
                  onChange={(e) => setGrammarJlptFilter(e.target.value)}
                  className="w-full max-w-md px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All JLPT levels</option>
                  {jlptGroups.map((level) => {
                    const jlptOnly = (grammarByJlpt[level] ?? []).filter((g) => !isGenkiRow(g));
                    return jlptOnly.length > 0 ? (
                      <option key={level} value={level}>{level} ({jlptOnly.length})</option>
                    ) : null;
                  })}
                </select>
              </div>
            ) : (
              <div className="mb-3">
                <select
                  value={grammarGenkiFilter}
                  onChange={(e) => setGrammarGenkiFilter(e.target.value)}
                  className="w-full max-w-md px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  disabled={genkiGroups.length === 0}
                >
                  <option value="">All chapters</option>
                  {genkiGroups.map((src) => (
                    <option key={src} value={src}>{src} ({grammarByGenki[src]?.length ?? 0})</option>
                  ))}
                </select>
                {genkiGroups.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">No Genki grammar loaded.</p>
                )}
              </div>
            )}

            {selectedGrammarIds.size > 0 && (
              <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                {selectedGrammarIds.size} {selectedGrammarIds.size === 1 ? "pattern" : "patterns"} selected
              </p>
            )}

            {filteredGrammar.length === 0 ? (
              <p className="text-sm text-gray-400">No matches.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                {filteredGrammar.map((g) => (
                  <label
                    key={g.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedGrammarIds.has(g.id)}
                        onChange={() => onToggleGrammar(g.id)}
                        className="accent-green-600 w-4 h-4 shrink-0"
                      />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 shrink-0">{g.pattern}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 min-w-0 truncate">{g.meaning}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-7 sm:pl-0 text-[11px] text-gray-400 shrink-0">
                      {g.jlptLevel && (
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-medium">{g.jlptLevel}</span>
                      )}
                      {g.source?.startsWith("Genki") && (
                        <span className="truncate max-w-[10rem] sm:max-w-[12rem]" title={g.source}>{g.source}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={onStart}
        disabled={selectedVocabIds.size === 0}
        className="px-5 py-2.5 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {selectedVocabIds.size === 0
          ? "Start practice"
          : `Start practice (${selectedVocabIds.size} ${selectedVocabIds.size === 1 ? "word" : "words"})`}
      </button>
    </div>
  );
}
