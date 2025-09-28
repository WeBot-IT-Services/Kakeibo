'use client'

import { Card, CardContent } from '@/components/ui/Card'
import type { Account } from '@/types/database'

interface AccountCardProps {
  account: Account
  onClick?: () => void
}

const accountTypeIcons = {
  bank: '🏦',
  maybank2u: '🏦',
  cimb_clicks: '🏦',
  boost: '📱',
  grabpay: '�',
  touch_n_go: '�',
  cash: '💵',
  credit_card: '💳',
  other: '💰'
}

const accountTypeNames = {
  bank: 'Bank Account',
  maybank2u: 'Maybank2u',
  cimb_clicks: 'CIMB Clicks',
  boost: 'Boost Wallet',
  grabpay: 'GrabPay',
  touch_n_go: 'Touch \'n Go',
  cash: 'Cash',
  credit_card: 'Credit Card',
  other: 'Other'
}

export function AccountCard({ account, onClick }: AccountCardProps) {
  const icon = accountTypeIcons[account.type as keyof typeof accountTypeIcons] || '💰'
  const typeName = accountTypeNames[account.type as keyof typeof accountTypeNames] || 'Other'
  
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:bg-muted/50' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{icon}</div>
            <div>
              <div className="font-medium">{account.name}</div>
              <div className="text-sm text-muted-foreground">{typeName}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg">
              ¥{account.balance.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              {account.currency}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
