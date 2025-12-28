import React from "react";
import { UserRound } from "lucide-react";
import { SelectModeButton } from "../../button";
import Image from "next/image";
import type { CharacterName } from "../../../lib/voice/voiceMapping";
import { getAllCharacters } from "../../../lib/voice/voiceMapping";

type VoiceSelectionProps = {
  selectedCharacter: CharacterName;
  setSelectedCharacter: (character: CharacterName) => void;
};

export const VoiceSelection = ({
  selectedCharacter,
  setSelectedCharacter,
}: VoiceSelectionProps) => {
  const characters = getAllCharacters();
  // Get character images (using placeholder for new characters - you'll need to add images)
  const getCharacterImage = (characterName: CharacterName) => {
    if (characterName === "Sakura") return "/img/female.jpg";
    if (characterName === "Ken") return "/img/man.jpg";
    // For new characters, use placeholder or default image
    return characterName.includes("Chica") || characterName.includes("Aiko")
      ? "/img/female.jpg"
      : "/img/man.jpg";
  };

  const getCharacterColorClass = (characterName: CharacterName) => {
    const colorMap: Record<CharacterName, string> = {
      Sakura: "bg-pink-500",
      Ken: "bg-blue-500",
      Chica: "bg-purple-500",
      Haruki: "bg-indigo-500",
      Aiko: "bg-rose-500",
      Ryo: "bg-cyan-500",
    };
    return colorMap[characterName] || "bg-gray-500";
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-gray-700 mb-2 mt-10">Choose Your Character</h2>
        <div className="bg-gray-100 rounded-full p-2">
          <UserRound className="w-6 h-6 text-gray-700" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
        {characters.map((character) => {
          const isSelected = selectedCharacter === character.characterName;
          const isPremium = character.voiceProvider === "elevenlabs";

          return (
            <SelectModeButton
              key={character.characterName}
              onClick={() => setSelectedCharacter(character.characterName)}
              className={`cursor-pointer relative group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                isSelected
                  ? "border-green-500 shadow-green-200"
                  : "border-transparent hover:border-green-200"
              } ${isPremium ? "ring-2 ring-yellow-200" : ""}`}
            >
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={getCharacterImage(character.characterName)}
                  alt={character.characterName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                {isSelected && (
                  <div className={`absolute top-2 right-2 w-5 h-5 ${getCharacterColorClass(character.characterName)} rounded-full flex items-center justify-center z-10`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
                {isPremium && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    Premium
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {character.characterName}
                </h3>
                <p className="text-gray-600 text-xs">{character.description}</p>
              </div>
            </SelectModeButton>
          );
        })}
      </div>
    </div>
  );
};
