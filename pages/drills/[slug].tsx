import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { X, Volume2, Check, AlertCircle, Mic } from "lucide-react";
import {
  SentenceView,
  ResultView,
  type TaskVocabularyItem,
} from "../../component/ui/Drills";
import type { DrillTaskResponse } from "../api/drills/[slug]";

/** Browser speech recognition (not in all TS libs). */
interface SpeechRecognitionLike {
  start(): void;
  stop(): void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (ev: SpeechResultEvent) => void;
  onend: () => void;
}
interface SpeechResultEvent {
  results: Array<Array<{ transcript: string }>>;
}

const TOTAL_TASKS = 16;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function kanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

function normalizeForCompare(str: string): string {
  return kanaToHiragana(str.trim().toLowerCase());
}

function isAnswerCorrect(userAnswer: string, acceptedAnswers: string[]): boolean {
  const normalized = normalizeForCompare(userAnswer);
  return acceptedAnswers.some((a) => normalizeForCompare(a) === normalized);
}

type TaskWithVocab = DrillTaskResponse & { taskVocabulary: TaskVocabularyItem[] };

function mapApiTaskToDrillTask(t: DrillTaskResponse): TaskWithVocab {
  return {
    ...t,
    sentence: t.sentence ?? t.targetJapanese,
    taskVocabulary: t.taskVocabulary ?? [],
  };
}

/** Reusable push-to-talk mic button. Use onMouseDown/onMouseUp + onMouseLeave for release. */
function HoldToSpeakButton({
  onStart,
  onStop,
  disabled,
  isRecording,
  pending,
  hint,
  size = "md",
  showHint = true,
  className = "",
}: {
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
  isRecording: boolean;
  pending: boolean;
  hint: string;
  size?: "sm" | "md";
  showHint?: boolean;
  className?: string;
}) {
  const sizeClass = size === "sm" ? "h-12 w-12" : "h-14 w-14";
  const iconClass = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const buttonEl = (
    <button
      type="button"
      onMouseDown={onStart}
      onMouseUp={onStop}
      onMouseLeave={onStop}
      onTouchStart={(e) => {
        e.preventDefault();
        onStart();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onStop();
      }}
      disabled={disabled}
      className={`flex items-center justify-center rounded-full border-2 transition-all shrink-0 ${sizeClass} ${
        isRecording ? "border-red-500 bg-red-50 text-red-600" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      } ${!showHint ? className : ""}`}
      title="Hold to speak (or hold Space key)"
      aria-label="Hold to speak"
    >
      <Mic className={iconClass} />
    </button>
  );
  if (!showHint) return buttonEl;
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {buttonEl}
      <p className="text-sm text-gray-500">{pending ? "Checking…" : hint}</p>
    </div>
  );
}

function DrillSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="h-1.5 w-full overflow-hidden bg-gray-100" />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12">
        <div className="h-12 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-100" />
        <div className="mt-8 h-12 w-32 animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

