import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
}

export const StatsCard = ({ label, value }: StatsCardProps) => {
  return (
    <div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-medium text-gray-900">{value}</div>
    </div>
  );
};
