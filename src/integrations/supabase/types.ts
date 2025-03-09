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
      agent_tasks: {
        Row: {
          agent_type: string
          completed_at: string | null
          created_at: string | null
          error: string | null
          id: string
          inputs: Json | null
          result: Json | null
          stage_id: string | null
          status: string
          updated_at: string | null
          workflow_id: string | null
        }
        Insert: {
          agent_type: string
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          inputs?: Json | null
          result?: Json | null
          stage_id?: string | null
          status?: string
          updated_at?: string | null
          workflow_id?: string | null
        }
        Update: {
          agent_type?: string
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          inputs?: Json | null
          result?: Json | null
          stage_id?: string | null
          status?: string
          updated_at?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_tasks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_tasks_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      contents: {
        Row: {
          content: string | null
          created_at: string | null
          description: string | null
          id: string
          status: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_tags: {
        Row: {
          document_id: string
          tag: string
        }
        Insert: {
          document_id: string
          tag: string
        }
        Update: {
          document_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_tags_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          content_id: string | null
          created_at: string | null
          id: string
          name: string
          path: string
          size: number
          type: string
          user_id: string
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          path: string
          size: number
          type: string
          user_id: string
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          path?: string
          size?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          email: string | null
          id: string
          joined_date: string | null
          location: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          id: string
          joined_date?: string | null
          location?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          id?: string
          joined_date?: string | null
          location?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      source_structured_content: {
        Row: {
          content_summary: string | null
          heading: string | null
          id: string
          order: number
          source_id: string
        }
        Insert: {
          content_summary?: string | null
          heading?: string | null
          id?: string
          order?: number
          source_id: string
        }
        Update: {
          content_summary?: string | null
          heading?: string | null
          id?: string
          order?: number
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_structured_content_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      source_tables: {
        Row: {
          headers: Json | null
          id: string
          rows: Json | null
          source_id: string
          table_id: string
        }
        Insert: {
          headers?: Json | null
          id?: string
          rows?: Json | null
          source_id: string
          table_id: string
        }
        Update: {
          headers?: Json | null
          id?: string
          rows?: Json | null
          source_id?: string
          table_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_tables_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          author: string | null
          content: string | null
          date_extracted: string | null
          date_published: string | null
          domain: string | null
          id: string
          metadata: Json | null
          quality: string
          source_type: string
          title: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          date_extracted?: string | null
          date_published?: string | null
          domain?: string | null
          id?: string
          metadata?: Json | null
          quality?: string
          source_type: string
          title?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          author?: string | null
          content?: string | null
          date_extracted?: string | null
          date_published?: string | null
          domain?: string | null
          id?: string
          metadata?: Json | null
          quality?: string
          source_type?: string
          title?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_stages: {
        Row: {
          created_at: string | null
          data: Json | null
          feedback: string | null
          id: string
          revision_count: number | null
          stage_name: string
          state: string
          updated_at: string | null
          version: number | null
          workflow_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          feedback?: string | null
          id?: string
          revision_count?: number | null
          stage_name: string
          state?: string
          updated_at?: string | null
          version?: number | null
          workflow_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          feedback?: string | null
          id?: string
          revision_count?: number | null
          stage_name?: string
          state?: string
          updated_at?: string | null
          version?: number | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stages_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string | null
          current_stage: string | null
          id: string
          metadata: Json | null
          topic: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_stage?: string | null
          id?: string
          metadata?: Json | null
          topic: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_stage?: string | null
          id?: string
          metadata?: Json | null
          topic?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
