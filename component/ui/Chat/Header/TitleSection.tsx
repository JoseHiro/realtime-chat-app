import React from "react";
import { Pen } from "lucide-react";

interface TitleSectionProps {
  title: string;
  id?: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (value: string) => void;
}

export const TitleSection = ({
  title,
  id,
  isEditing,
  onStartEdit,
  onSave,
}: TitleSectionProps) => {
  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          className="border rounded-md px-2 py-1 text-sm w-48 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          defaultValue={title}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSave((e.target as HTMLInputElement).value);
            }
          }}
        />
        <button
          onClick={() =>
            onSave(
              (document.querySelector("input") as HTMLInputElement)?.value ||
                "",
            )
          }
          className="cursor-pointer px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition"
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {id && (
        <button
          onClick={onStartEdit}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Edit title"
        >
          <Pen className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700 cursor-pointer" />
        </button>
      )}
    </div>
  );
};
