import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/types/supabase";

type Review = Database["public"]["Tables"]["reviews"]["Row"];
type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];
type ReviewUpdate = Database["public"]["Tables"]["reviews"]["Update"];

export function useReviews(destinationId?: string) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (destinationId) {
      fetchReviews();
    }
  }, [destinationId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*, user_profiles(name)")
        .eq("destination_id", destinationId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReviews(data);

      // Set user's review if it exists
      if (user) {
        const userReview = data.find((review) => review.user_id === user.id);
        setUserReview(userReview || null);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err instanceof Error ? err.message : "Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (rating: number, comment: string) => {
    if (!user || !destinationId) return { error: "Not authenticated" };

    try {
      setLoading(true);

      // Check if user already has a review
      if (userReview) {
        const { data, error } = await supabase
          .from("reviews")
          .update({ rating, comment, updated_at: new Date().toISOString() })
          .eq("id", userReview.id)
          .select()
          .single();

        if (error) throw error;
        setUserReview(data);
        await fetchReviews(); // Refresh reviews
        return { data, error: null };
      }

      // Create new review
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            user_id: user.id,
            destination_id: destinationId,
            rating,
            comment,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setUserReview(data);
      await fetchReviews(); // Refresh reviews
      return { data, error: null };
    } catch (err) {
      console.error("Error adding review:", err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Error adding review",
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      setLoading(true);
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", user.id); // Ensure user owns the review

      if (error) throw error;

      setUserReview(null);
      await fetchReviews(); // Refresh reviews
      return { error: null };
    } catch (err) {
      console.error("Error deleting review:", err);
      return {
        error: err instanceof Error ? err.message : "Error deleting review",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    userReview,
    loading,
    error,
    addReview,
    deleteReview,
    refreshReviews: fetchReviews,
  };
}
