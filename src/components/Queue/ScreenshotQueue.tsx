import React from "react"
import ScreenshotItem from "./ScreenshotItem"

interface Screenshot {
  path: string
  preview: string
}

interface ScreenshotQueueProps {
  isLoading: boolean
  screenshots: Screenshot[]
  onDeleteScreenshot: (index: number) => void
  onExtractText?: (screenshot: Screenshot) => void
  extractingIndex?: number
}

const ScreenshotQueue: React.FC<ScreenshotQueueProps> = ({
  isLoading,
  screenshots,
  onDeleteScreenshot,
  onExtractText,
  extractingIndex
}) => {
  if (screenshots.length === 0) {
    return <></>
  }

  const displayScreenshots = screenshots.slice(0, 5)

  return (
    <div className="grid grid-cols-5 gap-4">
      {displayScreenshots.map((screenshot, index) => (
        <ScreenshotItem
          key={screenshot.path}
          isLoading={isLoading}
          isExtracting={extractingIndex === index}
          screenshot={screenshot}
          index={index}
          onDelete={onDeleteScreenshot}
          onExtractText={onExtractText}
        />
      ))}
    </div>
  )
}

export default ScreenshotQueue
