import type { MasteryState } from "../../features/practice/types";

const colors: Record<MasteryState, string> = {
  new:      "bg-gray-100 text-gray-500",
  learning: "bg-amber-100 text-amber-700",
  familiar: "bg-blue-100 text-blue-700",
  strong:   "bg-green-100 text-green-700",
  mastered: "bg-violet-100 text-violet-700",
};

const labels: Record<MasteryState, string> = {
  new: "New", learning: "Learning", familiar: "Familiar", strong: "Strong", mastered: "Mastered",
};

export function MasteryBadge({ mastery, variant = "pill" }: { mastery: MasteryState; variant?: "pill" | "dot" }) {
  if (variant === "dot") {
    const dotColors: Record<MasteryState, string> = {
      new: "bg-gray-300", learning: "bg-amber-400", familiar: "bg-blue-400", strong: "bg-green-500", mastered: "bg-violet-500",
    };
    return <span className={`inline-block w-2 h-2 rounded-full ${dotColors[mastery]}`} title={labels[mastery]} />;
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[mastery]}`}>
      {labels[mastery]}
    </span>
  );
}
