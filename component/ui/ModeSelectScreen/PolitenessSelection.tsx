import React from "react";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { User } from "lucide-react";
import politenesses from "../../../data/politenesses.json";
import { SelectModeButton } from "../../button";
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
    <div className="mb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-gray-700 mb-2 mt-10">Speaking Style</h2>
        <div className="bg-gray-100 rounded-full p-2">
          <FaPersonWalkingLuggage className="w-6 h-6 text-gray-700" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {politenesses.map((option) => {
          const IconComponent = iconMap[option.icon] ?? User;
          return (
            <SelectModeButton
              key={option.id}
              onClick={() => setSelectedPoliteness(option.id)}
              className={`cursor-pointer relative group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                selectedPoliteness === option.id
                  ? "border-green-500 shadow-green-200"
                  : "border-transparent hover:border-green-200"
              }`}
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>
              <div className="relative z-10 text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto transition-colors duration-300 ${
                    selectedPoliteness === option.id
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <ButtonContents
                  label={option.label}
                  description={option.description}
                  example={option.example}
                  selected={selectedPoliteness === option.id}
                />
              </div>
            </SelectModeButton>
          );
        })}
      </div>
    </div>
  );
};
