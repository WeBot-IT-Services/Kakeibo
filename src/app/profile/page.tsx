'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuthContext } from '@/components/auth/AuthProvider'
import { User, Mail, Save, ArrowLeft, Trash2 } from 'lucide-react'

interface FormData {
  name: string
  email: string
}

interface FormErrors {
  name?: string
  email?: string
  general?: string
}

function ProfileContent() {
  const { user, updateProfile, signOut } = useAuthContext()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少需要2个字符'
    }

    if (!formData.email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    setLoading(true)
    setErrors({})
    setSuccess(false)

    try {
      await updateProfile(user.id, {
        name: formData.name.trim()
      })
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Update profile error:', error)
      setErrors({ general: '更新失败，请重试' })
    } finally {
      setLoading(false)
    }
  }

  // 处理输入变化
  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // 处理账户删除
  const handleDeleteAccount = async () => {
    if (!confirm('确定要删除账户吗？此操作不可恢复，所有数据将被永久删除。')) {
      return
    }

    if (!confirm('请再次确认：您真的要删除账户吗？')) {
      return
    }

    try {
      // 这里应该调用删除账户的 API
      // 目前先登出用户
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Delete account error:', error)
      setErrors({ general: '删除账户失败，请重试' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 头部导航 */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回</span>
              </Button>
              <h1 className="text-2xl font-bold">个人资料</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 成功提示 */}
                {success && (
                  <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                    个人资料更新成功！
                  </div>
                )}

                {/* 通用错误提示 */}
                {errors.general && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {errors.general}
                  </div>
                )}

                {/* 姓名输入 */}
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="姓名"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={errors.name}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>

                {/* 邮箱输入（只读） */}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="邮箱地址"
                    value={formData.email}
                    className="pl-10 bg-gray-50"
                    disabled={true}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    邮箱地址不可修改
                  </p>
                </div>

                {/* 保存按钮 */}
                <Button
                  type="submit"
                  className="w-full flex items-center space-x-2"
                  loading={loading}
                  disabled={loading}
                >
                  <Save className="h-4 w-4" />
                  <span>保存更改</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 账户设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">危险操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">删除账户</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    删除账户将永久删除您的所有数据，包括交易记录、账户信息等。此操作不可恢复。
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>删除账户</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
