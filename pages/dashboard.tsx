import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/apiRequest";
import { useSpeech } from "../context/SpeechContext";
import { Dashboard as DashboardComponent } from "../component/ui/Dashboard/Dashboard";

const Dashboard = () => {
  const { username } = useSpeech();

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await apiRequest("/api/user");
      if (!data) throw new Error("Failed to fetch user data");
      return data;
    },
  });

  const { data: chatsData, isLoading: chatsLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const data = await apiRequest("/api/chats/get");
      if (!data) throw new Error("Failed to fetch chats");
      return data;
    },
  });

  return (
    <DashboardComponent
      username={username || ""}
      userData={userData}
      chatsData={chatsData}
      isLoading={userLoading || chatsLoading}
    />
  );
};

export default Dashboard;
