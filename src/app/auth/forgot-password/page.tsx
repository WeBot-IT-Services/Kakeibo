'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { authService } from '@/lib/auth'
import { Mail, ArrowLeft, Check } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('请输入邮箱地址')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await authService.resetPassword(email)
      
      if (error) {
        setError(error.message || '发送重置邮件失败，请重试')
      } else {
        setSuccess(true)
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setError('发送重置邮件时发生错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">邮件已发送</h2>
              <p className="text-muted-foreground mb-4">
                我们已向 <strong>{email}</strong> 发送了密码重置邮件。
                请检查您的邮箱并点击邮件中的链接重置密码。
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className="w-full"
                >
                  重新发送
                </Button>
                <Link 
                  href="/auth/login" 
                  className="block text-sm text-primary hover:underline"
                >
                  返回登录
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            重置密码
          </h1>
          <p className="text-muted-foreground">
            输入您的邮箱地址，我们将发送重置链接
          </p>
        </div>

        {/* 重置表单 */}
        <Card>
          <CardHeader>
            <CardTitle>忘记密码</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 错误提示 */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {/* 邮箱输入 */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="邮箱地址"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  className="pl-10"
                  disabled={loading}
                />
              </div>

              {/* 发送按钮 */}
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                发送重置邮件
              </Button>
            </form>

            {/* 返回登录 */}
            <div className="mt-6 text-center">
              <Link 
                href="/auth/login" 
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回登录
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
