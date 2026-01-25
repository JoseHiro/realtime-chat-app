import React from "react";
import { Container } from "./shard/container";
import { BookOpen, ArrowRight } from "lucide-react";

interface NextExerciseProps {
  exercise?: {
    topic?: string;
    title?: string;
    description?: string;
  };
  onStart?: () => void;
}

const NextExercise = ({ exercise, onStart }: NextExerciseProps) => {
  // Default placeholder data - will be replaced when exercises are implemented
  const defaultExercise = {
    topic: "Self Introduction",
    title: "Let's say your name!",
    description: "Practice introducing yourself in Japanese",
  };

  const currentExercise = exercise || defaultExercise;

  return (
    <Container title="Next Exercise" className="bg-white border-none">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-300">
          <BookOpen className="w-4 h-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-900">
            {currentExercise.topic}
          </h4>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-700">{currentExercise.title}</p>
          {currentExercise.description && (
            <p className="text-xs text-gray-600">
              {currentExercise.description}
            </p>
          )}
        </div>
        {onStart && (
          <button
            onClick={onStart}
            className="flex items-center gap-2 text-xs font-medium text-gray-900 hover:text-black transition-colors mt-2"
          >
            Start Exercise
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </Container>
  );
};

export default NextExercise;
