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
import { Sidebar } from "../Sidebar";
import { RoundedButton } from "../../shared/button";
import { apiRequest } from "../../../lib/apiRequest";
import { useRouter } from "next/router";
import { toast } from "sonner";
import PageLayout from "./shared/PageLayout";

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

export const SettingsContent = () => {
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
        <div className="min-h-screen bg-gray-50 pt-5 overflow-auto w-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
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
      color: "",
      iconColor: "text-blue-600",
    },
    {
      title: "Subscription & Billing",
      description: "Manage your subscription plan and billing",
      icon: CreditCard,
      href: "/settings/billing",
      color: "",
      iconColor: "text-green-600",
    },
  ];

  return (
    <PageLayout title="Settings">
      {/* User Overview */}
      <div className=" rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {userData?.user.username || "User"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 capitalize">
                {userData?.user.subscriptionPlan || "Free"}
              </span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full border inline-block ${getStatusColor(
                userData?.user.subscriptionStatus || "Inactive",
              )}`}
            >
              {userData?.user.subscriptionStatus || "Inactive"}
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
                  <div className={`p-3 rounded-lg bg-white ${card.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
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
          {[
            {
              icon: Calendar,
              label: "Member Since:",
              value: formatDate(userData?.user.createdAt || ""),
            },
            {
              icon: Mail,
              label: "Total Conversations:",
              value: userData?.user.totalChats || 0,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{item.label}</span>
                <span className="text-gray-900 font-medium">{item.value}</span>
              </div>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="flex items-center justify-end">
          <RoundedButton
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-all duration-200 shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </RoundedButton>
        </div>
      </div>
    </PageLayout>
  );
};
