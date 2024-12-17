import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

type Rating = {
  destinationId: string;
  rating: number;
};

type UserComment = {
  id: string;
  destinationId: string;
  comment: string;
  date: string;
  user: string;
};

type UserInteractionsContextType = {
  ratings: Rating[];
  userComments: UserComment[];
  addRating: (destinationId: string, rating: number) => Promise<void>;
  getRating: (destinationId: string) => number | null;
  addComment: (destinationId: string, comment: string) => Promise<void>;
  removeComment: (commentId: string) => Promise<void>;
  getUserComments: (destinationId: string) => UserComment[];
};

const UserInteractionsContext = createContext<
  UserInteractionsContextType | undefined
>(undefined);

export function UserInteractionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userComments, setUserComments] = useState<UserComment[]>([]);

  const addRating = async (destinationId: string, rating: number) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("reviews").upsert({
        user_id: user.id,
        destination_id: destinationId,
        rating,
        comment: "", // Required field, but we're only updating rating
      });

      if (error) throw error;

      setRatings((prev) => {
        const existing = prev.find((r) => r.destinationId === destinationId);
        if (existing) {
          return prev.map((r) =>
            r.destinationId === destinationId ? { ...r, rating } : r,
          );
        }
        return [...prev, { destinationId, rating }];
      });
    } catch (err) {
      console.error("Error adding rating:", err);
    }
  };

  const getRating = (destinationId: string): number | null => {
    const rating = ratings.find((r) => r.destinationId === destinationId);
    return rating ? rating.rating : null;
  };

  const addComment = async (destinationId: string, comment: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            user_id: user.id,
            destination_id: destinationId,
            comment,
            rating: 0, // Required field, but we're only adding comment
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const newComment: UserComment = {
        id: data.id,
        destinationId,
        comment,
        date: new Date().toISOString(),
        user: "You",
      };

      setUserComments((prev) => [...prev, newComment]);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const removeComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;

      setUserComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error removing comment:", err);
    }
  };

  const getUserComments = (destinationId: string): UserComment[] => {
    return userComments.filter((c) => c.destinationId === destinationId);
  };

  return (
    <UserInteractionsContext.Provider
      value={{
        ratings,
        userComments,
        addRating,
        getRating,
        addComment,
        removeComment,
        getUserComments,
      }}
    >
      {children}
    </UserInteractionsContext.Provider>
  );
}

export function useUserInteractions() {
  const context = useContext(UserInteractionsContext);
  if (context === undefined) {
    throw new Error(
      "useUserInteractions must be used within a UserInteractionsProvider",
    );
  }
  return context;
}
