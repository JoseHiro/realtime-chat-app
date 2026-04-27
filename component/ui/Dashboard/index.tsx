import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChatDataType } from "../../../types/types";
import {
  MessageSquare,
  BookOpen,
  Clock,
  ArrowRight,
  Plus,
  Zap,
} from "lucide-react";
import { StreakCalendar } from "./StreakCalendar";

type ExtendedChatDataType = ChatDataType & {
  time?: number;
  analysis?: any;
  characterName?: string;
  title?: string;
};

interface DashboardContentProps {
  username: string;
  chatsData?: { chats?: ExtendedChatDataType[] };
  practiceActivity?: { createdAt: string }[];
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const FeatureCard = ({ icon, title, description, href }: FeatureCardProps) => (
  <Link
    href={href}
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
  </Link>
);

export const DashboardContent = ({
  username,
  chatsData,
  practiceActivity,
}: DashboardContentProps) => {
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
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {greeting}, {username}.
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {stats.chatsThisWeek > 0
              ? `${stats.chatsThisWeek} session${stats.chatsThisWeek > 1 ? "s" : ""} this week`
              : "No sessions this week yet. Let's get started."}
          </p>
        </div>
        <div className="shrink-0 w-28 h-28 sm:w-36 sm:h-36 relative">
          <Image
            src="/img/sakura.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 640px) 112px, 144px"
            priority
          />
        </div>
      </div>

      <div className="mb-8">
        <StreakCalendar activities={practiceActivity} />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Quick actions
        </p>
        <div className="flex gap-2">
          <Link
            href="/chat"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Start conversation
          </Link>
          <Link
            href="/flashcards?tab=vocabulary&add=1"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add word
          </Link>
        </div>
      </div>

      {/* Main features */}
      <div className="mb-10">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Features
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FeatureCard
            icon={<MessageSquare className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            title="Chat Practice"
            description="Practice natural Japanese conversation with an AI partner. Choose your level and topic."
            href="/chat"
          />
          <FeatureCard
            icon={<BookOpen className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            title="AI Flashcard"
            description="Review vocabulary and grammar with spaced repetition. Build lasting memory."
            href="/flashcards"
          />
        </div>
      </div>

      {/* Recent chats */}
      {chatsData?.chats && chatsData.chats.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Recent chats
            </p>
            <Link href="/chats" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              See all
            </Link>
          </div>
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            {chatsData.chats.slice(0, 3).map((chat) => (
              <Link
                key={chat.id}
                href={`/chats/${chat.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                    {chat.title || chat.theme || "Untitled chat"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(chat.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {chat.characterName && <span className="ml-2">· {chat.characterName}</span>}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-3 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

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
