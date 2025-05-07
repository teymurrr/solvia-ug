export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      education: {
        Row: {
          current: boolean | null
          degree: string | null
          end_date: string | null
          field: string | null
          id: string
          institution: string | null
          profile_id: string
          start_date: string | null
        }
        Insert: {
          current?: boolean | null
          degree?: string | null
          end_date?: string | null
          field?: string | null
          id?: string
          institution?: string | null
          profile_id: string
          start_date?: string | null
        }
        Update: {
          current?: boolean | null
          degree?: string | null
          end_date?: string | null
          field?: string | null
          id?: string
          institution?: string | null
          profile_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          current: boolean | null
          end_date: string | null
          hospital: string | null
          id: string
          location: string | null
          profile_id: string
          role: string | null
          start_date: string | null
        }
        Insert: {
          current?: boolean | null
          end_date?: string | null
          hospital?: string | null
          id?: string
          location?: string | null
          profile_id: string
          role?: string | null
          start_date?: string | null
        }
        Update: {
          current?: boolean | null
          end_date?: string | null
          hospital?: string | null
          id?: string
          location?: string | null
          profile_id?: string
          role?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_profiles: {
        Row: {
          about: string | null
          created_at: string | null
          id: string
          institution_name: string
          institution_type: string | null
          location: string | null
          profile_image: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          about?: string | null
          created_at?: string | null
          id: string
          institution_name: string
          institution_type?: string | null
          location?: string | null
          profile_image?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          about?: string | null
          created_at?: string | null
          id?: string
          institution_name?: string
          institution_type?: string | null
          location?: string | null
          profile_image?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          certificate: string | null
          id: string
          language: string | null
          level: string | null
          profile_id: string
        }
        Insert: {
          certificate?: string | null
          id?: string
          language?: string | null
          level?: string | null
          profile_id: string
        }
        Update: {
          certificate?: string | null
          id?: string
          language?: string | null
          level?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "languages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_profiles: {
        Row: {
          about: string | null
          actively_searching: boolean | null
          created_at: string | null
          first_name: string
          fsp_certificate: boolean | null
          fsp_certificate_file: string | null
          id: string
          last_name: string
          location: string | null
          open_to_relocation: boolean | null
          profession: string | null
          profile_image: string | null
          specialty: string | null
          updated_at: string | null
        }
        Insert: {
          about?: string | null
          actively_searching?: boolean | null
          created_at?: string | null
          first_name: string
          fsp_certificate?: boolean | null
          fsp_certificate_file?: string | null
          id: string
          last_name: string
          location?: string | null
          open_to_relocation?: boolean | null
          profession?: string | null
          profile_image?: string | null
          specialty?: string | null
          updated_at?: string | null
        }
        Update: {
          about?: string | null
          actively_searching?: boolean | null
          created_at?: string | null
          first_name?: string
          fsp_certificate?: boolean | null
          fsp_certificate_file?: string | null
          id?: string
          last_name?: string
          location?: string | null
          open_to_relocation?: boolean | null
          profession?: string | null
          profile_image?: string | null
          specialty?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_type: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
