import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kakeibo - Personal Finance Assistant Malaysia',
  description: 'Smart personal finance tracking app for Malaysia, supports AI receipt recognition, budget management, and data analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-MY">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
