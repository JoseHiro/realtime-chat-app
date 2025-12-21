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
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-gray-700 mb-2 mt-10">Japanese Level</h2>
        <div className="bg-gray-100 rounded-full p-2">
          <RiSpeakAiFill className="w-6 h-6 text-gray-700" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => {
          const IconComponent = iconMap[level.icon];
          const isSelected = selectedLevel === level.id;

          return (
            <div
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`cursor-pointer relative group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 h-full flex flex-col ${
                isSelected
                  ? "border-green-500 shadow-green-200 ring-4 ring-green-500 ring-opacity-20"
                  : "border-transparent hover:border-green-200"
              }`}
            >
              {/* Header with Icon and Stars */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br ${level.color} text-white shadow-lg`}
                >
                  <IconComponent className="w-7 h-7" />
                </div>
                <DifficultyStars level={level.difficulty} />
              </div>

              {/* Level Info */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {level.label}
                  </h3>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {level.japaneseLevel}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {level.description}
                </p>
              </div>

              {/* Difficulty Indicator Bar */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span>Difficulty</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${level.color} transition-all duration-300`}
                    style={{
                      width: `${(level.difficulty / 3) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  SELECTED
                </div>
              )}

              {/* Hover Glow Effect */}
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                  isSelected
                    ? "bg-gradient-to-br from-green-500/5 to-green-600/5"
                    : "group-hover:bg-gradient-to-br group-hover:from-green-500/5 group-hover:to-green-600/5"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
