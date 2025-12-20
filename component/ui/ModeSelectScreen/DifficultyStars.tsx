import React from "react";
import { Star } from "lucide-react";

export const DifficultyStars = React.memo(({ level }: { level: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= level
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
});

DifficultyStars.displayName = "DifficultyStars";
