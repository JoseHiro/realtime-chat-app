import { useState, useEffect } from "react";
import type { MasteryState, WordProgressSummary, Difficulty } from "../../features/practice/types";

export type Direction = "jp-to-en" | "en-to-jp";
export type VocabWord = { id: string; jp: string; en: string };
export type GrammarItem = { id: string; pattern: string; meaning: string; jlptLevel: string | null; source: string | null };
export type Deck = { id: string; name: string; wordIds: string[] };

const MASTERY_INTERVAL: Record<MasteryState, number> = {
  new: 0, learning: 1, familiar: 3, strong: 7, mastered: 14,
};

function isDue(progress: WordProgressSummary | undefined): boolean {
  if (!progress || !progress.lastSeen) return true;
  const intervalDays = MASTERY_INTERVAL[progress.mastery] ?? 0;
  const dueDate = new Date(progress.lastSeen);
  dueDate.setDate(dueDate.getDate() + intervalDays);
  return dueDate <= new Date();
}

const JLPT_ORDER = ["N5", "N4", "N3", "N2", "N1"];

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item) || "Other";
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

export function useSetupData() {
  const [direction, setDirection] = useState<Direction>("jp-to-en");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [allVocab, setAllVocab] = useState<VocabWord[]>([]);
  const [selectedVocabIds, setSelectedVocabIds] = useState<Set<string>>(new Set());
  const [vocabLoading, setVocabLoading] = useState(true);
  const [allGrammar, setAllGrammar] = useState<GrammarItem[]>([]);
  const [selectedGrammarIds, setSelectedGrammarIds] = useState<Set<string>>(new Set());
  const [grammarLoading, setGrammarLoading] = useState(true);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [decksLoading, setDecksLoading] = useState(true);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, WordProgressSummary>>({});
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    fetch("/api/practice/vocab")
      .then((r) => r.json())
      .then((data) => setAllVocab(Array.isArray(data.words) ? data.words : []))
      .catch(() => {})
      .finally(() => setVocabLoading(false));

    fetch("/api/practice/grammar")
      .then((r) => r.json())
      .then((data) => setAllGrammar(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setGrammarLoading(false));

    fetch("/api/practice/decks")
      .then((r) => r.json())
      .then((data) => setDecks(Array.isArray(data) ? data.map((d: Deck) => ({ ...d, wordIds: Array.isArray(d.wordIds) ? d.wordIds : [] })) : []))
      .catch(() => {})
      .finally(() => setDecksLoading(false));

    fetch("/api/practice/progress/words")
      .then((r) => r.json())
      .then((data: WordProgressSummary[]) => {
        if (!Array.isArray(data)) return;
        const map: Record<string, WordProgressSummary> = {};
        data.forEach((p) => { map[p.wordId] = p; });
        setProgressMap(map);
      })
      .catch(() => {})
      .finally(() => setProgressLoading(false));
  }, []);

  // Auto-select the single deck when decks finish loading
  useEffect(() => {
    if (decksLoading || decks.length === 0) return;
    setSelectedDeckId(decks[0].id);
  }, [decksLoading, decks]);

  useEffect(() => {
    if (!selectedDeckId || !allVocab.length) return;
    const deck = decks.find((d) => d.id === selectedDeckId);
    if (!deck) return;
    const validIds = new Set(allVocab.map((w) => w.id));
    setSelectedVocabIds(new Set(deck.wordIds.filter((id) => validIds.has(id))));
  }, [selectedDeckId, decks, allVocab]);

  function toggleVocab(id: string) {
    setSelectedVocabIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAllVocab() {
    setSelectedVocabIds(
      selectedVocabIds.size === allVocab.length ? new Set() : new Set(allVocab.map((w) => w.id)),
    );
  }

  function focusWeak() {
    const weakIds = allVocab
      .filter((w) => { const m = progressMap[w.id]?.mastery ?? "new"; return m === "new" || m === "learning"; })
      .map((w) => w.id);
    setSelectedVocabIds(new Set(weakIds.length > 0 ? weakIds : allVocab.map((w) => w.id)));
  }

  const weakCount = allVocab.filter((w) => {
    const m = progressMap[w.id]?.mastery ?? "new";
    return m === "new" || m === "learning";
  }).length;

  function focusDue() {
    const dueIds = allVocab.filter((w) => isDue(progressMap[w.id])).map((w) => w.id);
    setSelectedVocabIds(new Set(dueIds.length > 0 ? dueIds : allVocab.map((w) => w.id)));
  }

  const dueCount = allVocab.filter((w) => isDue(progressMap[w.id])).length;

  function autoSelectForStudy(): Set<string> {
    const dueReview = allVocab.filter((w) => { const p = progressMap[w.id]; return p?.lastSeen && isDue(p); });
    const newWords = allVocab.filter((w) => !progressMap[w.id]?.lastSeen).slice(0, 5);
    const ids = new Set([...dueReview, ...newWords].map((w) => w.id));
    setSelectedVocabIds(ids);
    return ids;
  }

  function toggleGrammar(id: string) {
    setSelectedGrammarIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const grammarByJlpt = groupBy(allGrammar, (g) => g.jlptLevel ?? "Other");
  const jlptGroups = [
    ...JLPT_ORDER.filter((l) => grammarByJlpt[l]),
    ...Object.keys(grammarByJlpt).filter((k) => !JLPT_ORDER.includes(k)),
  ];
  const grammarByGenki = groupBy(allGrammar, (g) =>
    g.source?.startsWith("Genki") ? g.source : "__non_genki__",
  );
  const genkiGroups = Object.keys(grammarByGenki)
    .filter((k) => k !== "__non_genki__" && k !== "Other")
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+$/)?.[0] ?? "0", 10);
      const numB = parseInt(b.match(/\d+$/)?.[0] ?? "0", 10);
      return numA !== numB ? numA - numB : a.localeCompare(b);
    });

  return {
    direction, setDirection,
    difficulty, setDifficulty,
    allVocab, selectedVocabIds, vocabLoading,
    decks, decksLoading, selectedDeckId, setSelectedDeckId,
    allGrammar, selectedGrammarIds, grammarLoading,
    toggleVocab, toggleAllVocab, toggleGrammar,
    grammarByJlpt, jlptGroups, grammarByGenki, genkiGroups,
    progressMap, progressLoading,
    focusWeak, weakCount,
    focusDue, dueCount,
    autoSelectForStudy,
  };
}
