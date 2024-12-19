// Mock Supabase client for local development
export type User = {
  id: string;
  email: string;
  user_metadata: {
    username: string;
    name: string;
  };
};
