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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      applied_vacancies: {
        Row: {
          application_data: Json | null
          application_date: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
          vacancy_id: string
        }
        Insert: {
          application_data?: Json | null
          application_date?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          vacancy_id: string
        }
        Update: {
          application_data?: Json | null
          application_date?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          vacancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applied_vacancies_vacancy_id_fkey"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "vacancies"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          blog_post_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          blog_post_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          blog_post_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_likes: {
        Row: {
          blog_post_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          blog_post_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          blog_post_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_likes_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_views: {
        Row: {
          blog_post_id: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          blog_post_id: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          blog_post_id?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_views_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string | null
          content: string
          created_at: string
          excerpt: string
          id: string
          image_url: string | null
          language: string
          like_count: number | null
          meta_description: string | null
          meta_title: string | null
          post_group_id: string | null
          publish_date: string | null
          read_time: string | null
          slug: string
          status: Database["public"]["Enums"]["blog_post_status"]
          tags: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          content: string
          created_at?: string
          excerpt: string
          id?: string
          image_url?: string | null
          language?: string
          like_count?: number | null
          meta_description?: string | null
          meta_title?: string | null
          post_group_id?: string | null
          publish_date?: string | null
          read_time?: string | null
          slug: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          tags?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          language?: string
          like_count?: number | null
          meta_description?: string | null
          meta_title?: string | null
          post_group_id?: string | null
          publish_date?: string | null
          read_time?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          tags?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
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
      learning_form_submissions: {
        Row: {
          country: string
          created_at: string
          email: string
          fsp_preparation: boolean
          full_name: string
          german_language: boolean
          id: string
          profession: string
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          email: string
          fsp_preparation?: boolean
          full_name: string
          german_language?: boolean
          id?: string
          profession: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          email?: string
          fsp_preparation?: boolean
          full_name?: string
          german_language?: boolean
          id?: string
          profession?: string
          updated_at?: string
        }
        Relationships: []
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
      saved_vacancies: {
        Row: {
          created_at: string
          id: string
          user_id: string
          vacancy_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          vacancy_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          vacancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_vacancies_vacancy_id_fkey"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "vacancies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      vacancies: {
        Row: {
          application_link: string | null
          city: string | null
          contract_type: string
          country: string | null
          created_at: string
          department: string
          description: string
          id: string
          institution: string
          institution_id: string | null
          job_type: string
          location: string
          posted_date: string
          profession: string | null
          requirements: string[] | null
          salary: string | null
          specialty: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_link?: string | null
          city?: string | null
          contract_type: string
          country?: string | null
          created_at?: string
          department: string
          description: string
          id?: string
          institution: string
          institution_id?: string | null
          job_type: string
          location: string
          posted_date?: string
          profession?: string | null
          requirements?: string[] | null
          salary?: string | null
          specialty?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_link?: string | null
          city?: string | null
          contract_type?: string
          country?: string | null
          created_at?: string
          department?: string
          description?: string
          id?: string
          institution?: string
          institution_id?: string | null
          job_type?: string
          location?: string
          posted_date?: string
          profession?: string | null
          requirements?: string[] | null
          salary?: string | null
          specialty?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_blog_statistics: {
        Args: { end_date?: string; start_date?: string }
        Returns: Json
      }
      get_user_type: {
        Args: { user_id: string }
        Returns: string
      }
      increment_blog_view_count: {
        Args: {
          post_id: string
          viewer_ip?: unknown
          viewer_user_agent?: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { uid: string }
        Returns: boolean
      }
      toggle_blog_post_like: {
        Args: { post_id: string }
        Returns: boolean
      }
    }
    Enums: {
      blog_post_status: "draft" | "published"
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
    Enums: {
      blog_post_status: ["draft", "published"],
    },
  },
} as const
