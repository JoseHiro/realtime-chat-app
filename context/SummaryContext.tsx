import React, { createContext, useContext, useState } from "react";

export interface SummaryContextType {
  summary: any;
  setSummary: React.Dispatch<React.SetStateAction<any>>;
  summaryFetchLoading: boolean;
  setSummaryFetchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultState: SummaryContextType = {
  summary: null,
  setSummary: () => {},
  summaryFetchLoading: false,
  setSummaryFetchLoading: () => {},
};

const SummaryContext = createContext<SummaryContextType>(defaultState);

export const SummaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [summary, setSummary] = useState<any>(null);
  const [summaryFetchLoading, setSummaryFetchLoading] = useState(false);

  const value: SummaryContextType = {
    summary,
    setSummary,
    summaryFetchLoading,
    setSummaryFetchLoading,
  };

  return (
    <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
  );
};

export const useSummary = (): SummaryContextType => useContext(SummaryContext);
