import React from "react";
import { RiSpeakAiFill } from "react-icons/ri";
import levels from "../../../data/levels.json";
import { DifficultyStars } from "./DifficultyStars";

type LevelSelectionProps = {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  iconMap: Record<string, React.ElementType>;
};

export const LevelSelection = ({
  selectedLevel,
  setSelectedLevel,
  iconMap,
}: LevelSelectionProps) => {
  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="flex justify-between items-center gap-2">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            Difficulty Level
          </h2>
          <p className="text-xs text-gray-500">
            Select your Japanese proficiency level
          </p>
        </div>

        <div className="bg-gray-100 rounded-full p-2">
          <RiSpeakAiFill className="w-6 h-6 text-gray-700" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {levels.map((level) => {
          const IconComponent = iconMap[level.icon];
          const isSelected = selectedLevel === level.id;

          return (
            <div
              key={level.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedLevel(level.id);
              }}
              className={`cursor-pointer p-5 rounded-lg border transition-all ${
                isSelected
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <DifficultyStars level={level.difficulty} />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-medium text-gray-900">
                    {level.label}
                  </h3>
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {level.japaneseLevel}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {level.description}
                </p>
              </div>

              {/* Difficulty Bar */}
              <div className="mt-4">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-wide mb-2">
                  <span>Difficulty</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      isSelected ? "bg-gray-900" : "bg-gray-400"
                    }`}
                    style={{
                      width: `${(level.difficulty / 3) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
