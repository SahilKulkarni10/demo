// test-personal-interview-responses.js
const { LLMHelper } = require('./dist-electron/LLMHelper.js');

async function testPersonalInterviewQuestions() {
  console.log('🧪 Testing Personal Interview Response System\n');
  
  // You'll need to add your actual API key here for testing
  const apiKey = process.env.GOOGLE_API_KEY || 'your-api-key-here';
  
  if (apiKey === 'your-api-key-here') {
    console.log('❌ Please set your GOOGLE_API_KEY environment variable or update the apiKey in this file');
    return;
  }
  
  const llmHelper = new LLMHelper(apiKey);
  
  const personalQuestions = [
    "Tell me about yourself",
    "What is your experience with React?",
    "What are your technical skills?",
    "Tell me about your projects",
    "What are your strengths?",
    "Why should we hire you?",
    "What are your career goals?"
  ];
  
  const technicalQuestions = [
    "Explain React hooks",
    "What is JWT?",
    "Node.js vs Python for backend",
    "How does authentication work?"
  ];
  
  console.log('📋 Testing Personal Background Questions:\n');
  
  for (const question of personalQuestions) {
    try {
      console.log(`❓ Question: "${question}"`);
      const result = await llmHelper.answerInterviewQuestion(question);
      console.log(`✅ Response Preview: ${result.answer.substring(0, 150)}...`);
      console.log(`📊 Contains "Sahil": ${result.answer.includes('Sahil') ? '✅ Yes' : '❌ No'}`);
      console.log(`📊 Contains "experience": ${result.answer.toLowerCase().includes('experience') ? '✅ Yes' : '❌ No'}`);
      console.log('---\n');
    } catch (error) {
      console.error(`❌ Error with question "${question}":`, error.message);
    }
  }
  
  console.log('\n🔧 Testing Technical Questions with Personal Context:\n');
  
  for (const question of technicalQuestions) {
    try {
      console.log(`❓ Question: "${question}"`);
      const result = await llmHelper.answerInterviewQuestion(question);
      console.log(`✅ Response Preview: ${result.answer.substring(0, 150)}...`);
      console.log(`📊 Contains "Sahil": ${result.answer.includes('Sahil') ? '✅ Yes' : '❌ No'}`);
      console.log(`📊 Contains personal context: ${result.answer.toLowerCase().includes('project') || result.answer.toLowerCase().includes('experience') ? '✅ Yes' : '❌ No'}`);
      console.log('---\n');
    } catch (error) {
      console.error(`❌ Error with question "${question}":`, error.message);
    }
  }
  
  console.log('🎯 Testing Complete!');
  console.log('\n📋 Summary:');
  console.log('✅ Personal questions should include specific details about Sahil Kulkarni');
  console.log('✅ Technical questions should reference personal experience when relevant');
  console.log('✅ All responses should be personalized and professional');
  console.log('\n💡 Tip: Check that responses mention:');
  console.log('  - Name: Sahil Kulkarni');
  console.log('  - Title: Full Stack Developer');
  console.log('  - Experience: 2+ years');
  console.log('  - Skills: React.js, Node.js, TypeScript, etc.');
  console.log('  - Projects: Cluely AI-Powered Coding Assistant');
  console.log('  - Current Role: Software Engineer at Tech Company');
}

// Run the test
testPersonalInterviewQuestions().catch(console.error);
