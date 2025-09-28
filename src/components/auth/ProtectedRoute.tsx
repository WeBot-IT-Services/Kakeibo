'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from './AuthProvider'
import { Card, CardContent } from '@/components/ui/Card'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login',
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading, isConfigured } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    // 如果 Supabase 未配置，显示错误信息
    if (!loading && !isConfigured) {
      // For production, redirect to error page or show configuration needed message
      console.error('Supabase not configured')
      return
    }

    // 如果需要认证但用户未登录，重定向到登录页
    if (!loading && requireAuth && !user) {
      router.push(redirectTo)
      return
    }

    // 如果不需要认证但用户已登录，重定向到仪表板
    if (!loading && !requireAuth && user) {
      router.push('/dashboard')
      return
    }
  }, [user, loading, isConfigured, requireAuth, redirectTo, router])

  // 显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center">
                <h3 className="font-semibold">加载中...</h3>
                <p className="text-sm text-muted-foreground">
                  正在验证您的身份
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 如果 Supabase 未配置
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-red-600">Configuration Required</h3>
              <p className="text-sm text-muted-foreground">
                Please check your environment configuration and ensure Supabase is properly set up.
              </p>
              <a 
                href="/"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Return to Home
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 如果需要认证但用户未登录
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="font-semibold">需要登录</h3>
              <p className="text-sm text-muted-foreground">
                请登录后访问此页面
              </p>
              <a 
                href={redirectTo}
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                前往登录
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 如果不需要认证但用户已登录
  if (!requireAuth && user) {
    return null // 将通过 useEffect 重定向
  }

  // 渲染受保护的内容
  return <>{children}</>
}
