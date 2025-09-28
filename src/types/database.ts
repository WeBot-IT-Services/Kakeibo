// 数据库类型定义

// Auth User interface (matches lib/auth.ts)
export interface AuthUser {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Account {
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

export interface Category {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense'
  icon?: string
  color?: string
  parent_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  account_id: string
  category_id: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  description?: string
  date: string
  person?: string // 按人筛选字段
  receipt_image?: string
  tags?: string[]
  is_recurring: boolean
  recurring_rule?: string
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  category_id?: string
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

export interface Reminder {
  id: string
  user_id: string
  title: string
  description?: string
  type: 'bill' | 'budget' | 'goal'
  due_date: string
  amount?: number
  is_completed: boolean
  is_recurring: boolean
  recurring_rule?: string
  created_at: string
  updated_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string
  description?: string
  is_completed: boolean
  created_at: string
  updated_at: string
}

// 联合类型和工具类型
export type TransactionType = 'income' | 'expense' | 'transfer'
export type AccountType = 'bank' | 'maybank2u' | 'cimb_clicks' | 'boost' | 'grabpay' | 'touch_n_go' | 'cash' | 'credit_card' | 'other'
export type CategoryType = 'income' | 'expense'
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly'
export type ReminderType = 'bill' | 'budget' | 'goal'

// 数据库视图类型
export interface TransactionWithDetails extends Transaction {
  account: Account
  category: Category
}

export interface BudgetWithCategory extends Budget {
  category?: Category
}

// API 响应类型
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
