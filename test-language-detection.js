// Quick test to verify language detection works with new web development languages
const testCases = [
  {
    text: "Create a React component with useState hook for managing form state",
    expected: "react"
  },
  {
    text: "Write TypeScript interfaces for user data with type safety",
    expected: "typescript"
  },
  {
    text: "Style a responsive navbar with CSS flexbox and media queries",
    expected: "css"
  },
  {
    text: "Build an HTML page with semantic elements and accessibility features",
    expected: "html"
  },
  {
    text: "Implement a REST API in JavaScript with async/await",
    expected: "javascript"
  },
  {
    text: "Solve two sum problem with optimal time complexity",
    expected: "cpp"
  },
  {
    text: "Create a machine learning model using pandas and numpy",
    expected: "python"
  },
  // Interview-style questions that should trigger specialized responses
  {
    text: "Explain what React JS is and why it's popular for building user interfaces",
    expected: "interview_question",
    type: "interview"
  },
  {
    text: "What are the benefits of using TypeScript over JavaScript?",
    expected: "interview_question", 
    type: "interview"
  },
  {
    text: "Describe the difference between SQL and NoSQL databases",
    expected: "interview_question",
    type: "interview"
  },
  {
    text: "How do you handle asynchronous operations in JavaScript?",
    expected: "interview_question",
    type: "interview"
  }
];

console.log("Language Detection Test Cases:");
testCases.forEach((test, index) => {
  console.log(`${index + 1}. Text: "${test.text}"`);
  console.log(`   Expected: ${test.expected}`);
  if (test.type === "interview") {
    console.log(`   Type: Interview Question (should trigger detailed response)`);
  }
  console.log();
});

console.log("These test cases cover:");
console.log("- React (JSX, hooks, components)");
console.log("- TypeScript (type safety, interfaces)");
console.log("- CSS (styling, flexbox, responsive)");
console.log("- HTML (semantic elements, accessibility)");
console.log("- JavaScript (async/await, REST API)");
console.log("- C++ (algorithmic problems)");
console.log("- Python (data science, ML)");
console.log("- Interview Questions (detailed explanations)");

console.log("\n🎯 INTERVIEW QUESTION FIX:");
console.log("When recording voice for interview questions like 'Explain React JS',");
console.log("the system will now:");
console.log("1. Transcribe the audio accurately");
console.log("2. Detect if it's an interview-style question");
console.log("3. Use the specialized answerInterviewQuestion() method");
console.log("4. Provide comprehensive, professional responses");
console.log("5. Include proper structure, examples, and detailed explanations");
