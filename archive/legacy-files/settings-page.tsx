'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AccountList } from '@/components/accounts/AccountList'
import { CategoryList } from '@/components/categories/CategoryList'
import { Settings, CreditCard, Tag, User } from 'lucide-react'
import { useAuth } from '@/lib/auth'

type TabType = 'accounts' | 'categories' | 'profile'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('accounts')

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Please log in to access settings</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tabs = [
    { id: 'accounts' as TabType, label: 'Accounts', icon: CreditCard },
    { id: 'categories' as TabType, label: 'Categories', icon: Tag },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors
                          ${activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'accounts' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Accounts</h2>
                  <p className="text-gray-600">
                    Configure your Malaysian bank accounts and e-wallets for expense tracking.
                  </p>
                </div>
                <AccountList userId={user.id} />
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Categories</h2>
                  <p className="text-gray-600">
                    Organize your expenses and income with custom categories.
                  </p>
                </div>
                <CategoryList userId={user.id} />
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                  <p className="text-gray-600">
                    Manage your account information and preferences.
                  </p>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="text-gray-900">{user.email}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User ID
                      </label>
                      <div className="text-gray-500 text-sm font-mono">{user.id}</div>
                    </div>
                    <div className="pt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Currency Settings</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🇲🇾</span>
                        <div>
                          <div className="font-medium text-gray-900">Malaysian Ringgit (RM)</div>
                          <div className="text-sm text-gray-500">Default currency for all transactions</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}