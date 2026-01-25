import React, { useMemo } from "react";
import { ChatDataType } from "../../../type/types";
import Strengths from "./Strengths";
import { Header } from "./Header";
import { DashBoardLeft } from "./DashBoardLeft";

type ExtendedChatDataType = ChatDataType & {
  time?: number;
  analysis?: any;
};

interface DashboardContentProps {
  username: string;
  chatsData?: { chats?: ExtendedChatDataType[] };
}

export const DashboardContent = ({
  username,
  chatsData,
}: DashboardContentProps) => {
  // Calculate stats
  const stats = useMemo(() => {
    if (!chatsData?.chats) {
      return {
        totalChats: 0,
        totalPracticeTime: 0,
        chatsThisWeek: 0,
      };
    }

    const chats = chatsData.chats;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const totalPracticeTime = chats.reduce(
      (sum, chat) => sum + (chat.time || 0),
      0,
    );

    const chatsThisWeek = chats.filter(
      (chat) => new Date(chat.createdAt) >= weekAgo,
    ).length;

    return {
      totalChats: chats.length,
      totalPracticeTime,
      chatsThisWeek,
    };
  }, [chatsData]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-6">
      <Header username={username} stats={stats} />
      <div className="flex flex-col lg:flex-row gap-2">
        <DashBoardLeft />
        <Strengths />
      </div>
    </div>
  );
};
