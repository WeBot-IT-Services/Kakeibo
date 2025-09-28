'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { X, Plus, Tag } from 'lucide-react'
import { categoryService } from '@/lib/database'
import type { Category } from '@/types/database'

interface AddCategoryFormProps {
  userId: string
  onSuccess: (category: Category) => void
  onCancel: () => void
}

const CATEGORY_ICONS = [
  '🍔', '🛒', '🚗', '🏠', '💊', '🎬', '📚', '👕', '⚽', '✈️',
  '💰', '🎯', '🔧', '📱', '💡', '🎵', '🌟', '💎', '🎨', '🏆',
  '☕', '🍕', '🚌', '🏥', '🎭', '📺', '💻', '👟', '🎸', '🎁'
]

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Healthcare',
  'Entertainment',
  'Education',
  'Clothing',
  'Sports & Fitness',
  'Travel',
  'Personal Care',
  'Home & Garden',
  'Technology',
  'Gifts & Donations',
  'Other'
]

const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Freelance',
  'Investment',
  'Rental',
  'Commission',
  'Bonus',
  'Gift Received',
  'Other Income'
]

const CATEGORY_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange  
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9', // Sky
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#EC4899'  // Pink
]

export function AddCategoryForm({ userId, onSuccess, onCancel }: AddCategoryFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    icon: '🏷️',
    color: '#3B82F6'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Category name is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const category = await categoryService.createCategory({
        user_id: userId,
        name: formData.name.trim(),
        type: formData.type,
        icon: formData.icon,
        color: formData.color,
        is_active: true
      })

      onSuccess(category)
    } catch (error) {
      console.error('Failed to create category:', error)
      setErrors({ general: 'Failed to create category. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = (categoryName: string) => {
    setFormData(prev => ({ ...prev, name: categoryName }))
  }

  const suggestedCategories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
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

      <div className="px-6 py-6 bg-white rounded-b-lg space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Display */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {errors.general}
            </div>
          )}

          {/* Category Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category Type</label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={formData.type === 'expense' ? 'primary' : 'outline'}
                className="flex-1 py-3 font-medium"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={formData.type === 'income' ? 'primary' : 'outline'}
                className="flex-1 py-3 font-medium"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              >
                Income
              </Button>
            </div>
          </div>

          {/* Category Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category Name</label>
            <Input
              placeholder="e.g., Food & Dining"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Icon</label>
            <div className="grid grid-cols-10 gap-2 p-3 border rounded-lg bg-gray-50 max-h-32 overflow-y-auto">
              {CATEGORY_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`p-2 rounded-lg text-xl hover:bg-white transition-colors ${
                    formData.icon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-white'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Color</label>
            <div className="grid grid-cols-8 gap-2 p-3 border rounded-lg bg-gray-50">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    formData.color === color ? 'ring-2 ring-gray-600 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {formData.name && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Preview:</h4>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: formData.color }}
                >
                  <span className="text-lg">{formData.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-blue-900">{formData.name}</p>
                  <p className="text-sm text-blue-700 capitalize">{formData.type}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" loading={loading} className="flex-1 py-3 font-medium">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
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

        {/* Quick Add Suggestions */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Quick Add - Popular {formData.type === 'expense' ? 'Expense' : 'Income'} Categories:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedCategories.map((category) => (
              <Button
                key={category}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(category)}
                className="justify-start text-left h-auto py-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}