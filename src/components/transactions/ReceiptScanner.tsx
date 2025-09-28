'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Camera, Upload, Loader2, X, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { aiReceiptService, type ReceiptData } from '@/lib/ai-receipt-service'

interface ReceiptScannerProps {
  onReceiptProcessed: (data: ReceiptData & { image?: string }) => void
  onCancel: () => void
}

export function ReceiptScanner({ onReceiptProcessed, onCancel }: ReceiptScannerProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<ReceiptData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection (images and PDFs)
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setSelectedImage(file)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file) {
      setError('Please select an image file (JPG, PNG, WEBP) or PDF document')
    }
  }

  // Process receipt with AI
  const processReceipt = async () => {
    if (!selectedImage) return

    setProcessing(true)
    setError(null)

    try {
      const response = await aiReceiptService.analyzeReceipt(selectedImage)
      
      if (response.success && response.data) {
        setResult(response.data)
      } else {
        setError(response.error || 'Failed to process receipt')
      }
    } catch (err) {
      setError('Processing failed. Please try again.')
      console.error('Receipt processing error:', err)
    } finally {
      setProcessing(false)
    }
  }

  // Use the extracted data
  const useReceiptData = () => {
    if (result) {
      onReceiptProcessed({
        ...result,
        image: imagePreview || undefined
      })
    }
  }

  // Reset form
  const reset = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Scan Receipt</h2>
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
        {/* Image Upload Section */}
        {!selectedImage && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Take a photo, upload an image, or select a PDF of your receipt</p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {/* Camera Input */}
                <Button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>Take Photo</span>
                </Button>
                
                {/* File Upload */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </Button>
              </div>

              {/* Hidden Inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* File Preview */}
        {imagePreview && !result && (
          <div className="space-y-4">
            <div className="relative">
              {selectedImage?.type === 'application/pdf' ? (
                <div className="w-full p-8 border rounded-lg bg-gray-50 flex flex-col items-center justify-center min-h-[200px]">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700">{selectedImage.name}</p>
                  <p className="text-sm text-gray-500">PDF Document</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <img
                  src={imagePreview}
                  alt="Receipt preview"
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={reset}
                className="absolute top-2 right-2 p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={processReceipt}
                disabled={processing}
                className="flex-1 flex items-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Scan Receipt</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={reset}
              >
                Choose Different
              </Button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Processing Failed</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-green-800 font-medium">Receipt Processed Successfully!</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700">Merchant:</span>
                    <p className="text-gray-900">{result.merchant}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Amount:</span>
                    <p className="text-gray-900">RM {result.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-900">{result.date}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-900 capitalize">{result.category}</p>
                  </div>
                </div>

                {result.items && result.items.length > 0 && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Items:</span>
                    <div className="max-h-32 overflow-y-auto mt-1">
                      {result.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs py-1">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>RM {item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={useReceiptData}
                className="flex-1"
              >
                Use This Data
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={reset}
              >
                Scan Another
              </Button>
            </div>
          </div>
        )}

        {/* Tips */}
        {!selectedImage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Tips for Best Results:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure good lighting and clear image</li>
              <li>• Include the entire receipt in the frame</li>
              <li>• Make sure text is readable</li>
              <li>• Works best with Malaysian receipts in RM/MYR</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}