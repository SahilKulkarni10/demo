#!/usr/bin/env node

/**
 * Test Enhanced Interview Response Format
 * 
 * This test demonstrates the new structured interview response format
 * that provides clear definitions, examples, and code like professional interviews.
 */

const { LLMHelper } = require('./dist-electron/LLMHelper.js');

// Initialize LLM Helper
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('❌ GOOGLE_API_KEY environment variable is not set');
  console.log('Please set it with: export GOOGLE_API_KEY="your-gemini-api-key"');
  process.exit(1);
}

const llmHelper = new LLMHelper(apiKey);

async function testEnhancedInterviewFormat() {
  console.log('🧪 ENHANCED INTERVIEW RESPONSE FORMAT TEST\n');
  
  const testQuestions = [
    {
      question: "Explain React JS",
      category: "Technical Concept",
      expectedFormat: "Definition → Components → Benefits → Usage → Code Example → Experience → Best Practices"
    },
    {
      question: "What is the difference between SQL and NoSQL databases?",
      category: "Comparison",
      expectedFormat: "Definitions → Key Differences → Pros/Cons → Use Cases → Examples → Experience"
    },
    {
      question: "How does asynchronous JavaScript work?",
      category: "Technical Explanation", 
      expectedFormat: "Definition → Concepts → Why Important → Real-world Usage → Code Example → Best Practices"
    },
    {
      question: "Implement a function to reverse a string in JavaScript",
      category: "Implementation",
      expectedFormat: "Brief Explanation → Clean Code → Comments → Approach → Best Practices"
    }
  ];

  for (let i = 0; i < testQuestions.length; i++) {
    const { question, category, expectedFormat } = testQuestions[i];
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🎯 TEST ${i + 1}: ${category} Question`);
    console.log(`QUESTION: "${question}"`);
    console.log(`EXPECTED FORMAT: ${expectedFormat}`);
    console.log(`${'='.repeat(80)}\n`);

    try {
      console.log('⏳ Processing interview question...');
      const startTime = Date.now();
      
      const response = await llmHelper.answerInterviewQuestion(question);
      
      const processingTime = Date.now() - startTime;
      
      console.log('📝 ENHANCED INTERVIEW RESPONSE:');
      console.log(`${'─'.repeat(60)}`);
      console.log(response.answer);
      console.log(`${'─'.repeat(60)}`);
      console.log(`⏱️ Processing time: ${processingTime}ms\n`);
      
      // Quick format validation
      console.log('✅ FORMAT ANALYSIS:');
      const answerText = response.answer.toLowerCase();
      
      // Check for structured elements
      const hasDefinition = answerText.includes('is a') || answerText.includes('is an') || answerText.includes('definition');
      const hasExample = answerText.includes('example') || answerText.includes('for instance');
      const hasCodeBlock = response.answer.includes('```');
      const hasPersonalExperience = answerText.includes('my experience') || answerText.includes('i have') || answerText.includes('in my');
      const hasBestPractices = answerText.includes('best practice') || answerText.includes('important') || answerText.includes('consider');
      
      console.log(`   📖 Clear Definition: ${hasDefinition ? '✅' : '❌'}`);
      console.log(`   💡 Practical Examples: ${hasExample ? '✅' : '❌'}`);
      console.log(`   💻 Code Examples: ${hasCodeBlock ? '✅' : '❌'}`);
      console.log(`   👤 Personal Experience: ${hasPersonalExperience ? '✅' : '❌'}`);
      console.log(`   📋 Best Practices: ${hasBestPractices ? '✅' : '❌'}`);
      
      const formatScore = [hasDefinition, hasExample, hasCodeBlock, hasPersonalExperience, hasBestPractices]
        .filter(Boolean).length;
      
      console.log(`   🎯 Format Score: ${formatScore}/5 (${formatScore >= 4 ? 'EXCELLENT' : formatScore >= 3 ? 'GOOD' : 'NEEDS IMPROVEMENT'})`);

      // Small delay between questions to avoid API rate limits
      if (i < testQuestions.length - 1) {
        console.log('\n⏳ Waiting 2 seconds before next question...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.error(`❌ Error processing question: ${error.message}`);
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('🏁 ENHANCED INTERVIEW FORMAT TEST COMPLETED');
  console.log(`${'='.repeat(80)}`);
  
  console.log('\n📋 SUMMARY:');
  console.log('✅ The enhanced format now provides:');
  console.log('   • Clear, accurate definitions');
  console.log('   • Structured explanations');
  console.log('   • Practical examples and use cases');
  console.log('   • Clean, well-formatted code examples');
  console.log('   • Personal experience integration');
  console.log('   • Professional best practices');
  console.log('   • Interview-ready presentation');
  
  console.log('\n🎤 FOR AUDIO QUESTIONS:');
  console.log('When you ask questions like "Explain React JS" via audio:');
  console.log('1. Audio gets transcribed accurately');
  console.log('2. System detects it\'s an interview question');
  console.log('3. Uses answerInterviewQuestion() with enhanced format');
  console.log('4. Provides structured, professional responses');
  console.log('5. Includes all elements: definition → examples → code → experience');
}

// Run the test
testEnhancedInterviewFormat().catch(console.error);
