import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSetupData } from "../hooks/practice/useSetupData";
import { useSession } from "../hooks/practice/useSession";
import { usePractice } from "../hooks/practice/usePractice";
import { SetupPhase } from "../component/practice/SetupPhase";
import { LoadingPhase } from "../component/practice/LoadingPhase";
import { PracticingPhase } from "../component/practice/PracticingPhase";
import { FinishedPhase } from "../component/practice/FinishedPhase";
import { SessionInfoModal } from "../component/practice/SessionInfoModal";
import { VocabularyTab } from "../component/practice/VocabularyTab";
import type { WordProgressSummary } from "../features/practice/types";

export default function DrillsPage() {
  const router = useRouter();
  const tab = (router.query.tab as string) === "vocabulary" ? "vocabulary" : "practice";
  const initialShowAddForm = router.query.add === "1" || router.query.add === "true";

  const setup = useSetupData();
  const session = useSession();
  const practice = usePractice(setup.direction);
  const [updatedProgressMap, setUpdatedProgressMap] = useState<Record<string, WordProgressSummary> | null>(null);
  const [todayCount, setTodayCount] = useState<number | null>(null);

  const isEnToJp = setup.direction === "en-to-jp";

  const isSessionActive = session.phase === "practicing" || session.phase === "loading" || session.phase === "finished";

  // Strip ?add query param after handing it off to VocabularyTab
  useEffect(() => {
    if (!router.isReady || !initialShowAddForm) return;
    void router.replace({ pathname: "/flashcards", query: { tab: "vocabulary" } }, undefined, { shallow: true });
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isSessionActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handleRouteChangeStart = (url: string) => {
      if (url.startsWith("/flashcards")) return;
      if (!window.confirm("Session in progress. Leave and lose your progress?")) {
        router.events.emit("routeChangeError");
        throw "routeChange aborted";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [isSessionActive, router.events]);

  async function handleStartSession(vocabOverride?: Set<string>) {
    const questions = await session.startSession({
      direction: setup.direction,
      selectedVocabIds: vocabOverride ?? setup.selectedVocabIds,
      selectedGrammarIds: setup.selectedGrammarIds,
      difficulty: setup.difficulty,
    });
    if (questions) practice.reset(questions);
  }

  // Auto-start when navigated from dashboard with "auto_start" flag
  const autoStarted = useRef(false);
  useEffect(() => {
    if (autoStarted.current || setup.vocabLoading || setup.progressLoading) return;
    const flag = sessionStorage.getItem("auto_start");
    if (flag !== "true") return;
    sessionStorage.removeItem("auto_start");
    autoStarted.current = true;
    const ids = setup.autoSelectForStudy();
    if (ids.size > 0) handleStartSession(ids);
  }, [setup.vocabLoading, setup.progressLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const skipProgressRef = useRef(false);

  function handleFinish() {
    practice.reset([]);
    session.resetSession();
  }

  async function handleTryAgain() {
    skipProgressRef.current = true;
    setUpdatedProgressMap(null);
    setTodayCount(null);
    await handleStartSession();
  }

  async function handleNext() {
    if (practice.isLastQuestion) {
      session.setPhase("finished");
      new Audio("/mp3/Duolingo_like,_finis_%233-1774009764406.mp3").play().catch(() => {});

      if (!skipProgressRef.current) {
        const sessionResults = practice.getSessionResults();
        const progressResults = session.session.map((q, i) => ({
          wordId: q.wordUsed.id,
          correct: sessionResults[i]?.correct ?? false,
        }));
        fetch("/api/practice/progress/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ results: progressResults }),
        })
          .then((r) => r.json())
          .then((data: { ok: boolean; todayCount: number }) => {
            setTodayCount(data.todayCount ?? null);
            return fetch("/api/practice/progress/words");
          })
          .then((r) => r.json())
          .then((data: WordProgressSummary[]) => {
            if (!Array.isArray(data)) return;
            const map: Record<string, WordProgressSummary> = {};
            data.forEach((p) => { map[p.wordId] = p; });
            setUpdatedProgressMap(map);
          })
          .catch(() => {});
      }

      skipProgressRef.current = false;
    }
    practice.advance();
  }

  const phaseTitle =
    session.phase === "setup" ? "Flashcards" :
    session.phase === "loading" ? "Preparing session…" :
    session.phase === "practicing" ? "Flashcards" :
    "Session complete";

  function switchTab(t: "vocabulary" | "practice") {
    void router.push({ pathname: "/flashcards", query: t === "practice" ? undefined : { tab: t } }, undefined, { shallow: true });
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{phaseTitle}</h1>
        </div>

        {/* Tabs — hidden while a session is active */}
        {!isSessionActive && (
          <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-gray-800">
            {(["practice", "vocabulary"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === t
                    ? "border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {t === "practice" ? "Practice" : "Vocabulary"}
              </button>
            ))}
          </div>
        )}

        {tab === "vocabulary" && (
          <VocabularyTab initialShowAddForm={initialShowAddForm} />
        )}

        {tab === "practice" && session.phase === "setup" && (
          <SetupPhase
            direction={setup.direction}
            onDirectionChange={setup.setDirection}
            difficulty={setup.difficulty}
            onDifficultyChange={setup.setDifficulty}
            decks={setup.decks}
            decksLoading={setup.decksLoading}
            allVocab={setup.allVocab}
            selectedVocabIds={setup.selectedVocabIds}
            progressMap={setup.progressMap}
            allGrammar={setup.allGrammar}
            selectedGrammarIds={setup.selectedGrammarIds}
            grammarByJlpt={setup.grammarByJlpt}
            jlptGroups={setup.jlptGroups}
            grammarByGenki={setup.grammarByGenki}
            genkiGroups={setup.genkiGroups}
            toggleGrammar={setup.toggleGrammar}
            error={session.error}
            onStart={() => handleStartSession()}
          />
        )}

        {tab === "practice" && session.phase === "loading" && (
          <LoadingPhase
            loadingStep={session.loadingStep}
            audioLoadedCount={session.audioLoadedCount}
            sessionLength={session.session.length}
          />
        )}

        {tab === "practice" && session.phase === "practicing" && practice.currentQuestion && (
          <PracticingPhase
            currentQuestion={practice.currentQuestion}
            isRetry={practice.isRetry}
            queuePos={practice.queuePos}
            queueLength={practice.queueLength}
            audioUrls={session.audioUrls}
            currentJudge={practice.currentJudge}
            judging={practice.judging}
            answer={practice.answer}
            setAnswer={practice.setAnswer}
            inputMode={practice.inputMode}
            setInputMode={practice.setInputMode}
            isRecording={practice.isRecording}
            showHint={practice.showHint}
            setShowHint={practice.setShowHint}
            showSentence={practice.showSentence}
            setShowSentence={practice.setShowSentence}
            activeHintWord={practice.activeHintWord}
            setActiveHintWord={practice.setActiveHintWord}
            onShowSessionInfo={() => practice.setShowSessionInfo(true)}
            isEnToJp={isEnToJp}
            isLastQuestion={practice.isLastQuestion}
            onNext={handleNext}

            handleTextSubmit={practice.handleTextSubmit}
            handleRecordStart={practice.handleRecordStart}
            handleRecordEnd={practice.handleRecordEnd}
          />
        )}

        {tab === "practice" && session.phase === "finished" && (
          <FinishedPhase
            session={session.session}
            results={practice.getSessionResults()}
            retryCounts={practice.retryCounts}
            progressMap={setup.progressMap}
            updatedProgressMap={updatedProgressMap}
            todayCount={todayCount}
            onTryAgain={handleTryAgain}
            onFinish={handleFinish}
          />
        )}

        {practice.showSessionInfo && (
          <SessionInfoModal
            allVocab={setup.allVocab}
            selectedVocabIds={setup.selectedVocabIds}
            allGrammar={setup.allGrammar}
            selectedGrammarIds={setup.selectedGrammarIds}
            direction={setup.direction}
            onClose={() => practice.setShowSessionInfo(false)}
          />
        )}
      </div>
    </div>
  );
}
