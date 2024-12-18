import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { UserProfileInsert } from "@/types/supabase";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signup: (
    email: string,
    password: string,
    username: string,
  ) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const createInitialProfile = async (userId: string, username: string) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("auth_id", userId)
        .single();

      if (existingProfile) {
        return { error: null };
      }

      // Create new profile with default preferences
      const newProfile: UserProfileInsert = {
        auth_id: userId,
        name: username,
        preferences: {
          theme: "light",
          language: "en",
          notifications: true,
          location: null,
          profileImage: null,
          favorites: [],
          lastVisited: [],
        },
      };

      const { error } = await supabase
        .from("user_profiles")
        .insert([newProfile]);

      if (error) throw error;

      return { error: null };
    } catch (err) {
      console.error("Error creating user profile:", err);
      return { error: err instanceof Error ? err : new Error("Unknown error") };
    }
  };

  const initializeAuth = useCallback(async () => {
    try {
      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);

      // If we have a user, ensure their profile exists
      if (session?.user) {
        await createInitialProfile(
          session.user.id,
          session.user.email?.split("@")[0] || "user",
        );
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);

      if (session?.user) {
        await createInitialProfile(
          session.user.id,
          session.user.email?.split("@")[0] || "user",
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [initializeAuth]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        // Ensure profile exists
        await createInitialProfile(
          data.user.id,
          data.user.email?.split("@")[0] || "user",
        );
      }

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (!error && data.user) {
        // Create initial profile
        const { error: profileError } = await createInitialProfile(
          data.user.id,
          username,
        );
        if (profileError) {
          return { error: profileError as AuthError };
        }
      }

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
