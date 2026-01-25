import React from "react";
import { MessageSquare, Users } from "lucide-react";
import { useRouter } from "next/router";
import { ActionButton } from "./ActionButton";
import NextExercise from "./NextExercise";
import Reviews from "./Reviews";
import Streaks from "./Streaks";

export const DashBoardLeft = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <Streaks />
        <NextExercise />
        <Reviews />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-black">Practices</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <ActionButton
            icon={MessageSquare}
            title="Start Conversation"
            description="Practice Japanese with AI characters. Choose your level, theme, and character."
            onClick={() => router.push("/new")}
          />
          <ActionButton
            icon={Users}
            title="Role Play Chat"
            description="Practice real-world scenarios like job interviews, restaurant orders, and more."
            onClick={() => router.push("/new")}
            disabled
            comingSoon
          />
        </div>
      </div>
    </div>
  );
};
