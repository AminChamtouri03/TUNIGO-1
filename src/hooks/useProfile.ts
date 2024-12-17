import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["user_profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["user_profiles"]["Update"];

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("auth_id", user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdate) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("auth_id", user?.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error("Error updating profile:", err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Error updating profile",
      };
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (name: string) => {
    if (!user) return { error: "No user logged in" };

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .insert([
          {
            auth_id: user.id,
            name,
            preferences: {},
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error("Error creating profile:", err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Error creating profile",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    refreshProfile: fetchProfile,
  };
}
