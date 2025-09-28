'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { authService } from '@/lib/auth'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isSubmitting = useRef(false)

  // Safety timeout to reset loading state if it gets stuck
  const resetLoadingTimeout = useRef<NodeJS.Timeout | null>(null)
  
  const clearTimeouts = () => {
    if (resetLoadingTimeout.current) {
      clearTimeout(resetLoadingTimeout.current)
      resetLoadingTimeout.current = null
    }
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Please enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Please enter your password'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent double submission
    if (isSubmitting.current || loading) {
      console.log('Already submitting, ignoring...')
      return
    }
    
    if (!validateForm()) return

    isSubmitting.current = true
    setLoading(true)
    setErrors({})
    clearTimeouts()
    
    // Set safety timeout (slightly longer than Supabase timeout)
    resetLoadingTimeout.current = setTimeout(() => {
      console.log('Login timeout reached, resetting state')
      setLoading(false)
      isSubmitting.current = false
      setErrors({ general: 'Authentication timeout. Please check your connection and try again.' })
    }, 10000)

    try {
      console.log('Attempting login...')
      const { user, error } = await authService.signIn(formData.email, formData.password)
      
      console.log('Auth response:', { user: !!user, error })
      
      if (error) {
        console.error('Login error:', error)
        clearTimeouts()
        setLoading(false)
        isSubmitting.current = false
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Invalid email or password. Please try again.' })
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'Please verify your email address first.' })
        } else {
          setErrors({ general: error.message || 'Login failed. Please try again.' })
        }
        return
      }

      if (user) {
        // Login successful, redirect to dashboard
        console.log('Login successful, redirecting to dashboard...')
        clearTimeouts()
        setLoading(false)
        isSubmitting.current = false
        router.push('/dashboard')
      } else {
        console.log('No user returned from auth')
        clearTimeouts()
        setLoading(false)
        isSubmitting.current = false
        setErrors({ general: 'Login failed. Please try again.' })
      }
    } catch (error) {
      console.error('Login error:', error)
      clearTimeouts()
      setLoading(false)
      isSubmitting.current = false
      setErrors({ general: 'An error occurred during login. Please try again.' })
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your Kakeibo account
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General error message */}
              {errors.general && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {errors.general}
                </div>
              )}

              {/* Email input */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={errors.email}
                  className="pl-10"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Password input */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={errors.password}
                  className="pl-10 pr-10"
                  disabled={loading}
                  autoComplete="current-password"
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

              {/* Forgot password link */}
              <div className="text-right">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login button */}
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Register link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  href="/auth/register" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
