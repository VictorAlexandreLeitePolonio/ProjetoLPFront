"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  initialLoading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function getInitialUser(): User | null {
  const stored = Cookies.get("auth_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(getInitialUser);
  const [initialLoading] = useState(false);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) {
      Cookies.set("auth_user", JSON.stringify(u), {
        expires: 1 / 3,
        sameSite: "strict",
        secure: false,
      });
    } else {
      Cookies.remove("auth_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        initialLoading,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
