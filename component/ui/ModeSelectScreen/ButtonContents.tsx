import React from "react";

export type ButtonContentsProps = {
  color?: string;
  label: string;
  description: string;
  example?: string;
  selected?: boolean;
};

export const ButtonContents = React.memo(
  ({ color, label, description, example, selected }: ButtonContentsProps) => {
    return (
      <>
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
        ></div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{label}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          <p className="text-xs text-gray-500 italic">{example}</p>
        </div>
        {selected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </>
    );
  }
);

ButtonContents.displayName = "ButtonContents";
