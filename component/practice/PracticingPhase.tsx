import { useEffect, useRef } from "react";
import { ProgressBar } from "./ProgressBar";
import type { SessionQuestion, SupportingWord } from "../../features/practice/types";
import type { QuestionResult, InputMode } from "../../hooks/practice/usePractice";

interface PracticingPhaseProps {
  currentQuestion: SessionQuestion;
  isRetry: boolean;
  queuePos: number;
  queueLength: number;
  audioUrls: Map<string, string>;
  currentJudge: QuestionResult | null;
  judging: boolean;
  answer: string;
  setAnswer: (a: string) => void;
  inputMode: InputMode;
  setInputMode: (m: InputMode) => void;
  isRecording: boolean;
  showHint: boolean;
  setShowHint: (v: boolean) => void;
  showSentence: boolean;
  setShowSentence: (v: boolean) => void;
  activeHintWord: SupportingWord | null;
  setActiveHintWord: (w: SupportingWord | null) => void;
  onShowSessionInfo: () => void;
  isEnToJp: boolean;
  isLastQuestion: boolean;
  onNext: () => void;
  handleTextSubmit: (e: React.SyntheticEvent) => void;
  handleRecordStart: () => void;
  handleRecordEnd: () => void;
}

export function PracticingPhase({
  currentQuestion, isRetry, queuePos, queueLength, audioUrls,
  currentJudge, judging,
  answer, setAnswer, inputMode, setInputMode, isRecording,
  showHint, setShowHint, showSentence, setShowSentence, activeHintWord, setActiveHintWord,
  onShowSessionInfo, isEnToJp, isLastQuestion,
  onNext,
  handleTextSubmit, handleRecordStart, handleRecordEnd,
}: PracticingPhaseProps) {
  const currentQ = currentQuestion;
  const currentAudio = audioUrls.get(currentQ.id) ?? null;
  const promptText = isEnToJp ? currentQ.translation : currentQ.sentence;

  const handleRecordStartRef = useRef(handleRecordStart);
  handleRecordStartRef.current = handleRecordStart;
  const handleRecordEndRef = useRef(handleRecordEnd);
  handleRecordEndRef.current = handleRecordEnd;
  const isRecordingRef = useRef(isRecording);
  isRecordingRef.current = isRecording;

  useEffect(() => {
    if (inputMode !== "voice" || currentJudge) return;
    let holding = false;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== " " || e.repeat || e.isComposing) return;
      const t = e.target as Element | null;
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA" || t?.tagName === "SELECT") return;
      e.preventDefault();
      if (!holding) { holding = true; handleRecordStartRef.current(); }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key !== " " || !holding) return;
      holding = false;
      handleRecordEndRef.current();
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [inputMode, currentJudge]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentJudge) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onNext();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [currentJudge]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentAudio || isEnToJp) return;
    const audio = new Audio(currentAudio);
    audio.play().catch(() => {});
  }, [currentAudio, isEnToJp]);

  return (
    <div className="flex flex-col gap-5 min-h-[60vh]">
      {/* Progress header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-2">
            Question {queuePos + 1} / {queueLength}
            {isRetry && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                ↻ Retry
              </span>
            )}
          </span>
          <button
            onClick={onShowSessionInfo}
            className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            Session info
          </button>
        </div>
        <ProgressBar value={queuePos + (currentJudge ? 1 : 0)} total={queueLength} />
      </div>

      {/* Question card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        {currentAudio ? (
          <div className="mb-4">
            <audio controls controlsList="nodownload" tabIndex={-1} src={currentAudio} className="w-full h-8" />
          </div>
        ) : (
          <div className="flex items-center gap-3 h-10 mb-4">
            <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/40 animate-pulse shrink-0" />
            <div className="flex-1 h-2 bg-violet-100 dark:bg-violet-900/40 animate-pulse rounded-full" />
          </div>
        )}

        {showSentence || currentJudge ? (
          <div className="mb-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-2xl text-gray-900 dark:text-gray-100 leading-relaxed">
                {(() => {
                  const targetWord: SupportingWord = {
                    word: currentQ.wordInSentence,
                    reading: currentQ.wordReading,
                    meaning: currentQ.wordUsed.en,
                  };
                  const allWords: { annotation: SupportingWord; isTarget: boolean }[] = [
                    { annotation: targetWord, isTarget: true },
                    ...(currentQ.supportingWords ?? []).map((sw) => ({ annotation: sw, isTarget: false })),
                  ];

                  type Segment = { text: string; annotation: SupportingWord | null; isTarget: boolean };
                  const matches: { start: number; end: number; annotation: SupportingWord; isTarget: boolean }[] = [];
                  for (const { annotation, isTarget } of allWords) {
                    const idx = annotation.word ? promptText.indexOf(annotation.word) : -1;
                    if (idx !== -1) matches.push({ start: idx, end: idx + annotation.word.length, annotation, isTarget });
                  }
                  matches.sort((a, b) => a.start - b.start);

                  const segments: Segment[] = [];
                  let pos = 0;
                  for (const m of matches) {
                    if (m.start > pos) segments.push({ text: promptText.slice(pos, m.start), annotation: null, isTarget: false });
                    segments.push({ text: promptText.slice(m.start, m.end), annotation: m.annotation, isTarget: m.isTarget });
                    pos = m.end;
                  }
                  if (pos < promptText.length) segments.push({ text: promptText.slice(pos), annotation: null, isTarget: false });

                  if (segments.length === 0) return promptText;

                  return segments.map((seg, i) => {
                    if (!seg.annotation) return <span key={i}>{seg.text}</span>;
                    const isActive = activeHintWord?.word === seg.annotation.word;
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveHintWord(isActive ? null : seg.annotation!)}
                        className={`underline underline-offset-4 decoration-dotted text-gray-900 dark:text-gray-100 cursor-pointer ${
                          seg.isTarget ? "decoration-violet-400" : "decoration-gray-400 dark:decoration-gray-600"
                        }`}
                      >
                        {seg.text}
                      </button>
                    );
                  });
                })()}
              </p>
              {!currentJudge && (
                <button
                  onClick={() => { setShowSentence(false); setShowHint(false); }}
                  className="shrink-0 mt-1 text-xs text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                >
                  Hide
                </button>
              )}
            </div>
            {!isEnToJp &&
              (showHint ? (
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">{currentQ.furigana}</p>
                  <button
                    onClick={() => setShowHint(false)}
                    className="text-xs text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors self-start"
                  >
                    Hide reading
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowHint(true)}
                  className="mt-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  Show reading
                </button>
              ))}
            {activeHintWord && (
              <div className="mt-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700">
                  <span className="text-xs text-violet-500">💡</span>
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">{activeHintWord.word}</span>
                  <span className="text-xs text-violet-500 dark:text-violet-400">{activeHintWord.reading}</span>
                  <span className="text-xs text-violet-400">—</span>
                  <span className="text-sm text-violet-600 dark:text-violet-300">{activeHintWord.meaning}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowSentence(true)}
            className="mb-3 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors underline underline-offset-2"
          >
            Show sentence
          </button>
        )}
      </div>

      {/* Result panel */}
      {currentJudge && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border ${
            currentJudge.correct
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          <span className={`text-2xl leading-none mt-0.5 ${currentJudge.correct ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            {currentJudge.correct ? "✓" : "✗"}
          </span>
          <div className="space-y-1 flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">{currentJudge.answer}</p>
            {!currentJudge.correct && currentJudge.feedback && (
              <p className="text-sm text-red-700 dark:text-red-400">{currentJudge.feedback}</p>
            )}
            {!currentJudge.correct && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Correct: </span>
                {currentJudge.correctTranslation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Input / Next */}
      <div>
        {!currentJudge ? (
          inputMode === "voice" ? (
            <div className="flex flex-col items-center gap-5 py-6">
              {judging ? (
                <p className="text-sm text-gray-400 animate-pulse">Checking…</p>
              ) : (
                <div className="relative flex items-center justify-center">
                  {isRecording && (
                    <span
                      className="absolute inset-0 rounded-full bg-red-400/40 animate-ping"
                      style={{ animationDuration: "1.2s" }}
                      aria-hidden
                    />
                  )}
                  <button
                    onPointerDown={handleRecordStart}
                    onPointerUp={handleRecordEnd}
                    onPointerLeave={handleRecordEnd}
                    disabled={judging}
                    className={`relative flex items-center justify-center rounded-full transition-all duration-200 select-none touch-none outline-none ${
                      isRecording
                        ? "w-24 h-24 bg-red-500 shadow-lg shadow-red-500/40 scale-105 ring-4 ring-red-400/50"
                        : "w-24 h-24 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-95 shadow-lg shadow-black/40 ring-4 ring-gray-800/40"
                    }`}
                    aria-label={isRecording ? "Recording…" : "Hold to speak"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill={isRecording ? "white" : "currentColor"} className={isRecording ? "" : "text-white dark:text-gray-900"} aria-hidden>
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 select-none text-center max-w-[240px]">
                {isRecording ? (
                  <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Listening…
                  </span>
                ) : (
                  "Hold to speak, or hold Space"
                )}
              </p>
              <button
                onClick={() => setInputMode("text")}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Use keyboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleTextSubmit} className="space-y-3">
              <textarea
                autoFocus
                placeholder={isEnToJp ? "Type in Japanese…" : "Type in English…"}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter" || e.shiftKey) return;
                  e.preventDefault();
                  if (!e.repeat && answer.trim()) handleTextSubmit(e);
                }}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-300"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="submit"
                  disabled={judging || !answer.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {judging ? "Checking…" : "Check answer"}
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("voice")}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-auto"
                >
                  Use voice
                </button>
              </div>
            </form>
          )
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={onNext}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              {isLastQuestion ? "Finish session" : "Next →"}
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 select-none">Press Space or Enter</p>
          </div>
        )}
      </div>
    </div>
  );
}
