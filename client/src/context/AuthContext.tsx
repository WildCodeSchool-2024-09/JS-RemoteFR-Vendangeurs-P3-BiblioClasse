import Cookies from "js-cookie";
import { createContext, useContext, useState } from "react";
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
  const login = (token: string, user_id: number) => {
    setUserId(user_id);
    Cookies.set("token", token, { expires: 1 });
    Cookies.set("user_id", user_id.toString());
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    Cookies.remove("user_id");
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
