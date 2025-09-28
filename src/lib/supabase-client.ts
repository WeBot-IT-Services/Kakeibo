// Supabase 客户端配置和工具函数
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase config check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not configured, using demo mode')
}

// 创建 Supabase 客户端
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

// 检查 Supabase 是否已配置
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabase)
}

// 获取配置状态
export const getSupabaseConfig = () => {
  return {
    configured: isSupabaseConfigured(),
    url: supabaseUrl ? '已配置' : '未配置',
    anonKey: supabaseAnonKey ? '已配置' : '未配置',
    client: supabase ? '已初始化' : '未初始化'
  }
}

// 安全的 Supabase 客户端获取
export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase 未配置，请先配置环境变量')
  }
  return supabase
}

// 用于组件中的条件渲染
export const withSupabase = <T>(
  component: T,
  fallback: T
): T => {
  return isSupabaseConfigured() ? component : fallback
}
