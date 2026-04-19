import React, { useState, useRef } from "react";
import { Sparkles, Play, Pause } from "lucide-react";
import Image from "next/image";
import { AudioWaveform } from "lucide-react";

import type { CharacterName } from "../../../lib/voice/voiceMapping";
import { getAllCharacters, getCharacterImageUrl } from "../../../lib/voice/voiceMapping";
import { calculateCreditsForCharacter } from "../../../lib/credits/characterCredits";

type CharacterTimeSelectionProps = {
  selectedCharacter: CharacterName;
  setSelectedCharacter: (character: CharacterName) => void;
  selectedTime: number;
  setSelectedTime: (time: number) => void;
};

export const CharacterTimeSelection = ({
  selectedCharacter,
  setSelectedCharacter,
  selectedTime,
  setSelectedTime,
}: CharacterTimeSelectionProps) => {
  const characters = getAllCharacters();
  const timeOptions = [3, 5, 10];
  const [playingCharacter, setPlayingCharacter] =
    useState<CharacterName | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getCharacterImage = (characterName: CharacterName) => {
    const imageUrl = getCharacterImageUrl(characterName);
    if (imageUrl) return imageUrl;
    if (characterName === "Sakura") return "/img/female.jpg";
    if (characterName === "Ken") return "/img/man.jpg";
    return characterName.includes("Chica") || characterName === "Aiko"
      ? "/img/female.jpg"
      : "/img/man.jpg";
  };

  const getRandomAudioPath = (characterName: CharacterName): string => {
    const randomIndex = Math.floor(Math.random() * 3) + 1;
    const characterLower = characterName.toLowerCase();
    return `/audio/characters/${characterLower}_${randomIndex}.mp3`;
  };

  const handlePlayAudio = (characterName: CharacterName, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (playingCharacter === characterName && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingCharacter(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audioPath = getRandomAudioPath(characterName);
    const audio = new Audio(audioPath);
    audioRef.current = audio;
    setPlayingCharacter(characterName);

    audio.play().catch(() => {
      setPlayingCharacter(null);
      audioRef.current = null;
    });

    audio.onended = () => {
      setPlayingCharacter(null);
      audioRef.current = null;
    };

    audio.onerror = () => {
      setPlayingCharacter(null);
      audioRef.current = null;
    };
  };

  const azureCharacters = characters.filter((c) => c.voiceProvider === "azure");
  const elevenlabsCharacters = characters.filter((c) => c.voiceProvider === "elevenlabs");

  const CharacterRow = ({ character }: { character: ReturnType<typeof getAllCharacters>[0] }) => {
    const isCharacterSelected = selectedCharacter === character.characterName;
    return (
      <div
        className={`group border rounded-lg transition-all ${
          isCharacterSelected
            ? "border-gray-900 dark:border-gray-300 bg-gray-50 dark:bg-gray-800"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600"
        }`}
      >
        <div className="flex items-center gap-6 p-4">
          <div className="flex items-center gap-3 min-w-[200px]">
            <div
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedCharacter(character.characterName);
              }}
            >
              <div
                className={`relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 ${
                  isCharacterSelected ? "ring-2 ring-gray-900 dark:ring-gray-300 ring-offset-2 dark:ring-offset-gray-900" : ""
                }`}
              >
                <Image
                  src={getCharacterImage(character.characterName)}
                  alt={character.characterName}
                  fill
                  className="object-cover"
                />
                {"voiceProvider" in character && character.voiceProvider === "elevenlabs" && (
                  <div className="absolute top-1 left-1 bg-gray-900 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                    PRO
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {character.characterName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {character.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => handlePlayAudio(character.characterName, e)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={`Play ${character.characterName} voice sample`}
            >
              {playingCharacter === character.characterName ? (
                <Pause className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              ) : (
                <Play className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>

          <div className="flex-1 flex items-center gap-2">
            {timeOptions.map((time) => {
              const isTimeSelected = isCharacterSelected && selectedTime === time;
              const credits = calculateCreditsForCharacter(time, character.characterName);
              const isAvailable = time !== 10;

              return (
                <button
                  key={time}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isAvailable) {
                      setSelectedCharacter(character.characterName);
                      setSelectedTime(time);
                    }
                  }}
                  disabled={!isAvailable}
                  className={`flex-1 px-4 py-3 rounded-md border transition-all ${
                    isTimeSelected
                      ? "border-gray-900 dark:border-gray-300 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600"
                  } ${!isAvailable ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium mb-0.5">{time} min</div>
                    <div className="text-xs opacity-70">{credits} credits</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="flex justify-between items-center gap-2">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            Select Voice & Duration
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose a character and session length
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
          <AudioWaveform className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </div>
      </div>

      {/* Standard */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Standard
          </h3>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="space-y-3">
          {azureCharacters.map((character) => (
            <CharacterRow key={character.characterName} character={character} />
          ))}
        </div>
      </div>

      {/* Premium */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Premium
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Sparkles className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Enhanced Quality
            </span>
          </div>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="space-y-3">
          {elevenlabsCharacters.map((character) => (
            <CharacterRow key={character.characterName} character={character} />
          ))}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedCharacter && selectedTime && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-900 dark:bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCharacter} · {selectedTime} minutes
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {calculateCreditsForCharacter(selectedTime, selectedCharacter)} credits
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
