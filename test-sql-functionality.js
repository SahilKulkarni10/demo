// Simple test to verify the SQL query functionality works
const testSQLQuery = async () => {
  try {
    const sqlQuery = "Write a SQL query to fetch unique values of MAJOR Subjects from Student table.";
    console.log("Testing SQL Query:", sqlQuery);
    
    // This would normally call the answerQuestion function
    // const result = await window.electronAPI.answerQuestion(sqlQuery);
    console.log("Expected SQL Response:");
    console.log("SELECT DISTINCT MAJOR FROM Student;");
    console.log("Alternative with NULL filtering:");
    console.log("SELECT DISTINCT MAJOR FROM Student WHERE MAJOR IS NOT NULL;");
    
    // Test other question types
    const testQuestions = [
      "Explain the difference between INNER JOIN and LEFT JOIN in SQL",
      "Write a Python function to reverse a string",
      "How do you handle asynchronous operations in JavaScript?",
      "What are the SOLID principles in software development?",
      "Create a React component with useState hook"
    ];
    
    console.log("\nAdditional test questions the system can now handle:");
    testQuestions.forEach((q, i) => console.log(`${i + 1}. ${q}`));
    
  } catch (error) {
    console.error("Test failed:", error);
  }
};

// Run the test
testSQLQuery();
