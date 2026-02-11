import React from "react";
import { Container } from "./shard/container";
import { Flame, CircleCheck } from "lucide-react";

const Streaks = () => {
  return (
    <Container
      title="Steaks"
      className="border-none bg-white text-black flex flex-col gap-2"
    >
      <div className="flex gap-2 items-center">
        <Flame className="w-8 h-8 text-red-500" />
        <div>
          <p className="text-2xl font-bold">19</p>
          <p> days</p>
        </div>
      </div>
      <div className="flex justify-between">
        {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
          <div
            key={day}
            className="flex flex-col gap-2 justify-center items-center"
          >
            <CircleCheck className="w-4 h-4 text-green-500" />
            <p className="text-xs">{day}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Streaks;
