// Interview Question Detection Test
// This script validates the interview question detection logic

function isInterviewStyleQuestion(text) {
  const interviewKeywords = [
    'explain', 'what is', 'how does', 'describe', 'tell me about',
    'why', 'when would you use', 'what are the benefits', 'benefits of',
    'difference between', 'pros and cons', 'advantages', 'disadvantages',
    'interview', 'professional', 'technical question', 'compare',
    'handle', 'manage', 'work with'
  ];
  
  const lowerText = text.toLowerCase();
  
  // Check for interview keywords
  const hasInterviewKeywords = interviewKeywords.some(keyword => 
    lowerText.includes(keyword)
  );
  
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
  
  const hasTechnicalTerms = technicalTerms.some(term => 
    lowerText.includes(term)
  );
  
  // More lenient detection for interview questions
  return (hasInterviewKeywords || isQuestion) && hasTechnicalTerms;
}

// Test cases
const testQuestions = [
  { text: "Explain React JS", expected: true },
  { text: "What is TypeScript?", expected: true },
  { text: "How does JavaScript work?", expected: true },
  { text: "Tell me about databases", expected: true },
  { text: "Why use React over Vue?", expected: true },
  { text: "Difference between SQL and NoSQL", expected: true },
  { text: "Implement binary search", expected: false },
  { text: "Write a for loop", expected: false },
  { text: "Hello world", expected: false },
  { text: "What are the benefits of TypeScript?", expected: true },
  { text: "How do you handle async operations in JS?", expected: true }
];

console.log("🔍 Interview Question Detection Test Results:\n");

testQuestions.forEach((test, index) => {
  const result = isInterviewStyleQuestion(test.text);
  const status = result === test.expected ? "✅ PASS" : "❌ FAIL";
  
  console.log(`${index + 1}. "${test.text}"`);
  console.log(`   Expected: ${test.expected ? "Interview" : "Non-Interview"}`);
  console.log(`   Detected: ${result ? "Interview" : "Non-Interview"}`);
  console.log(`   Result: ${status}\n`);
});

console.log("🎯 Summary: This detection logic will route interview questions");
console.log("to the answerInterviewQuestion() method for detailed responses!");
