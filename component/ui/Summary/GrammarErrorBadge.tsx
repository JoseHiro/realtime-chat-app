import React from "react";
import { GrammarErrorType } from "../../../lib/grammar/classifyGrammarError";
import {
  getGrammarErrorTypeLabel,
  getGrammarErrorTypeColor,
} from "../../../lib/grammar/classifyGrammarError";

interface GrammarErrorBadgeProps {
  type: GrammarErrorType;
  className?: string;
}

export const GrammarErrorBadge: React.FC<GrammarErrorBadgeProps> = ({
  type,
  className = "",
}) => {
  const label = getGrammarErrorTypeLabel(type);
  const colorClasses = getGrammarErrorTypeColor(type);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};
