// Comprehensive test for the full interview question flow with personal profile integration
const { LLMHelper } = require('./dist-electron/LLMHelper.js');

console.log('🎯 Testing Full Interview Question Flow with Personal Profile\n');

// Mock API key for testing (won't make actual API calls)
const mockApiKey = 'test-key';
const llmHelper = new LLMHelper(mockApiKey);

// Test interview question detection
console.log('📋 Testing Interview Question Detection:');

const testQuestions = [
  'tell me about yourself',
  'what is your experience',
  'tell me about ResumeRefine project',
  'what are your skills',
  'explain React',
  'tell me about CampusConnect',
  'what is JWT authentication',
  'describe your projects'
];

testQuestions.forEach((question, index) => {
  console.log(`${index + 1}. Question: "${question}"`);
  
  // Test personal question detection
  const isPersonal = llmHelper.isPersonalQuestion(question);
  console.log(`   Personal Question: ${isPersonal ? '✅ YES' : '❌ NO'}`);
  
  // Test interview-style detection
  const isInterview = llmHelper.isInterviewStyleQuestion(question);
  console.log(`   Interview Style: ${isInterview ? '✅ YES' : '❌ NO'}`);
  
  // Generate personal response if it's a personal question
  if (isPersonal) {
    try {
      const response = llmHelper.generatePersonalResponse(question);
      console.log(`   Response Preview: "${response.substring(0, 100)}..."`);
    } catch (error) {
      console.log(`   ⚠️  Error generating response: ${error.message}`);
    }
  }
  
  console.log('');
});

console.log('🔧 Testing Specific Project Mentions:');

const projectQuestions = [
  'tell me about your ResumeRefine project',
  'what is CampusConnect',
  'explain your Research Paper Agent',
  'describe MetaConnect app',
  'what technologies did you use in Resume Agent'
];

projectQuestions.forEach((question, index) => {
  console.log(`${index + 1}. Question: "${question}"`);
  
  const isPersonal = llmHelper.isPersonalQuestion(question);
  console.log(`   Detected as Personal: ${isPersonal ? '✅ YES' : '❌ NO'}`);
  
  if (isPersonal) {
    try {
      const response = llmHelper.generatePersonalResponse(question);
      console.log(`   Response Length: ${response.length} characters`);
      console.log(`   Mentions Project: ${response.includes('ResumeRefine') || response.includes('CampusConnect') || response.includes('Research Paper') || response.includes('MetaConnect') || response.includes('Resume Agent') ? '✅ YES' : '❌ NO'}`);
    } catch (error) {
      console.log(`   ⚠️  Error: ${error.message}`);
    }
  }
  
  console.log('');
});

console.log('✅ Full Interview Flow Test Complete!\n');

console.log('📈 Summary:');
console.log('- Personal question detection: Enhanced to recognize project names');
console.log('- Interview-style detection: Improved to handle personal projects');
console.log('- Response generation: Now includes specific project details');
console.log('- Integration: Ready for frontend connection');

console.log('\n🚀 Next Steps:');
console.log('1. Test with real API key using: GOOGLE_API_KEY=your_key node test-personal-interview-responses.js');
console.log('2. Try asking about specific projects in the frontend');
console.log('3. The system should now properly recognize and respond to questions about your projects');
