import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

export type DrillTaskType = "VOCAB" | "SENTENCE";

export interface TaskVocabularyItem {
  /** Surface form (e.g. kanji) as it appears in the sentence */
  word: string;
  /** Reading in hiragana */
  reading: string;
  /** English meaning */
  meaning: string;
}

export interface DrillTask {
  id: string;
  type: DrillTaskType;
  /** For VOCAB: the word (kanji) */
  word?: string;
  /** For VOCAB: hiragana reading */
  reading?: string;
  /** For SENTENCE: full sentence text */
  sentence?: string;
  /** Optional audio URL; auto-played in Mimic mode */
  audioUrl?: string;
}

export type DrillMode = "mimic" | "speak" | "recall";

interface DrillContainerProps {
  task: DrillTask;
  /** For SENTENCE tasks: words that are tappable for dictionary tooltip */
  taskVocabulary?: TaskVocabularyItem[];
  mode: DrillMode;
  /** Progress 0..1 for the bar */
  progress?: number;
  /** Optional total steps for display, e.g. "3 / 10" */
  currentStep?: number;
  totalSteps?: number;
  onNext?: () => void;
  onAgain?: () => void;
  onGood?: () => void;
  onEasy?: () => void;
  /** Optional: show "Again" / "Good" / "Easy" style buttons (e.g. for SRS) */
  showEvaluationButtons?: boolean;
}

type Segment = { type: "plain"; text: string } | { type: "vocab"; text: string; vocab: TaskVocabularyItem };

function buildSentenceSegments(sentence: string, vocabulary: TaskVocabularyItem[]): Segment[] {
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

export function DrillContainer({
  task,
  taskVocabulary = [],
  mode,
  progress = 0,
  currentStep,
  totalSteps,
  onNext,
  onAgain,
  onGood,
  onEasy,
  showEvaluationButtons = false,
}: DrillContainerProps) {
  const [popoverVocab, setPopoverVocab] = useState<TaskVocabularyItem | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<{ x: number; y: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMimic = mode === "mimic";

  useEffect(() => {
    if (!isMimic || !task.audioUrl) return;
    const audio = new Audio(task.audioUrl);
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [isMimic, task.audioUrl, task.id]);

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
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      closePopover();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [popoverVocab]);

  const segments =
    task.type === "SENTENCE" && task.sentence
      ? buildSentenceSegments(task.sentence, taskVocabulary)
      : [];

  return (
    <div ref={containerRef} className="flex min-h-screen flex-col bg-white">
      {/* Progress bar – top, accent green */}
      <div className="h-1.5 w-full overflow-hidden bg-gray-100">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          role="progressbar"
          aria-valuenow={progress * 100}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {totalSteps != null && currentStep != null && (
        <div className="px-4 py-2 text-center text-sm text-gray-500">
          {currentStep} / {totalSteps}
        </div>
      )}

      {/* Main content – generous spacing */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {task.type === "VOCAB" && (
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="text-4xl font-medium tracking-wide text-gray-900 md:text-5xl" lang="ja">
              {task.word}
            </p>
            <p className="text-3xl text-gray-600 md:text-4xl" lang="ja">
              {task.reading}
            </p>
          </div>
        )}

        {task.type === "SENTENCE" && task.sentence && (
          <div className="max-w-xl text-center">
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
                    {seg.text}
                  </button>
                )
              )}
            </p>
          </div>
        )}
      </main>

      {/* Dictionary popover */}
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

      {/* Bottom actions – accent green */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="mx-auto flex max-w-md flex-col gap-4">
          {showEvaluationButtons ? (
            <div className="flex gap-3">
              {onAgain && (
                <button
                  type="button"
                  onClick={onAgain}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Again
                </button>
              )}
              {onGood && (
                <button
                  type="button"
                  onClick={onGood}
                  className="flex-1 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-medium text-white hover:bg-emerald-600"
                >
                  Good
                </button>
              )}
              {onEasy && (
                <button
                  type="button"
                  onClick={onEasy}
                  className="flex-1 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-medium text-white hover:bg-emerald-600"
                >
                  Easy
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="flex-1 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
