import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { apiRequest } from "../../lib/apiRequest";
import { toast } from "sonner";
import {
  LogOut,
  Users,
  MessageSquare,
  TrendingUp,
  Shield,
  DollarSign,
  Coins,
  FileText,
} from "lucide-react";
import { RoundedButton } from "../../component/shared/button";

interface AdminStats {
  totalUsers: number;
  totalChats: number;
  activeSubscriptions: number;
  recentUsers: Array<{
    id: string;
    email: string;
    username: string | null;
    createdAt: string;
    subscriptionPlan: string | null;
  }>;
}

interface UserUsage {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
  subscriptionPlan: string | null;
  subscriptionStatus: string | null;
  usage: {
    totalCostUsd: number;
    totalTokens: number;
    totalCharacters: number;
    totalEvents: number;
    chatsWithUsage: number;
  };
}

interface UsageData {
  users: UserUsage[];
  totals: {
    totalCostUsd: number;
    totalTokens: number;
    totalCharacters: number;
    totalEvents: number;
  };
}

const AdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [chatDetail, setChatDetail] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAdminAuth = useCallback(async () => {
    try {
      const response = await apiRequest("/api/admin/verify", {
        method: "GET",
      });
      console.log("Admin verify response:", response); // Debug log
      if (!response || !response.isAdmin) {
        console.log("Not authenticated, redirecting to login");
        router.push("/admin/login");
        return;
      }
      // Auth successful
      setIsAuthenticated(true);
      await Promise.all([fetchStats(), fetchUsageData()]);
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  const fetchStats = async () => {
    try {
      const data = (await apiRequest("/api/admin/stats", {
        method: "GET",
      })) as AdminStats;
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageData = async () => {
    try {
      const data = (await apiRequest("/api/admin/usage", {
        method: "GET",
      })) as UsageData | null;

      if (!data) {
        console.error("No data returned from usage API");
        toast.error("Failed to load usage data");
        return;
      }

      console.log("Usage data fetched:", data);
      console.log("Users count:", data?.users?.length);
      console.log("Total cost:", data?.totals?.totalCostUsd);
      setUsageData(data);
    } catch (error) {
      console.error("Error fetching usage data:", error);
      toast.error("Failed to load usage data");
    }
  };

  const fetchUserDetail = async (userId: string) => {
    try {
      const data = await apiRequest(`/api/admin/usage?userId=${userId}`, {
        method: "GET",
      });
      setUserDetail(data);
      setChatDetail(null);
    } catch (error) {
      console.error("Error fetching user detail:", error);
      toast.error("Failed to load user details");
    }
  };

  const fetchChatDetail = async (chatId: number) => {
    try {
      const data = await apiRequest(`/api/admin/usage?chatId=${chatId}`, {
        method: "GET",
      });
      setChatDetail(data);
      setUserDetail(null);
    } catch (error) {
      console.error("Error fetching chat detail:", error);
      toast.error("Failed to load chat details");
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("/api/admin/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-gray-900" />
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <RoundedButton
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-black"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </RoundedButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalUsers || 0}
                </p>
              </div>
              <Users className="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Total Conversations
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalChats || 0}
                </p>
              </div>
              <MessageSquare className="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Active Subscriptions
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.activeSubscriptions || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cost (USD)</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${usageData?.totals?.totalCostUsd?.toFixed(4) || "0.0000"}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Usage Overview Cards */}
        {usageData && usageData.totals && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tokens</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {usageData.totals.totalTokens.toLocaleString()}
                  </p>
                </div>
                <Coins className="w-10 h-10 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Characters (TTS)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {usageData.totals.totalCharacters.toLocaleString()}
                  </p>
                </div>
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {usageData.totals.totalEvents.toLocaleString()}
                  </p>
                </div>
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* User Detail View */}
        {userDetail && (
          <div className="bg-white rounded-lg border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  User Usage: {userDetail.user.email}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {userDetail.user.username || "No username"}
                </p>
              </div>
              <RoundedButton
                onClick={() => {
                  setUserDetail(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Close
              </RoundedButton>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${userDetail.summary.totalCostUsd.toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Tokens</p>
                  <p className="text-xl font-bold text-gray-900">
                    {userDetail.summary.totalTokens.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Characters</p>
                  <p className="text-xl font-bold text-gray-900">
                    {userDetail.summary.totalCharacters.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Events</p>
                  <p className="text-xl font-bold text-gray-900">
                    {userDetail.summary.totalEvents}
                  </p>
                </div>
              </div>

              <h3 className="text-md font-semibold text-gray-900 mb-4">
                Conversations ({userDetail.chats.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Chat ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cost (USD)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tokens
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Characters
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Events
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userDetail.chats.map((chat: any) => (
                      <tr key={chat.chatId}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {chat.chatId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {chat.title || "Untitled"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ${chat.costUsd.toFixed(4)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {chat.totalTokens.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {chat.totalCharacters.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {chat.eventCount}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => fetchChatDetail(chat.chatId)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Chat Detail View */}
        {chatDetail && (
          <div className="bg-white rounded-lg border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Chat Usage:{" "}
                  {chatDetail.chat.title || `Chat #${chatDetail.chat.id}`}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  User: {chatDetail.chat.user.email}
                </p>
              </div>
              <RoundedButton
                onClick={() => {
                  setChatDetail(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Close
              </RoundedButton>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${chatDetail.summary.totalCostUsd.toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Tokens</p>
                  <p className="text-xl font-bold text-gray-900">
                    {chatDetail.summary.totalTokens.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Characters</p>
                  <p className="text-xl font-bold text-gray-900">
                    {chatDetail.summary.totalCharacters.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Events</p>
                  <p className="text-xl font-bold text-gray-900">
                    {chatDetail.summary.totalEvents}
                  </p>
                </div>
              </div>

              <h3 className="text-md font-semibold text-gray-900 mb-4">
                Usage Events ({chatDetail.events.length})
              </h3>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Provider
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Input Tokens
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Output Tokens
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Characters
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cost (USD)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chatDetail.events.map((event: any) => (
                      <tr key={event.id}>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(event.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {event.provider}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {event.apiType}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {event.inputTokens || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {event.outputTokens || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {event.characters || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ${Number(event.costUsd).toFixed(6)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              event.status === "SUCCESS"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users with Usage */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Users Usage Statistics
            </h2>
          </div>
          {!usageData ? (
            <div className="p-6 text-center text-gray-500">
              Loading usage data...
            </div>
          ) : usageData.users && usageData.users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No usage data available yet. Usage will appear here once users
              start chatting.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost (USD)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Tokens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Characters
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usageData.users?.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.username || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {user.subscriptionPlan || "Free"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${user.usage.totalCostUsd.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.usage.totalTokens.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.usage.totalCharacters.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.usage.chatsWithUsage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => fetchUserDetail(user.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
