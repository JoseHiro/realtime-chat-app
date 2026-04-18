import React, { useMemo } from "react";
import { ChatDataType } from "../../../types/types";
import { MessageSquare, BookOpen, Clock, ArrowRight, Library } from "lucide-react";
import { useRouter } from "next/router";

type ExtendedChatDataType = ChatDataType & {
  time?: number;
  analysis?: any;
};

interface DashboardContentProps {
  username: string;
  chatsData?: { chats?: ExtendedChatDataType[] };
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard = ({ icon, title, description, onClick }: FeatureCardProps) => (
  <button
    onClick={onClick}
    className="group flex flex-col gap-4 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-left hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
  >
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
        {icon}
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
    </div>
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  </button>
);

export const DashboardContent = ({
  username,
  chatsData,
}: DashboardContentProps) => {
  const router = useRouter();

  const stats = useMemo(() => {
    if (!chatsData?.chats) return { totalChats: 0, chatsThisWeek: 0 };
    const chats = chatsData.chats;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const chatsThisWeek = chats.filter(
      (chat) => new Date(chat.createdAt) >= weekAgo,
    ).length;
    return { totalChats: chats.length, chatsThisWeek };
  }, [chatsData]);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {greeting}, {username}.
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {stats.chatsThisWeek > 0
            ? `${stats.chatsThisWeek} session${stats.chatsThisWeek > 1 ? "s" : ""} this week`
            : "No sessions this week yet. Let's get started."}
        </p>
      </div>

      {/* Main features */}
      <div className="mb-10">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Features
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FeatureCard
            icon={<MessageSquare className="w-5 h-5 text-gray-700" />}
            title="Chat Practice"
            description="Practice natural Japanese conversation with an AI partner. Choose your level and topic."
            onClick={() => router.push("/new_chat")}
          />
          <FeatureCard
            icon={<BookOpen className="w-5 h-5 text-gray-700" />}
            title="AI Flashcard"
            description="Review vocabulary and grammar with spaced repetition. Build lasting memory."
            onClick={() => router.push("/drills")}
          />
          <FeatureCard
            icon={<Library className="w-5 h-5 text-gray-700" />}
            title="Vocabulary"
            description="Add and manage your personal word list. Organize words into decks for practice."
            onClick={() => router.push("/vocabulary")}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-800 mb-8" />

      {/* Coming soon */}
      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Coming soon
        </p>
        <div className="flex flex-col gap-2">
          {[
            { icon: <Clock className="w-4 h-4" />, label: "Drill Exercises", note: "Structured grammar and vocabulary drills" },
            { icon: <MessageSquare className="w-4 h-4" />, label: "Role-Play Scenarios", note: "Real-world conversation simulations" },
          ].map(({ icon, label, note }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 opacity-60"
            >
              <div className="text-gray-400 dark:text-gray-600">{icon}</div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</span>
                <p className="text-xs text-gray-400 dark:text-gray-500">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
