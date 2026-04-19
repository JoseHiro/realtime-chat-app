import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Plus, Trash2, FolderOpen, Pencil, Check, X } from "lucide-react";

interface Word {
  id: string;
  jp: string;
  en: string;
}

interface Deck {
  id: string;
  name: string;
  wordIds: string[];
}

export default function VocabularyPage() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  const [jp, setJp] = useState("");
  const [en, setEn] = useState("");
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newDeckName, setNewDeckName] = useState("");
  const [selectedWordIds, setSelectedWordIds] = useState<Set<string>>(new Set());
  const [showNewDeck, setShowNewDeck] = useState(false);
  const [creatingDeck, setCreatingDeck] = useState(false);

  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
  const [editWordIds, setEditWordIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/practice/vocab").then((r) => r.json()),
      fetch("/api/practice/decks").then((r) => r.json()),
    ]).then(([vocabData, decksData]) => {
      setWords(vocabData.words ?? []);
      setDecks(Array.isArray(decksData) ? decksData : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!router.isReady || loading) return;
    const add = router.query.add;
    if (add === "1" || add === "true") {
      setShowAddForm(true);
      void router.replace("/vocabulary", undefined, { shallow: true });
    }
  }, [router, loading]);

  async function addWord() {
    if (!jp.trim() || !en.trim()) return;
    setAdding(true);
    const res = await fetch("/api/practice/vocab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jp: jp.trim(), en: en.trim() }),
    });
    if (res.ok) {
      const word = await res.json();
      setWords((prev) => [...prev, word]);
      setJp("");
      setEn("");
      setShowAddForm(false);
    }
    setAdding(false);
  }

  async function deleteWord(id: string) {
    await fetch("/api/practice/vocab", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setWords((prev) => prev.filter((w) => w.id !== id));
    setDecks((prev) =>
      prev.map((d) => ({ ...d, wordIds: d.wordIds.filter((wid) => wid !== id) }))
    );
  }

  async function createDeck() {
    if (!newDeckName.trim()) return;
    setCreatingDeck(true);
    const res = await fetch("/api/practice/decks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newDeckName.trim(), wordIds: Array.from(selectedWordIds) }),
    });
    if (res.ok) {
      const deck = await res.json();
      setDecks((prev) => [...prev, deck]);
      setNewDeckName("");
      setSelectedWordIds(new Set());
      setShowNewDeck(false);
    }
    setCreatingDeck(false);
  }

  async function deleteDeck(id: string) {
    await fetch("/api/practice/decks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDecks((prev) => prev.filter((d) => d.id !== id));
  }

  function startEditDeck(deck: Deck) {
    setEditingDeckId(deck.id);
    setEditWordIds(new Set(deck.wordIds));
  }

  function cancelEditDeck() {
    setEditingDeckId(null);
    setEditWordIds(new Set());
  }

  async function saveDeck(deckId: string) {
    setSaving(true);
    const wordIds = Array.from(editWordIds);
    const res = await fetch("/api/practice/decks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deckId, wordIds }),
    });
    if (res.ok) {
      setDecks((prev) =>
        prev.map((d) => (d.id === deckId ? { ...d, wordIds } : d))
      );
      cancelEditDeck();
    }
    setSaving(false);
  }

  function toggleEditWord(id: string) {
    setEditWordIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Vocabulary</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {words.length} word{words.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add word
          </button>
        </div>

        {/* Add word form */}
        {showAddForm && (
          <div className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">New word</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Japanese (e.g. 行く)"
                value={jp}
                onChange={(e) => setJp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addWord()}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              />
              <input
                type="text"
                placeholder="English (e.g. to go)"
                value={en}
                onChange={(e) => setEn(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addWord()}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              />
              <div className="flex gap-2">
                <button
                  onClick={addWord}
                  disabled={adding || !jp.trim() || !en.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  {adding ? "Adding…" : "Add"}
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setJp(""); setEn(""); }}
                  className="px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Word list */}
        {words.length > 0 ? (
          <div className="mb-10 rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            {words.map((word) => (
              <div key={word.id} className="flex items-center justify-between px-4 py-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{word.jp}</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500 truncate">{word.en}</span>
                </div>
                <button
                  onClick={() => deleteWord(word.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-10 py-12 text-center text-sm text-gray-400 dark:text-gray-600 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
            No words yet. Add your first word above.
          </div>
        )}

        {/* Decks section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Deck</p>
            {decks.length === 0 && (
              <button
                onClick={() => setShowNewDeck(true)}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New deck
              </button>
            )}
          </div>

          {/* New deck form */}
          {showNewDeck && (
            <div className="mb-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <input
                autoFocus
                type="text"
                placeholder="Deck name"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                className="w-full mb-3 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              />
              {words.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select words to include</p>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800">
                    {words.map((word) => (
                      <label
                        key={word.id}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <input
                          type="checkbox"
                          checked={selectedWordIds.has(word.id)}
                          onChange={(e) => {
                            const next = new Set(selectedWordIds);
                            if (e.target.checked) next.add(word.id);
                            else next.delete(word.id);
                            setSelectedWordIds(next);
                          }}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-800 dark:text-gray-200">{word.jp}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{word.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={createDeck}
                  disabled={creatingDeck || !newDeckName.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  {creatingDeck ? "Creating…" : "Create"}
                </button>
                <button
                  onClick={() => { setShowNewDeck(false); setNewDeckName(""); setSelectedWordIds(new Set()); }}
                  className="px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {decks.length > 0 ? (
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
              {decks.map((deck) => (
                <div key={deck.id}>
                  {/* Deck row */}
                  <div className="flex items-center justify-between px-4 py-3 group">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{deck.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {deck.wordIds.length} word{deck.wordIds.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => editingDeckId === deck.id ? cancelEditDeck() : startEditDeck(deck)}
                        className="p-1.5 rounded-md text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDeck(deck.id)}
                        className="p-1.5 rounded-md text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Edit panel */}
                  {editingDeckId === deck.id && (
                    <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 pt-2">Select words in this deck</p>
                      {words.length === 0 ? (
                        <p className="text-xs text-gray-400">No words yet.</p>
                      ) : (
                        <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 mb-3">
                          {words.map((word) => (
                            <label
                              key={word.id}
                              className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <input
                                type="checkbox"
                                checked={editWordIds.has(word.id)}
                                onChange={() => toggleEditWord(word.id)}
                                className="accent-green-600 rounded"
                              />
                              <span className="text-sm text-gray-800 dark:text-gray-200">{word.jp}</span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">{word.en}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveDeck(deck.id)}
                          disabled={saving}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {saving ? "Saving…" : "Save"}
                        </button>
                        <button
                          onClick={cancelEditDeck}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-600 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              No decks yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
