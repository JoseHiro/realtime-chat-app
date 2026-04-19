import React, { useMemo, useState, useRef } from "react";
import { ChevronRight, Play, Pause, Lock, Edit3 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useChatSession } from "../../../context/ChatSessionContext";
import { useUser } from "../../../context/UserContext";
import { ChatType } from "../../../types/types";
import { BlockUseOverlay } from "../../overlay";
import levels from "../../../data/levels.json";
import politenesses from "../../../data/politenesses.json";
import themes from "../../../data/themes.json";
import { getAllCharacters, getCharacterImageUrl } from "../../../lib/voice/voiceMapping";
import type { CharacterName } from "../../../lib/voice/voiceMapping";
import { calculateCreditsForCharacter } from "../../../lib/credits/characterCredits";

function chip(selected: boolean, extra?: string) {
  return [
    "px-3 py-1.5 rounded-lg border text-sm font-medium transition-all cursor-pointer",
    selected
      ? "border-gray-900 dark:border-gray-200 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500",
    extra ?? "",
  ].join(" ");
}

export const ModeSelectScreen = ({
  setHistory,
  setChatInfo,
  setHiraganaReadingList,
  setPaymentOverlay,
  handleRefreshPreviousData,
  handleBeginConversation,
  needPayment,
  loading,
  plan,
}: {
  setHistory: React.Dispatch<React.SetStateAction<ChatType>>;
  setChatInfo: React.Dispatch<React.SetStateAction<{ audioUrl: string; english: string }[]>>;
  loading: boolean;
  setHiraganaReadingList: React.Dispatch<React.SetStateAction<string[]>>;
  setPaymentOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  needPayment: boolean;
  handleRefreshPreviousData: () => void;
  plan: string;
  handleBeginConversation: () => void;
}) => {
  const {
    selectedPoliteness, setSelectedPoliteness,
    selectedLevel, setSelectedLevel,
    selectedTheme, setSelectedTheme,
    customTheme, setCustomTheme,
    checkGrammarMode, setCheckGrammarMode,
    selectedTime, setSelectedTime,
    selectedCharacter, setSelectedCharacter,
  } = useChatSession();

  const { username, subscriptionPlan, creditsRemaining } = useUser();
  const isProUser = plan === "pro" || subscriptionPlan === "pro";

  const [playingCharacter, setPlayingCharacter] = useState<CharacterName | null>(null);
  const [showCustomTheme, setShowCustomTheme] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const characters = getAllCharacters();
  const timeOptions = [3, 5, 10];

  const canProceed = useMemo(
    () => Boolean(selectedLevel && (selectedTheme || customTheme.trim()) && selectedPoliteness),
    [selectedLevel, selectedTheme, customTheme, selectedPoliteness],
  );

  const creditCost = useMemo(() => {
    try { return calculateCreditsForCharacter(selectedTime, selectedCharacter); } catch { return 0; }
  }, [selectedTime, selectedCharacter]);

  const showCredits = subscriptionPlan === "pro" || subscriptionPlan === "premium";

  function handlePlayAudio(characterName: CharacterName, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (playingCharacter === characterName && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingCharacter(null);
      return;
    }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const idx = Math.floor(Math.random() * 3) + 1;
    const audio = new Audio(`/audio/characters/${characterName.toLowerCase()}_${idx}.mp3`);
    audioRef.current = audio;
    setPlayingCharacter(characterName);
    audio.play().catch(() => { setPlayingCharacter(null); audioRef.current = null; });
    audio.onended = () => { setPlayingCharacter(null); audioRef.current = null; };
    audio.onerror = () => { setPlayingCharacter(null); audioRef.current = null; };
  }

  function getCharacterImage(name: CharacterName): string {
    const url = getCharacterImageUrl(name);
    if (url) return url;
    return (name === "Sakura" || name.includes("Chica") || name === "Aiko") ? "/img/female.jpg" : "/img/man.jpg";
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950 overflow-auto w-full">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Chat setup</h1>
          {showCredits && (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full">
              {creditsRemaining} credits
            </span>
          )}
        </div>

        <div className="space-y-7">
          {/* Level */}
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Level</p>
            <div className="flex flex-wrap gap-2">
              {levels.map((l) => (
                <button key={l.id} type="button" onClick={() => setSelectedLevel(l.id)} className={chip(selectedLevel === l.id)}>
                  {l.label}
                  <span className="ml-1.5 text-xs opacity-60">{l.japaneseLevel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speaking Style */}
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Speaking style</p>
            <div className="flex flex-wrap gap-2">
              {politenesses.map((p) => (
                <button key={p.id} type="button" onClick={() => setSelectedPoliteness(p.id)} className={chip(selectedPoliteness === p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Theme</p>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => {
                const isLocked = !isProUser && t.id !== "daily";
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (isLocked) {
                        setPaymentOverlay(true);
                        toast.info("Upgrade to Pro to unlock all themes!", { position: "top-center" });
                        return;
                      }
                      setSelectedTheme(t.id);
                      setCustomTheme("");
                      setShowCustomTheme(false);
                    }}
                    className={chip(selectedTheme === t.id && !customTheme.trim(), isLocked ? "opacity-50" : "")}
                  >
                    {isLocked && <Lock className="inline w-3 h-3 mr-1 opacity-60" />}
                    {t.label}
                  </button>
                );
              })}
              {/* Custom theme chip */}
              <button
                type="button"
                onClick={() => {
                  if (!isProUser) {
                    setPaymentOverlay(true);
                    toast.info("Custom themes are available in Pro plan.", { position: "top-center" });
                    return;
                  }
                  setShowCustomTheme((v) => !v);
                  setSelectedTheme("");
                }}
                className={chip(Boolean(customTheme.trim()), !isProUser ? "opacity-50" : "")}
              >
                {!isProUser && <Lock className="inline w-3 h-3 mr-1 opacity-60" />}
                <Edit3 className="inline w-3 h-3 mr-1" />
                Custom
              </button>
            </div>
            {showCustomTheme && isProUser && (
              <input
                autoFocus
                type="text"
                placeholder="Enter your topic…"
                value={customTheme}
                onChange={(e) => { setCustomTheme(e.target.value); setSelectedTheme(""); }}
                className="mt-2 w-full max-w-xs px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              />
            )}
          </div>

          {/* Character + Time */}
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Voice &amp; Duration</p>
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
              {characters.map((character) => {
                const isSelected = selectedCharacter === character.characterName;
                const isPro = "voiceProvider" in character && character.voiceProvider === "elevenlabs";
                return (
                  <div key={character.characterName} className={`flex items-center gap-3 px-3 py-2.5 ${isSelected ? "bg-gray-50 dark:bg-gray-800/60" : ""}`}>
                    {/* Avatar + name */}
                    <button
                      type="button"
                      onClick={() => setSelectedCharacter(character.characterName)}
                      className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                    >
                      <div className={`relative w-8 h-8 rounded-md overflow-hidden shrink-0 ${isSelected ? "ring-2 ring-gray-900 dark:ring-gray-300 ring-offset-1 dark:ring-offset-gray-950" : ""}`}>
                        <Image src={getCharacterImage(character.characterName)} alt={character.characterName} fill className="object-cover" />
                        {isPro && (
                          <div className="absolute top-0 left-0 bg-gray-900 text-white text-[8px] font-semibold px-1 rounded-br">PRO</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">{character.characterName}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{character.description}</p>
                      </div>
                    </button>

                    {/* Play button */}
                    <button
                      type="button"
                      onClick={(e) => handlePlayAudio(character.characterName, e)}
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {playingCharacter === character.characterName
                        ? <Pause className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                        : <Play className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                      }
                    </button>

                    {/* Time options */}
                    <div className="flex gap-1 shrink-0">
                      {timeOptions.map((t) => {
                        const isTimeSelected = isSelected && selectedTime === t;
                        const disabled = t === 10;
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={disabled}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!disabled) { setSelectedCharacter(character.characterName); setSelectedTime(t); }
                            }}
                            className={[
                              "px-2.5 py-1 rounded-md border text-xs font-medium transition-all",
                              isTimeSelected
                                ? "border-gray-900 dark:border-gray-200 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                                : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500",
                              disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
                            ].join(" ")}
                          >
                            {t}m
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grammar Correction */}
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Grammar correction</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCheckGrammarMode(false)}
                className={chip(!checkGrammarMode)}
              >
                Off
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isProUser) { setPaymentOverlay(true); return; }
                  setCheckGrammarMode(true);
                }}
                className={chip(checkGrammarMode, !isProUser ? "opacity-50" : "")}
              >
                {!isProUser && <Lock className="inline w-3 h-3 mr-1 opacity-60" />}
                On
              </button>
            </div>
          </div>

          {/* Credit cost */}
          {showCredits && (
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {selectedTime} min · {selectedCharacter} · {creditCost} credits
              </span>
              <span className={creditsRemaining >= creditCost ? "text-gray-900 dark:text-gray-100 font-medium" : "text-red-500 font-medium"}>
                Balance: {creditsRemaining}
              </span>
            </div>
          )}

          {/* Start button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!canProceed || loading}
              onClick={handleBeginConversation}
              className={[
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-base transition-all",
                canProceed && !loading
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed",
              ].join(" ")}
            >
              {loading ? "Connecting…" : "Start Conversation"}
              {!loading && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {needPayment && (
        <div className="fixed inset-0 z-[100]">
          <BlockUseOverlay plan={plan === "pro" ? "pro" : "trial"} />
        </div>
      )}
    </div>
  );
};
