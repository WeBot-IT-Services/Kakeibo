import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from './supabase-client'
import type { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar_url?: string
}

interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

// 认证服务
export const authService = {
  // 检查 Supabase 是否配置
  isConfigured(): boolean {
    return isSupabaseConfigured()
  },

  // 获取当前用户
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return null
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) return null

      // For now, use basic user info from auth
      // TODO: Add user_profiles table support later
      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || null
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  // 用户注册
  async signUp(email: string, password: string, name: string): Promise<{ user: User | null, error: any }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { user: null, error: { message: 'Supabase 未配置' } }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      if (error) return { user: null, error }

      // 创建用户配置
      if (data.user) {
        try {
          await this.createUserProfile(data.user.id, email, name)
        } catch (profileError) {
          console.error('Create user profile error:', profileError)
          // 即使创建配置失败，也不影响注册成功
        }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { user: null, error }
    }
  },

  // User login
  async signIn(email: string, password: string): Promise<{ user: User | null, error: any }> {
    if (!isSupabaseConfigured() || !supabase) {
      console.log('Supabase not configured')
      return { user: null, error: { message: 'Supabase is not configured' } }
    }

    try {
      console.log('Calling Supabase signInWithPassword...')
      console.log('Supabase client configured:', !!supabase)
      
      // Add timeout wrapper for Supabase call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Supabase authentication timeout after 8 seconds')), 8000)
      })

      const authPromise = supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('Waiting for Supabase response...')
      const { data, error } = await Promise.race([authPromise, timeoutPromise]) as any

      console.log('Supabase response:', { 
        user: !!data?.user, 
        userId: data?.user?.id, 
        error: error?.message 
      })

      return { user: data.user, error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { user: null, error }
    }
  },

  // 用户登出
  async signOut(): Promise<{ error: any }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: { message: 'Supabase 未配置' } }
    }

    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  },

  // 重置密码
  async resetPassword(email: string): Promise<{ error: any }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: { message: 'Supabase 未配置' } }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      return { error }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error }
    }
  },

  // 创建用户配置
  async createUserProfile(userId: string, email: string, name: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase 未配置')
    }

    try {
      // TODO: Enable when user_profiles table is created in database
      console.log('User profile creation skipped - database not fully set up yet')
      
      // 创建默认分类
      try {
        // TODO: Enable when create_default_categories function exists
        // await (supabase as any).rpc('create_default_categories', { user_uuid: userId })
        console.log('Default categories creation skipped - database not fully set up yet')
      } catch (error) {
        console.error('Create default categories error:', error)
        // 不抛出错误，因为这不是关键功能
      }

      // 创建默认账户
      try {
        // TODO: Enable when create_default_accounts function exists
        // await (supabase as any).rpc('create_default_accounts', { user_uuid: userId })
        console.log('Default accounts creation skipped - database not fully set up yet')
      } catch (error) {
        console.error('Create default accounts error:', error)
        // 不抛出错误，因为这不是关键功能
      }
    } catch (error) {
      console.error('Create user profile error:', error)
      throw error
    }
  },

  // 更新用户配置
  async updateProfile(userId: string, updates: { name?: string, avatar_url?: string }): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase 未配置')
    }

    try {
      // TODO: Enable when user_profiles table is created in database
      console.log('User profile update skipped - database not fully set up yet')
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  },

  // 更新密码
  async updatePassword(newPassword: string): Promise<{ error: any }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: { message: 'Supabase 未配置' } }
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      return { error }
    } catch (error) {
      console.error('Update password error:', error)
      return { error }
    }
  },

  // 监听认证状态变化
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }

    return supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const authUser = await this.getCurrentUser()
          callback(authUser)
        } else {
          callback(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        callback(null)
      }
    })
  }
}

// React Hook 用于获取当前用户
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查 Supabase 是否配置
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // 获取初始用户状态
    authService.getCurrentUser().then(user => {
      setUser(user)
      setLoading(false)
    }).catch(error => {
      console.error('Get initial user error:', error)
      setLoading(false)
    })

    // 监听认证状态变化
    const { data: { subscription } } = authService.onAuthStateChange(setUser)

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    isConfigured: authService.isConfigured(),
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut,
    resetPassword: authService.resetPassword,
    updateProfile: authService.updateProfile
  }
}


