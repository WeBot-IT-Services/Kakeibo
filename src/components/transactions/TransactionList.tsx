'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { transactionService } from '@/lib/database'
import type { TransactionWithDetails } from '@/types/database'

interface TransactionListProps {
  userId: string
  refreshTrigger?: number
  filters?: {
    accountId?: string
    categoryId?: string
    person?: string
    type?: 'income' | 'expense' | 'transfer'
    startDate?: string
    endDate?: string
  }
}

export function TransactionList({ userId, refreshTrigger, filters }: TransactionListProps) {
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  const loadTransactions = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setLoading(true)
      const { data, total: totalCount } = await transactionService.getTransactions(userId, {
        page: pageNum,
        limit: 20,
        ...filters
      })

      if (reset) {
        setTransactions(data)
      } else {
        setTransactions(prev => [...prev, ...data])
      }
      
      setTotal(totalCount)
      setHasMore(data.length === 20 && (pageNum * 20) < totalCount)
      setPage(pageNum)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和刷新
  useEffect(() => {
    loadTransactions(1, true)
  }, [userId, refreshTrigger, filters])

  const loadMore = () => {
    if (!loading && hasMore) {
      loadTransactions(page + 1, false)
    }
  }

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'income' ? '+' : '-'
    const color = type === 'income' ? 'text-green-600' : 'text-red-600'
    return (
      <span className={color}>
        {sign}¥{amount.toFixed(2)}
      </span>
    )
  }

  if (loading && transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">加载中...</div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            暂无交易记录
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>交易记录</span>
            <span className="text-sm font-normal text-muted-foreground">
              共 {total} 条记录
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {transaction.category?.icon || '📝'}
                    </div>
                    <div>
                      <div className="font-medium">
                        {transaction.category?.name || '未分类'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.account?.name} • {' '}
                        {format(new Date(transaction.date), 'MM月dd日', { locale: zhCN })}
                        {transaction.person && ` • ${transaction.person}`}
                      </div>
                      {transaction.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {transaction.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatAmount(transaction.amount, transaction.type)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(transaction.created_at), 'HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={loadMore}
                loading={loading}
              >
                加载更多
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