export default function DrillPage() {
  const router = useRouter();
  const { slug } = router.query;
  const slugStr = typeof slug === "string" ? slug : "";

  const [tasks, setTasks] = useState<TaskWithVocab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [vocabConfirmed, setVocabConfirmed] = useState(false);
  const [translateInput, setTranslateInput] = useState("");
  const [checkResult, setCheckResult] = useState<"idle" | "correct" | "incorrect" | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [jumbleChips, setJumbleChips] = useState<{ word: string; reading: string }[]>([]);
  const [jumbleSelected, setJumbleSelected] = useState<number[]>([]);
  const [jumbleShowHiragana, setJumbleShowHiragana] = useState(true);
  const [sentenceShowHiragana, setSentenceShowHiragana] = useState(true);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceCheckPending, setVoiceCheckPending] = useState(false);

  const recognitionRef = useRef<{ start(): void; stop(): void } | null>(null);
  const voiceTranscriptRef = useRef<string>("");
  const voiceTaskRef = useRef<{ taskId: string; acceptedAnswers: string[]; taskType: "VOCAB" | "SENTENCE" } | null>(null);
  const mountedRef = useRef(true);
  const voiceStartedBySpaceRef = useRef(false);

  const totalTasks = tasks.length;
  const task = tasks[currentIndex];
  const progressPercent = totalTasks > 0 ? ((currentIndex + 1) / totalTasks) * 100 : 0;

  const fetchTasks = useCallback(async () => {
    if (!slugStr) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/drills/${encodeURIComponent(slugStr)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to load tasks");
        setTasks([]);
        return;
      }
      const data = await res.json();
      const list: DrillTaskResponse[] = data.tasks ?? [];
      const slice = list.slice(0, TOTAL_TASKS);
      if (slice.length === 0) {
        setError("No tasks found for this lesson.");
        setTasks([]);
        return;
      }
      setTasks(slice.map(mapApiTaskToDrillTask));
      setCurrentIndex(0);
      setCorrectCount(0);
      setIsCompleted(false);
      setVocabConfirmed(false);
      setTranslateInput("");
      setCheckResult(null);
      setShowCorrectAnswer(false);
      setJumbleChips([]);
      setJumbleSelected([]);
    } catch {
      setError("Failed to load tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [slugStr]);

  useEffect(() => {
    if (slugStr) fetchTasks();
  }, [slugStr, fetchTasks]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      voiceStartedBySpaceRef.current = false;
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // ignore if not started
      }
    };
  }, []);

  const handleExit = () => {
    router.push("/drills");
  };

  const handlePronounceConfirm = () => {
    setVocabConfirmed(true);
  };

  const handleCheckTranslate = () => {
    if (!task || task.type !== "SENTENCE" || task.mode !== "TRANSLATE") return;
    const correct = isAnswerCorrect(translateInput, task.acceptedAnswers ?? []);
    setCheckResult(correct ? "correct" : "incorrect");
    if (correct) setCorrectCount((c) => c + 1);
    else setShowCorrectAnswer(true);
  };

  useEffect(() => {
    if (!task) {
      voiceTaskRef.current = null;
      return;
    }
    if (task.type === "VOCAB") {
      const answers = (task.acceptedAnswers?.length ? task.acceptedAnswers : [task.reading].filter(Boolean)) as string[];
      voiceTaskRef.current = answers.length ? { taskId: task.id, acceptedAnswers: answers, taskType: "VOCAB" } : null;
    } else if (task.type === "SENTENCE" && (task.mode === "MIMIC" || task.mode === "TRANSLATE")) {
      voiceTaskRef.current = { taskId: task.id, acceptedAnswers: task.acceptedAnswers ?? [], taskType: "SENTENCE" };
    } else {
      voiceTaskRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync ref from current task shape
  }, [task?.id, task?.type, task?.mode, task?.acceptedAnswers, task?.reading]);

  const getRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (recognitionRef.current) return recognitionRef.current;
    const win = window as Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) return null;
    const recognition = new SR();
    recognition.lang = "ja-JP";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (ev: SpeechResultEvent) => {
      const last = ev.results.length - 1;
      voiceTranscriptRef.current = ev.results[last][0].transcript;
    };
    recognition.onend = () => {
      voiceStartedBySpaceRef.current = false;
      if (!mountedRef.current) return;
      setIsRecordingVoice(false);
      const transcript = voiceTranscriptRef.current.trim();
      const current = voiceTaskRef.current;
      if (!transcript || !current) return;
      setVoiceCheckPending(true);
      fetch("/api/drills/check-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, acceptedAnswers: current.acceptedAnswers }),
      })
        .then((res) => res.json())
        .then((data: { correct?: boolean; error?: string }) => {
          if (!mountedRef.current) return;
          if (data.error) return;
          if (voiceTaskRef.current?.taskId !== current.taskId) return;
          const correct = !!data.correct;
          if (current.taskType === "SENTENCE") setTranslateInput(transcript);
          setCheckResult(correct ? "correct" : "incorrect");
          if (correct) setCorrectCount((c) => c + 1);
          else setShowCorrectAnswer(true);
        })
        .catch(() => {
          if (mountedRef.current) setVoiceCheckPending(false);
        })
        .finally(() => {
          if (mountedRef.current) setVoiceCheckPending(false);
        });
    };
    recognitionRef.current = recognition;
    return recognition;
  }, []);

  const canUseVoice =
    task && checkResult === null &&
    (task.type === "VOCAB" || (task.type === "SENTENCE" && (task.mode === "MIMIC" || task.mode === "TRANSLATE")));

  const startVoiceInput = useCallback(() => {
    if (!canUseVoice) return;
    const rec = getRecognition();
    if (!rec || isRecordingVoice) return;
    voiceTranscriptRef.current = "";
    setIsRecordingVoice(true);
    rec.start();
  }, [canUseVoice, getRecognition, isRecordingVoice]);

  const stopVoiceInput = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (!canUseVoice) return;
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      e.preventDefault();
      startVoiceInput();
      voiceStartedBySpaceRef.current = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (voiceStartedBySpaceRef.current) {
        e.preventDefault();
        stopVoiceInput();
        voiceStartedBySpaceRef.current = false;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [canUseVoice, startVoiceInput, stopVoiceInput]);

  const handleNext = () => {
    setVocabConfirmed(false);
    setTranslateInput("");
    setCheckResult(null);
    setShowCorrectAnswer(false);
    setJumbleChips([]);
    setJumbleSelected([]);
    if (currentIndex + 1 >= totalTasks) {
      setIsCompleted(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const isJumble = task?.mode === "JUMBLE";
  useEffect(() => {
    if (isJumble && task?.taskVocabulary?.length) {
      const items = task.taskVocabulary.map((v) => ({ word: v.word, reading: v.reading }));
      setJumbleChips(shuffle([...items]));
      setJumbleSelected([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset chips when task id or jumble mode changes
  }, [task?.id, isJumble]);

  const jumbleRemainingIndices = jumbleChips
    .map((_, i) => i)
    .filter((i) => !jumbleSelected.includes(i));
  const jumbleBuiltSentence = jumbleSelected.map((i) => jumbleChips[i].word).join("");
  const jumbleBuiltDisplay = jumbleSelected.map((i) => jumbleChips[i]).map((c) => (jumbleShowHiragana ? c.reading : c.word)).join("");

  const handleJumbleTapChip = (chipIndex: number) => {
    if (checkResult !== null) return;
    setJumbleSelected((prev) => [...prev, chipIndex]);
  };
  const handleJumbleUndo = () => {
    setJumbleSelected((prev) => prev.slice(0, -1));
  };
  const handleCheckJumble = () => {
    if (!task?.targetJapanese) return;
    const correct = jumbleBuiltSentence === task.targetJapanese;
    setCheckResult(correct ? "correct" : "incorrect");
    if (correct) setCorrectCount((c) => c + 1);
    else setShowCorrectAnswer(true);
  };

  const canShowNext =
    (task?.type === "VOCAB" && (vocabConfirmed || checkResult !== null)) ||
    (task?.type === "SENTENCE" && task.mode === "MIMIC") ||
    (task?.type === "SENTENCE" && (task.mode === "JUMBLE" || task.mode === "TRANSLATE") && checkResult !== null);

  if (!router.isReady || !slugStr) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (loading) return <DrillSkeleton />;

  if (error || totalTasks === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <AlertCircle className="h-12 w-12 text-amber-500" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">Unable to load lesson</h2>
        <p className="mt-2 text-center text-gray-600">{error ?? "No tasks found."}</p>
        <button
          type="button"
          onClick={() => router.push("/drills")}
          className="mt-6 rounded-xl bg-emerald-500 px-6 py-2.5 text-white hover:bg-emerald-600"
        >
          Back to Roadmap
        </button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <ResultView
        correctCount={correctCount}
        totalTasks={totalTasks}
        onBackToRoadmap={handleExit}
      />
    );
  }

  const isVocab = task.type === "VOCAB";
  const isMimic = task.mode === "MIMIC";
  const isTranslate = task.mode === "TRANSLATE";

  const handlePlay = () => {
    // Placeholder: audio will be wired when audioUrl is available
    if (task.audioUrl) {
      const audio = new Audio(task.audioUrl);
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header: × , progress bar, counter */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={handleExit}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Exit"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="w-12 shrink-0 text-right text-sm font-medium text-gray-600">
            {currentIndex + 1}/{totalTasks}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        {isVocab && (
          <div className="flex flex-col items-center gap-6 text-center">
            <button
              type="button"
              onClick={handlePlay}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Play word"
            >
              <Volume2 className="h-7 w-7" />
            </button>
            <p className="text-4xl font-medium tracking-wide text-gray-900 md:text-5xl" lang="ja">
              {task.word}
            </p>
            <p className="text-3xl text-gray-600 md:text-4xl" lang="ja">
              {task.reading}
            </p>
            {checkResult === null && (
              <HoldToSpeakButton
                onStart={startVoiceInput}
                onStop={stopVoiceInput}
                disabled={voiceCheckPending}
                isRecording={isRecordingVoice}
                pending={voiceCheckPending}
                hint="Hold the mic or Space while saying the word. Release to check."
              />
            )}
          </div>
        )}

        {!isVocab && !isJumble && !isTranslate && task.targetJapanese && (
          <div className="w-full max-w-xl text-center">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handlePlay}
                className="flex items-center justify-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-600 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="Play sentence"
              >
                <Volume2 className="h-5 w-5" />
                Play
              </button>
              <button
                type="button"
                onClick={() => setSentenceShowHiragana((v) => !v)}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                title={sentenceShowHiragana ? "Show kanji" : "Show hiragana"}
                aria-label={sentenceShowHiragana ? "Switch to kanji" : "Switch to hiragana"}
              >
                {sentenceShowHiragana ? "あ" : "漢"}
              </button>
            </div>
            <SentenceView
              text={task.targetJapanese}
              taskVocabulary={task.taskVocabulary}
              showHiragana={sentenceShowHiragana}
            />
            {task.english && (
              <p className="mt-6 text-lg text-gray-600">{task.english}</p>
            )}
            {checkResult === null && (
              <HoldToSpeakButton
                onStart={startVoiceInput}
                onStop={stopVoiceInput}
                disabled={voiceCheckPending}
                isRecording={isRecordingVoice}
                pending={voiceCheckPending}
                hint="Hold the mic or Space while saying the sentence. Release to check."
                size="sm"
                className="mt-6"
              />
            )}
          </div>
        )}

        {!isVocab && isTranslate && task.english && (
          <div className="w-full max-w-xl text-center">
            <p className="text-sm font-medium text-gray-500 mb-2">Translate into Japanese</p>
            <p className="text-2xl font-medium text-gray-900 md:text-3xl">{task.english}</p>
          </div>
        )}

        {isJumble && task.targetJapanese && (
          <div className="w-full max-w-xl">
            <div className="mb-2 flex items-center justify-center gap-2">
              <p className="text-sm font-medium text-gray-500">
                Tap the chips in the correct order
              </p>
              <button
                type="button"
                onClick={() => setJumbleShowHiragana((v) => !v)}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                title={jumbleShowHiragana ? "Show kanji" : "Show hiragana"}
                aria-label={jumbleShowHiragana ? "Switch to kanji" : "Switch to hiragana"}
              >
                {jumbleShowHiragana ? "あ" : "漢"}
              </button>
            </div>
            <div className="mb-6 min-h-[3rem] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-3">
              <p className="text-center text-xl text-gray-900" lang="ja">
                {jumbleSelected.length === 0 ? (
                  <span className="text-gray-400">Your sentence will appear here</span>
                ) : (
                  jumbleBuiltDisplay
                )}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {jumbleRemainingIndices.map((idx) => (
                <button
                  key={`${task.id}-${idx}`}
                  type="button"
                  onClick={() => handleJumbleTapChip(idx)}
                  disabled={checkResult !== null}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-lg text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60"
                  lang="ja"
                >
                  {jumbleShowHiragana ? jumbleChips[idx].reading : jumbleChips[idx].word}
                </button>
              ))}
            </div>
            {jumbleSelected.length > 0 && checkResult === null && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleJumbleUndo}
                  className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                  Undo last
                </button>
              </div>
            )}
            {task.english && (
              <p className="mt-6 text-center text-lg text-gray-600">{task.english}</p>
            )}
          </div>
        )}

        {/* SENTENCE / TRANSLATE: input and feedback */}
        {!isVocab && isTranslate && (
          <div className="mt-8 w-full max-w-md space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={translateInput}
                onChange={(e) => setTranslateInput(e.target.value)}
                placeholder="Type or hold the mic to speak..."
                disabled={checkResult !== null}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-70"
              />
              <HoldToSpeakButton
                onStart={startVoiceInput}
                onStop={stopVoiceInput}
                disabled={checkResult !== null || voiceCheckPending}
                isRecording={isRecordingVoice}
                pending={voiceCheckPending}
                hint="Hold the mic button or Space key while speaking. Release to check (answer is compared in hiragana)."
                size="sm"
                showHint={false}
                className="h-[52px] w-12 rounded-xl"
              />
            </div>
            <p className="text-center text-sm text-gray-500">
              {voiceCheckPending ? "Checking…" : "Hold the mic button or Space key while speaking. Release to check (answer is compared in hiragana)."}
            </p>
          </div>
        )}

        {/* Correct / incorrect feedback */}
        {(checkResult === "correct" || checkResult === "incorrect") && (
          <div
            className={`mt-6 flex items-center gap-2 rounded-full px-4 py-2 ${
              checkResult === "correct"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {checkResult === "correct" ? (
              <Check className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">
              {checkResult === "correct" ? "Correct!" : "Incorrect"}
            </span>
          </div>
        )}
        {showCorrectAnswer && task && (isVocab || isMimic || isTranslate || isJumble) && (
          <p className="mt-3 text-sm text-gray-600">
            {isVocab ? (
              <>Correct reading: <span lang="ja" className="font-medium">{task.reading}</span></>
            ) : (
              <>Correct: <span lang="ja" className="font-medium">{task.targetJapanese}</span></>
            )}
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6">
        <div className="mx-auto max-w-md">
          {!canShowNext && isVocab && (
            <button
              type="button"
              onClick={handlePronounceConfirm}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-base font-medium text-white hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <Volume2 className="h-5 w-5" />
              Pronounce & Confirm
            </button>
          )}

          {!isVocab && isTranslate && checkResult === null && (
            <button
              type="button"
              onClick={handleCheckTranslate}
              className="w-full rounded-xl bg-emerald-500 py-3.5 text-base font-medium text-white hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Check
            </button>
          )}

          {isJumble && checkResult === null && (
            <button
              type="button"
              onClick={handleCheckJumble}
              disabled={jumbleSelected.length === 0}
              className="w-full rounded-xl bg-emerald-500 py-3.5 text-base font-medium text-white hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50"
            >
              Check
            </button>
          )}

          {canShowNext && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full rounded-xl bg-emerald-500 py-3.5 text-base font-medium text-white hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Next
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
