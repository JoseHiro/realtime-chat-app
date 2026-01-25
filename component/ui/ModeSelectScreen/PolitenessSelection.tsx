import React from "react";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { User } from "lucide-react";
import politenesses from "../../../data/politenesses.json";
import { SelectModeButton } from "../../shared/button";
import { ButtonContents } from "./ButtonContents";

type PolitenessSelectionProps = {
  selectedPoliteness: string;
  setSelectedPoliteness: (politeness: string) => void;
  iconMap: Record<string, React.ElementType>;
};

export const PolitenessSelection = ({
  selectedPoliteness,
  setSelectedPoliteness,
  iconMap,
}: PolitenessSelectionProps) => {
  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            Speaking Style
          </h2>
          <p className="text-xs text-gray-500">
            Choose how the character should speak
          </p>
        </div>
        <div className="bg-gray-100 rounded-full p-2">
          <FaPersonWalkingLuggage className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {politenesses.map((option) => {
          const IconComponent = iconMap[option.icon] ?? User;
          const isSelected = selectedPoliteness === option.id;

          return (
            <SelectModeButton
              key={option.id}
              onClick={() => setSelectedPoliteness(option.id)}
              className={`cursor-pointer p-5 rounded-lg border transition-all ${
                isSelected
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="space-y-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Content */}
                <ButtonContents
                  label={option.label}
                  description={option.description}
                  example={option.example}
                  selected={isSelected}
                />
              </div>
            </SelectModeButton>
          );
        })}
      </div>
    </div>
  );
};
