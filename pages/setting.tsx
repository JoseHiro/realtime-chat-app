import React from "react";
import { LogOut, User, Calendar, Crown } from "lucide-react";
import { Sidebar } from "../component/ui/Sidebar";
import { RoundedButton } from "../component/button";
import { apiRequest } from "../lib/apiRequest";
import { useRouter } from "next/router";

interface UserData {
  user: {
    username: string;
    subscriptionStatus: string;
    subscriptionPlan: string;
    createdAt: string;
  };
  trialStatus: string;
}

const Setting = () => {
  const router = useRouter()
  // Mock data - replace with your actual data fetching logic
  const userData: UserData = {
    user: {
      username: "Josey",
      subscriptionStatus: "trialing",
      subscriptionPlan: "trial",
      createdAt: "2025-09-08T13:38:09.224Z",
    },
    trialStatus: "ended",
  };

  const handleLogout = async () => {
    console.log("Logging out...");

    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "trialing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "ended":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="relative w-full h-screen flex">
      <Sidebar />
      <div className="min-h-screen bg-gradient-to-br pt-5 from-gray-50 to-green-50 overflow-auto w-full">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Settings
            </h1>

            {/* User Information Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Username
                    </span>
                    <span className="text-sm text-gray-900">
                      {userData.user.username}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Member Since
                    </span>
                    <span className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(userData.user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subscription Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Subscription
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Plan
                    </span>
                    <span className="text-sm text-gray-900 capitalize">
                      {userData.user.subscriptionPlan}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Status
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border capitalize ${getStatusColor(
                        userData.user.subscriptionStatus
                      )}`}
                    >
                      {userData.user.subscriptionStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Trial Status
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border capitalize ${getStatusColor(
                        userData.trialStatus
                      )}`}
                    >
                      {userData.trialStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div>
                <RoundedButton
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-all duration-200 shadow-sm"
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

export default Setting;
