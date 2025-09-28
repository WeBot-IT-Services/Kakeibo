import { Wallet, TrendingUp, PieChart, Receipt, Target, Bell } from 'lucide-react'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Kakeibo Malaysia 💰
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Smart Personal Finance Assistant for Malaysia - Making money management simple and efficient
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          icon={<Receipt className="h-8 w-8" />}
          title="Smart Expense Tracking"
          description="AI-powered receipt recognition and intelligent categorization for Malaysian expenses"
          color="bg-blue-500"
        />
        <FeatureCard
          icon={<Wallet className="h-8 w-8" />}
          title="Account Management"
          description="Manage multiple accounts: Maybank, CIMB, Touch 'n Go, Boost, GrabPay and more"
          color="bg-green-500"
        />
        <FeatureCard
          icon={<PieChart className="h-8 w-8" />}
          title="Data Analytics"
          description="Visual charts and insights to understand your spending habits in MYR"
          color="bg-purple-500"
        />
        <FeatureCard
          icon={<Target className="h-8 w-8" />}
          title="Budget Management"
          description="Set spending budgets and track progress to control your Malaysian expenses"
          color="bg-orange-500"
        />
        <FeatureCard
          icon={<TrendingUp className="h-8 w-8" />}
          title="Trend Analysis"
          description="Income and expense trends at a glance, clear view of your financial status"
          color="bg-red-500"
        />
        <FeatureCard
          icon={<Bell className="h-8 w-8" />}
          title="Smart Reminders"
          description="Bill due date reminders, budget overspend warnings, never miss important information"
          color="bg-indigo-500"
        />
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4">
        <div className="space-x-4">
          <a
            href="/auth/login"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Login
          </a>
          <a
            href="/auth/register"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Register for Free
          </a>
        </div>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Click "Login" or "Register for Free" to start managing your finances
        </p>
      </div>
    </main>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className={`${color} text-white p-3 rounded-lg inline-block mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
