import React from "react";
import { useRouter } from "next/router";
import { Trophy } from "lucide-react";

interface ResultViewProps {
  correctCount: number;
  totalTasks: number;
  onBackToRoadmap?: () => void;
}

export function ResultView({
  correctCount,
  totalTasks,
  onBackToRoadmap,
}: ResultViewProps) {
  const router = useRouter();
  const accuracy = totalTasks > 0 ? Math.round((correctCount / totalTasks) * 100) : 0;

  const handleBack = () => {
    if (onBackToRoadmap) onBackToRoadmap();
    else router.push("/drills");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Trophy className="h-5 w-5 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
          Excellent!
        </h1>
        <p className="text-lg text-gray-600">
          You completed all {totalTasks} tasks.
        </p>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-8 py-4">
          <p className="text-sm font-medium text-gray-500">Accuracy</p>
          <p className="text-3xl font-bold text-emerald-600">{accuracy}%</p>
          <p className="mt-1 text-sm text-gray-600">
            {correctCount} / {totalTasks} correct
          </p>
        </div>
        <button
          type="button"
          onClick={handleBack}
          className="rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-medium text-white hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Back to Roadmap
        </button>
      </div>
    </div>
  );
}
