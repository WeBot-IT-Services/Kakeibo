'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { authService } from '@/lib/auth'
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
  general?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // 密码强度检查
  const getPasswordStrength = (password: string) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    strength = Object.values(checks).filter(Boolean).length
    return { strength, checks }
  }

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // 姓名验证
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少需要2个字符'
    }

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符'
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }

    // 用户协议验证
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '请同意用户协议和隐私政策'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      const { user, error } = await authService.signUp(
        formData.email, 
        formData.password, 
        formData.name.trim()
      )
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ general: '该邮箱已被注册，请使用其他邮箱或直接登录' })
        } else if (error.message.includes('Password should be at least 6 characters')) {
          setErrors({ password: '密码至少需要6个字符' })
        } else {
          setErrors({ general: error.message || '注册失败，请重试' })
        }
        return
      }

      if (user) {
        setRegistrationSuccess(true)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: '注册过程中发生错误，请重试' })
    } finally {
      setLoading(false)
    }
  }

  // 处理输入变化
  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'agreeToTerms' ? e.target.checked : e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // 注册成功页面
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">注册成功！</h2>
              <p className="text-muted-foreground mb-4">
                我们已向您的邮箱 <strong>{formData.email}</strong> 发送了验证邮件。
                请点击邮件中的链接完成账户验证。
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/auth/login')}
                  className="w-full"
                >
                  前往登录
                </Button>
                <Link 
                  href="/" 
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  返回首页
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            创建账户
          </h1>
          <p className="text-muted-foreground">
            开始您的理财之旅
          </p>
        </div>

        {/* 注册表单 */}
        <Card>
          <CardHeader>
            <CardTitle>注册</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* 邮箱输入 */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="邮箱地址"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={errors.email}
                  className="pl-10"
                  disabled={loading}
                />
              </div>

              {/* 密码输入 */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="密码"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={errors.password}
                  className="pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* 密码强度指示器 */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= passwordStrength.strength
                            ? passwordStrength.strength <= 2
                              ? 'bg-red-500'
                              : passwordStrength.strength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    密码强度: {
                      passwordStrength.strength <= 2 ? '弱' :
                      passwordStrength.strength <= 3 ? '中等' : '强'
                    }
                  </p>
                </div>
              )}

              {/* 确认密码输入 */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="确认密码"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={errors.confirmPassword}
                  className="pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* 用户协议 */}
              <div className="space-y-2">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange('agreeToTerms')}
                    className="mt-1"
                    disabled={loading}
                  />
                  <span className="text-sm text-muted-foreground">
                    我已阅读并同意{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      用户协议
                    </Link>
                    {' '}和{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      隐私政策
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* 注册按钮 */}
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                创建账户
              </Button>
            </form>

            {/* 登录链接 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                已有账户？{' '}
                <Link 
                  href="/auth/login" 
                  className="text-primary hover:underline font-medium"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 返回首页 */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
