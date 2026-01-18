import React, { useMemo } from "react";
import { useRouter } from "next/router";
import {
  MessageSquare,
  Settings,
  Flame,
  Clock,
  TrendingUp,
  FileText,
  ChevronRight,
  Coffee,
  Briefcase,
  Plane,
  BookOpen,
  Users,
  MessageCircle,
  Sparkles,
  Crown,
  Loader2,
} from "lucide-react";
import { Sidebar } from "../component/ui/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/apiRequest";
import { ChatDataType } from "../type/types";
import themes from "../data/themes.json";
import { useSpeech } from "../context/SpeechContext";

// Extended type for chat data with additional fields from API
type ExtendedChatDataType = ChatDataType & {
  time?: number;
  analysis?: any;
};

const Dashboard = () => {
  const router = useRouter();
  const { username, subscriptionPlan } = useSpeech();

  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await apiRequest("/api/user");
      if (!data) throw new Error("Failed to fetch user data");
      return data;
    },
  });

  // Fetch chats
  const { data: chatsData, isLoading: chatsLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const data = await apiRequest("/api/chats/get");
      if (!data) throw new Error("Failed to fetch chats");
      return data;
    },
  });

  // Map theme IDs to icon components
  const getThemeIcon = (themeId?: string) => {
    const iconMap: Record<string, React.ElementType> = {
      daily: Coffee,
      business: Briefcase,
      travel: Plane,
      culture: BookOpen,
      social: Users,
    };

    if (!themeId) return MessageCircle;
    const theme = themes.find((t) => t.id === themeId);
    if (theme && iconMap[theme.icon]) {
      return iconMap[theme.icon];
    }
    return MessageCircle;
  };

  // Calculate streaks and stats
  const stats = useMemo(() => {
    if (!chatsData?.chats) {
      return {
        totalChats: 0,
        totalPracticeTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        chatsThisWeek: 0,
        chatsWithSummaries: 0,
        favoriteTheme: null as string | null,
        last30Days: [] as boolean[],
      };
    }

    const chats = chatsData.chats as ExtendedChatDataType[];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Calculate total practice time
    const totalPracticeTime = chats.reduce((sum, chat) => {
      return sum + (chat.time || 0);
    }, 0);

    // Calculate streaks
    const chatDates = chats
      .map((chat) => new Date(chat.createdAt))
      .map(
        (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
      )
      .sort((a, b) => b.getTime() - a.getTime());

    // Remove duplicates (same day)
    const uniqueDates = Array.from(
      new Set(chatDates.map((d) => d.getTime()))
    ).map((time) => new Date(time));

    // Calculate current streak
    let currentStreak = 0;
    const checkDate = new Date(today);
    for (const date of uniqueDates) {
      const dateTime = date.getTime();
      const checkTime = checkDate.getTime();

      if (dateTime === checkTime) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dateTime < checkTime) {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 1;
    let tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    // Chats this week
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const chatsThisWeek = chats.filter((chat) => {
      const chatDate = new Date(chat.createdAt);
      return chatDate >= weekAgo;
    }).length;

    // Chats with summaries
    const chatsWithSummaries = chats.filter((chat) => chat.analysis).length;

    // Favorite theme
    const themeCounts: Record<string, number> = {};
    chats.forEach((chat) => {
      if (chat.theme) {
        themeCounts[chat.theme] = (themeCounts[chat.theme] || 0) + 1;
      }
    });
    const favoriteTheme =
      Object.keys(themeCounts).length > 0
        ? Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0][0]
        : null;

    // Last 30 days heatmap
    const last30Days: boolean[] = [];
    const chatDatesSet = new Set(
      uniqueDates.map((d) => d.toISOString().split("T")[0])
    );
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      last30Days.push(chatDatesSet.has(dateStr));
    }

    return {
      totalChats: chats.length,
      totalPracticeTime,
      currentStreak,
      longestStreak,
      chatsThisWeek,
      chatsWithSummaries,
      favoriteTheme,
      last30Days,
    };
  }, [chatsData]);

  // Recent chats (last 5)
  const recentChats = useMemo(() => {
    if (!chatsData?.chats) return [];
    return (chatsData.chats as ExtendedChatDataType[]).slice(0, 5);
  }, [chatsData]);

  // Recent summaries (chats with analysis, last 5)
  const recentSummaries = useMemo(() => {
    if (!chatsData?.chats) return [];
    return (chatsData.chats as ExtendedChatDataType[])
      .filter((chat) => chat.analysis)
      .slice(0, 5);
  }, [chatsData]);

  const isLoading = userLoading || chatsLoading;

  if (isLoading) {
    return (
      <div className="relative w-full h-screen flex">
        <Sidebar />
        <div className="min-h-screen bg-white overflow-auto w-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
        </div>
      </div>
    );
  }

  const displayUsername = username || userData?.user?.username || "User";

  return (
    <div className="relative w-full h-screen flex bg-white">
      <Sidebar />
      <div className="min-h-screen bg-white overflow-auto w-full">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {displayUsername}
                </h1>
                <p className="text-gray-600 mt-1">
                  Here&apos;s your learning progress
                </p>
              </div>
              <div className="flex items-center gap-3">
                {subscriptionPlan && (
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      subscriptionPlan === "pro" ||
                      subscriptionPlan === "premium"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {subscriptionPlan === "pro" ||
                    subscriptionPlan === "premium" ? (
                      <Crown className="w-4 h-4" />
                    ) : null}
                    <span className="text-sm font-medium capitalize">
                      {subscriptionPlan}
                    </span>
                  </div>
                )}
                {(subscriptionPlan === "pro" ||
                  subscriptionPlan === "premium") &&
                  userData?.user?.creditsRemaining !== undefined && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white">
                      <Sparkles className="w-4 h-4 text-gray-700" />
                      <span className="text-sm font-medium text-gray-900">
                        {userData.user.creditsRemaining || 0} credits
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Total Chats</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalChats}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">Current Streak</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.currentStreak} days
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Practice Time</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalPracticeTime}m
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">This Week</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.chatsThisWeek}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Usage & Streaks */}
          {/* Main Widget Card */}
          <div className="relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute  -top-24 -right-24 w-48 h-48 bg-gray-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div
              className="absolute -bottom-24 -left-24 w-48 h-48 bg-gray-300 rounded-full blur-3xl opacity-30 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-20 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Glass Card */}
            <div className="relative bg-black backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Daily Usage</h2>
                  <p className="text-sm text-gray-600">Track your progress</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Current Streak */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                      {stats.currentStreak}
                    </div>
                    <div className="text-sm font-medium text-white/70">
                      Day Streak
                    </div>
                  </div>
                </div>

                {/* Longest Streak */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                      {stats.longestStreak}
                    </div>
                    <div className="text-sm font-medium text-white/70">
                      Best Streak
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivation Message */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl mb-6 border border-orange-500/20">
                <Flame className="w-5 h-5 text-orange-300 flex-shrink-0" />
                <span className="text-sm font-medium text-white/90">
                  Keep practicing daily to maintain your streak!
                </span>
              </div>

              {/* 30-Day Heatmap */}
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>
                  Last 30 Days
                </h3>
                <div className="grid grid-cols-10 gap-2">
                  {stats.last30Days.map((hasChat, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg transition-all duration-300 hover:scale-110 ${
                        hasChat
                          ? "bg-white"
                          : "bg-white/5 border border-white/10 hover:border-white/30"
                      }`}
                      title={
                        hasChat
                          ? `Activity on ${new Date(
                              Date.now() - (29 - index) * 24 * 60 * 60 * 1000
                            ).toLocaleDateString()}`
                          : "No activity"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Wider */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Chats */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Recent Chats
                    </h2>
                    <button
                      onClick={() => router.push("/chats")}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {recentChats.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">No chats yet</p>
                      <button
                        onClick={() => router.push("/new")}
                        className="text-sm text-gray-900 hover:underline"
                      >
                        Start your first conversation
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentChats.map((chat: ExtendedChatDataType) => {
                        const ThemeIcon = getThemeIcon(chat.theme);
                        const lastMessage =
                          chat.message && chat.message.length > 0
                            ? chat.message[chat.message.length - 1]
                            : null;
                        return (
                          <button
                            key={chat.id}
                            onClick={() => router.push(`/chats/${chat.id}`)}
                            className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <ThemeIcon className="w-5 h-5 text-gray-700" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-medium text-gray-900 truncate">
                                    {chat.title || "Untitled Chat"}
                                  </h3>
                                  <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                                </div>
                                {lastMessage && (
                                  <p className="text-sm text-gray-600 truncate">
                                    {lastMessage.message}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                  <span>
                                    {new Date(
                                      chat.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  {chat.time && (
                                    <>
                                      <span>•</span>
                                      <span>{chat.time} min</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Narrower */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Quick Stats
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Conversations
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.totalChats}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Summaries</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.chatsWithSummaries}
                    </div>
                  </div>
                  {stats.favoriteTheme && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Favorite Theme
                      </div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const ThemeIcon = getThemeIcon(stats.favoriteTheme);
                          return (
                            <ThemeIcon className="w-5 h-5 text-gray-700" />
                          );
                        })()}
                        <span className="text-lg font-semibold text-gray-900">
                          {themes.find((t) => t.id === stats.favoriteTheme)
                            ?.label || stats.favoriteTheme}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Summaries */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Summaries
                  </h2>
                </div>
                <div className="p-6">
                  {recentSummaries.length === 0 ? (
                    <div className="text-center py-6">
                      <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No summaries yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentSummaries.map((chat: ExtendedChatDataType) => (
                        <button
                          key={chat.id}
                          onClick={() => router.push(`/chats/${chat.id}`)}
                          className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sm text-gray-900 truncate">
                              {chat.title || "Untitled Chat"}
                            </h3>
                            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(chat.createdAt).toLocaleDateString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Quick Link */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <button
                  onClick={() => router.push("/settings")}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Settings
                        </h3>
                        <p className="text-sm text-gray-600">
                          Manage your account
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .grid-cols-15 {
          grid-template-columns: repeat(15, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
