"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SelfIdProfile {
  name?: string;
  description?: string;
  avatar?: string;
}

interface IdentityContextType {
  isWorldIdVerified: boolean;
  setIsWorldIdVerified: (isVerified: boolean) => void;
  selfIdProfile: SelfIdProfile | null;
  setSelfIdProfile: (profile: SelfIdProfile | null) => void;
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

export const IdentityProvider = ({ children }: { children: ReactNode }) => {
  const [isWorldIdVerified, setIsWorldIdVerified] = useState(false);
  const [selfIdProfile, setSelfIdProfile] = useState<SelfIdProfile | null>(null);

  return (
    <IdentityContext.Provider value={{ isWorldIdVerified, setIsWorldIdVerified, selfIdProfile, setSelfIdProfile }}>
      {children}
    </IdentityContext.Provider>
  );
};

export const useIdentity = () => {
  const context = useContext(IdentityContext);
  if (context === undefined) {
    throw new Error("useIdentity must be used within an IdentityProvider");
  }
  return context;
};
