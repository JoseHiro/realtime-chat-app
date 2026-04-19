import { useState, useRef, useCallback } from "react";
import type { SessionQuestion, SupportingWord } from "../../features/practice/types";

export type Direction = "jp-to-en" | "en-to-jp";
export type InputMode = "voice" | "text";

export type QuestionResult = {
  answer: string;
  correct: boolean;
  feedback: string;
  correctTranslation: string;
};

const MAX_RETRIES = 1;

interface QueueItem {
  question: SessionQuestion;
  originalId: string;
  isRetry: boolean;
}

export function usePractice(direction: Direction) {
  const [originalSession, setOriginalSession] = useState<SessionQuestion[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [queuePos, setQueuePos] = useState(0);
  const [retryCounts, setRetryCounts] = useState<Map<string, number>>(new Map());
  const [resultMap, setResultMap] = useState<Map<string, QuestionResult>>(new Map());

  const [currentJudge, setCurrentJudge] = useState<QuestionResult | null>(null);
  const [judging, setJudging] = useState(false);
  const [answer, setAnswer] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [isRecording, setIsRecording] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [activeHintWord, setActiveHintWord] = useState<SupportingWord | null>(null);
  const [showSessionInfo, setShowSessionInfo] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const currentItem = queue[queuePos] ?? null;
  const currentQuestion = currentItem?.question ?? null;
  const isRetry = currentItem?.isRetry ?? false;
  const queueLength = queue.length;

  const retryWillBeAdded =
    currentJudge !== null &&
    !currentJudge.correct &&
    (retryCounts.get(currentItem?.originalId ?? "") ?? 0) < MAX_RETRIES;

  const isLastQuestion = queueLength > 0 && queuePos + 1 >= queueLength && !retryWillBeAdded;

  function reset(session: SessionQuestion[]) {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setOriginalSession(session);
    setQueue(session.map((q) => ({ question: q, originalId: q.id, isRetry: false })));
    setQueuePos(0);
    setRetryCounts(new Map());
    setResultMap(new Map());
    setCurrentJudge(null);
    setAnswer("");
    setShowHint(false);
    setShowSentence(false);
    setActiveHintWord(null);
    setInputMode("voice");
  }

  function advance() {
    if (currentJudge && currentItem) {
      setResultMap((prev) => new Map(prev).set(currentItem.originalId, currentJudge));
      if (!currentJudge.correct) {
        const count = retryCounts.get(currentItem.originalId) ?? 0;
        if (count < MAX_RETRIES) {
          setQueue((prev) => [...prev, { question: currentItem.question, originalId: currentItem.originalId, isRetry: true }]);
          setRetryCounts((prev) => { const next = new Map(prev); next.set(currentItem.originalId, count + 1); return next; });
        }
      }
    }
    setQueuePos((prev) => prev + 1);
    setCurrentJudge(null);
    setAnswer("");
    setShowHint(false);
    setShowSentence(false);
    setActiveHintWord(null);
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  function getSessionResults(): (QuestionResult | null)[] {
    const map = new Map(resultMap);
    if (currentJudge && currentItem) map.set(currentItem.originalId, currentJudge);
    return originalSession.map((q) => map.get(q.id) ?? null);
  }

  const handleJudge = useCallback(
    async (ans: string) => {
      if (!currentQuestion || !ans.trim() || judging || currentJudge) return;
      setAnswer(ans);
      setJudging(true);

      const res = await fetch("/api/practice/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence: currentQuestion.sentence,
          userAnswer: ans.trim(),
          expectedTranslation: currentQuestion.translation,
          direction,
        }),
      });
      const data = await res.json();

      const result: QuestionResult = {
        answer: ans.trim(),
        correct: data.correct,
        feedback: data.feedback,
        correctTranslation: data.correctTranslation,
      };
      setCurrentJudge(result);
      setJudging(false);

      const audio = new Audio(
        result.correct
          ? "/mp3/Short_soft_bell_chim_%231-1774009349360.mp3"
          : "/mp3/Duolingo_like_wrong,_quiz__%231-1774009512701.mp3",
      );
      audio.play().catch(() => {});
    },
    [currentQuestion, judging, currentJudge, direction],
  );

  function handleRecordStart() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = direction === "en-to-jp" ? "ja-JP" : "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => handleJudge(e.results[0][0].transcript as string);
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setIsRecording(true);
  }

  function handleRecordEnd() { recognitionRef.current?.stop(); }

  function handleTextSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    handleJudge(answer);
  }

  return {
    currentQuestion, isRetry, isLastQuestion,
    queuePos, queueLength,
    originalSessionLength: originalSession.length,
    retryCounts,
    currentJudge, judging,
    answer, setAnswer,
    inputMode, setInputMode,
    isRecording,
    showHint, setShowHint,
    showSentence, setShowSentence,
    activeHintWord, setActiveHintWord,
    showSessionInfo, setShowSessionInfo,
    reset, advance, getSessionResults,
    handleJudge, handleRecordStart, handleRecordEnd, handleTextSubmit,
  };
}
