import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  email: string;
  user_metadata: {
    username: string;
    name: string;
  };
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (
    email: string,
    password: string,
    username: string,
  ) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // Mock login
    return { error: null };
  };

  const signup = async (email: string, password: string, username: string) => {
    // Mock signup
    return { error: null };
  };

  const logout = async () => {
    // Mock logout
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email: string) => {
    // Mock reset password
    return { error: null };
  };

  const updatePassword = async (newPassword: string) => {
    // Mock update password
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
