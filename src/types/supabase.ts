// Supabase 数据库类型定义
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          currency: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          currency?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          currency?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'bank' | 'maybank2u' | 'cimb_clicks' | 'boost' | 'grabpay' | 'touch_n_go' | 'cash' | 'credit_card' | 'other'
          balance: number
          currency: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'bank' | 'maybank2u' | 'cimb_clicks' | 'boost' | 'grabpay' | 'touch_n_go' | 'cash' | 'credit_card' | 'other'
          balance?: number
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'bank' | 'maybank2u' | 'cimb_clicks' | 'boost' | 'grabpay' | 'touch_n_go' | 'cash' | 'credit_card' | 'other'
          balance?: number
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          icon: string | null
          color: string | null
          parent_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          icon?: string | null
          color?: string | null
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'income' | 'expense'
          icon?: string | null
          color?: string | null
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          category_id: string
          amount: number
          type: 'income' | 'expense' | 'transfer'
          description: string | null
          date: string
          person: string | null
          receipt_image: string | null
          tags: string[] | null
          is_recurring: boolean
          recurring_rule: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          category_id: string
          amount: number
          type: 'income' | 'expense' | 'transfer'
          description?: string | null
          date: string
          person?: string | null
          receipt_image?: string | null
          tags?: string[] | null
          is_recurring?: boolean
          recurring_rule?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          category_id?: string
          amount?: number
          type?: 'income' | 'expense' | 'transfer'
          description?: string | null
          date?: string
          person?: string | null
          receipt_image?: string | null
          tags?: string[] | null
          is_recurring?: boolean
          recurring_rule?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          name: string
          amount: number
          period: 'weekly' | 'monthly' | 'yearly'
          start_date: string
          end_date: string
          spent: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          name: string
          amount: number
          period: 'weekly' | 'monthly' | 'yearly'
          start_date: string
          end_date: string
          spent?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          name?: string
          amount?: number
          period?: 'weekly' | 'monthly' | 'yearly'
          start_date?: string
          end_date?: string
          spent?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: 'bill' | 'budget' | 'goal'
          due_date: string
          amount: number | null
          is_completed: boolean
          is_recurring: boolean
          recurring_rule: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          type: 'bill' | 'budget' | 'goal'
          due_date: string
          amount?: number | null
          is_completed?: boolean
          is_recurring?: boolean
          recurring_rule?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          type?: 'bill' | 'budget' | 'goal'
          due_date?: string
          amount?: number | null
          is_completed?: boolean
          is_recurring?: boolean
          recurring_rule?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      savings_goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          target_date: string | null
          description: string | null
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          target_date?: string | null
          description?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          target_date?: string | null
          description?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_default_categories: {
        Args: {
          user_uuid: string
        }
        Returns: undefined
      }
      create_default_accounts: {
        Args: {
          user_uuid: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
