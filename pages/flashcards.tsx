import { useState, useEffect, useRef } from "react";
import { useSetupData } from "../hooks/practice/useSetupData";
import { useSession } from "../hooks/practice/useSession";
import { usePractice } from "../hooks/practice/usePractice";
import { SetupPhase } from "../component/practice/SetupPhase";
import { LoadingPhase } from "../component/practice/LoadingPhase";
import { PracticingPhase } from "../component/practice/PracticingPhase";
import { FinishedPhase } from "../component/practice/FinishedPhase";
import { SessionInfoModal } from "../component/practice/SessionInfoModal";
import type { WordProgressSummary } from "../features/practice/types";

export default function DrillsPage() {
  const setup = useSetupData();
  const session = useSession();
  const practice = usePractice(setup.direction);
  const [updatedProgressMap, setUpdatedProgressMap] = useState<Record<string, WordProgressSummary> | null>(null);
  const [todayCount, setTodayCount] = useState<number | null>(null);

  const isEnToJp = setup.direction === "en-to-jp";

  async function handleStartSession(vocabOverride?: Set<string>) {
    const questions = await session.startSession({
      direction: setup.direction,
      selectedVocabIds: vocabOverride ?? setup.selectedVocabIds,
      selectedGrammarIds: setup.selectedGrammarIds,
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

  async function handlePracticeMistakes(wrongWordIds: string[]) {
    setUpdatedProgressMap(null);
    setTodayCount(null);
    await handleStartSession(new Set(wrongWordIds));
  }

  function handleBackToSetup() {
    practice.reset([]);
    session.resetSession();
  }

  async function handleNext() {
    if (practice.isLastQuestion) {
      session.setPhase("finished");
      new Audio("/mp3/Duolingo_like,_finis_%233-1774009764406.mp3").play().catch(() => {});
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
    practice.advance();
  }

  const phaseTitle =
    session.phase === "setup" ? "Practice" :
    session.phase === "loading" ? "Preparing session…" :
    session.phase === "practicing" ? "Practice" :
    "Session complete";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{phaseTitle}</h1>
          {(session.phase === "setup" || session.phase === "loading") && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEnToJp ? "Translate English sentences into Japanese." : "Translate Japanese sentences into English."}
            </p>
          )}
        </div>

        {session.phase === "setup" && (
          <SetupPhase
            direction={setup.direction}
            onDirectionChange={setup.setDirection}
            allVocab={setup.allVocab}
            selectedVocabIds={setup.selectedVocabIds}
            vocabLoading={setup.vocabLoading}
            onToggleVocab={setup.toggleVocab}
            onToggleAllVocab={setup.toggleAllVocab}
            decks={setup.decks}
            decksLoading={setup.decksLoading}
            selectedDeckId={setup.selectedDeckId}
            onDeckChange={setup.setSelectedDeckId}
            allGrammar={setup.allGrammar}
            selectedGrammarIds={setup.selectedGrammarIds}
            grammarLoading={setup.grammarLoading}
            onToggleGrammar={setup.toggleGrammar}
            grammarByJlpt={setup.grammarByJlpt}
            jlptGroups={setup.jlptGroups}
            grammarByGenki={setup.grammarByGenki}
            genkiGroups={setup.genkiGroups}
            progressMap={setup.progressMap}
            onFocusWeak={setup.focusWeak}
            weakCount={setup.weakCount}
            onFocusDue={setup.focusDue}
            dueCount={setup.dueCount}
            error={session.error}
            onStart={() => handleStartSession()}
          />
        )}

        {session.phase === "loading" && (
          <LoadingPhase
            loadingStep={session.loadingStep}
            audioLoadedCount={session.audioLoadedCount}
            sessionLength={session.session.length}
          />
        )}

        {session.phase === "practicing" && practice.currentQuestion && (
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
            handleJudge={practice.handleJudge}
            handleTextSubmit={practice.handleTextSubmit}
            handleRecordStart={practice.handleRecordStart}
            handleRecordEnd={practice.handleRecordEnd}
          />
        )}

        {session.phase === "finished" && (
          <FinishedPhase
            session={session.session}
            results={practice.getSessionResults()}
            retryCounts={practice.retryCounts}
            progressMap={setup.progressMap}
            updatedProgressMap={updatedProgressMap}
            todayCount={todayCount}
            onPracticeAgain={() => handleStartSession()}
            onPracticeMistakes={handlePracticeMistakes}
            onBackToSetup={handleBackToSetup}
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
