interface ProgressBarProps {
  value: number;
  total: number;
  color?: "default" | "score";
}

export function ProgressBar({ value, total, color = "default" }: ProgressBarProps) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;

  let barColor = "bg-gray-900";
  if (color === "score") {
    if (pct >= 80) barColor = "bg-green-500";
    else if (pct >= 50) barColor = "bg-yellow-400";
    else barColor = "bg-red-400";
  }

  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
