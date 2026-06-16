import React, { useState, useCallback } from 'react'
import Spinner from '../../../components/Spinner'
import { bulkUploadProducts, fetchProducts } from '../productThunk'
import { useDispatch, useSelector } from 'react-redux'
import { FaTimes, FaUpload, FaDownload, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaFileExcel } from 'react-icons/fa'
import AppToast from '../../../services/toastService'

const BulkUploadModel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  // Fix: Use the correct path to your state
  const { bulkUploadProductsLoading } =  useSelector((state) => state.product);
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadResult, setUploadResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Check if file is Excel
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ]
      
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid Excel file (.xlsx, .xls)')
        setSelectedFile(null)
        return
      }
      
      setSelectedFile(file)
      setError('')
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    try {
      const result = await dispatch(bulkUploadProducts(selectedFile)).unwrap();
      dispatch(fetchProducts(1));
      setUploadResult(result)
      setError('')
      AppToast.showSuccess('Bulk upload completed successfully!')
    } catch (err) {
      const errorMsg = err?.message || 'Upload failed. Please try again.'
      setError(errorMsg)
      setUploadResult(null)
      AppToast.showError(errorMsg)
    }
  }

  const handleDownload = useCallback(() => {
    if (!uploadResult?.excelBase64) return

    try {
      const { excelBase64, fileName, mimeType } = uploadResult
      
      // Convert base64 to blob
      const byteCharacters = atob(excelBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })

      // Create download link
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      
      AppToast.showSuccess('Report downloaded successfully!')
    } catch (err) {
      console.error('Download failed:', err)
      setError('Failed to download report')
      AppToast.showError('Failed to download report')
    }
  }, [uploadResult])

  const handleClose = () => {
    setSelectedFile(null)
    setUploadResult(null)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaUpload className="text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Bulk Upload Products
              </h2>
              <p className="text-sm text-gray-500">
                Upload Excel file to add multiple products at once
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* File Upload Section */}
          {!uploadResult && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept=".xlsx, .xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                    <FaFileExcel className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {selectedFile ? selectedFile.name : 'Choose Excel File'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedFile 
                        ? 'Click to change file' 
                        : 'Select .xlsx or .xls file'
                      }
                    </p>
                  </div>
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                  <FaTimesCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Upload Button */}
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  disabled={bulkUploadProductsLoading}
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {bulkUploadProductsLoading ? (
                    <>
                      <Spinner size={20} color="#ffffff" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload className="w-4 h-4" />
                      Upload File
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Results Section */}
          {uploadResult && (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-center gap-3 text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                <FaCheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{uploadResult.message}</p>
                  <p className="text-sm text-green-500 mt-1">
                    File: {uploadResult.fileName}
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {uploadResult.counts?.created || 0}
                  </div>
                  <div className="text-sm text-blue-500 mt-1">Created</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {uploadResult.counts?.duplicates || 0}
                  </div>
                  <div className="text-sm text-yellow-500 mt-1">Duplicates</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {uploadResult.counts?.failed || 0}
                  </div>
                  <div className="text-sm text-red-500 mt-1">Failed</div>
                </div>
              </div>

              {/* Download Report */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaFileExcel className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-700">
                        Download Detailed Report
                      </p>
                      <p className="text-sm text-gray-500">
                        Contains upload results and error details
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaDownload className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setUploadResult(null)
                    setError('')
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {!uploadResult && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <FaExclamationTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p>
                Make sure your Excel file follows the required format. Download the template for reference.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulkUploadModel