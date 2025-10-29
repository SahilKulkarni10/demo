import React, { useState, useEffect, useRef } from "react"
import { useQuery } from "react-query"
import ScreenshotQueue from "../components/Queue/ScreenshotQueue"
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastVariant,
  ToastMessage
} from "../components/ui/toast"
import QueueCommands from "../components/Queue/QueueCommands"

interface QueueProps {
  setView: React.Dispatch<React.SetStateAction<"queue" | "solutions" | "debug">>
}

const Queue: React.FC<QueueProps> = ({ setView }) => {
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<ToastMessage>({
    title: "",
    description: "",
    variant: "neutral"
  })

  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [tooltipHeight, setTooltipHeight] = useState(0)
  const [extractingIndex, setExtractingIndex] = useState<number | undefined>(undefined)
  const [extractedText, setExtractedText] = useState<string>("")
  const [showExtractedText, setShowExtractedText] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const { data: screenshots = [], refetch } = useQuery<Array<{ path: string; preview: string }>, Error>(
    ["screenshots"],
    async () => {
      try {
        const existing = await window.electronAPI.getScreenshots()
        return existing
      } catch (error) {
        console.error("Error loading screenshots:", error)
        showToast("Error", "Failed to load existing screenshots", "error")
        return []
      }
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: true,
      refetchOnMount: true
    }
  )

  const showToast = (
    title: string,
    description: string,
    variant: ToastVariant
  ) => {
    setToastMessage({ title, description, variant })
    setToastOpen(true)
  }

  const handleDeleteScreenshot = async (index: number) => {
    const screenshotToDelete = screenshots[index]

    try {
      const response = await window.electronAPI.deleteScreenshot(
        screenshotToDelete.path
      )

      if (response.success) {
        refetch()
      } else {
        console.error("Failed to delete screenshot:", response.error)
        showToast("Error", "Failed to delete the screenshot file", "error")
      }
    } catch (error) {
      console.error("Error deleting screenshot:", error)
    }
  }

  const handleExtractText = async (screenshot: { path: string; preview: string }) => {
    const screenshotIndex = screenshots.findIndex(s => s.path === screenshot.path)
    
    try {
      setExtractingIndex(screenshotIndex)
      const result = await window.electronAPI.analyzeImageFile(screenshot.path)
      setExtractedText(result.text)
      setShowExtractedText(true)
      showToast(
        "Text Extracted",
        "Successfully extracted text from screenshot",
        "success"
      )
    } catch (error) {
      console.error("Error extracting text:", error)
      showToast(
        "Extraction Failed", 
        "Failed to extract text from screenshot",
        "error"
      )
    } finally {
      setExtractingIndex(undefined)
    }
  }

  useEffect(() => {
    const updateDimensions = () => {
      if (contentRef.current) {
        let contentHeight = contentRef.current.scrollHeight
        const contentWidth = contentRef.current.scrollWidth
        if (isTooltipVisible) {
          contentHeight += tooltipHeight
        }
        window.electronAPI.updateContentDimensions({
          width: contentWidth,
          height: contentHeight
        })
      }
    }

    const resizeObserver = new ResizeObserver(updateDimensions)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }
    updateDimensions()

    const cleanupFunctions = [
      window.electronAPI.onScreenshotTaken(() => refetch()),
      window.electronAPI.onResetView(() => refetch()),
      window.electronAPI.onSolutionError((error: string) => {
        showToast(
          "Processing Failed",
          "There was an error processing your screenshots.",
          "error"
        )
        setView("queue")
        console.error("Processing error:", error)
      }),
      window.electronAPI.onProcessingNoScreenshots(() => {
        showToast(
          "No Screenshots",
          "There are no screenshots to process.",
          "neutral"
        )
      })
    ]

    return () => {
      resizeObserver.disconnect()
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [isTooltipVisible, tooltipHeight])

  const handleTooltipVisibilityChange = (visible: boolean, height: number) => {
    setIsTooltipVisible(visible)
    setTooltipHeight(height)
  }

  return (
    <div ref={contentRef} className={`bg-transparent w-1/2`}>
      <div className="queue-transparent">
        <div className="px-4 py-3">
          <Toast
            open={toastOpen}
            onOpenChange={setToastOpen}
            variant={toastMessage.variant}
            duration={3000}
          >
            <ToastTitle>{toastMessage.title}</ToastTitle>
            <ToastDescription>{toastMessage.description}</ToastDescription>
          </Toast>

          <div className="space-y-3 w-fit">
            <ScreenshotQueue
              isLoading={false}
              screenshots={screenshots}
              onDeleteScreenshot={handleDeleteScreenshot}
              onExtractText={handleExtractText}
              extractingIndex={extractingIndex}
            />

            {/* Extracted Text Display */}
            {showExtractedText && extractedText && (
              <div className="bg-black/80 backdrop-blur-md rounded-lg border border-white/20 text-white p-4 max-w-2xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-white">Extracted Text</h3>
                  <button
                    onClick={() => setShowExtractedText(false)}
                    className="text-white/70 hover:text-white transition-colors"
                    aria-label="Close extracted text"
                  >
                    ×
                  </button>
                </div>
                <div className="bg-gray-900/50 border border-gray-600 rounded p-3 text-xs leading-relaxed max-h-40 overflow-y-auto">
                  {extractedText}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(extractedText)
                      showToast("Copied", "Text copied to clipboard", "success")
                    }}
                    className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Copy Text
                  </button>
                  <button
                    onClick={() => setShowExtractedText(false)}
                    className="bg-gray-600/80 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <QueueCommands
              screenshots={screenshots}
              onTooltipVisibilityChange={handleTooltipVisibilityChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Queue
