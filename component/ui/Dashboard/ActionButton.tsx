import React from "react";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
}

export const ActionButton = ({
  icon: Icon,
  title,
  description,
  onClick,
  disabled = false,
  comingSoon = false,
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-6 rounded-lg border text-left transition-all shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:border-black hover:shadow-sm cursor-pointer"
      }`}
    >
      <div className="flex items-start gap-4 justify-between mb-4">
        <div className="w-12 h-12 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-900" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
          {comingSoon && (
            <div className="px-3 py-1 bg-gray-100 rounded-full inline-block mt-1">
              <span className="text-xs font-medium text-gray-600">
                Coming Soon
              </span>
            </div>
          )}
        </div>
        {!disabled && !comingSoon && (
          <ArrowRight className="w-5 h-5 shrink-0 text-gray-400" />
        )}
      </div>

      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
};
