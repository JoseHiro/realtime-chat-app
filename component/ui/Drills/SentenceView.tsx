import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface TaskVocabularyItem {
  word: string;
  reading: string;
  meaning: string;
}

type Segment =
  | { type: "plain"; text: string }
  | { type: "vocab"; text: string; vocab: TaskVocabularyItem };

function buildSentenceSegments(
  sentence: string,
  vocabulary: TaskVocabularyItem[]
): Segment[] {
  if (!vocabulary.length) return [{ type: "plain", text: sentence }];
  const sorted = [...vocabulary].sort((a, b) => b.word.length - a.word.length);
  const segments: Segment[] = [];
  let remaining = sentence;
  while (remaining.length > 0) {
    let found = false;
    for (const item of sorted) {
      if (remaining.startsWith(item.word)) {
        segments.push({ type: "vocab", text: item.word, vocab: item });
        remaining = remaining.slice(item.word.length);
        found = true;
        break;
      }
    }
    if (!found) {
      const nextVocab = sorted.find((v) => remaining.includes(v.word));
      const nextIndex = nextVocab ? remaining.indexOf(nextVocab.word) : remaining.length;
      if (nextIndex > 0) {
        segments.push({ type: "plain", text: remaining.slice(0, nextIndex) });
        remaining = remaining.slice(nextIndex);
      } else if (nextVocab) {
        segments.push({ type: "vocab", text: nextVocab.word, vocab: nextVocab });
        remaining = remaining.slice(nextVocab.word.length);
      } else {
        segments.push({ type: "plain", text: remaining });
        break;
      }
    }
  }
  return segments;
}

interface SentenceViewProps {
  /** Japanese sentence or phrase (targetJapanese) */
  text: string;
  taskVocabulary?: TaskVocabularyItem[];
  /** When true, show readings (hiragana) for vocabulary segments instead of surface form */
  showHiragana?: boolean;
  className?: string;
}

export function SentenceView({
  text,
  taskVocabulary = [],
  showHiragana = false,
  className = "",
}: SentenceViewProps) {
  const [popoverVocab, setPopoverVocab] = useState<TaskVocabularyItem | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<{ x: number; y: number } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const segments = buildSentenceSegments(text, taskVocabulary);

  const handleVocabClick = (e: React.MouseEvent, vocab: TaskVocabularyItem) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopoverAnchor({ x: rect.left + rect.width / 2, y: rect.bottom });
    setPopoverVocab(vocab);
  };

  const closePopover = () => {
    setPopoverVocab(null);
    setPopoverAnchor(null);
  };

  useEffect(() => {
    if (!popoverVocab) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      closePopover();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [popoverVocab]);

  return (
    <div ref={containerRef} className={className}>
      <p className="text-2xl leading-relaxed text-gray-900 md:text-3xl" lang="ja">
        {segments.map((seg, i) =>
          seg.type === "plain" ? (
            <span key={i}>{seg.text}</span>
          ) : (
            <button
              key={i}
              type="button"
              onClick={(e) => handleVocabClick(e, seg.vocab)}
              className="border-b-2 border-dotted border-gray-400 pb-0.5 text-inherit hover:border-emerald-500 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
            >
              {showHiragana ? seg.vocab.reading : seg.text}
            </button>
          )
        )}
      </p>

      {popoverVocab && popoverAnchor && (
        <div
          className="fixed z-50 -translate-x-1/2 -translate-y-full"
          style={{ left: popoverAnchor.x, top: popoverAnchor.y - 8 }}
          role="tooltip"
        >
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900" lang="ja">
                  {popoverVocab.word}
                </p>
                <p className="text-sm text-gray-600" lang="ja">
                  {popoverVocab.reading}
                </p>
                <p className="mt-1 text-sm text-gray-700">{popoverVocab.meaning}</p>
              </div>
              <button
                type="button"
                onClick={closePopover}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
