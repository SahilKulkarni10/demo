// src/components/ScreenshotItem.tsx
import React, { useState } from "react"
import { X, FileText } from "lucide-react"

interface Screenshot {
  path: string
  preview: string
}

interface ScreenshotItemProps {
  screenshot: Screenshot
  onDelete: (index: number) => void
  onExtractText?: (screenshot: Screenshot) => void
  index: number
  isLoading: boolean
  isExtracting?: boolean
}

const ScreenshotItem: React.FC<ScreenshotItemProps> = ({
  screenshot,
  onDelete,
  onExtractText,
  index,
  isLoading,
  isExtracting = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleDelete = async () => {
    await onDelete(index)
  }

  const handleExtractText = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onExtractText && !isExtracting) {
      onExtractText(screenshot)
    }
  }

  return (
    <>
      <div
        className={`border border-white relative ${isLoading ? "" : "group"}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="w-full h-full relative">
          {(isLoading || isExtracting) && (
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isExtracting && (
                <div className="absolute bottom-2 left-0 right-0 text-center text-white text-[10px] leading-none">
                  Extracting...
                </div>
              )}
            </div>
          )}
          <img
            src={screenshot.preview}
            alt="Screenshot"
            className={`w-full h-full object-cover transition-transform duration-300 ${
              (isLoading || isExtracting)
                ? "opacity-50"
                : "cursor-pointer group-hover:scale-105 group-hover:brightness-75"
            }`}
          />
        </div>
        
        {/* Action buttons - only show when not loading */}
        {!isLoading && !isExtracting && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              className="absolute top-2 left-2 p-1 rounded-full bg-black bg-opacity-70 text-white hover:bg-opacity-90 transition-opacity duration-200"
              aria-label="Delete screenshot"
            >
              <X size={16} />
            </button>

            {/* Extract Text button */}
            {onExtractText && (
              <button
                onClick={handleExtractText}
                className="absolute top-2 right-2 p-1 rounded-full bg-blue-600 bg-opacity-70 text-white hover:bg-opacity-90 transition-opacity duration-200"
                aria-label="Extract text from screenshot"
              >
                <FileText size={16} />
              </button>
            )}

            {/* Bottom overlay with action hints */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <div className="flex justify-between items-center text-white text-[10px]">
                <span>Click to delete</span>
                {onExtractText && <span>Extract text</span>}
              </div>
            </div>
          </div>
        )}

        {/* Tooltip for additional context */}
        {showTooltip && !isLoading && !isExtracting && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20">
            {onExtractText ? "Delete or Extract Text" : "Click to Delete"}
          </div>
        )}
      </div>
    </>
  )
}

export default ScreenshotItem
