/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserDto } from "@papyrus/source";

type AuthContextType = {
  token: string | null;
  user: UserDto | null;
  setToken: (token: string | null) => Promise<void>;
  setUser: (user: UserDto | null) => Promise<void>;
  clearAuth: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Chargement initial depuis localStorage
  useEffect(() => {
    const loadAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("auth_user");

        if (storedToken) setTokenState(storedToken);
        if (storedUser) setUserState(JSON.parse(storedUser));
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  // Sauvegarde du token
  const setToken = async (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem("token");
      setTokenState(null);
    }
  };

  // Sauvegarde de l'utilisateur
  const setUser = async (newUser: UserDto | null) => {
    if (newUser) {
      localStorage.setItem("auth_user", JSON.stringify(newUser));
      setUserState(newUser);
    } else {
      localStorage.removeItem("auth_user");
      setUserState(null);
    }
  };

  // Déconnexion
  const clearAuth = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setToken,
        setUser,
        clearAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return ctx;
};
