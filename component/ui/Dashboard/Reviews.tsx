import React from "react";
import { Container } from "./shared/container";
import { CheckCircle2, Clock } from "lucide-react";

interface Review {
  id?: string;
  exerciseTitle?: string;
  completedAt?: string;
  score?: number;
}

interface ReviewsProps {
  reviews?: Review[];
  onViewAll?: () => void;
}

const Reviews = ({ reviews, onViewAll }: ReviewsProps) => {
  // Default placeholder data - will be replaced when reviews are implemented
  const defaultReviews: Review[] = [
    {
      id: "1",
      exerciseTitle: "Self Introduction",
      completedAt: "2 days ago",
      score: 85,
    },
    {
      id: "2",
      exerciseTitle: "Greetings",
      completedAt: "5 days ago",
      score: 92,
    },
  ];

  const displayReviews = reviews || defaultReviews;

  return (
    <Container title="Reviews" className="bg-white border-none">
      <div className="flex flex-col gap-3">
        {displayReviews.length === 0 ? (
          <p className="text-sm text-gray-600">No reviews yet</p>
        ) : (
          displayReviews.slice(0, 2).map((review, index) => (
            <div
              key={review.id || index}
              className="flex items-center justify-between pb-2 border-b border-gray-200 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {review.exerciseTitle || "Exercise"}
                  </p>
                  {review.completedAt && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        {review.completedAt}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {review.score !== undefined && (
                <div className="text-sm font-medium text-gray-900 flex-shrink-0 ml-2">
                  {review.score}%
                </div>
              )}
            </div>
          ))
        )}
        {onViewAll && displayReviews.length > 2 && (
          <button
            onClick={onViewAll}
            className="text-xs text-gray-600 hover:text-gray-900 transition-colors mt-1"
          >
            View all reviews
          </button>
        )}
      </div>
    </Container>
  );
};

export default Reviews;
