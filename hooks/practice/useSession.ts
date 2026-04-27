import { useState, useRef, useEffect } from "react";
import type { SessionQuestion, Difficulty } from "../../features/practice/types";

export type Phase = "setup" | "loading" | "practicing" | "finished";
export type LoadingStep = "questions" | "audio";
export type Direction = "jp-to-en" | "en-to-jp";

interface StartArgs {
  direction: Direction;
  selectedVocabIds: Set<string>;
  selectedGrammarIds: Set<string>;
  difficulty: Difficulty;
}

export function useSession() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("questions");
  const [session, setSession] = useState<SessionQuestion[]>([]);
  const [audioUrls, setAudioUrls] = useState<Map<string, string>>(new Map());
  const [audioLoadedCount, setAudioLoadedCount] = useState(0);
  const [error, setError] = useState("");

  const audioBlobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => { audioBlobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u)); };
  }, []);

  function revokeAllAudio() {
    audioBlobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    audioBlobUrlsRef.current = [];
    setAudioUrls(new Map());
  }

  function resetSession() {
    revokeAllAudio();
    setSession([]);
    setPhase("setup");
    setError("");
  }

  async function startSession({ direction, selectedVocabIds, selectedGrammarIds, difficulty }: StartArgs): Promise<SessionQuestion[] | null> {
    if (selectedVocabIds.size === 0) {
      setError("Select at least one vocabulary word.");
      return null;
    }

    setPhase("loading");
    setLoadingStep("questions");
    setError("");
    revokeAllAudio();

    const res = await fetch("/api/practice/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wordIds: Array.from(selectedVocabIds),
        grammarIds: Array.from(selectedGrammarIds),
        direction,
        difficulty,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error ?? "Failed to generate session.");
      setPhase("setup");
      return null;
    }

    const data = await res.json();
    const questions: SessionQuestion[] = data.questions;
    setSession(questions);
    setLoadingStep("audio");
    setAudioLoadedCount(0);

    const urlMap = new Map<string, string>();
    let loaded = 0;

    await Promise.all(
      questions.map(async (q) => {
        try {
          const ttsRes = await fetch("/api/practice/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: q.sentence }),
          });
          if (ttsRes.ok) {
            const blob = await ttsRes.blob();
            const url = URL.createObjectURL(blob);
            urlMap.set(q.id, url);
            audioBlobUrlsRef.current.push(url);
          }
        } catch { /* non-fatal */ }
        loaded++;
        setAudioLoadedCount(loaded);
      }),
    );

    setAudioUrls(new Map(urlMap));
    setPhase("practicing");
    return questions;
  }

  return {
    phase, setPhase,
    loadingStep,
    session,
    audioUrls,
    audioLoadedCount,
    error,
    startSession,
    resetSession,
  };
}
