"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMHelper = void 0;
const generative_ai_1 = require("@google/generative-ai");
const fs_1 = __importDefault(require("fs"));
const PersonalProfile_1 = require("./PersonalProfile");
class LLMHelper {
    model;
    questionCache = new Map();
    cacheExpirationMs = 30 * 60 * 1000; // 30 minutes cache
    codingPrompt = `You are an expert coding problem solver with mastery in:
- Data Structures and Algorithms (DSA)
- Competitive Programming
- Software Engineering problems
- Code optimization and efficiency
- Multiple programming languages (C++, Java, Python, JavaScript, Go, Rust, etc.)

CRITICAL CODE FORMATTING REQUIREMENTS:
- Clean, readable code with proper spacing
- Language-appropriate indentation (4 spaces for C++/Java, 2 spaces for JavaScript, 4 spaces for Python, etc.)
- Clear variable and function names following language conventions
- Proper commenting where necessary
- Follow language-specific best practices
- Optimize for both readability and efficiency
- Use consistent bracket placement (K&R style for C++, appropriate for each language)
- Proper spacing around operators (=, +, -, etc.)
- Clean line breaks between logical sections
- No unnecessary blank lines or compressed code

LANGUAGE-SPECIFIC FORMATTING EXAMPLES:

C++ Example:
\`\`\`cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            
            numMap[nums[i]] = i;
        }
        
        return {};
    }
};
\`\`\`

Python Example:
\`\`\`python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        num_map = {}
        
        for i, num in enumerate(nums):
            complement = target - num
            
            if complement in num_map:
                return [num_map[complement], i]
            
            num_map[num] = i
        
        return []
\`\`\`

JavaScript Example:
\`\`\`javascript
function twoSum(nums, target) {
  const numMap = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    
    numMap.set(nums[i], i);
  }
  
  return [];
}
\`\`\`

TypeScript Example:
\`\`\`typescript
function twoSum(nums: number[], target: number): number[] {
  const numMap = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (numMap.has(complement)) {
      return [numMap.get(complement)!, i];
    }
    
    numMap.set(nums[i], i);
  }
  
  return [];
}
\`\`\`

React Example:
\`\`\`react
import React, { useState, useEffect } from 'react';

interface NumberListProps {
  numbers: number[];
  target: number;
}

const NumberList: React.FC<NumberListProps> = ({ numbers, target }) => {
  const [result, setResult] = useState<number[]>([]);
  
  useEffect(() => {
    const findTwoSum = () => {
      const numMap = new Map<number, number>();
      
      for (let i = 0; i < numbers.length; i++) {
        const complement = target - numbers[i];
        
        if (numMap.has(complement)) {
          setResult([numMap.get(complement)!, i]);
          return;
        }
        
        numMap.set(numbers[i], i);
      }
      
      setResult([]);
    };
    
    findTwoSum();
  }, [numbers, target]);
  
  return (
    <div className="number-list">
      <h3>Two Sum Result</h3>
      {result.length > 0 ? (
        <p>Indices: {result.join(', ')}</p>
      ) : (
        <p>No solution found</p>
      )}
    </div>
  );
};

export default NumberList;
\`\`\`

Java Example:
\`\`\`java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (numMap.containsKey(complement)) {
                return new int[]{numMap.get(complement), i};
            }
            
            numMap.put(nums[i], i);
        }
        
        return new int[]{};
    }
}
\`\`\`

SQL Example:
\`\`\`sql
-- Find students with unique major subjects
SELECT DISTINCT major 
FROM student 
WHERE major IS NOT NULL
ORDER BY major;

-- Complex query with joins and aggregation
SELECT s.major, COUNT(*) as student_count, AVG(g.gpa) as avg_gpa
FROM student s
JOIN grades g ON s.student_id = g.student_id
WHERE s.enrollment_status = 'ACTIVE'
GROUP BY s.major
HAVING COUNT(*) > 5
ORDER BY avg_gpa DESC;
\`\`\`

CSS Example:
\`\`\`css
.number-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.number-list h3 {
  color: #333;
  margin-bottom: 16px;
  font-size: 1.5rem;
  font-weight: 600;
}

.number-list p {
  background-color: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
  margin: 8px 0;
  font-size: 1rem;
}

.number-list .result-success {
  border-left-color: #28a745;
  background-color: #d4edda;
}

.number-list .result-error {
  border-left-color: #dc3545;
  background-color: #f8d7da;
}
\`\`\`

HTML Example:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Two Sum Calculator</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>Two Sum Problem Solver</h1>
    </header>
    
    <main class="main-content">
      <div class="input-section">
        <label for="numbers">Enter numbers (comma-separated):</label>
        <input type="text" id="numbers" placeholder="1,2,3,4,5">
        
        <label for="target">Target sum:</label>
        <input type="number" id="target" placeholder="9">
        
        <button onclick="calculateTwoSum()">Find Two Sum</button>
      </div>
      
      <div class="result-section">
        <h2>Result:</h2>
        <div id="result"></div>
      </div>
    </main>
  </div>
  
  <script src="script.js"></script>
</body>
</html>
\`\`\`

PROBLEM SOLVING APPROACH:
1. Understand the problem completely
2. Identify optimal algorithm and data structures
3. Consider time and space complexity
4. Write clean, well-formatted solution following the language-specific example above
5. Verify correctness with test cases

ALWAYS provide complete, working code solutions with formatting that matches the example quality for the specific language.`;
    constructor(apiKey) {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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
    /**
     * Helper method to determine if a question is about personal/professional background
     */
    isPersonalQuestion(text) {
        const personalKeywords = [
            'tell me about yourself', 'introduce yourself', 'about you', 'your background',
            'your experience', 'your skills', 'your projects', 'work experience',
            'previous job', 'current role', 'your education', 'your qualifications',
            'why should we hire you', 'strengths', 'weaknesses', 'career goals',
            'why this company', 'why this role', 'where do you see yourself',
            'biggest achievement', 'challenging project', 'your expertise'
        ];
        // Check for specific project names from personal profile
        const projectNames = PersonalProfile_1.personalProfile.projects.map(project => project.name.toLowerCase().replace(/[^\w\s]/g, ' ').trim());
        const lowerText = text.toLowerCase();
        // Check for personal keywords
        const hasPersonalKeywords = personalKeywords.some(keyword => lowerText.includes(keyword));
        // Check for specific project mentions
        const mentionsPersonalProject = projectNames.some(projectName => {
            // Split project name into words and check if multiple words match
            const projectWords = projectName.split(' ').filter(word => word.length > 2);
            return projectWords.some(word => lowerText.includes(word));
        });
        return hasPersonalKeywords || mentionsPersonalProject;
    }
    /**
     * Generate personalized responses for personal/background questions
     */
    generatePersonalResponse(question) {
        const lowerQuestion = question.toLowerCase();
        // Self introduction
        if (lowerQuestion.includes('tell me about yourself') || lowerQuestion.includes('introduce yourself')) {
            return `${PersonalProfile_1.PersonalProfileHelper.getIntroduction()} ${PersonalProfile_1.PersonalProfileHelper.getTechnicalSkillsSummary()} I'm passionate about building innovative software solutions and continuously learning new technologies.`;
        }
        // Experience questions
        if (lowerQuestion.includes('experience') || lowerQuestion.includes('work')) {
            return `I have ${PersonalProfile_1.personalProfile.experience.totalYears}+ years of experience in full-stack development and AI/ML projects. I'm currently a B.Tech Computer Engineering student with hands-on experience in building innovative applications. ${PersonalProfile_1.PersonalProfileHelper.getProjectHighlight()}`;
        }
        // Skills questions
        if (lowerQuestion.includes('skills') || lowerQuestion.includes('technical')) {
            return `${PersonalProfile_1.PersonalProfileHelper.getTechnicalSkillsSummary()} I'm particularly strong in ${PersonalProfile_1.personalProfile.skills.frameworksLibraries.slice(0, 3).join(', ')} for development and ${PersonalProfile_1.personalProfile.skills.programmingLanguages.slice(0, 3).join(', ')} as programming languages. I also have experience with tools like ${PersonalProfile_1.personalProfile.skills.databasesTools.slice(0, 2).join(' and ')}.`;
        }
        // Specific project questions - check for mentions of actual project names
        for (const project of PersonalProfile_1.personalProfile.projects) {
            const projectWords = project.name.toLowerCase().replace(/[^\w\s]/g, ' ').split(' ').filter(word => word.length > 2);
            const mentionsThisProject = projectWords.some(word => lowerQuestion.includes(word));
            if (mentionsThisProject) {
                return `Great question about ${project.name}! This is one of my key projects where ${project.description} I built it using ${project.technologies.join(', ')}. The project highlights include: ${project.highlights.join(', ')}. It was particularly interesting because it allowed me to ${project.highlights[0].toLowerCase()} and ${project.highlights[1].toLowerCase()}. ${project.link ? `You can check it out at ${project.link}` : ''}`;
            }
        }
        // General projects questions
        if (lowerQuestion.includes('project') || lowerQuestion.includes('built')) {
            const mainProject = PersonalProfile_1.personalProfile.projects[0];
            return `${PersonalProfile_1.PersonalProfileHelper.getProjectHighlight()} This project showcases my ability to ${mainProject.highlights[0].toLowerCase()}, ${mainProject.highlights[1].toLowerCase()}. I've also worked on other projects including ${PersonalProfile_1.personalProfile.projects[1]?.name}, ${PersonalProfile_1.personalProfile.projects[2]?.name}, and ${PersonalProfile_1.personalProfile.projects[3]?.name || 'several other innovative applications'}.`;
        }
        // Strengths questions
        if (lowerQuestion.includes('strength') || lowerQuestion.includes('good at')) {
            return `${PersonalProfile_1.PersonalProfileHelper.getStrengthsAndGoals()} I'm particularly good at problem-solving complex technical challenges, learning new technologies quickly, and collaborating effectively with cross-functional teams. I also have a strong attention to detail and focus on writing clean, maintainable code.`;
        }
        // Career goals
        if (lowerQuestion.includes('career') || lowerQuestion.includes('future') || lowerQuestion.includes('goals')) {
            return `My career goal is to ${PersonalProfile_1.personalProfile.careerGoals[0].toLowerCase()}. I want to ${PersonalProfile_1.personalProfile.careerGoals[1].toLowerCase()} and ${PersonalProfile_1.personalProfile.careerGoals[2].toLowerCase()}. I'm particularly interested in working on innovative projects that have real-world impact and allow me to grow both technically and professionally.`;
        }
        // Why hire you
        if (lowerQuestion.includes('hire you') || lowerQuestion.includes('why choose')) {
            return `You should hire me because I bring a unique combination of strong technical skills, practical experience, and passion for innovation. With ${PersonalProfile_1.personalProfile.experience.totalYears}+ years of experience, I've proven my ability to deliver high-quality solutions using modern technologies. I'm a quick learner who adapts well to new challenges and contributes positively to team dynamics. Plus, I have hands-on experience with projects like ${PersonalProfile_1.personalProfile.projects[0].name}, which demonstrates my ability to work with cutting-edge technologies.`;
        }
        // Default personal response
        return `Thank you for the question. I'm ${PersonalProfile_1.personalProfile.name}, a ${PersonalProfile_1.personalProfile.title} with ${PersonalProfile_1.personalProfile.experience.totalYears}+ years of experience. I'm passionate about building innovative software solutions and have expertise in both frontend and backend development. I'm always eager to learn new technologies and contribute to meaningful projects.`;
    }
    /**
     * Helper method to detect if a question is interview-style
     */
    isInterviewStyleQuestion(text) {
        const interviewKeywords = [
            'explain', 'what is', 'how does', 'describe', 'tell me about',
            'why', 'when would you use', 'what are the benefits', 'benefits of',
            'difference between', 'pros and cons', 'advantages', 'disadvantages',
            'interview', 'professional', 'technical question', 'compare',
            'handle', 'manage', 'work with'
        ];
        const lowerText = text.toLowerCase();
        // Check for interview keywords
        const hasInterviewKeywords = interviewKeywords.some(keyword => lowerText.includes(keyword));
        // Check for question patterns (more comprehensive)
        const isQuestion = lowerText.includes('?') ||
            lowerText.startsWith('what') ||
            lowerText.startsWith('how') ||
            lowerText.startsWith('why') ||
            lowerText.startsWith('when') ||
            lowerText.startsWith('explain') ||
            lowerText.startsWith('describe') ||
            lowerText.startsWith('tell me') ||
            lowerText.includes('difference') ||
            lowerText.includes('vs ') ||
            lowerText.includes(' vs') ||
            lowerText.includes('handle') ||
            lowerText.includes('work');
        // Technical terms that indicate interview context
        const technicalTerms = [
            'react', 'javascript', 'typescript', 'node', 'database', 'sql',
            'algorithm', 'programming', 'software', 'development', 'coding',
            'framework', 'library', 'api', 'backend', 'frontend', 'web',
            'computer science', 'data structure', 'object oriented', 'async',
            'operations', 'nosql', 'vue', 'angular'
        ];
        const hasTechnicalTerms = technicalTerms.some(term => lowerText.includes(term));
        // Check for personal project mentions (always treat as interview-style if mentioned)
        const projectNames = PersonalProfile_1.personalProfile.projects.map(project => project.name.toLowerCase().replace(/[^\w\s]/g, ' ').trim());
        const mentionsPersonalProject = projectNames.some(projectName => {
            const projectWords = projectName.split(' ').filter(word => word.length > 2);
            return projectWords.some(word => lowerText.includes(word));
        });
        // Enhanced detection: personal projects, interview keywords, or technical questions
        return mentionsPersonalProject || (hasInterviewKeywords || isQuestion) && hasTechnicalTerms;
    }
    /**
     * Solve coding problems including DSA, competitive programming, and general coding challenges
     * Returns clean, well-formatted code solutions
     */
    async solveCodingProblem(problemDescription, language) {
        try {
            const prompt = `${this.codingPrompt}

Problem: ${problemDescription}

Language: ${language}

Provide a complete, optimized solution with:
1. Clean, readable code with proper spacing and indentation
2. Efficient algorithm with good time/space complexity
3. Clear variable names and structure
4. Proper formatting as shown in the reference example
5. Brief comment explaining the approach if complex

Return the solution in this format:
\`\`\`${language}
[Your complete solution here]
\`\`\`

Focus on:
- Correctness and efficiency
- Clean, professional formatting
- Readable code structure
- Proper spacing and indentation`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log("[LLMHelper] Generated coding solution");
            return { solution: text, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error solving coding problem:", error);
            throw error;
        }
    }
    /**
     * Optimize or refactor existing code
     */
    async optimizeCode(code, language = "python", requirements) {
        try {
            const prompt = `${this.codingPrompt}

Original Code:
\`\`\`${language}
${code}
\`\`\`

${requirements ? `Requirements: ${requirements}` : ""}

Please optimize and improve this code by:
1. Improving time/space complexity if possible
2. Enhancing readability and formatting
3. Following best practices for ${language}
4. Adding proper spacing and indentation
5. Using clear variable names
6. Removing any redundancy

Provide the optimized solution with clean formatting:
\`\`\`${language}
[Your optimized solution here]
\`\`\`

If you make significant changes, briefly explain the improvements.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log("[LLMHelper] Generated optimized code");
            return { solution: text, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error optimizing code:", error);
            throw error;
        }
    }
    /**
     * Solve coding problems from images (screenshots of coding problems)
     * Automatically detects language from image content or uses provided language
     */
    async solveCodingProblemFromImage(imagePath, language) {
        try {
            const imagePart = await this.fileToGenerativePart(imagePath);
            // If no language provided, detect from image first
            if (!language) {
                console.log("[LLMHelper] No language specified, detecting from image content");
                const detectionPrompt = `Analyze this image and determine what programming language or technology is being asked for.

DETECTION RULES:
1. Look for explicit language mentions in the problem text
2. Check for language-specific syntax or keywords visible
3. Look for file extensions or IDE context
4. Consider the problem domain and typical language usage
5. Check for framework-specific terms (React, Django, etc.)

Return EXACTLY one of: python, javascript, typescript, java, cpp, c, go, rust, sql, html, css, react, general

If uncertain or it's a general algorithm problem, return "python" as the default.`;
                const detectionResult = await this.model.generateContent([detectionPrompt, imagePart]);
                const detectionResponse = await detectionResult.response;
                language = detectionResponse.text().trim().toLowerCase();
                // Validate detected language
                const validLanguages = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'sql', 'html', 'css', 'react'];
                if (!validLanguages.includes(language)) {
                    language = 'python'; // Safe default
                }
                console.log(`[LLMHelper] Detected language from image: ${language}`);
            }
            const prompt = `${this.codingPrompt}

Analyze this image containing a coding problem and provide a complete solution.

Language: ${language}

COMPREHENSIVE ANALYSIS REQUIRED:
1. Carefully read and understand the complete problem statement from the image
2. Identify all constraints, input/output formats, and edge cases
3. Consider the optimal algorithm and data structures needed
4. Account for time and space complexity requirements
5. Look for any specific hints or examples provided in the image

SOLUTION REQUIREMENTS:
1. Provide a complete, working solution in ${language}
2. Use clean, professional formatting with proper indentation
3. Include helpful comments explaining key logic
4. Follow ${language}-specific best practices and conventions
5. Ensure the solution handles all edge cases mentioned
6. Optimize for both correctness and efficiency

Return the solution in this format:
\`\`\`${language}
[Your complete solution here]
\`\`\`

Focus on:
- Accuracy: Solving exactly what's asked in the image
- Completeness: Handling all requirements and edge cases
- Quality: Clean, readable, and efficient code
- Format: Professional ${language} code formatting`;
            const result = await this.model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();
            console.log(`[LLMHelper] Generated coding solution from image in ${language}`);
            return { solution: text, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error solving coding problem from image:", error);
            throw error;
        }
    }
    /**
     * Analyze and solve coding problems from text input
     */
    async analyzeTextInput(text, language = "python") {
        try {
            const prompt = `${this.codingPrompt}

Problem Statement: ${text}

Language: ${language}

Analyze this coding problem and provide a complete solution:

1. Understand the problem requirements
2. Design the optimal algorithm
3. Implement with clean, readable code
4. Use proper formatting and spacing
5. Include brief comments if needed

Return the solution in this format:
\`\`\`${language}
[Your complete solution here]
\`\`\`

Focus on correctness, efficiency, and professional code formatting.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text_response = response.text();
            console.log("[LLMHelper] Generated coding solution from text");
            return { text: text_response, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error analyzing text input:", error);
            throw error;
        }
    }
    /**
     * Analyze and solve coding problems from image files
     * Supports various image types: coding problems, screenshots, diagrams, etc.
     */
    async analyzeImageFile(imagePath, language) {
        try {
            const imageData = await fs_1.default.promises.readFile(imagePath);
            const imagePart = {
                inlineData: {
                    data: imageData.toString("base64"),
                    mimeType: "image/png"
                }
            };
            // First, determine what type of content is in the image
            const contentAnalysisPrompt = `Analyze this image and determine what type of content it contains.

CONTENT TYPES:
1. CODING_PROBLEM: Programming challenges, algorithm problems, interview questions
2. CODE_SCREENSHOT: Screenshots of existing code that needs explanation
3. TECHNICAL_DIAGRAM: System architecture, database schemas, flowcharts
4. UI_MOCKUP: Website layouts, app designs, frontend mockups
5. ERROR_SCREENSHOT: Error messages, debugging scenarios
6. GENERAL_QUESTION: Text-based questions, documentation, tutorials

Return EXACTLY one of: CODING_PROBLEM, CODE_SCREENSHOT, TECHNICAL_DIAGRAM, UI_MOCKUP, ERROR_SCREENSHOT, GENERAL_QUESTION`;
            const contentResult = await this.model.generateContent([contentAnalysisPrompt, imagePart]);
            const contentResponse = await contentResult.response;
            const contentType = contentResponse.text().trim().toUpperCase();
            console.log(`[LLMHelper] Detected image content type: ${contentType}`);
            // Handle different content types appropriately
            switch (contentType) {
                case 'CODING_PROBLEM':
                    return await this.handleCodingProblemImage(imagePart, language);
                case 'CODE_SCREENSHOT':
                    return await this.handleCodeScreenshot(imagePart, language);
                case 'TECHNICAL_DIAGRAM':
                    return await this.handleTechnicalDiagram(imagePart);
                case 'UI_MOCKUP':
                    return await this.handleUIMockup(imagePart);
                case 'ERROR_SCREENSHOT':
                    return await this.handleErrorScreenshot(imagePart, language);
                case 'GENERAL_QUESTION':
                default:
                    return await this.handleGeneralImageQuestion(imagePart);
            }
        }
        catch (error) {
            console.error("Error analyzing image file:", error);
            throw error;
        }
    }
    /**
     * Handle coding problem images
     */
    async handleCodingProblemImage(imagePart, language) {
        if (!language) {
            // Detect language from image content
            const detectionPrompt = `Analyze this coding problem image and determine the most appropriate programming language.
      
      Look for:
      - Explicit language mentions in the problem
      - Language-specific syntax or examples
      - Problem domain (web dev → JS/Python, algorithms → Python/C++, etc.)
      
      Return one of: python, javascript, typescript, java, cpp, c, go, rust, sql, html, css, react
      Default to "python" for general algorithm problems.`;
            const detectionResult = await this.model.generateContent([detectionPrompt, imagePart]);
            const detectionResponse = await detectionResult.response;
            language = detectionResponse.text().trim().toLowerCase() || 'python';
        }
        const prompt = `${this.codingPrompt}

Solve this coding problem from the image.

Language: ${language}

ANALYSIS STEPS:
1. Read the complete problem statement carefully
2. Identify input/output format and constraints
3. Design the optimal algorithm
4. Implement with clean, professional code
5. Consider edge cases and efficiency

Return the solution:
\`\`\`${language}
[Your complete solution here]
\`\`\`

Include a brief explanation of your approach if the logic is complex.`;
        const result = await this.model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        console.log(`[LLMHelper] Generated coding problem solution in ${language}`);
        return { text, timestamp: Date.now() };
    }
    /**
     * Handle code screenshot images (for explanation)
     */
    async handleCodeScreenshot(imagePart, language) {
        const prompt = `Analyze this code screenshot and provide a clear explanation.

EXPLANATION REQUIREMENTS:
1. Identify the programming language used
2. Explain what the code does step by step
3. Point out key concepts and patterns
4. Mention any best practices or potential improvements
5. Explain the logic flow and data transformations

Provide a comprehensive but clear explanation that helps understand the code.`;
        const result = await this.model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        console.log("[LLMHelper] Generated code screenshot explanation");
        return { text, timestamp: Date.now() };
    }
    /**
     * Handle technical diagram images
     */
    async handleTechnicalDiagram(imagePart) {
        const prompt = `Analyze this technical diagram and provide a detailed explanation.

ANALYSIS AREAS:
1. Overall architecture and components
2. Data flow and relationships
3. Technology stack implications
4. Design patterns and principles
5. Scalability and performance considerations
6. Potential improvements or alternatives

Provide insights that demonstrate understanding of the system design.`;
        const result = await this.model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        console.log("[LLMHelper] Generated technical diagram analysis");
        return { text, timestamp: Date.now() };
    }
    /**
     * Handle UI mockup images
     */
    async handleUIMockup(imagePart) {
        const prompt = `Analyze this UI mockup and provide implementation guidance.

ANALYSIS POINTS:
1. UI components and layout structure
2. Recommended frontend technologies (React, HTML/CSS, etc.)
3. Responsive design considerations
4. User experience best practices
5. Implementation approach and code structure
6. Accessibility considerations

Provide practical advice for implementing this design.`;
        const result = await this.model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        console.log("[LLMHelper] Generated UI mockup analysis");
        return { text, timestamp: Date.now() };
    }
    /**
     * Handle error screenshot images
     */
    async handleErrorScreenshot(imagePart, language) {
        const prompt = `Analyze this error screenshot and provide debugging help.

DEBUGGING APPROACH:
1. Identify the error type and message
2. Explain what the error means
3. Identify likely causes
4. Provide step-by-step troubleshooting steps
5. Suggest code fixes or configuration changes
6. Recommend prevention strategies

Focus on practical solutions and clear explanations.`;
        const result = await this.model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        console.log("[LLMHelper] Generated error debugging help");
        return { text, timestamp: Date.now() };
    }
    /**
     * Handle general question images
     */
    async handleGeneralImageQuestion(imagePart) {
        const prompt = `Analyze this image and provide a helpful response.

RESPONSE GUIDELINES:
1. Read and understand any text content
2. Identify the main question or topic
3. Provide accurate, comprehensive information
4. Use clear explanations and examples
5. Focus on being helpful and educational

Provide a thorough answer based on the image content.`;
        const result = await this.model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        console.log("[LLMHelper] Generated general image response");
        return { text, timestamp: Date.now() };
    }
    /**
     * Analyze and solve coding problems from audio files (OPTIMIZED)
     */
    async analyzeAudioFile(audioPath, language = "python") {
        try {
            const audioData = await fs_1.default.promises.readFile(audioPath);
            const audioPart = {
                inlineData: {
                    data: audioData.toString("base64"),
                    mimeType: "audio/mp3"
                }
            };
            // First transcribe the audio to understand what was said
            const transcriptionPrompt = `Listen to this audio and provide an exact transcription of what was said.

INSTRUCTIONS:
1. Transcribe exactly what you hear
2. Include all words and phrases clearly
3. If it's a question, preserve the question format
4. If it's a coding problem, transcribe the problem statement
5. Do not solve or answer anything yet - just transcribe

Return only the transcribed text.`;
            const transcriptionResult = await this.model.generateContent([transcriptionPrompt, audioPart]);
            const transcriptionResponse = await transcriptionResult.response;
            const transcription = transcriptionResponse.text();
            console.log("[LLMHelper] Transcribed audio:", transcription);
            // Check if this looks like an interview question
            const isInterviewQuestion = this.isInterviewStyleQuestion(transcription);
            let finalResponse;
            if (isInterviewQuestion) {
                // Use the specialized interview question answering method with language detection
                console.log("[LLMHelper] Detected interview question, using specialized response");
                const interviewResponse = await this.answerInterviewQuestion(transcription);
                finalResponse = interviewResponse.answer;
            }
            else {
                // Treat as coding problem and use coding prompt
                console.log("[LLMHelper] Treating as coding problem");
                const codingPrompt = `${this.codingPrompt}

Problem from audio transcription: ${transcription}

Language: ${language}

Process:
1. Understand the problem from the transcription
2. Identify the requirements and constraints
3. Design the optimal solution
4. Implement with clean, readable code

Return the solution in this format:
\`\`\`${language}
[Your complete solution here]
\`\`\`

Focus on correctness, efficiency, and professional formatting.`;
                const codingResult = await this.model.generateContent(codingPrompt);
                const codingResponse = await codingResult.response;
                finalResponse = codingResponse.text();
            }
            console.log("[LLMHelper] Generated response from audio file");
            return { text: finalResponse, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error analyzing audio file:", error);
            throw error;
        }
    }
    /**
     * Analyze and solve coding problems from base64 audio data (OPTIMIZED)
     * First transcribes the audio, then provides appropriate response based on content
     */
    async analyzeAudioFromBase64(data, mimeType, language = "auto") {
        try {
            const audioPart = {
                inlineData: {
                    data,
                    mimeType
                }
            };
            // First transcribe the audio to understand what was said
            const transcriptionPrompt = `Listen to this audio and provide an exact transcription of what was said.

INSTRUCTIONS:
1. Transcribe exactly what you hear
2. Include all words and phrases clearly
3. If it's a question, preserve the question format
4. If it's a coding problem, transcribe the problem statement
5. Do not solve or answer anything yet - just transcribe

Return only the transcribed text.`;
            const transcriptionResult = await this.model.generateContent([transcriptionPrompt, audioPart]);
            const transcriptionResponse = await transcriptionResult.response;
            const transcription = transcriptionResponse.text();
            console.log("[LLMHelper] Transcribed audio:", transcription);
            // Single language detection to avoid redundant API calls
            const detectedLanguage = await this.detectLanguage(transcription);
            console.log("[LLMHelper] Detected language:", detectedLanguage);
            // Check if this looks like an interview question (fast local check)
            const isInterviewQuestion = this.isInterviewStyleQuestion(transcription);
            let finalAnswer;
            if (isInterviewQuestion) {
                // Pass detected language to avoid re-detection
                console.log("[LLMHelper] Detected interview question, using specialized response");
                const interviewResponse = await this.answerInterviewQuestion(transcription, detectedLanguage);
                finalAnswer = interviewResponse.answer;
            }
            else {
                // Pass detected language to avoid re-detection
                console.log("[LLMHelper] Using general question response");
                const generalResponse = await this.answerQuestion(transcription, detectedLanguage);
                finalAnswer = generalResponse.answer;
            }
            console.log("[LLMHelper] Generated response from transcribed audio");
            return {
                text: transcription,
                answer: finalAnswer,
                timestamp: Date.now()
            };
        }
        catch (error) {
            console.error("Error analyzing audio from base64:", error);
            throw error;
        }
    }
    /**
     * Debug and improve existing code solutions
     */
    async debugCode(code, language = "python", errorDescription) {
        try {
            const prompt = `${this.codingPrompt}

Debug and fix this code:

Original Code:
\`\`\`${language}
${code}
\`\`\`

${errorDescription ? `Error/Issue: ${errorDescription}` : ""}

Please:
1. Identify and fix any bugs or issues
2. Improve code efficiency if possible
3. Enhance readability and formatting
4. Ensure proper spacing and indentation
5. Add comments for clarity if needed

Return the corrected solution:
\`\`\`${language}
[Your fixed and improved solution here]
\`\`\`

Explain what was fixed and improved.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log("[LLMHelper] Generated debugged code");
            return { solution: text, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error debugging code:", error);
            throw error;
        }
    }
    /**
     * Format and clean up poorly formatted code
     * Transforms messy code into clean, readable format like professional examples
     */
    async formatCode(code, language) {
        try {
            // Auto-detect language if not provided
            if (!language) {
                console.log("[LLMHelper] No language specified, attempting to detect from code");
                const detectionPrompt = `Analyze this code and determine the programming language.

Code:
\`\`\`
${code}
\`\`\`

Look for:
- Language-specific syntax and keywords
- Import/include statements
- Function/method declarations
- Variable declarations
- Comments style
- File structure patterns

Return EXACTLY one of: python, javascript, typescript, java, cpp, c, go, rust, sql, html, css, php, ruby, swift, kotlin, csharp, dart

If uncertain, return "python" as default.`;
                try {
                    const detectionResult = await this.model.generateContent(detectionPrompt);
                    const detectionResponse = await detectionResult.response;
                    language = detectionResponse.text().trim().toLowerCase();
                    const validLanguages = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'sql', 'html', 'css', 'php', 'ruby', 'swift', 'kotlin', 'csharp', 'dart'];
                    if (!validLanguages.includes(language)) {
                        language = 'python';
                    }
                    console.log(`[LLMHelper] Detected language: ${language}`);
                }
                catch (detectionError) {
                    console.warn("Language detection failed, defaulting to python");
                    language = 'python';
                }
            }
            const prompt = `${this.codingPrompt}

Transform this poorly formatted code into clean, professional format:

Original Code:
\`\`\`${language}
${code}
\`\`\`

FORMATTING REQUIREMENTS FOR ${language.toUpperCase()}:
1. Language-appropriate indentation (4 spaces for Python/C++/Java, 2 spaces for JavaScript, etc.)
2. Consistent spacing around operators and brackets
3. Clean line breaks and structure
4. Proper bracket placement following ${language} conventions
5. Clear variable names (improve if necessary)
6. Remove unnecessary complexity while maintaining logic
7. Add proper spacing between functions and logical blocks
8. Follow professional coding standards for ${language}
9. Use ${language}-specific best practices and idioms
10. Ensure proper import/include statements formatting

Use the ${language.toUpperCase()} example from my knowledge base as the target format.

Transform the provided code to match professional ${language} formatting standards.

Return ONLY the formatted code in this format:
\`\`\`${language}
[Your clean, formatted code here]
\`\`\`

Focus purely on formatting transformation while preserving functionality.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`[LLMHelper] Generated formatted ${language} code`);
            return { solution: text, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error formatting code:", error);
            throw error;
        }
    }
    /**
     * Detect the programming language from problem text or code snippet
     */
    async detectLanguage(text) {
        try {
            const prompt = `Analyze this text and determine the most appropriate response type.

Text: ${text}

LANGUAGE DETECTION RULES:

1. EXPLICIT LANGUAGE MENTIONS:
- Look for direct language mentions: "in Python", "using JavaScript", "write a C++ program"
- Check for file extensions: .py, .js, .cpp, .java, etc.
- Look for language-specific keywords: def, func, class, public, async, etc.

2. CONTEXT CLUES:
- Web/Frontend: Likely JavaScript/TypeScript/React
- Backend/Server: Could be Python/Node.js/Java
- Data Science/ML: Likely Python
- Mobile Dev: Swift (iOS) or Kotlin (Android)
- System Programming: C/C++/Rust
- Enterprise: Java/C#

3. TECHNICAL INDICATORS:
- Python: pandas, numpy, pip, django, flask
- JavaScript: npm, node, express, react, DOM
- TypeScript: interfaces, types, generics, Angular
- Java: Spring, Maven, JVM, Android
- C++: STL, vectors, pointers, templates
- SQL: SELECT, JOIN, tables, queries
- Go: goroutines, channels, packages
- Rust: ownership, borrowing, traits

4. REQUEST TYPE:
EXPLANATION ("explanation"):
- "explain this code"
- "how does this work"
- "what does this do"
- "walk me through"
- "break down this code"

FRONTEND DEVELOPMENT ("frontend"):
- UI/UX, responsive design, DOM manipulation
- Client-side frameworks, component-based architecture
- Browser APIs, performance optimization
- "frontend", "client-side", "user interface"

BACKEND DEVELOPMENT ("backend"):
- Server-side logic, APIs, databases
- Authentication, authorization, middleware
- Scalability, microservices, cloud deployment
- "backend", "server-side", "API development"

CODING ("specific_language"):
- "write a program"
- "implement"
- "create a function"
- "solve this problem"
- Code provided with specific language markers

SQL ("sql"):
- Database queries
- Table operations
- Data manipulation

GENERAL ("general"):
- Conceptual questions
- Technology comparisons
- Best practices
- Architecture discussions

DETERMINE ORDER:
1. Check for explicit language mention
2. Look for language-specific code/syntax
3. Analyze context clues (frontend/backend indicators)
4. Consider technical terms
5. Default to "general" if uncertain

Return EXACTLY one of: explanation, general, cpp, python, javascript, typescript, react, java, c, go, rust, sql, html, css, php, ruby, swift, kotlin, csharp, dart, frontend, backend

Focus on identifying the EXACT intended language or response type.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const detectedLanguage = response.text().trim().toLowerCase();
            // Validate the detected language
            const validLanguages = ['explanation', 'general', 'cpp', 'python', 'javascript', 'typescript', 'react', 'java', 'c', 'go', 'rust', 'sql', 'html', 'css', 'php', 'ruby', 'swift', 'kotlin', 'csharp', 'dart', 'frontend', 'backend'];
            if (validLanguages.includes(detectedLanguage)) {
                console.log(`[LLMHelper] Detected language: ${detectedLanguage}`);
                return detectedLanguage;
            }
            else {
                console.log(`[LLMHelper] Invalid language detected: ${detectedLanguage}, defaulting to general`);
                return "general";
            }
        }
        catch (error) {
            console.error("Error detecting language:", error);
            return "general"; // Default fallback
        }
    }
    /**
     * Handle all types of questions and provide appropriate answers (OPTIMIZED)
     * Supports coding problems, explanations, technical concepts, frontend/backend development
     * @param question - The question to answer
     * @param preDetectedLanguage - Optional pre-detected language to skip detection
     */
    async answerQuestion(question, preDetectedLanguage) {
        try {
            // Skip language detection if already provided
            const detectedLanguage = preDetectedLanguage || await this.detectLanguage(question);
            // Fast local check for interview questions
            const isInterviewQuestion = this.isInterviewStyleQuestion(question);
            if (isInterviewQuestion) {
                console.log("[LLMHelper] Detected interview question, using specialized response");
                const interviewResponse = await this.answerInterviewQuestion(question, detectedLanguage);
                return { answer: interviewResponse.answer, timestamp: Date.now() };
            }
            // Handle coding problems with specific language requirements
            const codingLanguages = ['cpp', 'python', 'javascript', 'typescript', 'react', 'java', 'c', 'go', 'rust', 'html', 'css'];
            if (codingLanguages.includes(detectedLanguage)) {
                // Check if this is asking for implementation vs explanation
                const lowerQuestion = question.toLowerCase();
                const isImplementationRequest = lowerQuestion.includes('write') || lowerQuestion.includes('implement') ||
                    lowerQuestion.includes('create') || lowerQuestion.includes('build') ||
                    lowerQuestion.includes('code') || lowerQuestion.includes('program') ||
                    lowerQuestion.includes('function') || lowerQuestion.includes('solve') ||
                    lowerQuestion.includes('algorithm') || lowerQuestion.includes('problem');
                if (isImplementationRequest) {
                    console.log(`[LLMHelper] Detected coding implementation request in ${detectedLanguage}`);
                    const solution = await this.solveCodingProblem(question, detectedLanguage);
                    return { answer: solution.solution, timestamp: Date.now() };
                }
            }
            // Handle frontend/backend context
            if (detectedLanguage === 'frontend' || detectedLanguage === 'backend') {
                const contextualLanguage = detectedLanguage === 'frontend' ? 'javascript' : 'python';
                const lowerQuestion = question.toLowerCase();
                if (lowerQuestion.includes('implement') || lowerQuestion.includes('create') || lowerQuestion.includes('build')) {
                    console.log(`[LLMHelper] Detected ${detectedLanguage} implementation request`);
                    const solution = await this.solveCodingProblem(question, contextualLanguage);
                    return { answer: solution.solution, timestamp: Date.now() };
                }
            }
            // Handle SQL queries
            if (detectedLanguage === 'sql') {
                console.log("[LLMHelper] Detected SQL query request");
                const solution = await this.solveCodingProblem(question, 'sql');
                return { answer: solution.solution, timestamp: Date.now() };
            }
            // For all other questions (explanations, concepts, general tech questions)
            const prompt = `You are an expert technical assistant specializing in software development, algorithms, and technology concepts.

Question: ${question}
Detected Context: ${detectedLanguage}

RESPONSE GUIDELINES:

FOR EXPLANATION REQUESTS:
- If explaining existing code: Break down logic step-by-step, explain data flow and key concepts
- Use clear analogies and real-world examples
- Focus on understanding, not providing new implementations

FOR CONCEPTUAL/TECHNICAL QUESTIONS:
- Provide clear, comprehensive explanations
- Include practical examples and use cases
- Compare different approaches when relevant
- Mention best practices and common pitfalls

FOR FRONTEND DEVELOPMENT TOPICS:
- Focus on JavaScript/TypeScript, React, HTML, CSS
- Explain modern web development practices
- Include responsive design and user experience considerations
- Mention popular frameworks and libraries

FOR BACKEND DEVELOPMENT TOPICS:
- Cover server-side technologies (Node.js, Python, Java, etc.)
- Explain APIs, databases, and system architecture
- Include security, performance, and scalability considerations
- Mention cloud services and DevOps practices

FOR GENERAL PROGRAMMING CONCEPTS:
- Explain algorithms, data structures, and design patterns
- Compare different programming paradigms
- Discuss code quality, testing, and maintenance
- Include examples in multiple languages when helpful

CRITICAL INSTRUCTIONS:
- Keep responses focused and practical
- Use appropriate technical depth for the question
- Include code examples only when they clarify concepts
- Always provide accurate and up-to-date information
- Be specific about which technologies or languages you're discussing`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const answer = response.text();
            console.log(`[LLMHelper] Generated comprehensive answer for ${detectedLanguage} question`);
            return { answer, timestamp: Date.now() };
        }
        catch (error) {
            console.error("Error answering question:", error);
            throw error;
        }
    }
    /**
     * Check cache for existing answer to avoid redundant API calls
     */
    getCachedAnswer(question) {
        const normalizedQuestion = question.toLowerCase().trim();
        const cached = this.questionCache.get(normalizedQuestion);
        if (cached && Date.now() < cached.expiryTime) {
            console.log("[LLMHelper] Using cached answer");
            return { answer: cached.answer, timestamp: cached.timestamp };
        }
        // Clean expired entries
        if (cached && Date.now() >= cached.expiryTime) {
            this.questionCache.delete(normalizedQuestion);
        }
        return null;
    }
    /**
     * Cache an answer for future use
     */
    cacheAnswer(question, answer, timestamp) {
        const normalizedQuestion = question.toLowerCase().trim();
        const expiryTime = Date.now() + this.cacheExpirationMs;
        this.questionCache.set(normalizedQuestion, { answer, timestamp, expiryTime });
        // Limit cache size to prevent memory issues
        if (this.questionCache.size > 100) {
            const firstKey = this.questionCache.keys().next().value;
            this.questionCache.delete(firstKey);
        }
    }
    /**
     * Specialized interview question answering with expert-level responses (OPTIMIZED)
     * Provides structured, professional answers optimized for interview scenarios
     * @param question - The interview question to answer
     * @param preDetectedLanguage - Optional pre-detected language to skip detection
     */
    async answerInterviewQuestion(question, preDetectedLanguage) {
        try {
            // Check cache first for exact matches (great for repeated common questions)
            const cachedResult = this.getCachedAnswer(question);
            if (cachedResult) {
                return cachedResult;
            }
            // Skip language detection if already provided
            const detectedLanguage = preDetectedLanguage || await this.detectLanguage(question);
            // Check if it's a personal/background question (fast local check)
            const isPersonal = this.isPersonalQuestion(question);
            if (isPersonal) {
                const personalAnswer = this.generatePersonalResponse(question);
                const result = { answer: personalAnswer, timestamp: Date.now() };
                this.cacheAnswer(question, personalAnswer, result.timestamp);
                console.log("[LLMHelper] Generated personalized interview answer (cached personal)");
                return result;
            }
            // Fast categorization without additional API calls
            const questionType = this.categorizeInterviewQuestion(question, detectedLanguage);
            // Generate optimized prompt based on question type
            const prompt = this.generateInterviewPrompt(question, detectedLanguage, questionType);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const answer = response.text();
            const timestamp = Date.now();
            // Cache the result
            this.cacheAnswer(question, answer, timestamp);
            console.log(`[LLMHelper] Generated optimized interview answer for ${detectedLanguage} (${questionType}) question`);
            return { answer, timestamp };
        }
        catch (error) {
            console.error("Error answering interview question:", error);
            throw error;
        }
    }
    /**
     * Fast local categorization of interview questions without API calls
     */
    categorizeInterviewQuestion(question, detectedLanguage) {
        const lowerQuestion = question.toLowerCase();
        // Fast pattern matching for common question types
        if (lowerQuestion.includes('explain') && (lowerQuestion.includes('code') || lowerQuestion.includes('this'))) {
            return 'explanation';
        }
        if (lowerQuestion.includes('implement') || lowerQuestion.includes('write') || lowerQuestion.includes('create')) {
            return 'implementation';
        }
        if (lowerQuestion.includes('difference') || lowerQuestion.includes('vs') || lowerQuestion.includes('compare')) {
            return 'comparison';
        }
        if (lowerQuestion.includes('what is') || lowerQuestion.includes('define')) {
            return 'concept';
        }
        // Category by detected language/context
        if (['react', 'javascript', 'typescript', 'frontend'].includes(detectedLanguage)) {
            return 'frontend';
        }
        if (['backend', 'python', 'java'].includes(detectedLanguage)) {
            return 'backend';
        }
        return 'general';
    }
    /**
     * Generate optimized interview prompt based on question categorization
     */
    generateInterviewPrompt(question, detectedLanguage, questionType) {
        // Get relevant experience only for technical topics (avoid API calls for simple questions)
        const relevantExperience = questionType !== 'general' ?
            PersonalProfile_1.PersonalProfileHelper.getRelevantExperience(question) : [];
        const experienceContext = relevantExperience.length > 0 ?
            `\n\nRELEVANT EXPERIENCE: ${relevantExperience.slice(0, 2).join('; ')}.` : '';
        // Enhanced structured prompt for professional interview responses
        const basePrompt = `You are ${PersonalProfile_1.personalProfile.name}, ${PersonalProfile_1.personalProfile.title} with ${PersonalProfile_1.personalProfile.experience.totalYears}+ years of experience. 

QUESTION: ${question}
CONTEXT: ${detectedLanguage}${experienceContext}

CRITICAL RESPONSE FORMAT - Follow this EXACT structure for professional interview answers:

1. **CLEAR DEFINITION/INTRODUCTION**: Start with a concise, accurate definition or introduction to the topic
2. **KEY CONCEPTS/COMPONENTS**: Break down the main concepts, features, or components
3. **PRACTICAL BENEFITS/WHY IT MATTERS**: Explain the practical benefits and why it's important
4. **REAL-WORLD APPLICATION**: Describe how it's used in practice with specific examples
5. **CODE EXAMPLE** (when relevant): Provide a clean, well-formatted code example
6. **PERSONAL EXPERIENCE**: Connect to your specific projects and experience
7. **BEST PRACTICES**: Mention important best practices or considerations

FORMAT EXAMPLE:
"[Technology/Concept], from my perspective as a ${PersonalProfile_1.personalProfile.title}, is [clear definition]. 

The key components include: [list main features/concepts with brief explanations].

What makes [technology] powerful is [key benefits]. This is important because [practical reasons].

In practice, [real-world usage examples]. For example, [specific scenario].

Here's a simple code example:
\`\`\`${detectedLanguage}
[clean, working code example]
\`\`\`

From my experience working on ${PersonalProfile_1.personalProfile.projects[0].name}, [personal connection and practical insights].

Key best practices include [important considerations or tips]."

RESPONSE REQUIREMENTS:`;
        // Type-specific guidelines with enhanced structure
        const typeGuidelines = {
            explanation: `- Follow the 7-point structure above exactly
- Include a clear definition first, then break down concepts step-by-step
- Provide practical code examples when explaining technical concepts
- Reference your experience from ${PersonalProfile_1.personalProfile.projects[0].name} and other projects
- Focus on understanding with concrete examples`,
            implementation: `- Start with brief explanation of what you're implementing
- Provide clean, well-formatted, working code in ${detectedLanguage}
- Include comments in the code for clarity
- Explain your approach and why you chose this solution
- Reference best practices you've learned in your ${PersonalProfile_1.personalProfile.experience.totalYears}+ years`,
            comparison: `- Define both technologies/concepts clearly first
- Create a structured comparison (pros/cons, use cases, performance, etc.)
- Include code examples for both when relevant
- Reference your practical experience with each
- Be balanced and objective, mentioning specific use cases`,
            concept: `- Start with a crystal-clear definition as a ${PersonalProfile_1.personalProfile.title}
- Break down the concept into digestible components
- Explain practical benefits and real-world applications
- Include code examples that demonstrate the concept
- Connect to your work with ${PersonalProfile_1.personalProfile.skills.programmingLanguages[0]} and ${PersonalProfile_1.personalProfile.skills.frameworksLibraries[0]}`,
            frontend: `- Follow the structured format focusing on ${PersonalProfile_1.personalProfile.skills.frameworksLibraries[0]}, JavaScript, React
- Include modern web development practices and patterns
- Provide clean code examples with proper formatting
- Reference your frontend projects and practical experience
- Explain user experience and performance considerations`,
            backend: `- Structure your answer around server-side technologies from your experience
- Include API design, database considerations, and architecture patterns
- Provide code examples for key concepts
- Reference your work with scalability and security
- Connect to your backend projects and real-world implementations`,
            general: `- Follow the 7-point structure for clear, comprehensive explanations
- Include practical examples and code when relevant
- Use your ${PersonalProfile_1.personalProfile.experience.totalYears}+ years of experience for context
- Keep professional and interview-appropriate tone
- Provide actionable insights and best practices`
        };
        return `${basePrompt}
${typeGuidelines[questionType] || typeGuidelines['general']}

FINAL REQUIREMENTS:
- Be clear, concise, and accurate
- Include code examples when they clarify concepts
- Reference your specific background and projects naturally
- Structure your response for easy understanding
- Maintain professional interview tone as ${PersonalProfile_1.personalProfile.name}
- Aim for 2-3 minutes speaking time with rich content`;
    }
}
exports.LLMHelper = LLMHelper;
//# sourceMappingURL=LLMHelper.js.map