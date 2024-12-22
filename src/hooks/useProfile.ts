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

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: existingProfile, error: fetchError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("auth_id", user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setProfile(existingProfile);
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      setError(err instanceof Error ? err.message : "Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`profile-changes-${user?.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_profiles",
          filter: `auth_id=eq.${user?.id}`,
        },
        () => {
          fetchProfile();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user) return { error: "No user logged in" };

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_id", user.id)
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

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
}
