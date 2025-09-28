'use client'

import { useState } from 'react'
import { ReceiptScanner } from '@/components/transactions/ReceiptScanner'

export default function TestReceiptPage() {
  const [results, setResults] = useState<any>(null)

  const handleReceiptProcessed = (data: any) => {
    console.log('Receipt data received:', data)
    setResults(data)
  }

  const handleCancel = () => {
    console.log('Receipt scanning cancelled')
  }

  const testAPIConnection = async () => {
    try {
      console.log('Testing API connection...')
      const response = await fetch('/api/test-ai', { method: 'POST' })
      const data = await response.json()
      console.log('API test result:', data)
      setResults({ apiTest: data })
    } catch (error) {
      console.error('API test failed:', error)
      setResults({ apiTest: { error: error instanceof Error ? error.message : 'Unknown error' } })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Receipt Scanner Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button 
            onClick={testAPIConnection}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Test API Connection
          </button>
          
          <ReceiptScanner 
            onReceiptProcessed={handleReceiptProcessed} 
            onCancel={handleCancel} 
          />
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}