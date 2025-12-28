import React from "react";
import { Clock } from "lucide-react";
import { SelectModeButton } from "../../button";

type TimeSelectionProps = {
  selectedTime: number; // 3, 5, or 10 (minutes)
  setSelectedTime: (time: number) => void;
};

export const TimeSelection = ({
  selectedTime,
  setSelectedTime,
}: TimeSelectionProps) => {
  const timeOptions = [
    { value: 3, label: "3 min", description: "Quick practice" },
    { value: 5, label: "5 min", description: "Standard session" },
    { value: 10, label: "10 min", description: "Extended practice" },
  ];

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-gray-700 mb-2 mt-10">Duration</h2>
        <div className="bg-gray-100 rounded-full p-2">
          <Clock className="w-6 h-6 text-gray-700" />
        </div>
      </div>
      <div className="flex gap-4 max-w-2xl">
        {timeOptions.map((option) => (
          <SelectModeButton
            key={option.value}
            onClick={() => setSelectedTime(option.value)}
            className={`cursor-pointer relative group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 flex-1 ${
              selectedTime === option.value
                ? "border-green-500 shadow-green-200"
                : "border-transparent hover:border-green-200"
            }`}
          >
            <div className="text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto transition-colors duration-300 ${
                  selectedTime === option.value
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-green-100"
                }`}
              >
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {option.label}
              </h3>
              <p className="text-gray-600 text-xs">{option.description}</p>
            </div>
          </SelectModeButton>
        ))}
      </div>
    </div>
  );
};
