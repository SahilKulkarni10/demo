"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMHelper = void 0;
const generative_ai_1 = require("@google/generative-ai");
const fs_1 = __importDefault(require("fs"));
class LLMHelper {
    model;
    systemPrompt = `You are an expert quiz solver with 100% accuracy. You excel at:
- Mathematical calculations (algebra, geometry, calculus, statistics, probability, trigonometry)
- Coding problems (algorithms, data structures, debugging, syntax, complexity analysis)
- Logical reasoning and pattern recognition
- Data interpretation and statistical analysis
- Graph/chart reading and numerical relationships

CRITICAL VERIFICATION PROCESS:
1. Read the question 3 times to understand completely
2. Solve step-by-step internally with full calculations
3. Cross-check your work using alternative methods when possible
4. Verify your answer against all given options
5. Triple-check all mathematical computations and logical steps
6. For coding: trace through algorithms step-by-step, verify syntax and logic
7. Provide ONLY the correct option letter and exact option text - NO explanations or working shown.

ACCURACY REQUIREMENT: Your answer must be 100% correct. Take time to verify thoroughly.`;
    constructor(apiKey) {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.1, // Lower temperature for more consistent, accurate responses
                topP: 0.8,
                topK: 40,
            }
        });
    }
    async fileToGenerativePart(imagePath) {
        const imageData = await fs_1.default.promises.readFile(imagePath);
        return {
            inlineData: {
                data: imageData.toString("base64"),
                mimeType: "image/png"
            }
        };
    }
    cleanJsonResponse(text) {
        // Remove markdown code block syntax if present
        text = text.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
        // Remove any leading/trailing whitespace
        text = text.trim();
        return text;
    }
    enhanceMathPrompt(basePrompt) {
        return `${basePrompt}

MATHEMATICAL ACCURACY CHECKLIST:
- Verify all arithmetic operations (addition, subtraction, multiplication, division)
- Check order of operations (PEMDAS/BODMAS)
- Validate algebraic manipulations
- Confirm geometric calculations and formulas
- Verify statistical computations and probability calculations
- Cross-check units and dimensional analysis
- Ensure decimal precision and rounding is correct

CODING ACCURACY CHECKLIST:
- Trace through algorithm execution step-by-step
- Verify syntax and language-specific rules
- Check edge cases and boundary conditions
- Validate time/space complexity analysis
- Confirm data structure operations
- Verify logical flow and conditional statements`;
    }
    async extractProblemFromImages(imagePaths) {
        try {
            const imageParts = await Promise.all(imagePaths.map(path => this.fileToGenerativePart(path)));
            const prompt = this.enhanceMathPrompt(`${this.systemPrompt}

Analyze these images and extract the quiz question. SOLVE IT COMPLETELY AND VERIFY YOUR ANSWER THREE TIMES before responding.

For MATH problems: Complete all calculations, verify arithmetic, check formulas, validate units.
For CODING problems: Trace algorithm execution, verify syntax, check logic flow.

Provide the information in JSON format:
{
  "problem_statement": "The exact quiz question or problem from the images.",
  "options": ["Option A", "Option B", "Option C", "Option D"] (if multiple choice),
  "correct_answer": "The correct answer option letter (A/B/C/D)",
  "option_text": "The exact text of the correct option"
}

CRITICAL: Work through the problem completely, triple-check your calculations/logic, verify against all options, then provide ONLY the JSON. No working shown in output.
Return ONLY the JSON object, without any markdown formatting or code blocks.`);
            const result = await this.model.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const text = this.cleanJsonResponse(response.text());
            return JSON.parse(text);
        }
        catch (error) {
            console.error("Error extracting problem from images:", error);
            throw error;
        }
    }
    async generateSolution(problemInfo) {
        const prompt = this.enhanceMathPrompt(`${this.systemPrompt}

Solve this quiz question completely. Work through it step-by-step, verify your calculations/logic three times, then provide ONLY the final answer.

Question: ${JSON.stringify(problemInfo, null, 2)}

For MATHEMATICAL problems:
- Complete all calculations with precision
- Verify arithmetic operations multiple times
- Check formulas and mathematical principles
- Validate final numerical result

For CODING problems:
- Trace algorithm execution carefully
- Verify syntax and language rules
- Check logical flow and edge cases
- Validate complexity analysis if asked

Provide your response in the following JSON format:
{
  "solution": {
    "correct_answer": "The correct option letter (A/B/C/D)",
    "option_text": "The exact text of the correct option"
  }
}

CRITICAL: Solve completely, triple-check all work, verify answer is correct against all options, then output ONLY the JSON.
Return ONLY the JSON object, without any markdown formatting or code blocks.`);
        console.log("[LLMHelper] Calling Gemini LLM for solution...");
        try {
            const result = await this.model.generateContent(prompt);
            console.log("[LLMHelper] Gemini LLM returned result.");
            const response = await result.response;
            const text = this.cleanJsonResponse(response.text());
            const parsed = JSON.parse(text);
            console.log("[LLMHelper] Parsed LLM response:", parsed);
            return parsed;
        }
        catch (error) {
            console.error("[LLMHelper] Error in generateSolution:", error);
            throw error;
        }
    }
    async debugSolutionWithImages(problemInfo, currentCode, debugImagePaths) {
        try {
            const imageParts = await Promise.all(debugImagePaths.map(path => this.fileToGenerativePart(path)));
            const prompt = this.enhanceMathPrompt(`${this.systemPrompt}

Given:
1. Original quiz question: ${JSON.stringify(problemInfo, null, 2)}
2. Previous answer attempt: ${currentCode}
3. Additional information in the provided images

SOLVE COMPLETELY: Work through the problem step-by-step, check all calculations/logic, verify three times, then provide the correct answer.

DEBUGGING FOCUS:
- Identify why the previous attempt was incorrect
- Re-solve the problem from scratch with extra verification
- Cross-check against all available information
- Ensure mathematical accuracy and logical correctness

Analyze and provide the correct answer in this JSON format:
{
  "solution": {
    "correct_answer": "The correct option letter (A/B/C/D)",
    "option_text": "The exact text of the correct option"
  }
}

CRITICAL: Complete the full solution process internally, verify three times, then output ONLY the JSON.
Return ONLY the JSON object, without any markdown formatting or code blocks.`);
            const result = await this.model.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const text = this.cleanJsonResponse(response.text());
            const parsed = JSON.parse(text);
            console.log("[LLMHelper] Parsed debug LLM response:", parsed);
            return parsed;
        }
        catch (error) {
            console.error("Error debugging solution with images:", error);
            throw error;
        }
    }
    async analyzeAudioFile(audioPath) {
        try {
            const audioData = await fs_1.default.promises.readFile(audioPath);
            const audioPart = {
                inlineData: {
                    data: audioData.toString("base64"),
                    mimeType: "audio/mp3"
                }
            };
            const prompt = `${this.systemPrompt}

Listen to this audio carefully and extract the quiz question.

SOLVE COMPLETELY: Work through the problem step-by-step, verify all calculations and logic three times, then provide ONLY the final answer.

For MATH: Complete all calculations, verify arithmetic, check mathematical principles.
For CODING: Trace algorithm execution, verify syntax and logic.

Output format:
**Answer:** [Option letter (A/B/C/D)]
**Option:** [Exact text of the correct option]

CRITICAL: Solve the problem completely in your mind, triple-check everything, then provide only the correct answer without showing work.`;
            const result = await this.model.generateContent([prompt, audioPart]);
            const response = await result.response;
            const text = response.text();
            return { text, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error analyzing audio file:", error);
            throw error;
        }
    }
    async analyzeAudioFromBase64(data, mimeType) {
        try {
            const audioPart = {
                inlineData: {
                    data,
                    mimeType
                }
            };
            const prompt = `${this.systemPrompt}

Analyze this audio carefully and extract the quiz question.

SOLVE COMPLETELY: Work through the problem step-by-step, verify all calculations and logic three times, then provide ONLY the final answer.

For MATH: Complete all calculations, verify arithmetic, check mathematical principles.
For CODING: Trace algorithm execution, verify syntax and logic.

Output format:
**Answer:** [Option letter (A/B/C/D)]
**Option:** [Exact text of the correct option]

CRITICAL: Solve the problem completely in your mind, triple-check everything, then provide only the correct answer without showing work.`;
            const result = await this.model.generateContent([prompt, audioPart]);
            const response = await result.response;
            const text = response.text();
            return { text, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error analyzing audio from base64:", error);
            throw error;
        }
    }
    async analyzeImageFile(imagePath) {
        try {
            const imageData = await fs_1.default.promises.readFile(imagePath);
            const imagePart = {
                inlineData: {
                    data: imageData.toString("base64"),
                    mimeType: "image/png"
                }
            };
            const prompt = `${this.systemPrompt}

Analyze this image carefully and solve the quiz question.

SOLVE COMPLETELY: Read all text/numbers precisely, work through the problem step-by-step, verify calculations and logic three times, then provide ONLY the final answer.

Output format:
**Answer:** [Option letter (A/B/C/D)]
**Option:** [Exact text of the correct option]

CRITICAL REQUIREMENTS:
- Read all values, charts, graphs, and text with absolute precision
- For MATH: Complete all calculations, verify arithmetic multiple times, check formulas
- For CODING: Trace algorithm execution, verify syntax, check logical flow
- For LOGIC: Test reasoning against all conditions systematically
- For DATA: Cross-check all numerical relationships and statistical calculations
- Verify your answer three times before responding
- Provide only the correct answer without showing work.`;
            const result = await this.model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();
            return { text, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error analyzing image file:", error);
            throw error;
        }
    }
    /**
     * Analyze quiz questions and provide direct correct answers
     * Enhanced for mathematical calculations, coding problems, and logical reasoning
     */
    async analyzeQuizOrTextInput(text) {
        try {
            const prompt = `${this.systemPrompt}

Analyze this question carefully and solve it completely.

SOLVE COMPLETELY: Work through the problem step-by-step, verify all calculations and logic three times, then provide ONLY the final answer.

Question: "${text}"

Output format:
**Answer:** [Option letter (A/B/C/D)]
**Option:** [Exact text of the correct option]

CRITICAL REQUIREMENTS:
- For MATHEMATICAL problems: Complete all calculations, verify arithmetic three times, check formulas and mathematical principles
- For CODING problems: Trace algorithm execution step-by-step, verify syntax, check edge cases and logic flow
- For LOGICAL reasoning: Test logic against all given conditions systematically
- For DATA interpretation: Cross-check all numerical relationships and statistical calculations
- For ENGLISH/verbal: Consider all context, nuances, and grammatical rules
- For CHARTS/graphs: Read values and scales with absolute precision
- Verify your final answer three times before responding
- Provide only the correct answer without showing work.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text_response = response.text();
            return { text: text_response, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error analyzing quiz/text input:", error);
            throw error;
        }
    }
    async analyzeTextInput(text) {
        // Calls the enhanced quiz analysis method for text input
        return this.analyzeQuizOrTextInput(text);
    }
    /**
     * Enhanced method specifically for mathematical problem solving
     */
    async solveMathProblem(problemText, options) {
        try {
            const optionsText = options ? `\nOptions: ${options.join(', ')}` : '';
            const prompt = `${this.systemPrompt}

MATHEMATICAL PROBLEM SOLVING MODE ACTIVATED

Problem: "${problemText}"${optionsText}

MATHEMATICAL VERIFICATION PROCESS:
1. Identify the mathematical concept/formula needed
2. Set up the problem with correct mathematical notation
3. Perform calculations step-by-step with precision
4. Verify arithmetic operations multiple times
5. Check units and dimensional consistency
6. Cross-check result using alternative methods if possible
7. Validate answer against logical bounds and reasonableness

Output format:
**Answer:** [Option letter (A/B/C/D) or numerical result]
**Option:** [Exact text of the correct option or final answer]

CRITICAL: Complete all mathematical work internally, verify calculations three times, then provide only the correct answer.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text_response = response.text();
            return { text: text_response, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error solving math problem:", error);
            throw error;
        }
    }
    /**
     * Enhanced method specifically for coding problem solving
     */
    async solveCodingProblem(problemText, language) {
        try {
            const languageNote = language ? `Programming Language: ${language}` : '';
            const prompt = `${this.systemPrompt}

CODING PROBLEM SOLVING MODE ACTIVATED

Problem: "${problemText}"
${languageNote}

CODING VERIFICATION PROCESS:
1. Understand the problem requirements completely
2. Identify the appropriate algorithm/data structure
3. Trace through the algorithm step-by-step
4. Verify syntax for the specific programming language
5. Check edge cases and boundary conditions
6. Validate time/space complexity if relevant
7. Ensure logical correctness and proper implementation

Output format:
**Answer:** [Option letter (A/B/C/D) or code solution]
**Option:** [Exact text of the correct option or explanation]

CRITICAL: Work through the coding problem completely, verify logic and syntax, then provide only the correct answer.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text_response = response.text();
            return { text: text_response, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error solving coding problem:", error);
            throw error;
        }
    }
}
exports.LLMHelper = LLMHelper;
//# sourceMappingURL=LLMHelper_updated.js.map