import React from "react";
import { ChatSessionProvider } from "./ChatSessionContext";
import { UserProvider } from "./UserContext";
import { SummaryProvider } from "./SummaryContext";
import { UIPreferencesProvider } from "./UIPreferencesContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChatSessionProvider>
    <UserProvider>
      <SummaryProvider>
        <UIPreferencesProvider>{children}</UIPreferencesProvider>
      </SummaryProvider>
    </UserProvider>
  </ChatSessionProvider>
);
