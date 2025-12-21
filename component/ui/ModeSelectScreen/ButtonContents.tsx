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
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
            {label}
          </h3>
          <p className="text-gray-600 text-xs">{description}</p>
          {example && (
            <p className="text-xs text-gray-500 italic mt-0.5">{example}</p>
          )}
        </div>
        {selected && (
          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        )}
      </>
    );
  }
);

ButtonContents.displayName = "ButtonContents";
