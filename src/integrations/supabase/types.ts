export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clicks: {
        Row: {
          click_id: string
          clicked_at: string
          currency: string | null
          event_id: string | null
          id: string
          price_shown: number | null
          provider_name: string
          provider_url: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          click_id: string
          clicked_at?: string
          currency?: string | null
          event_id?: string | null
          id?: string
          price_shown?: number | null
          provider_name: string
          provider_url?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          click_id?: string
          clicked_at?: string
          currency?: string | null
          event_id?: string | null
          id?: string
          price_shown?: number | null
          provider_name?: string
          provider_url?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clicks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          away_team: string
          competition: string | null
          created_at: string
          event_date: string
          external_id: string
          home_team: string
          id: string
          image_url: string | null
          league: string | null
          max_price: number | null
          min_price: number | null
          status: string
          total_tickets: number | null
          updated_at: string
          venue: string
          venue_address: string | null
        }
        Insert: {
          away_team: string
          competition?: string | null
          created_at?: string
          event_date: string
          external_id: string
          home_team: string
          id?: string
          image_url?: string | null
          league?: string | null
          max_price?: number | null
          min_price?: number | null
          status?: string
          total_tickets?: number | null
          updated_at?: string
          venue: string
          venue_address?: string | null
        }
        Update: {
          away_team?: string
          competition?: string | null
          created_at?: string
          event_date?: string
          external_id?: string
          home_team?: string
          id?: string
          image_url?: string | null
          league?: string | null
          max_price?: number | null
          min_price?: number | null
          status?: string
          total_tickets?: number | null
          updated_at?: string
          venue?: string
          venue_address?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          api_endpoint: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          reliability_score: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          api_endpoint?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          reliability_score?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          api_endpoint?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          reliability_score?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      search_history: {
        Row: {
          created_at: string
          date_from: string | null
          date_to: string | null
          id: string
          location: string | null
          results_count: number | null
          search_query: string
          user_ip: string | null
        }
        Insert: {
          created_at?: string
          date_from?: string | null
          date_to?: string | null
          id?: string
          location?: string | null
          results_count?: number | null
          search_query: string
          user_ip?: string | null
        }
        Update: {
          created_at?: string
          date_from?: string | null
          date_to?: string | null
          id?: string
          location?: string | null
          results_count?: number | null
          search_query?: string
          user_ip?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string
          currency: string
          delivery_info: string | null
          delivery_type: string | null
          event_id: string
          external_ticket_id: string | null
          fees: number | null
          id: string
          is_available: boolean
          last_updated: string
          price: number
          provider_id: string
          row_info: string | null
          seat_info: string | null
          section: string | null
          ticket_url: string | null
          total_price: number
        }
        Insert: {
          created_at?: string
          currency?: string
          delivery_info?: string | null
          delivery_type?: string | null
          event_id: string
          external_ticket_id?: string | null
          fees?: number | null
          id?: string
          is_available?: boolean
          last_updated?: string
          price: number
          provider_id: string
          row_info?: string | null
          seat_info?: string | null
          section?: string | null
          ticket_url?: string | null
          total_price: number
        }
        Update: {
          created_at?: string
          currency?: string
          delivery_info?: string | null
          delivery_type?: string | null
          event_id?: string
          external_ticket_id?: string | null
          fees?: number | null
          id?: string
          is_available?: boolean
          last_updated?: string
          price?: number
          provider_id?: string
          row_info?: string | null
          seat_info?: string | null
          section?: string | null
          ticket_url?: string | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
