import type { VocabWord } from "../../hooks/practice/useSetupData";
import type { GrammarItem } from "../../hooks/practice/useSetupData";
import type { Direction } from "../../hooks/practice/usePractice";

interface SessionInfoModalProps {
  allVocab: VocabWord[];
  selectedVocabIds: Set<string>;
  allGrammar: GrammarItem[];
  selectedGrammarIds: Set<string>;
  direction: Direction;
  onClose: () => void;
}

export function SessionInfoModal({
  allVocab, selectedVocabIds,
  allGrammar, selectedGrammarIds,
  direction, onClose,
}: SessionInfoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Session info</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Vocabulary · {allVocab.filter((w) => selectedVocabIds.has(w.id)).length}
          </p>
          <div className="flex flex-wrap gap-2">
            {allVocab
              .filter((w) => selectedVocabIds.has(w.id))
              .map((w) => (
                <span
                  key={w.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-sm"
                >
                  <span className="font-medium text-gray-800">{w.jp}</span>
                  <span className="text-gray-400">{w.en}</span>
                </span>
              ))}
          </div>
        </div>

        {selectedGrammarIds.size > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Grammar · {selectedGrammarIds.size}
            </p>
            <div className="flex flex-wrap gap-2">
              {allGrammar
                .filter((g) => selectedGrammarIds.has(g.id))
                .map((g) => (
                  <span
                    key={g.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 border border-green-200 text-sm"
                  >
                    <span className="font-semibold text-green-800">{g.pattern}</span>
                    <span className="text-green-600">{g.meaning}</span>
                  </span>
                ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Direction
          </p>
          <p className="text-sm text-gray-700">
            {direction === "jp-to-en" ? "Japanese → English" : "English → Japanese"}
          </p>
        </div>
      </div>
    </div>
  );
}
