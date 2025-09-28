'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { AddCategoryForm } from './AddCategoryForm'
import { 
  Plus, 
  Tag, 
  TrendingUp, 
  TrendingDown,
  Coffee,
  Car,
  Home,
  Heart,
  Book,
  Gamepad2,
  Briefcase,
  Gift,
  ShoppingCart,
  DollarSign
} from 'lucide-react'
import { categoryService } from '@/lib/database'

// Category icon mapping
const categoryIcons = {
  coffee: Coffee,
  car: Car,
  home: Home,
  heart: Heart,
  book: Book,
  gamepad2: Gamepad2,
  briefcase: Briefcase,
  gift: Gift,
  'shopping-cart': ShoppingCart,
  'dollar-sign': DollarSign,
  tag: Tag,
}

type Category = {
  id: string
  name: string
  type: 'expense' | 'income'
  icon?: string
  color?: string
  user_id: string
  created_at: string
  updated_at: string
}

interface CategoryListProps {
  userId: string
  onCategorySelect?: (category: Category) => void
  selectedCategory?: Category | null
}

export function CategoryList({ userId, onCategorySelect, selectedCategory }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const categories = await categoryService.getCategories(userId)
      setCategories(categories)
    } catch (err) {
      console.error('Error loading categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryAdded = async () => {
    setShowAddForm(false)
    await loadCategories()
  }

  useEffect(() => {
    if (userId) {
      loadCategories()
    }
  }, [userId])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading categories...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadCategories}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const expenseCategories = categories.filter(cat => cat.type === 'expense')
  const incomeCategories = categories.filter(cat => cat.type === 'income')

  return (
    <>
      {/* Add Category Form Modal */}
      {showAddForm && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg">
              <AddCategoryForm
                userId={userId}
                onSuccess={handleCategoryAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Categories</h2>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Button>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories yet</h3>
              <p className="text-gray-600 mb-4">
                Create categories to organize your expenses and income
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Category</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Expense Categories */}
            {expenseCategories.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <CardTitle>Expense Categories</CardTitle>
                    <span className="text-sm text-gray-500">({expenseCategories.length})</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {expenseCategories.map((category) => {
                      const IconComponent = categoryIcons[(category.icon || 'tag') as keyof typeof categoryIcons] || Tag
                      const isSelected = selectedCategory?.id === category.id
                      
                      return (
                        <button
                          key={category.id}
                          onClick={() => onCategorySelect?.(category)}
                          className={`
                            p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2
                            ${isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          <IconComponent 
                            className="h-5 w-5"
                            style={{ color: category.color || '#6B7280' }}
                          />
                          <span className="text-sm font-medium text-gray-800">
                            {category.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Income Categories */}
            {incomeCategories.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <CardTitle>Income Categories</CardTitle>
                    <span className="text-sm text-gray-500">({incomeCategories.length})</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {incomeCategories.map((category) => {
                      const IconComponent = categoryIcons[(category.icon || 'tag') as keyof typeof categoryIcons] || Tag
                      const isSelected = selectedCategory?.id === category.id
                      
                      return (
                        <button
                          key={category.id}
                          onClick={() => onCategorySelect?.(category)}
                          className={`
                            p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2
                            ${isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          <IconComponent 
                            className="h-5 w-5"
                            style={{ color: category.color || '#10B981' }}
                          />
                          <span className="text-sm font-medium text-gray-800">
                            {category.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  )
}