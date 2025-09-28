'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Camera, Plus, X } from 'lucide-react'
import { transactionService, accountService, categoryService } from '@/lib/database'
import { ReceiptScanner } from './ReceiptScanner'
import type { Account, Category, Transaction } from '@/types/database'
import type { ReceiptData } from '@/lib/ai-receipt-service'

interface AddTransactionFormProps {
  userId: string
  onSuccess?: (transaction: Transaction) => void
  onCancel?: () => void
}

export function AddTransactionForm({ userId, onSuccess, onCancel }: AddTransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showScanner, setShowScanner] = useState(false)
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    account_id: '',
    category_id: '',
    person: '',
    receipt_image: ''
  })

  // 加载账户和分类数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const [accountsData, categoriesData] = await Promise.all([
          accountService.getAccounts(userId),
          categoryService.getCategories(userId)
        ])
        setAccounts(accountsData)
        setCategories(categoriesData)
        
        // 设置默认账户
        if (accountsData.length > 0) {
          setFormData(prev => ({ ...prev, account_id: accountsData[0].id }))
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    
    loadData()
  }, [userId])

  // 根据交易类型筛选分类
  const filteredCategories = categories.filter(cat => cat.type === formData.type)

  // Handle receipt scan result
  const handleReceiptProcessed = (receiptData: ReceiptData & { image?: string }) => {
    // Auto-fill form with receipt data
    setFormData(prev => ({
      ...prev,
      type: 'expense', // Most receipts are expenses
      amount: receiptData.total.toString(),
      description: receiptData.merchant,
      date: receiptData.date,
      category_id: findCategoryByName(receiptData.category),
      receipt_image: receiptData.image || ''
    }))
    setShowScanner(false)
  }

  // Find category ID by name
  const findCategoryByName = (categoryName: string): string => {
    const category = categories.find(cat => 
      cat.name.toLowerCase().includes(categoryName.toLowerCase()) ||
      categoryName.toLowerCase().includes(cat.name.toLowerCase())
    )
    return category?.id || ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.account_id || !formData.category_id) return

    setLoading(true)
    try {
      const transaction = await transactionService.createTransaction({
        user_id: userId,
        account_id: formData.account_id,
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description || undefined,
        date: formData.date,
        person: formData.person || undefined,
        is_recurring: false
      })

      onSuccess?.(transaction)
      
      // 重置表单
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        account_id: accounts[0]?.id || '',
        category_id: '',
        person: '',
        receipt_image: ''
      })
    } catch (error) {
      console.error('Failed to create transaction:', error)
      alert('Failed to add transaction, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Receipt Scanner Modal */}
      {showScanner && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg">
              <ReceiptScanner
                onReceiptProcessed={handleReceiptProcessed}
                onCancel={() => setShowScanner(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Transaction Form */}
      <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-center text-gray-900">Add Transaction</h2>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowScanner(true)}
                className="flex items-center space-x-1"
              >
                <Camera className="h-4 w-4" />
                <span>Scan Receipt</span>
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 py-6 bg-white rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
          {/* Transaction Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Transaction Type</label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={formData.type === 'expense' ? 'primary' : 'outline'}
                className="flex-1 py-3 font-medium"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category_id: '' }))}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={formData.type === 'income' ? 'primary' : 'outline'}
                className="flex-1 py-3 font-medium"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income', category_id: '' }))}
              >
                Income
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Amount (MYR)</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="text-lg font-medium text-center"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          {/* Account Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Account</label>
            <select
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.account_id}
              onChange={(e) => setFormData(prev => ({ ...prev, account_id: e.target.value }))}
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} (RM {account.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <select
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              required
            >
              <option value="">Select Category</option>
              {filteredCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Notes</label>
            <Input
              placeholder="Add notes..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Person */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Person (Optional)</label>
            <Input
              placeholder="Record person"
              value={formData.person}
              onChange={(e) => setFormData(prev => ({ ...prev, person: e.target.value }))}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" loading={loading} className="flex-1 py-3 font-medium">
              Add Transaction
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="px-6 py-3">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
