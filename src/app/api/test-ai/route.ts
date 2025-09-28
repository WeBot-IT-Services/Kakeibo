import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test environment variables
    const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    const hasKey = !!openaiKey && openaiKey !== 'your_openai_api_key'
    
    return NextResponse.json({
      success: true,
      config: {
        hasOpenAIKey: hasKey,
        nodeEnv: process.env.NODE_ENV,
        keyPrefix: openaiKey ? openaiKey.substring(0, 10) + '...' : 'Not configured'
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Test AI API route called')
    
    // Simple OpenAI API test
    const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    
    if (!openaiKey || openaiKey === 'your_openai_api_key') {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API key not configured'
      }, { status: 400 })
    }

    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('OpenAI API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      return NextResponse.json({
        success: false,
        error: `OpenAI API error: ${response.status} - ${errorText}`
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('OpenAI API success, models count:', data.data?.length || 0)

    return NextResponse.json({
      success: true,
      message: 'OpenAI API connection successful',
      modelsCount: data.data?.length || 0
    })

  } catch (error) {
    console.error('Test AI API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}