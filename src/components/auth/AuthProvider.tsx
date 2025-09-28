'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<{ user: any, error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ user: any, error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (userId: string, updates: { name?: string, avatar_url?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
