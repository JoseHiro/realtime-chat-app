import React, { useState } from "react";
import { useRouter } from "next/router";
import { apiRequest } from "../../lib/apiRequest";
import { toast } from "sonner";
import { Shield, CheckCircle2 } from "lucide-react";
import { RoundedButton } from "../../component/button";

const AdminSetup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    try {
      // Call the setup API
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretKey: process.env.NEXT_PUBLIC_ADMIN_SETUP_SECRET || "setup123",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success("Admin account created successfully!");
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      } else {
        toast.error(data.error || "Failed to create admin account");
      }
    } catch (error) {
      console.error("Setup error:", error);
      toast.error("Failed to create admin account");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Account Created!
          </h2>
          <p className="text-gray-600 mb-6">
            Your admin account has been set up successfully.
          </p>
          <p className="text-sm text-gray-500 mb-4">Email: admin@yahoo.co.jp</p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to admin login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Account Setup
          </h1>
          <p className="text-gray-600 text-sm">
            One-time setup to create your admin account
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Account Details:
            </p>
            <p className="text-sm text-gray-600">Email: admin@yahoo.co.jp</p>
            <p className="text-sm text-gray-600">Password: Admin2025!</p>
          </div>
        </div>

        <RoundedButton
          onClick={handleSetup}
          disabled={loading}
          className="w-full bg-gray-900 text-white hover:bg-black disabled:opacity-50 py-3 font-semibold"
        >
          {loading ? "Setting up..." : "Create Admin Account"}
        </RoundedButton>

        <p className="mt-4 text-xs text-gray-500 text-center">
          ⚠️ Remove this page after setup for security
        </p>
      </div>
    </div>
  );
};

export default AdminSetup;
