import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, user_id: number) => void;
  logout: () => void;
  userId: number | null;
  setUserId: (userId: number | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("token"),
  );
  const [userId, setUserId] = useState<number | null>(null);

  // Récupérer user_id au chargement
  useEffect(() => {
    const savedUserId = Cookies.get("user_id");
    if (savedUserId) {
      setUserId(Number(savedUserId));
    }
  }, []);

  const login = (token: string, user_id: number) => {
    Cookies.set("token", token, { expires: 1 });
    Cookies.set("user_id", user_id.toString());
    setIsAuthenticated(true);
    setUserId(user_id);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user_id");
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userId, setUserId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
