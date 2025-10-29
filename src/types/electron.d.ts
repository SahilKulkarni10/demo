export interface ElectronAPI {
  updateContentDimensions: (dimensions: {
    width: number
    height: number
  }) => Promise<void>
  getScreenshots: () => Promise<Array<{ path: string; preview: string }>>
  deleteScreenshot: (path: string) => Promise<{ success: boolean; error?: string }>
  onScreenshotTaken: (callback: (data: { path: string; preview: string }) => void) => () => void
  onSolutionsReady: (callback: (solutions: string) => void) => () => void
  onResetView: (callback: () => void) => () => void
  onSolutionStart: (callback: () => void) => () => void
  onDebugStart: (callback: () => void) => () => void
  onDebugSuccess: (callback: (data: any) => void) => () => void
  onSolutionError: (callback: (error: string) => void) => () => void
  onProcessingNoScreenshots: (callback: () => void) => () => void
  onProblemExtracted: (callback: (data: any) => void) => () => void
  onSolutionSuccess: (callback: (data: any) => void) => () => void
  onUnauthorized: (callback: () => void) => () => void
  onDebugError: (callback: (error: string) => void) => () => void
  takeScreenshot: () => Promise<void>
  moveWindowLeft: () => Promise<void>
  moveWindowRight: () => Promise<void>
  analyzeAudioFromBase64: (data: string, mimeType: string) => Promise<{ text: string; answer?: string; timestamp: number }>
  analyzeAudioFile: (path: string) => Promise<{ text: string; timestamp: number }>
  analyzeImageFile: (path: string) => Promise<{ text: string; timestamp: number }>
  analyzeTextInput: (text: string, language?: string) => Promise<{ text: string; timestamp: number }>
  solveCodingProblem: (problemDescription: string, language?: string) => Promise<{ solution: string; timestamp: number }>
  optimizeCode: (code: string, language?: string, requirements?: string) => Promise<{ solution: string; timestamp: number }>
  debugCode: (code: string, language?: string, errorDescription?: string) => Promise<{ solution: string; timestamp: number }>
  formatCode: (code: string, language?: string) => Promise<{ solution: string; timestamp: number }>
  answerQuestion: (question: string) => Promise<{ answer: string; timestamp: number }>
  answerInterviewQuestion: (question: string) => Promise<{ answer: string; timestamp: number }>
  quitApp: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
} 