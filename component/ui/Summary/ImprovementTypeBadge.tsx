import React from "react";
import { ImprovementType } from "../../../types/types";
import {
  getImprovementTypeLabel,
  getImprovementTypeColor,
} from "../../../lib/improvements/getImprovementTypes";

interface ImprovementTypeBadgeProps {
  type: ImprovementType;
  className?: string;
}

export const ImprovementTypeBadge: React.FC<ImprovementTypeBadgeProps> = ({
  type,
  className = "",
}) => {
  const label = getImprovementTypeLabel(type);
  const colorClasses = getImprovementTypeColor(type);

  return (
    <span
      className={`py-1 px-2 rounded text-xs font-medium border ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};
