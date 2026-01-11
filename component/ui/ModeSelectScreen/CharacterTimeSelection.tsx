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
    // First try to get from voice mapping config
    const imageUrl = getCharacterImageUrl(characterName);
    if (imageUrl) return imageUrl;

    // Fallback to default images based on character name
    if (characterName === "Sakura") return "/img/female.jpg";
    if (characterName === "Ken") return "/img/man.jpg";
    return characterName.includes("Chica") || characterName === "Aiko"
      ? "/img/female.jpg"
      : "/img/man.jpg";
  };

  const getRandomAudioPath = (characterName: CharacterName): string => {
    const randomIndex = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const characterLower = characterName.toLowerCase();
    return `/audio/characters/${characterLower}_${randomIndex}.mp3`;
  };

  const handlePlayAudio = (
    characterName: CharacterName,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // If the same character is playing, pause it
    if (playingCharacter === characterName && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingCharacter(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Play the new audio
    const audioPath = getRandomAudioPath(characterName);
    const audio = new Audio(audioPath);
    audioRef.current = audio;
    setPlayingCharacter(characterName);

    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      setPlayingCharacter(null);
      audioRef.current = null;
    });

    // Reset state when audio ends
    audio.onended = () => {
      setPlayingCharacter(null);
      audioRef.current = null;
    };

    // Handle errors
    audio.onerror = () => {
      console.error("Error loading audio:", audioPath);
      setPlayingCharacter(null);
      audioRef.current = null;
    };
  };

  const azureCharacters = characters.filter((c) => c.voiceProvider === "azure");
  const elevenlabsCharacters = characters.filter(
    (c) => c.voiceProvider === "elevenlabs"
  );

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            Select Voice & Duration
          </h2>
          <p className="text-xs text-gray-500">
            Choose a character and session length
          </p>
        </div>
        <div className="bg-gray-100 rounded-full p-2">
          <AudioWaveform className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      {/* Standard Voice Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Standard
          </h3>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="space-y-3">
          {azureCharacters.map((character) => {
            const isCharacterSelected =
              selectedCharacter === character.characterName;

            return (
              <div
                key={character.characterName}
                className={`group border rounded-lg transition-all ${
                  isCharacterSelected
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-6 p-4">
                  {/* Character Info */}
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
                          isCharacterSelected
                            ? "ring-2 ring-gray-900 ring-offset-2"
                            : ""
                        }`}
                      >
                        <Image
                          src={getCharacterImage(character.characterName)}
                          alt={character.characterName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {character.characterName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {character.description}
                        </p>
                      </div>
                    </div>
                    {/* Play Button */}
                    <button
                      type="button"
                      onClick={(e) =>
                        handlePlayAudio(character.characterName, e)
                      }
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label={`Play ${character.characterName} voice sample`}
                    >
                      {playingCharacter === character.characterName ? (
                        <Pause className="w-4 h-4 text-gray-700" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-700" />
                      )}
                    </button>
                  </div>

                  {/* Time Options */}
                  <div className="flex-1 flex items-center gap-2">
                    {timeOptions.map((time) => {
                      const isTimeSelected =
                        isCharacterSelected && selectedTime === time;
                      const credits = calculateCreditsForCharacter(
                        time,
                        character.characterName
                      );
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
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                          } ${
                            !isAvailable
                              ? "opacity-40 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-sm font-medium mb-0.5">
                              {time} min
                            </div>
                            <div className="text-xs opacity-70">
                              {credits} credits
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Voice Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Premium
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-full">
            <Sparkles className="w-3 h-3 text-gray-600" />
            <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">
              Enhanced Quality
            </span>
          </div>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="space-y-3">
          {elevenlabsCharacters.map((character) => {
            const isCharacterSelected =
              selectedCharacter === character.characterName;

            return (
              <div
                key={character.characterName}
                className={`group border rounded-lg transition-all ${
                  isCharacterSelected
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-6 p-4">
                  {/* Character Info */}
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
                          isCharacterSelected
                            ? "ring-2 ring-gray-900 ring-offset-2"
                            : ""
                        }`}
                      >
                        <Image
                          src={getCharacterImage(character.characterName)}
                          alt={character.characterName}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-gray-900 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                          PRO
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {character.characterName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {character.description}
                        </p>
                      </div>
                    </div>
                    {/* Play Button */}
                    <button
                      type="button"
                      onClick={(e) =>
                        handlePlayAudio(character.characterName, e)
                      }
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label={`Play ${character.characterName} voice sample`}
                    >
                      {playingCharacter === character.characterName ? (
                        <Pause className="w-4 h-4 text-gray-700" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-700" />
                      )}
                    </button>
                  </div>

                  {/* Time Options */}
                  <div className="flex-1 flex items-center gap-2">
                    {timeOptions.map((time) => {
                      const isTimeSelected =
                        isCharacterSelected && selectedTime === time;
                      const credits = calculateCreditsForCharacter(
                        time,
                        character.characterName
                      );
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
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                          } ${
                            !isAvailable
                              ? "opacity-40 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-sm font-medium mb-0.5">
                              {time} min
                            </div>
                            <div className="text-xs opacity-70">
                              {credits} credits
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedCharacter && selectedTime && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {selectedCharacter} · {selectedTime} minutes
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {calculateCreditsForCharacter(selectedTime, selectedCharacter)}{" "}
              credits
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
