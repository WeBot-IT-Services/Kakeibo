import { supabase, isSupabaseConfigured } from './supabase-client'
import type { Account, Category, Transaction } from '@/types/database'

// Database service helper
const getDB = () => {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Database not configured')
  }
  return supabase as any
}

// Account service
export const accountService = {
  async getAccounts(userId: string): Promise<Account[]> {
    const db = getDB()
    const { data, error } = await db
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createAccount(account: Omit<Account, 'id' | 'created_at' | 'updated_at'>): Promise<Account> {
    const db = getDB()
    const { data, error } = await db
      .from('accounts')
      .insert(account)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    const db = getDB()
    const { data, error } = await db
      .from('accounts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteAccount(id: string): Promise<void> {
    const db = getDB()
    const { error } = await db
      .from('accounts')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error
  }
}

// Category service  
export const categoryService = {
  async getCategories(userId: string, type?: 'income' | 'expense'): Promise<Category[]> {
    const db = getDB()
    let query = db
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const db = getDB()
    const { data, error } = await db
      .from('categories')
      .insert(category)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const db = getDB()
    const { data, error } = await db
      .from('categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteCategory(id: string): Promise<void> {
    const db = getDB()
    const { error } = await db
      .from('categories')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error
  }
}

// Transaction service
export const transactionService = {
  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const db = getDB()
    const { data, error } = await db
      .from('transactions')
      .insert(transaction)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getTransactions(userId: string, options?: any): Promise<any> {
    const db = getDB()
    
    // If called with options (pagination), return paginated format
    if (options) {
      const { data, error } = await db
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(options.limit || 20)

      if (error) throw error
      return {
        data: data || [],
        total: (data || []).length
      }
    }
    
    // Simple format for basic calls
    const { data, error } = await db
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  },

  async getStatistics(userId: string, startDate?: string, endDate?: string) {
    const db = getDB()
    const { data, error } = await db
      .from('transactions')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    const transactions = data || []
    
    const totalIncome = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0)
    
    const totalExpense = transactions
      .filter((t: any) => t.type === 'expense')  
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    // Simple category stats (empty array for now)
    const categoryStats: { category: string; amount: number; type: string; }[] = []

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryStats
    }
  }
}
