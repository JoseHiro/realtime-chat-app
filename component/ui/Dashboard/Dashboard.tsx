import React from "react";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardContent } from "./index";

interface DashboardProps {
  username: string;
  userData?: any;
  chatsData?: any;
  isLoading: boolean;
}

export const Dashboard = ({
  username,
  userData,
  chatsData,
  isLoading,
}: DashboardProps) => {
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
        </div>
      </DashboardLayout>
    );
  }

  const displayUsername = username || userData?.user?.username || "User";

  return (
    <DashboardLayout>
      <DashboardContent username={displayUsername} chatsData={chatsData} />
    </DashboardLayout>
  );
};
