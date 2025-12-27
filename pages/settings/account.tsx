import React, { useState, useEffect } from "react";
import { User, Lock, Save, Loader2, ArrowLeft } from "lucide-react";
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

const AccountSettings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = (await apiRequest("/api/user", {
        method: "GET",
      })) as UserData;
      setUserData(data);
      setUsername(data.user.username || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setUpdating("username");
    try {
      const response = (await apiRequest("/api/user/update-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })) as { message?: string; user?: { username: string } } | null;

      if (!response) {
        toast.error("Failed to update username");
        return;
      }

      if (response.user?.username) {
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                user: { ...prev.user, username: response.user!.username },
              }
            : null
        );
        toast.success("Username updated successfully!");
      } else {
        // Fallback: use the username from the form if response doesn't have it
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                user: { ...prev.user, username: username.trim() },
              }
            : null
        );
        toast.success("Username updated successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update username");
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setUpdating("password");
    try {
      await apiRequest("/api/user/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setUpdating(null);
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

  return (
    <div className="relative w-full h-screen flex">
      <Sidebar />
      <div className="min-h-screen bg-gradient-to-br pt-5 from-gray-50 to-green-50 overflow-auto w-full">
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => router.push("/settings")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Account Settings
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your account information
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Username Section */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Username
                  </h2>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-black"
                    placeholder="Enter username"
                  />
                  <RoundedButton
                    onClick={handleUpdateUsername}
                    disabled={updating === "username"}
                    className="px-4 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {updating === "username" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save
                  </RoundedButton>
                </div>
              </div>

              {/* Password Section */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Change Password
                  </h2>
                </div>
                <div className="space-y-3">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-black"
                    placeholder="Current password"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-black"
                    placeholder="New password"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-black"
                    placeholder="Confirm new password"
                  />
                  <div className="flex justify-end">
                    <RoundedButton
                      onClick={handleUpdatePassword}
                      disabled={updating === "password"}
                      className="px-4 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                    >
                      {updating === "password" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </RoundedButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
