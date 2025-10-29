// Test script to verify personal project detection and response generation
const { PersonalProfileHelper } = require('./dist-electron/PersonalProfile.js');

console.log('🧪 Testing Personal Project Detection\n');

// Test personal profile helper functions
console.log('📋 Testing PersonalProfileHelper functions:');
console.log('1. Introduction:');
console.log(`   ${PersonalProfileHelper.getIntroduction()}\n`);

console.log('2. Technical Skills Summary:');
console.log(`   ${PersonalProfileHelper.getTechnicalSkillsSummary()}\n`);

console.log('3. Project Highlight:');
console.log(`   ${PersonalProfileHelper.getProjectHighlight()}\n`);

console.log('4. Strengths & Goals:');
console.log(`   ${PersonalProfileHelper.getStrengthsAndGoals()}\n`);

// Test specific project experience
console.log('🔧 Testing Relevant Experience Detection:');

const testQuestions = [
  'resume refine',
  'ResumeRefine project',
  'tell me about resume refine',
  'campus connect',
  'CampusConnect',
  'research paper agent',
  'meta connect'
];

testQuestions.forEach((question, index) => {
  console.log(`${index + 1}. Question: "${question}"`);
  const experience = PersonalProfileHelper.getRelevantExperience(question);
  experience.forEach((exp, expIndex) => {
    console.log(`   ${expIndex + 1}. ${exp}`);
  });
  console.log('');
});

console.log('✅ Personal Project Detection Test Complete!');
console.log('\n📝 Next Steps:');
console.log('1. Test with the actual LLM by asking about your projects');
console.log('2. Questions like "tell me about ResumeRefine" should now work');
console.log('3. The system should recognize your project names and provide personal responses');
