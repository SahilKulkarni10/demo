import React, { useState, useEffect, useRef } from "react"
import { IoLogOutOutline } from "react-icons/io5"

interface QueueCommandsProps {
  onTooltipVisibilityChange: (visible: boolean, height: number) => void
  screenshots: Array<{ path: string; preview: string }>
}

const QueueCommands: React.FC<QueueCommandsProps> = ({
  onTooltipVisibilityChange,
  screenshots
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioResult, setAudioResult] = useState<string | null>(null)
  const [textInput, setTextInput] = useState<string>("")
  const [isTextInputVisible, setIsTextInputVisible] = useState(false)
  const [textResult, setTextResult] = useState<string | null>(null)
  const [codeInput, setCodeInput] = useState<string>("")
  const [isCodeFormatterVisible, setIsCodeFormatterVisible] = useState(false)
  const [formattedCodeResult, setFormattedCodeResult] = useState<string | null>(null)
  const chunks = useRef<Blob[]>([])

  // Question answering states
  const [questionInput, setQuestionInput] = useState<string>("")
  const [isQuestionInputVisible, setIsQuestionInputVisible] = useState(false)
  const [questionAnswer, setQuestionAnswer] = useState<string | null>(null)

  useEffect(() => {
    let tooltipHeight = 0
    if (tooltipRef.current && isTooltipVisible) {
      tooltipHeight = tooltipRef.current.offsetHeight + 10
    }
    onTooltipVisibilityChange(isTooltipVisible, tooltipHeight)
  }, [isTooltipVisible])

  const handleMouseEnter = () => {
    setIsTooltipVisible(true)
  }

  const handleMouseLeave = () => {
    setIsTooltipVisible(false)
  }

  const handleRecordClick = async () => {
    if (!isRecording) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        recorder.ondataavailable = (e) => chunks.current.push(e.data)
        recorder.onstop = async () => {
          const blob = new Blob(chunks.current, { type: chunks.current[0]?.type || 'audio/webm' })
          chunks.current = []
          const reader = new FileReader()
          reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1]
            try {
              // Use the updated method that returns both transcription and answer
              const result = await window.electronAPI.analyzeAudioFromBase64(base64Data, blob.type) as { text: string; answer?: string; timestamp: number }
              
              // The updated method now returns both text and answer
              if (result.answer) {
                setAudioResult(result.answer)
              } else {
                // Fallback: use interview question method with transcription
                const interviewAnswerResult = await window.electronAPI.answerInterviewQuestion(result.text)
                setAudioResult(interviewAnswerResult.answer)
              }
            } catch (err) {
              setAudioResult('Audio analysis failed.')
            }
          }
          reader.readAsDataURL(blob)
        }
        setMediaRecorder(recorder)
        recorder.start()
        setIsRecording(true)
      } catch (err) {
        setAudioResult('Could not start recording.')
      }
    } else {
      // Stop recording
      mediaRecorder?.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    
    try {
      const result = await window.electronAPI.answerInterviewQuestion(textInput);
      setTextResult(result.answer);
      setTextInput("");
      setIsTextInputVisible(false);
    } catch (err) {
      setTextResult('Text analysis failed.');
    }
  };

  const handleTextInputToggle = () => {
    setIsTextInputVisible(!isTextInputVisible);
    if (isTextInputVisible) {
      setTextInput("");
    }
  };

  const handleCodeFormatSubmit = async () => {
    if (!codeInput.trim()) return;
    
    try {
      // Use "auto" to automatically detect the programming language
      const result = await window.electronAPI.formatCode(codeInput, "auto");
      setFormattedCodeResult(result.solution);
      setCodeInput("");
      setIsCodeFormatterVisible(false);
    } catch (err) {
      setFormattedCodeResult('Code formatting failed.');
    }
  };

  const handleCodeFormatterToggle = () => {
    setIsCodeFormatterVisible(!isCodeFormatterVisible);
    if (isCodeFormatterVisible) {
      setCodeInput("");
    }
  };

  const handleQuestionSubmit = async () => {
    if (!questionInput.trim()) return;
    
    try {
      const result = await window.electronAPI.answerQuestion(questionInput);
      setQuestionAnswer(result.answer);
      setQuestionInput("");
      setIsQuestionInputVisible(false);
    } catch (err) {
      setQuestionAnswer('Failed to answer question. Please try again.');
    }
  };

  const handleQuestionInputToggle = () => {
    setIsQuestionInputVisible(!isQuestionInputVisible);
    if (isQuestionInputVisible) {
      setQuestionInput("");
    }
  };

  const handleQuestionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuestionSubmit();
    }
  };

  const handleCodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleCodeFormatSubmit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  return (
    <div className="pt-2 w-fit">
      <div className="text-xs text-white backdrop-blur-md bg-black/90 rounded-lg py-2 px-4 flex items-center justify-center gap-4 border border-white/20 command-bar-always-visible">
        {/* Show/Hide */}
        <div className="flex items-center gap-2 always-visible-button">
          <span className="text-[11px] leading-none text-white always-visible-text">Show/Hide</span>
          <div className="flex gap-1">
            <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white always-visible-button">
              ⌘
            </button>
            <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white always-visible-button">
              B
            </button>
          </div>
        </div>

        {/* Screenshot */}
        <div className="flex items-center gap-2 always-visible-button">
          <span className="text-[11px] leading-none truncate always-visible-text">
            {screenshots.length === 0 ? "Take first screenshot" : "Screenshot"}
          </span>
          <div className="flex gap-1">
            <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white always-visible-button">
              ⌘
            </button>
            <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white always-visible-button">
              H
            </button>
          </div>
        </div>

        {/* Solve Command - Always visible now */}
        <div className="flex items-center gap-2 always-visible-button">
          <span className="text-[11px] leading-none text-white always-visible-text">Solve</span>
          <div className="flex gap-1">
            <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white always-visible-button">
              ⌘
            </button>
            <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white always-visible-button">
              ↵
            </button>
          </div>
        </div>

        {/* Voice Recording Button */}
        <div className="flex items-center gap-2 always-visible-button">
          <button
            className={`bg-white/20 hover:bg-white/30 transition-colors rounded-md px-2 py-1 text-[11px] leading-none text-white flex items-center gap-1 always-visible-button ${isRecording ? 'bg-red-500/80 hover:bg-red-500' : ''}`}
            onClick={handleRecordClick}
            type="button"
          >
            {isRecording ? (
              <span className="animate-pulse always-visible-text">● Stop Recording</span>
            ) : (
              <span className="always-visible-text">🎤 Record Voice</span>
            )}
          </button>
        </div>

        {/* Text Input Button */}
        <div className="flex items-center gap-2 always-visible-button">
          <button
            className={`bg-white/20 hover:bg-white/30 transition-colors rounded-md px-2 py-1 text-[11px] leading-none text-white flex items-center gap-1 always-visible-button ${isTextInputVisible ? 'bg-blue-500/80 hover:bg-blue-500' : ''}`}
            onClick={handleTextInputToggle}
            type="button"
          >
            {isTextInputVisible ? (
              <span className="always-visible-text">📝 Close Text</span>
            ) : (
              <span className="always-visible-text">📝 Ask Question</span>
            )}
          </button>
        </div>

        {/* Code Formatter Button */}
        <div className="flex items-center gap-2 always-visible-button">
          <button
            className={`bg-white/20 hover:bg-white/30 transition-colors rounded-md px-2 py-1 text-[11px] leading-none text-white flex items-center gap-1 always-visible-button ${isCodeFormatterVisible ? 'bg-green-500/80 hover:bg-green-500' : ''}`}
            onClick={handleCodeFormatterToggle}
            type="button"
          >
            {isCodeFormatterVisible ? (
              <span className="always-visible-text">🔧 Close Formatter</span>
            ) : (
              <span className="always-visible-text">🔧 Format Code</span>
            )}
          </button>
        </div>

        {/* Question Answering Button */}
        <div className="flex items-center gap-2 always-visible-button">
          <button
            className={`bg-white/20 hover:bg-white/30 transition-colors rounded-md px-2 py-1 text-[11px] leading-none text-white flex items-center gap-1 always-visible-button ${isQuestionInputVisible ? 'bg-purple-500/80 hover:bg-purple-500' : ''}`}
            onClick={handleQuestionInputToggle}
            type="button"
          >
            {isQuestionInputVisible ? (
              <span className="always-visible-text">❓ Close Q&A</span>
            ) : (
              <span className="always-visible-text">❓ Ask SQL/Tech</span>
            )}
          </button>
        </div>

        {/* Question mark with tooltip */}
        <div
          className="relative inline-block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-6 h-6 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-sm transition-colors flex items-center justify-center cursor-help z-10">
            <span className="text-xs text-white font-bold">?</span>
          </div>

          {/* Tooltip Content */}
          {isTooltipVisible && (
            <div
              ref={tooltipRef}
              className="absolute top-full right-0 mt-2 w-80"
            >
              <div className="p-3 text-xs bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-white/90 shadow-lg">
                <div className="space-y-4">
                  <h3 className="font-medium truncate">Keyboard Shortcuts</h3>
                  <div className="space-y-3">
                    {/* Toggle Command */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Toggle Window</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            ⌘
                          </span>
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            B
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] leading-relaxed text-white/70 truncate">
                        Show or hide this window.
                      </p>
                    </div>
                    {/* Screenshot Command */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Take Screenshot</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            ⌘
                          </span>
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            H
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] leading-relaxed text-white/70 truncate">
                        Take a screenshot of the problem description. The tool
                        will extract and analyze the problem. The 5 latest
                        screenshots are saved.
                      </p>
                    </div>

                    {/* Solve Command */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Solve Problem</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            ⌘
                          </span>
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            ↵
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] leading-relaxed text-white/70 truncate">
                        Generate a solution based on the current problem.
                      </p>
                    </div>

                    {/* Voice Recording */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Voice Recording</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            🎤
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] leading-relaxed text-white/70 truncate">
                        Record interview questions to get professional, structured answers with technical depth and real-world examples.
                      </p>
                    </div>

                    {/* Text Input */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Text Input</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            📝
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] leading-relaxed text-white/70 truncate">
                        Type detailed interview questions for comprehensive answers with real-world examples and business impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="mx-2 h-4 w-px bg-white/40" />

        {/* Sign Out Button - Moved to end */}
        <button
          className="text-red-400 hover:text-red-300 transition-colors hover:cursor-pointer"
          title="Sign Out"
          onClick={() => window.electronAPI.quitApp()}
        >
          <IoLogOutOutline className="w-4 h-4" />
        </button>
      </div>
      
      {/* Text Input Field */}
      {isTextInputVisible && (
        <div className="mt-2 p-4 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 text-white text-xs max-w-2xl shadow-lg">
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-white">Interview Question:</label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a detailed interview question (e.g., 'Explain the four pillars of OOP with real-world examples' or 'How would you design a scalable microservices architecture?')..."
              className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded text-white text-xs placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500/50 leading-relaxed"
              rows={4}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="px-3 py-1 bg-blue-500/70 hover:bg-blue-500/90 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
              >
                Get Interview Answer
              </button>
              <button
                onClick={handleTextInputToggle}
                className="px-3 py-1 bg-gray-600/70 hover:bg-gray-600/90 text-white rounded text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Formatter Field */}
      {isCodeFormatterVisible && (
        <div className="mt-2 p-4 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 text-white text-xs max-w-4xl shadow-lg">
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-white">Code to Format (Any Language):</label>
            <textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={handleCodeKeyPress}
              placeholder="Paste your poorly formatted code here (supports C++, Python, JavaScript, Java, Go, Rust, and more)..."
              className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded text-white text-xs placeholder-gray-400 resize-none focus:outline-none focus:border-green-500/50 leading-relaxed font-mono"
              rows={8}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCodeFormatSubmit}
                disabled={!codeInput.trim()}
                className="px-3 py-1 bg-green-500/70 hover:bg-green-500/90 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
              >
                🔧 Auto-Format Code
              </button>
              <button
                onClick={handleCodeFormatterToggle}
                className="px-3 py-1 bg-gray-600/70 hover:bg-gray-600/90 text-white rounded text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
            <div className="text-xs text-gray-400">
              💡 Tip: Press Ctrl+Enter to format quickly • Automatically detects language
            </div>
          </div>
        </div>
      )}

      {/* Audio Interview Answer Display */}
      {audioResult && (
        <div className="mt-2 p-4 bg-black/80 backdrop-blur-md rounded-lg border border-indigo-500/20 text-white text-xs max-w-4xl shadow-lg">
          <span className="font-semibold text-indigo-400">🎯 Professional Interview Answer:</span>
          <div className="mt-3 text-gray-100 whitespace-pre-wrap leading-relaxed">{audioResult}</div>
        </div>
      )}

      {/* Formatted Code Result Display */}
      {formattedCodeResult && (
        <div className="mt-2 p-4 bg-black/80 backdrop-blur-md rounded-lg border border-green-500/20 text-white text-xs max-w-6xl shadow-lg">
          <span className="font-semibold text-green-400">🔧 Formatted Code:</span>
          <div className="mt-3 text-gray-100 leading-relaxed font-mono whitespace-pre-wrap bg-gray-900/50 p-3 rounded border border-gray-600 overflow-x-auto">
            {formattedCodeResult}
          </div>
        </div>
      )}

      {/* Interview Answer Display */}
      {textResult && (
        <div className="mt-2 p-4 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 text-white text-xs max-w-4xl shadow-lg">
          <span className="font-semibold text-white">💡 Interview Answer:</span>
          <div className="mt-3 text-gray-100 whitespace-pre-wrap leading-relaxed font-mono">{textResult}</div>
        </div>
      )}

      {/* Question Input Field */}
      {isQuestionInputVisible && (
        <div className="mt-2 p-4 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 text-white text-xs max-w-2xl shadow-lg">
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-white">SQL/Technical Question:</label>
            <textarea
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              onKeyDown={handleQuestionKeyPress}
              placeholder="Ask SQL queries or technical questions (e.g., 'SELECT customers with orders > $1000' or 'What is the difference between TCP and UDP?')..."
              className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded text-white text-xs placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500/50 leading-relaxed"
              rows={4}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleQuestionSubmit}
                disabled={!questionInput.trim()}
                className="px-3 py-1 bg-purple-500/70 hover:bg-purple-500/90 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
              >
                Get Answer
              </button>
              <button
                onClick={handleQuestionInputToggle}
                className="px-3 py-1 bg-gray-600/70 hover:bg-gray-600/90 text-white rounded text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Answer Display */}
      {questionAnswer && (
        <div className="mt-2 p-4 bg-black/80 backdrop-blur-md rounded-lg border border-purple-500/20 text-white text-xs max-w-4xl shadow-lg">
          <span className="font-semibold text-purple-400">❓ Answer:</span>
          <div className="mt-3 text-gray-100 whitespace-pre-wrap leading-relaxed">{questionAnswer}</div>
        </div>
      )}
    </div>
  )
}

export default QueueCommands
