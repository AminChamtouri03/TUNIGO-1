import { createContext, useContext, useState, ReactNode } from "react";

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
  addRating: (destinationId: string, rating: number) => void;
  getRating: (destinationId: string) => number | null;
  addComment: (destinationId: string, comment: string) => void;
  removeComment: (commentId: string) => void;
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
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userComments, setUserComments] = useState<UserComment[]>([]);

  const addRating = (destinationId: string, rating: number) => {
    setRatings((prev) => {
      const existing = prev.find((r) => r.destinationId === destinationId);
      if (existing) {
        return prev.map((r) =>
          r.destinationId === destinationId ? { ...r, rating } : r,
        );
      }
      return [...prev, { destinationId, rating }];
    });
  };

  const getRating = (destinationId: string): number | null => {
    const rating = ratings.find((r) => r.destinationId === destinationId);
    return rating ? rating.rating : null;
  };

  const addComment = (destinationId: string, comment: string) => {
    const newComment: UserComment = {
      id: Date.now().toString(),
      destinationId,
      comment,
      date: "Just now",
      user: "You",
    };
    setUserComments((prev) => [...prev, newComment]);
  };

  const removeComment = (commentId: string) => {
    setUserComments((prev) => prev.filter((c) => c.id !== commentId));
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
