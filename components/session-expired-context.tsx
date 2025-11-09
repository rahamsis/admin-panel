"use client";

import { createContext, useContext, useState } from "react";

type SessionExpiredContextType = {
  isExpired: boolean;
  showExpired: () => void;
  hideExpired: () => void;
};

const SessionExpiredContext = createContext<SessionExpiredContextType | null>(null);

export function SessionExpiredProvider({ children }: { children: React.ReactNode }) {
  const [isExpired, setIsExpired] = useState(false);

  const showExpired = () => setIsExpired(true);
  const hideExpired = () => setIsExpired(false);

  return (
    <SessionExpiredContext.Provider value={{ isExpired, showExpired, hideExpired }}>
      {children}
    </SessionExpiredContext.Provider>
  );
}

export function useSessionExpired() {
  const ctx = useContext(SessionExpiredContext);
  if (!ctx) {
    throw new Error("useSessionExpired must be used within a SessionExpiredProvider");
  }
  return ctx;
}
