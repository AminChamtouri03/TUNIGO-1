export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          auth_id: string;
          name: string;
          age?: number;
          occupation?: string;
          nationality?: string;
          bio?: string;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id: string;
          name: string;
          age?: number;
          occupation?: string;
          nationality?: string;
          bio?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string;
          name?: string;
          age?: number;
          occupation?: string;
          nationality?: string;
          bio?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type UserProfileUpdate =
  Database["public"]["Tables"]["user_profiles"]["Update"];
