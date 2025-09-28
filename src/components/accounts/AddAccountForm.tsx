'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { X, Plus, Wallet } from 'lucide-react'
import { accountService } from '@/lib/database'
import type { Account } from '@/types/database'

interface AddAccountFormProps {
  userId: string
  onSuccess: (account: Account) => void
  onCancel: () => void
}

const MALAYSIAN_ACCOUNT_TYPES = [
  { value: 'maybank2u', label: 'Maybank2u', icon: '🏦' },
  { value: 'cimb_clicks', label: 'CIMB Clicks', icon: '🏦' },
  { value: 'public_bank', label: 'Public Bank', icon: '🏦' },
  { value: 'rhb_bank', label: 'RHB Bank', icon: '🏦' },
  { value: 'hong_leong', label: 'Hong Leong Bank', icon: '🏦' },
  { value: 'ambank', label: 'AmBank', icon: '🏦' },
  { value: 'touch_n_go', label: 'Touch \'n Go eWallet', icon: '💳' },
  { value: 'boost', label: 'Boost', icon: '🚀' },
  { value: 'grabpay', label: 'GrabPay', icon: '🟢' },
  { value: 'shopee_pay', label: 'ShopeePay', icon: '🛒' },
  { value: 'fave_pay', label: 'FavePay', icon: '❤️' },
  { value: 'bigpay', label: 'BigPay', icon: '✈️' },
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'credit_card', label: 'Credit Card', icon: '💳' },
  { value: 'debit_card', label: 'Debit Card', icon: '💳' },
  { value: 'other', label: 'Other', icon: '📱' }
]

export function AddAccountForm({ userId, onSuccess, onCancel }: AddAccountFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    balance: '',
    currency: 'MYR'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Account name is required'
    if (!formData.type) newErrors.type = 'Account type is required'
    if (!formData.balance.trim()) newErrors.balance = 'Initial balance is required'
    if (isNaN(parseFloat(formData.balance))) newErrors.balance = 'Invalid balance amount'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const account = await accountService.createAccount({
        user_id: userId,
        name: formData.name.trim(),
        type: formData.type as any,
        balance: parseFloat(formData.balance),
        currency: formData.currency,
        is_active: true
      })

      onSuccess(account)
    } catch (error) {
      console.error('Failed to create account:', error)
      setErrors({ general: 'Failed to create account. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const selectedAccountType = MALAYSIAN_ACCOUNT_TYPES.find(type => type.value === formData.type)

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Add New Account</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 bg-white rounded-b-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Display */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {errors.general}
            </div>
          )}

          {/* Account Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Account Name</label>
            <Input
              placeholder="e.g., Maybank Savings Account"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Account Type</label>
            <select
              className={`flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                errors.type ? 'border-red-500' : 'border-input'
              }`}
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">Select Account Type</option>
              {MALAYSIAN_ACCOUNT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
          </div>

          {/* Initial Balance */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Initial Balance (RM)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">RM</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`pl-12 text-lg font-medium ${errors.balance ? 'border-red-500' : ''}`}
                value={formData.balance}
                onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
              />
            </div>
            {errors.balance && <p className="text-sm text-red-600">{errors.balance}</p>}
          </div>

          {/* Currency (Fixed) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Currency</label>
            <Input
              value="MYR (Malaysian Ringgit)"
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Preview */}
          {selectedAccountType && formData.name && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Preview:</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{selectedAccountType.icon}</span>
                  <div>
                    <p className="font-medium text-blue-900">{formData.name}</p>
                    <p className="text-sm text-blue-700">{selectedAccountType.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-900">
                    RM {formData.balance || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" loading={loading} className="flex-1 py-3 font-medium">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 py-3"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Popular Malaysian Accounts:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div>• Maybank2u Online Banking</div>
            <div>• Touch 'n Go eWallet</div>
            <div>• CIMB Clicks</div>
            <div>• Boost eWallet</div>
            <div>• Public Bank</div>
            <div>• GrabPay Wallet</div>
          </div>
        </div>
      </div>
    </div>
  )
}