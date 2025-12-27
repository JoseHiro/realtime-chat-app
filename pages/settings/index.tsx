import React, { useState, useEffect } from "react";
import {
  LogOut,
  User,
  Calendar,
  Crown,
  ChevronRight,
  Mail,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Sidebar } from "../../component/ui/Sidebar";
import { RoundedButton } from "../../component/button";
import { apiRequest } from "../../lib/apiRequest";
import { useRouter } from "next/router";
import { toast } from "sonner";

interface UserData {
  user: {
    username: string | null;
    email: string;
    subscriptionStatus: string | null;
    subscriptionPlan: string | null;
    createdAt: string;
    totalChats: number;
  };
  trialStatus: string | null;
}

const SettingsIndex = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = (await apiRequest("/api/user", {
        method: "GET",
      })) as UserData;
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
      router.push("/login");
      toast.success("Successfully logged out!", { position: "top-center" });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "trialing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "canceled":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "ended":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen flex">
        <Sidebar />
        <div className="min-h-screen bg-gradient-to-br pt-5 from-gray-50 to-green-50 overflow-auto w-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="relative w-full h-screen flex">
        <Sidebar />
        <div className="min-h-screen bg-gradient-to-br pt-5 from-gray-50 to-green-50 overflow-auto w-full flex items-center justify-center">
          <p className="text-gray-600">Failed to load user data</p>
        </div>
      </div>
    );
  }

  const settingsCards = [
    {
      title: "Account Settings",
      description: "Manage your username and password",
      icon: User,
      href: "/settings/account",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Subscription & Billing",
      description: "Manage your subscription plan and billing",
      icon: CreditCard,
      href: "/settings/billing",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="relative w-full h-screen flex">
      <Sidebar />
      <div className="min-h-screen bg-gradient-to-br pt-5 from-gray-50 to-green-50 overflow-auto w-full">
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Settings
            </h1>

            {/* User Overview */}
            <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {userData.user.username || "User"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 capitalize">
                      {userData.user.subscriptionPlan || "Free"}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border inline-block ${getStatusColor(
                      userData.user.subscriptionStatus
                    )}`}
                  >
                    {userData.user.subscriptionStatus || "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Settings Cards */}
            <div className="space-y-4 mb-6">
              {settingsCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.title}
                    onClick={() => router.push(card.href)}
                    className={`w-full p-4 rounded-lg border-1 ${card.color} transition-all duration-200 text-left group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg bg-white ${card.iconColor}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {card.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {card.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Account Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Member Since:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(userData.user.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Total Conversations:</span>
                  <span className="text-gray-900 font-medium">
                    {userData.user.totalChats}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <div className="flex items-center justify-end">
                <RoundedButton
                  onClick={handleLogout}
                  className=" flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-all duration-200 shadow-sm"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </RoundedButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsIndex;
