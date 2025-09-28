'use client'

import { useState, useEffect } from 'react'
import { Plus, Filter, TrendingUp, Wallet, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AddTransactionForm } from '@/components/transactions/AddTransactionForm'
import { TransactionList } from '@/components/transactions/TransactionList'
import { AccountList } from '@/components/accounts/AccountList'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuthContext } from '@/components/auth/AuthProvider'
import { transactionService } from '@/lib/database'

function DashboardContent() {
  const { user, signOut } = useAuthContext()
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'accounts'>('overview')
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [statistics, setStatistics] = useState<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    categoryStats: { category: string; amount: number; type: string; }[];
  }>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryStats: []
  })

  // 加载统计数据
  const loadStatistics = async () => {
    if (!user) return
    
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
      
      const stats = await transactionService.getStatistics(user.id, startDate, endDate)
      setStatistics(stats)
    } catch (error) {
      console.error('Failed to load statistics:', error)
    }
  }

  useEffect(() => {
    if (user) {
      loadStatistics()
    }
  }, [user, refreshTrigger])

  const handleTransactionAdded = () => {
    setShowAddForm(false)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Kakeibo Malaysia</h1>
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Transaction</span>
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user?.name || 'User'}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = '/settings'}
                  className="flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Overview
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              <Filter className="h-4 w-4 inline mr-2" />
              Transactions
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'accounts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('accounts')}
            >
              <Wallet className="h-4 w-4 inline mr-2" />
              Accounts
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6">
        {/* Only render content when user exists */}
        {user && (
          <>
            {/* Add Transaction Form Modal */}
            {showAddForm && (
              <div 
                className="fixed inset-0 z-50 overflow-y-auto"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowAddForm(false);
                  }
                }}
              >
                <div className="flex min-h-full items-center justify-center p-4">
                  <div 
                    className="relative w-full max-w-lg transform rounded-lg shadow-xl transition-all"
                    style={{ backgroundColor: 'white' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AddTransactionForm
                      userId={user.id}
                      onSuccess={handleTransactionAdded}
                      onCancel={() => setShowAddForm(false)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Overview Page */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Income</p>
                          <p className="text-2xl font-bold text-green-600">
                            RM {statistics.totalIncome.toFixed(2)}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                          <p className="text-2xl font-bold text-red-600">
                            RM {statistics.totalExpense.toFixed(2)}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-red-600 rotate-180" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Balance</p>
                          <p className={`text-2xl font-bold ${statistics.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            RM {statistics.balance.toFixed(2)}
                          </p>
                        </div>
                        <Wallet className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Transactions */}
                <TransactionList 
                  userId={user.id} 
                  refreshTrigger={refreshTrigger}
                />
              </div>
            )}

            {/* Transactions Page */}
            {activeTab === 'transactions' && (
              <TransactionList 
                userId={user.id} 
                refreshTrigger={refreshTrigger}
              />
            )}

            {/* Accounts Page */}
            {activeTab === 'accounts' && (
              <AccountList 
                userId={user.id} 
                refreshTrigger={refreshTrigger}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
