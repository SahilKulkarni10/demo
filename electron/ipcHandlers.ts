// ipcHandlers.ts

import { ipcMain, app } from "electron"
import { AppState } from "./main"

export function initializeIpcHandlers(appState: AppState): void {
  ipcMain.handle(
    "update-content-dimensions",
    async (event, { width, height }: { width: number; height: number }) => {
      if (width && height) {
        appState.setWindowDimensions(width, height)
      }
    }
  )

  ipcMain.handle("delete-screenshot", async (event, path: string) => {
    return appState.deleteScreenshot(path)
  })

  ipcMain.handle("take-screenshot", async () => {
    try {
      const screenshotPath = await appState.takeScreenshot()
      const preview = await appState.getImagePreview(screenshotPath)
      return { path: screenshotPath, preview }
    } catch (error) {
      console.error("Error taking screenshot:", error)
      throw error
    }
  })

  ipcMain.handle("get-screenshots", async () => {
    console.log({ view: appState.getView() })
    try {
      let previews = []
      if (appState.getView() === "queue") {
        previews = await Promise.all(
          appState.getScreenshotQueue().map(async (path) => ({
            path,
            preview: await appState.getImagePreview(path)
          }))
        )
      } else {
        previews = await Promise.all(
          appState.getExtraScreenshotQueue().map(async (path) => ({
            path,
            preview: await appState.getImagePreview(path)
          }))
        )
      }
      previews.forEach((preview: any) => console.log(preview.path))
      return previews
    } catch (error) {
      console.error("Error getting screenshots:", error)
      throw error
    }
  })

  ipcMain.handle("toggle-window", async () => {
    appState.toggleMainWindow()
  })

  ipcMain.handle("reset-queues", async () => {
    try {
      appState.clearQueues()
      console.log("Screenshot queues have been cleared.")
      return { success: true }
    } catch (error: any) {
      console.error("Error resetting queues:", error)
      return { success: false, error: error.message }
    }
  })

  // IPC handler for analyzing audio from base64 data
  ipcMain.handle("analyze-audio-base64", async (event, data: string, mimeType: string) => {
    try {
      const result = await appState.processingHelper.processAudioBase64(data, mimeType)
      return result
    } catch (error: any) {
      console.error("Error in analyze-audio-base64 handler:", error)
      throw error
    }
  })

  // IPC handler for analyzing audio from file path
  ipcMain.handle("analyze-audio-file", async (event, path: string) => {
    try {
      const result = await appState.processingHelper.processAudioFile(path)
      return result
    } catch (error: any) {
      console.error("Error in analyze-audio-file handler:", error)
      throw error
    }
  })

  // IPC handler for analyzing image from file path
  ipcMain.handle("analyze-image-file", async (event, path: string) => {
    try {
      const result = await appState.processingHelper.getLLMHelper().analyzeImageFile(path)
      return result
    } catch (error: any) {
      console.error("Error in analyze-image-file handler:", error)
      throw error
    }
  })

  // IPC handler for analyzing text input
  ipcMain.handle("analyze-text-input", async (event, text: string, language: string = "cpp") => {
    try {
      const result = await appState.processingHelper.processTextInput(text, language)
      return result
    } catch (error: any) {
      console.error("Error in analyze-text-input handler:", error)
      throw error
    }
  })

  // IPC handler for solving coding problems
  ipcMain.handle("solve-coding-problem", async (event, problemDescription: string, language: string = "cpp") => {
    try {
      const result = await appState.processingHelper.getLLMHelper().solveCodingProblem(problemDescription, language)
      return result
    } catch (error: any) {
      console.error("Error in solve-coding-problem handler:", error)
      throw error
    }
  })

  // IPC handler for optimizing code
  ipcMain.handle("optimize-code", async (event, code: string, language: string = "cpp", requirements?: string) => {
    try {
      const result = await appState.processingHelper.getLLMHelper().optimizeCode(code, language, requirements)
      return result
    } catch (error: any) {
      console.error("Error in optimize-code handler:", error)
      throw error
    }
  })

  // IPC handler for debugging code
  ipcMain.handle("debug-code", async (event, code: string, language: string = "cpp", errorDescription?: string) => {
    try {
      const result = await appState.processingHelper.getLLMHelper().debugCode(code, language, errorDescription)
      return result
    } catch (error: any) {
      console.error("Error in debug-code handler:", error)
      throw error
    }
  })

  // IPC handler for formatting code
  ipcMain.handle("format-code", async (event, code: string, language: string = "cpp") => {
    try {
      const result = await appState.processingHelper.getLLMHelper().formatCode(code, language)
      return result
    } catch (error: any) {
      console.error("Error in format-code handler:", error)
      throw error
    }
  })

  ipcMain.handle("answer-question", async (event, question: string) => {
    try {
      const result = await appState.processingHelper.getLLMHelper().answerQuestion(question);
      return result;
    } catch (error) {
      console.error("Error answering question:", error);
      throw error;
    }
  });

  // IPC handler for interview question answering
  ipcMain.handle("answer-interview-question", async (event, question: string) => {
    try {
      const result = await appState.processingHelper.getLLMHelper().answerInterviewQuestion(question);
      return result;
    } catch (error: any) {
      console.error("Error answering interview question:", error);
      throw error;
    }
  })

  ipcMain.handle("quit-app", () => {
    app.quit()
  })
}
