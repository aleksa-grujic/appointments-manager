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
      appointment_children: {
        Row: {
          appointment_id: string
          child_id: string | null
          child_name: string | null
          created_at: string
          id: string
          parent_name: string | null
          phone_number: string | null
        }
        Insert: {
          appointment_id: string
          child_id?: string | null
          child_name?: string | null
          created_at?: string
          id?: string
          parent_name?: string | null
          phone_number?: string | null
        }
        Update: {
          appointment_id?: string
          child_id?: string | null
          child_name?: string | null
          created_at?: string
          id?: string
          parent_name?: string | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_children_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_children_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_products: {
        Row: {
          appointment_id: string | null
          created_at: string
          id: string
          products: Json | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          products?: Json | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          products?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_products_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          child_count: string | null
          child_id: string | null
          child_name: string | null
          child_name2: string | null
          child_name3: string | null
          created_at: string
          drink_cost: number[] | null
          end_time: string | null
          free: boolean | null
          id: string
          notes: string | null
          parent_name: string | null
          phone_number: string | null
          reservation: boolean | null
          start_time: string
          status: string | null
          table_number: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          child_count?: string | null
          child_id?: string | null
          child_name?: string | null
          child_name2?: string | null
          child_name3?: string | null
          created_at?: string
          drink_cost?: number[] | null
          end_time?: string | null
          free?: boolean | null
          id?: string
          notes?: string | null
          parent_name?: string | null
          phone_number?: string | null
          reservation?: boolean | null
          start_time: string
          status?: string | null
          table_number?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          child_count?: string | null
          child_id?: string | null
          child_name?: string | null
          child_name2?: string | null
          child_name3?: string | null
          created_at?: string
          drink_cost?: number[] | null
          end_time?: string | null
          free?: boolean | null
          id?: string
          notes?: string | null
          parent_name?: string | null
          phone_number?: string | null
          reservation?: boolean | null
          start_time?: string
          status?: string | null
          table_number?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          created_at: string
          id: string
          name: string | null
          notes: string | null
          parent_name: string | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          notes?: string | null
          parent_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          notes?: string | null
          parent_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          name: string | null
          price: number | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          name?: string | null
          price?: number | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          name?: string | null
          price?: number | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name?: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
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
