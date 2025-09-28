// AI Receipt Recognition Service for Malaysian Receipts
// Uses OpenAI Vision API for OCR and data extraction

interface ReceiptData {
  merchant: string
  date: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  category: string
  currency: string
  taxAmount?: number
  paymentMethod?: string
}

interface AIResponse {
  success: boolean
  data?: ReceiptData
  error?: string
}

class AIReceiptService {
  private readonly OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  private readonly API_URL = 'https://api.openai.com/v1/chat/completions'

  // Convert file to base64 (images and PDFs)
  private async fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataURL = reader.result as string
        const [header, base64] = dataURL.split(',')
        const mimeType = header.match(/data:([^;]+)/)?.[1] || file.type
        resolve({ base64, mimeType })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Check if file type is supported
  private isSupportedFileType(file: File): boolean {
    const supportedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'application/pdf'
    ]
    return supportedTypes.includes(file.type)
  }

  // Analyze receipt with OpenAI Vision (supports images and PDFs)
  async analyzeReceipt(file: File): Promise<AIResponse> {
    console.log('=== AI Receipt Analysis Started ===')
    console.log('File name:', file.name)
    console.log('File type:', file.type)
    console.log('File size:', file.size, 'bytes')
    
    try {
      // Check API key configuration
      console.log('Checking API key configuration...')
      if (!this.OPENAI_API_KEY || this.OPENAI_API_KEY === 'your_openai_api_key') {
        console.error('API key not configured')
        return { success: false, error: 'OpenAI API key not configured' }
      }

      // Check if file type is supported
      if (!this.isSupportedFileType(file)) {
        return { 
          success: false, 
          error: 'Unsupported file type. Please use JPG, PNG, WEBP, or PDF files.' 
        }
      }

      console.log('Processing receipt file:', { 
        name: file.name, 
        type: file.type, 
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB` 
      })

      const { base64, mimeType } = await this.fileToBase64(file)
      console.log('File converted to base64, mimeType:', mimeType)
      
      const prompt = `Analyze this Malaysian receipt (image or PDF) and extract the following information in JSON format:

{
  "merchant": "store/restaurant name",
  "date": "YYYY-MM-DD format",
  "total": "total amount as number",
  "items": [
    {
      "name": "item name",
      "quantity": "quantity as number", 
      "price": "price as number"
    }
  ],
  "category": "expense category (food, shopping, transport, etc.)",
  "currency": "MYR",
  "taxAmount": "tax amount if available",
  "paymentMethod": "cash/card/ewallet if mentioned"
}

Focus on:
- Malaysian store names and formats
- Ringgit Malaysia (RM/MYR) currency
- Common Malaysian payment methods (Touch 'n Go, Boost, GrabPay, etc.)
- Local food items and store categories
- Date formats commonly used in Malaysia

Return only valid JSON without any explanation text.`

      console.log('Making API request to OpenAI...')
      
      const requestBody = {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      }

      console.log('Making API call to:', this.API_URL)
      console.log('Request headers configured')
      console.log('Request body size:', JSON.stringify(requestBody).length, 'characters')

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenAI API error:', errorText)
        
        if (response.status === 401) {
          return { success: false, error: 'Invalid OpenAI API key' }
        } else if (response.status === 429) {
          return { success: false, error: 'API rate limit exceeded. Please try again later.' }
        } else if (response.status === 413) {
          return { success: false, error: 'File too large. Please use a smaller image or PDF.' }
        }
        
        return { success: false, error: `OpenAI API error: ${response.statusText}` }
      }

      const result = await response.json()
      console.log('OpenAI response received:', result)
      
      const content = result.choices?.[0]?.message?.content

      if (!content) {
        console.error('No content in response:', result)
        return { success: false, error: 'No content received from OpenAI' }
      }

      console.log('Parsing receipt data:', content)

      try {
        // Parse JSON response
        const receiptData = JSON.parse(content) as ReceiptData
        
        // Validate required fields
        if (!receiptData.merchant || !receiptData.total || !receiptData.date) {
          return { success: false, error: 'Missing required receipt data from AI analysis' }
        }

        console.log('Receipt data successfully parsed:', receiptData)
        return { success: true, data: receiptData }
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError, 'Content:', content)
        return { success: false, error: 'Failed to parse AI response. Please try again.' }
      }

    } catch (error) {
      console.error('Receipt analysis error:', error)
      
      // Provide specific error messages based on error type
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Network error: Unable to connect to AI service. Please check your internet connection and try again.'
        }
      }
      
      if (error instanceof Error) {
        // Check for common network errors
        if (error.message.includes('CORS')) {
          return { 
            success: false, 
            error: 'Network configuration error. Please refresh the page and try again.'
          }
        }
        
        if (error.message.includes('timeout')) {
          return { 
            success: false, 
            error: 'Request timeout. The file might be too large. Please try a smaller file.'
          }
        }
        
        return { 
          success: false, 
          error: `Error: ${error.message}`
        }
      }
      
      return { 
        success: false, 
        error: 'Unknown error occurred. Please try again.'
      }
    }
  }

  // Fallback OCR using simple text extraction
  async extractTextOnly(imageFile: File): Promise<AIResponse> {
    try {
      if (!this.OPENAI_API_KEY || this.OPENAI_API_KEY === 'your_openai_api_key') {
        return { success: false, error: 'OpenAI API key not configured' }
      }

      const { base64 } = await this.fileToBase64(imageFile)
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all text from this receipt image. Focus on merchant name, total amount in RM/MYR, and date.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 300
        })
      })

      const result = await response.json()
      const extractedText = result.choices[0]?.message?.content || ''

      return { 
        success: true, 
        data: {
          merchant: 'Manual Entry Required',
          date: new Date().toISOString().split('T')[0],
          total: 0,
          items: [],
          category: 'other',
          currency: 'MYR'
        }
      }

    } catch (error) {
      return { 
        success: false, 
        error: 'Text extraction failed'
      }
    }
  }

  // Get suggested category based on merchant name
  getCategoryFromMerchant(merchant: string): string {
    const merchantLower = merchant.toLowerCase()
    
    // Malaysian food establishments
    if (merchantLower.includes('mcd') || merchantLower.includes('kfc') || 
        merchantLower.includes('pizza') || merchantLower.includes('restoran') ||
        merchantLower.includes('cafe') || merchantLower.includes('kopitiam') ||
        merchantLower.includes('mamak') || merchantLower.includes('food')) {
      return 'food'
    }
    
    // Malaysian retail
    if (merchantLower.includes('99 speedmart') || merchantLower.includes('7-eleven') ||
        merchantLower.includes('giant') || merchantLower.includes('tesco') ||
        merchantLower.includes('aeon') || merchantLower.includes('mydin')) {
      return 'shopping'
    }
    
    // Transport
    if (merchantLower.includes('grab') || merchantLower.includes('taxi') ||
        merchantLower.includes('lrt') || merchantLower.includes('mrt') ||
        merchantLower.includes('rapid') || merchantLower.includes('petrol')) {
      return 'transport'
    }
    
    // Entertainment
    if (merchantLower.includes('cinema') || merchantLower.includes('gsc') ||
        merchantLower.includes('tgv') || merchantLower.includes('game')) {
      return 'entertainment'
    }
    
    return 'other'
  }
}

export const aiReceiptService = new AIReceiptService()
export type { ReceiptData, AIResponse }