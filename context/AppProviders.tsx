import React from "react";
import { ChatSessionProvider } from "./ChatSessionContext";
import { UserProvider } from "./UserContext";
import { SummaryProvider } from "./SummaryContext";
import { UIPreferencesProvider } from "./UIPreferencesContext";
import { ThemeProvider } from "./ThemeContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <ChatSessionProvider>
      <UserProvider>
        <SummaryProvider>
          <UIPreferencesProvider>{children}</UIPreferencesProvider>
        </SummaryProvider>
      </UserProvider>
    </ChatSessionProvider>
  </ThemeProvider>
);
