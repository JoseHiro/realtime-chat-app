import React from "react";
import NextExercise from "./NextExercise";
import Reviews from "./Reviews";
import Streaks from "./Streaks";

export const DashBoardLeft = () => {
  return (
    <div className="flex flex-col gap-2">
      <Streaks />
      <NextExercise />
      <Reviews />
    </div>
  );
};
