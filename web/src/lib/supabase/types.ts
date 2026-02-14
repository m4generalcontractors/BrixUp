export type UserRole = "investor" | "builder" | "dealmaker";
export type DealStatus = "Open" | "Funding" | "Funded" | "Active" | "Completed";
export type PropertyType = "Flip" | "New Build" | "Value-Add" | "Wholesale" | "Land";
export type KycStatus = "pending" | "verified" | "rejected";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          user_role: UserRole;
          wallet_address: string | null;
          kyc_status: KycStatus;
          email_notifications: boolean;
          sms_notifications: boolean;
          push_notifications: boolean;
          language: "en" | "es";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          user_role?: UserRole;
          wallet_address?: string | null;
          kyc_status?: KycStatus;
          email_notifications?: boolean;
          sms_notifications?: boolean;
          push_notifications?: boolean;
          language?: "en" | "es";
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      deals: {
        Row: {
          id: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          property_type: PropertyType;
          status: DealStatus;
          source: string;
          asking_price: number;
          rehab_budget: number;
          arv: number;
          total_capital_needed: number;
          funded_amount: number;
          projected_roi: number;
          projected_timeline: string;
          investor_interest_rate: number;
          beds: number;
          baths: number;
          sqft: number;
          year_built: number;
          lot_size: string;
          description: string;
          dealmaker_id: string | null;
          gc_id: string | null;
          listed_date: string;
          funding_deadline: string;
          est_completion: string;
          investor_count: number;
          min_investment: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["deals"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["deals"]["Insert"]>;
      };
      investments: {
        Row: {
          id: string;
          investor_id: string;
          deal_id: string;
          amount: number;
          status: "pending" | "confirmed" | "completed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["investments"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["investments"]["Insert"]>;
      };
      contractors: {
        Row: {
          id: string;
          user_id: string;
          primary_trade: string;
          years_experience: number;
          license_number: string | null;
          insurance_provider: string | null;
          brix_score: number;
          location: string;
          w9_status: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contractors"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["contractors"]["Insert"]>;
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: "investment" | "yield" | "staking_reward" | "conversion" | "received" | "send";
          amount: number;
          description: string;
          from_address: string | null;
          to_address: string | null;
          status: "pending" | "confirmed" | "completed";
          tx_hash: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["transactions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          signed_up_at: string;
          created_at: string;
        };
        Insert: {
          email: string;
          signed_up_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["waitlist"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
