import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDto } from "@papyrus/source";
import { localStorageBasePrefixVariable } from "../utils/local-storage-base-prefix-variable";

type AuthContextType = {
  token: string | null;
  user: UserDto | null;
  setToken: (token: string) => Promise<void>;
  setUser: (user: UserDto | null) => Promise<void>;
  clearAuth: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUserState] = useState<UserDto | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(localStorageBasePrefixVariable("idToken"));
        const storedUser = await AsyncStorage.getItem(localStorageBasePrefixVariable("user"));

        if (storedToken) setTokenState(storedToken);
        if (storedUser) setUserState(JSON.parse(storedUser) as UserDto);
      } catch (error) {
        console.error("Erreur lors du chargement de l'auth :", error);
      } finally {
        setLoading(false);
      }
    };
    void loadAuth();
  }, []);

  const setUser = async (newUser: UserDto | null) => {
    if (newUser) {
      await AsyncStorage.setItem(localStorageBasePrefixVariable("user"), JSON.stringify(newUser));
      setUserState(newUser);
    } else {
      await AsyncStorage.removeItem(localStorageBasePrefixVariable("user"));
      setUserState(null);
    }
  };

  const setToken = async (newToken: string) => {
    try {
      await AsyncStorage.setItem(localStorageBasePrefixVariable("idToken"), newToken);
      setTokenState(newToken);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du token :", error);
    }
  };

  const clearAuth = async () => {
    try {
      await AsyncStorage.removeItem(localStorageBasePrefixVariable("idToken"));
      await AsyncStorage.removeItem(localStorageBasePrefixVariable("user"));
      setTokenState(null);
      setUserState(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'auth :", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, clearAuth, loading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
