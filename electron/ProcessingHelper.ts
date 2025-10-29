// ProcessingHelper.ts

import { AppState } from "./main"
import { LLMHelper } from "./LLMHelper"
import dotenv from "dotenv"

dotenv.config()

const isDev = process.env.NODE_ENV === "development"
const isDevTest = process.env.IS_DEV_TEST === "true"
const MOCK_API_WAIT_TIME = Number(process.env.MOCK_API_WAIT_TIME) || 500

export class ProcessingHelper {
  private appState: AppState
  private llmHelper: LLMHelper
  private currentProcessingAbortController: AbortController | null = null
  private currentExtraProcessingAbortController: AbortController | null = null

  constructor(appState: AppState) {
    this.appState = appState
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not found in environment variables")
    }
    this.llmHelper = new LLMHelper(apiKey)
  }

  public async processScreenshots(): Promise<void> {
    const mainWindow = this.appState.getMainWindow()
    if (!mainWindow) return

    const view = this.appState.getView()

    if (view === "queue") {
      const screenshotQueue = this.appState.getScreenshotHelper().getScreenshotQueue()
      if (screenshotQueue.length === 0) {
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.NO_SCREENSHOTS)
        return
      }

      // Check if last screenshot is an audio file  
      const allPaths = this.appState.getScreenshotHelper().getScreenshotQueue();
      const lastPath = allPaths[allPaths.length - 1];
      if (lastPath.endsWith('.mp3') || lastPath.endsWith('.wav')) {
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_START);
        this.appState.setView('solutions');
        try {
          // First analyze the audio to extract problem text
          const audioResult = await this.llmHelper.analyzeAudioFile(lastPath, "auto");
          
          // Detect the appropriate programming language
          const detectedLanguage = await this.llmHelper.detectLanguage(audioResult.text);
          console.log(`[ProcessingHelper] Detected language for audio: ${detectedLanguage}`);
          
          const problemInfo = {
            problem_statement: audioResult.text, 
            input_format: { description: "Audio coding problem", parameters: [] as any[] }, 
            output_format: { description: "Code solution", type: "code", subtype: detectedLanguage }, 
            constraints: [] as any[], 
            test_cases: [] as any[],
            validation_type: "manual",
            difficulty: "custom"
          };
          mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.PROBLEM_EXTRACTED, problemInfo);
          this.appState.setProblemInfo(problemInfo);

          // Automatically generate a solution for the coding problem from audio
          try {
            const solutionResult = await this.llmHelper.solveCodingProblem(audioResult.text, detectedLanguage);
            
            // Automatically format the generated code for clean output
            let finalCode = solutionResult.solution;
            try {
              console.log(`[ProcessingHelper] Auto-formatting audio-generated ${detectedLanguage} code...`);
              const formatResult = await this.llmHelper.formatCode(solutionResult.solution, detectedLanguage);
              finalCode = formatResult.solution;
              console.log("[ProcessingHelper] Audio code auto-formatting successful");
            } catch (formatError) {
              console.warn("[ProcessingHelper] Audio code formatting failed, using original:", formatError);
              // If formatting fails, we still use the original solution
            }
            
            // Convert the coding solution format to the expected frontend format
            const formattedSolution = {
              solution: {
                code: finalCode,
                thoughts: ["Audio problem analyzed", `${detectedLanguage.toUpperCase()} algorithm designed`, "Solution implemented", "Code auto-formatted"],
                time_complexity: "To be analyzed",
                space_complexity: "To be analyzed"
              }
            };
            
            mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.SOLUTION_SUCCESS, formattedSolution);
          } catch (solutionError: any) {
            console.error("Audio solution generation error:", solutionError);
            mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, solutionError.message);
          }
          
          return;
        } catch (err: any) {
          console.error('Audio processing error:', err);
          mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, err.message);
          return;
        }
      }

      // Handle coding problem from screenshot
      mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_START)
      this.appState.setView("solutions")
      this.currentProcessingAbortController = new AbortController()
      try {
        const imageResult = await this.llmHelper.analyzeImageFile(lastPath);
        
        // Detect the appropriate programming language
        const detectedLanguage = await this.llmHelper.detectLanguage(imageResult.text);
        console.log(`[ProcessingHelper] Detected language for screenshot: ${detectedLanguage}`);
        
        const problemInfo = {
          problem_statement: imageResult.text,
          input_format: { description: "Coding problem from screenshot", parameters: [] as any[] },
          output_format: { description: "Code solution", type: "code", subtype: detectedLanguage },
          complexity: { time: "To be analyzed", space: "To be analyzed" },
          test_cases: [] as any[],
          validation_type: "manual",
          difficulty: "custom"
        };
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.PROBLEM_EXTRACTED, problemInfo);
        this.appState.setProblemInfo(problemInfo);

        // Automatically generate a solution for the coding problem
        try {
          const solutionResult = await this.llmHelper.solveCodingProblem(imageResult.text, detectedLanguage);
          
          // Automatically format the generated code for clean output
          let finalCode = solutionResult.solution;
          try {
            console.log(`[ProcessingHelper] Auto-formatting screenshot-generated ${detectedLanguage} code...`);
            const formatResult = await this.llmHelper.formatCode(solutionResult.solution, detectedLanguage);
            finalCode = formatResult.solution;
            console.log("[ProcessingHelper] Screenshot code auto-formatting successful");
          } catch (formatError) {
            console.warn("[ProcessingHelper] Screenshot code formatting failed, using original:", formatError);
            // If formatting fails, we still use the original solution
          }
          
          // Convert the coding solution format to the expected frontend format
          const formattedSolution = {
            solution: {
              code: finalCode,
              thoughts: ["Problem analyzed", `${detectedLanguage.toUpperCase()} algorithm designed`, "Solution implemented", "Code auto-formatted"],
              time_complexity: "To be analyzed",
              space_complexity: "To be analyzed"
            }
          };
          
          mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.SOLUTION_SUCCESS, formattedSolution);
        } catch (solutionError: any) {
          console.error("Solution generation error:", solutionError);
          mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, solutionError.message);
        }
        
      } catch (error: any) {
        console.error("Image processing error:", error)
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, error.message)
      } finally {
        this.currentProcessingAbortController = null
      }
      return;
    } else {
      // Debug mode
      const extraScreenshotQueue = this.appState.getScreenshotHelper().getExtraScreenshotQueue()
      if (extraScreenshotQueue.length === 0) {
        console.log("No extra screenshots to process")
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.NO_SCREENSHOTS)
        return
      }

      mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.DEBUG_START)
      this.currentExtraProcessingAbortController = new AbortController()

      try {
        // Get problem info and current solution
        const problemInfo = this.appState.getProblemInfo()
        if (!problemInfo) {
          throw new Error("No problem info available")
        }

        // Use the detected language from the problem info, fallback to cpp
        const detectedLanguage = problemInfo.output_format?.subtype || "cpp";
        console.log(`[ProcessingHelper] Using language for debug: ${detectedLanguage}`);

        // Generate a solution for debugging by solving the coding problem
        const currentSolution = await this.llmHelper.solveCodingProblem(
          problemInfo.problem_statement, 
          detectedLanguage
        )
        const currentCode = currentSolution.solution

        // Debug the solution using vision model and image analysis
        const debugResult = await this.llmHelper.debugCode(
          currentCode,
          detectedLanguage,
          `Debug this solution using the provided images for additional context. Original problem: ${problemInfo.problem_statement}`
        )

        // Automatically format the debugged code for clean output
        let finalDebuggedCode = debugResult.solution;
        try {
          console.log(`[ProcessingHelper] Auto-formatting debugged ${detectedLanguage} code...`);
          const formatResult = await this.llmHelper.formatCode(debugResult.solution, detectedLanguage);
          finalDebuggedCode = formatResult.solution;
          console.log("[ProcessingHelper] Debug code auto-formatting successful");
        } catch (formatError) {
          console.warn("[ProcessingHelper] Debug code formatting failed, using original:", formatError);
          // If formatting fails, we still use the original solution
        }

        this.appState.setHasDebugged(true)
        mainWindow.webContents.send(
          this.appState.PROCESSING_EVENTS.DEBUG_SUCCESS,
          { solution: finalDebuggedCode }
        )

      } catch (error: any) {
        console.error("Debug processing error:", error)
        mainWindow.webContents.send(
          this.appState.PROCESSING_EVENTS.DEBUG_ERROR,
          error.message
        )
      } finally {
        this.currentExtraProcessingAbortController = null
      }
    }
  }

  public cancelOngoingRequests(): void {
    if (this.currentProcessingAbortController) {
      this.currentProcessingAbortController.abort()
      this.currentProcessingAbortController = null
    }

    if (this.currentExtraProcessingAbortController) {
      this.currentExtraProcessingAbortController.abort()
      this.currentExtraProcessingAbortController = null
    }

    this.appState.setHasDebugged(false)
  }

  public async processAudioBase64(data: string, mimeType: string, language: string = "auto") {
    // If language is auto, we'll let the LLMHelper handle it
    return this.llmHelper.analyzeAudioFromBase64(data, mimeType, language);
  }

  // Add audio file processing method
  public async processAudioFile(filePath: string, language: string = "auto") {
    return this.llmHelper.analyzeAudioFile(filePath, language);
  }

  public async processTextInput(text: string, language: string = "auto") {
    // If language is auto, detect it first
    if (language === "auto") {
      language = await this.llmHelper.detectLanguage(text);
      console.log(`[ProcessingHelper] Detected language for text input: ${language}`);
    }
    
    // Use LLMHelper to analyze and solve coding problems from text input
    return this.llmHelper.analyzeTextInput(text, language);
  }

  public async processCodeFormatting(code: string, language: string = "auto") {
    // If language is auto, detect it first
    if (language === "auto") {
      language = await this.llmHelper.detectLanguage(code);
      console.log(`[ProcessingHelper] Detected language for code formatting: ${language}`);
    }
    
    // Use LLMHelper to format and clean up poorly written code
    return this.llmHelper.formatCode(code, language);
  }

  public getLLMHelper() {
    return this.llmHelper;
  }
}
