import React, { useMemo } from "react";
import { ChatDataType } from "../../../type/types";
import { Header } from "./Header";
import { DashBoardLeft } from "./DashBoardLeft";
import { ActionButton } from "./ActionButton";
import { MessageSquare, Users } from "lucide-react";
import { useRouter } from "next/router";

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
  const router = useRouter();
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
    <div className="bg-white rounded-xl p-6 mb-6 space-y-6">
      <Header username={username} stats={stats} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[60%_40%] gap-6">
        <DashBoardLeft />
        <div className="flex flex-col gap-2 pl-4 pr-4 sm:pl-0 sm:pr-0 lg:pl-0 lg:pr-4">
          <h3 className="text-black">Practices</h3>
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
