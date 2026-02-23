import React, { createContext, useContext, useState } from "react";

export interface UserContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  subscriptionPlan: string;
  setSubscriptionPlan: React.Dispatch<React.SetStateAction<string>>;
  creditsRemaining: number;
  setCreditsRemaining: React.Dispatch<React.SetStateAction<number>>;
}

const defaultState: UserContextType = {
  username: "",
  setUsername: () => {},
  subscriptionPlan: "",
  setSubscriptionPlan: () => {},
  creditsRemaining: 0,
  setCreditsRemaining: () => {},
};

const UserContext = createContext<UserContextType>(defaultState);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [creditsRemaining, setCreditsRemaining] = useState(0);

  const value: UserContextType = {
    username,
    setUsername,
    subscriptionPlan,
    setSubscriptionPlan,
    creditsRemaining,
    setCreditsRemaining,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => useContext(UserContext);
