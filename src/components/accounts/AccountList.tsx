'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Wallet } from 'lucide-react'
import { AccountCard } from './AccountCard'
import { AddAccountForm } from './AddAccountForm'
import { accountService } from '@/lib/database'
import type { Account } from '@/types/database'

interface AccountListProps {
  userId: string
  onAccountSelect?: (account: Account) => void
  refreshTrigger?: number
}

export function AccountList({ userId, onAccountSelect, refreshTrigger }: AccountListProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [totalBalance, setTotalBalance] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const data = await accountService.getAccounts(userId)
      setAccounts(data)
      
      // Calculate total balance
      const total = data.reduce((sum, account) => sum + account.balance, 0)
      setTotalBalance(total)
    } catch (error) {
      console.error('Failed to load accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccountAdded = (newAccount: Account) => {
    setAccounts(prev => [newAccount, ...prev])
    setTotalBalance(prev => prev + newAccount.balance)
    setShowAddForm(false)
  }

  useEffect(() => {
    loadAccounts()
  }, [userId, refreshTrigger])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">加载中...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Add Account Form Modal */}
      {showAddForm && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg">
              <AddAccountForm
                userId={userId}
                onSuccess={handleAccountAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Total Assets Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Total Balance</div>
                <div className="text-3xl font-bold mt-2">
                  RM {totalBalance.toFixed(2)}
                </div>
                <div className="text-sm opacity-90 mt-1">
                  {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                </div>
              </div>
              <Wallet className="h-12 w-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Accounts List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <CardTitle>My Accounts</CardTitle>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Account</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No accounts yet</h3>
                <p className="text-gray-600 mb-4">
                  Add your first Malaysian bank account or e-wallet to get started
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Account</span>
                </Button>
              </div>
            ) : (
              accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onClick={() => onAccountSelect?.(account)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
