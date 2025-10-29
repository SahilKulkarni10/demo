// quick-demo.js - Demonstrates the personal profile functionality
const { personalProfile, PersonalProfileHelper } = require('./electron/PersonalProfile.js');

console.log('🎯 Personal Interview System Demo\n');

console.log('👤 Personal Profile Summary:');
console.log(`Name: ${personalProfile.name}`);
console.log(`Title: ${personalProfile.title}`);
console.log(`Experience: ${personalProfile.experience.totalYears}+ years`);
console.log(`Location: ${personalProfile.location}\n`);

console.log('🛠️ Technical Skills:');
console.log(`Programming Languages: ${personalProfile.skills.programmingLanguages.slice(0, 5).join(', ')}`);
console.log(`Frameworks/Libraries: ${personalProfile.skills.frameworksLibraries.slice(0, 5).join(', ')}`);
console.log(`Databases/Tools: ${personalProfile.skills.databasesTools.slice(0, 3).join(', ')}\n`);

console.log('🚀 Key Project:');
const mainProject = personalProfile.projects[0];
console.log(`Name: ${mainProject.name}`);
console.log(`Description: ${mainProject.description}`);
console.log(`Technologies: ${mainProject.technologies.join(', ')}\n`);

console.log('💼 Sample Interview Responses:\n');

console.log('📋 Helper Methods Demo:');
console.log('1. Introduction:');
console.log(`   ${PersonalProfileHelper.getIntroduction()}\n`);

console.log('2. Technical Skills Summary:');
console.log(`   ${PersonalProfileHelper.getTechnicalSkillsSummary()}\n`);

console.log('3. Project Highlight:');
console.log(`   ${PersonalProfileHelper.getProjectHighlight()}\n`);

console.log('4. Strengths & Goals:');
console.log(`   ${PersonalProfileHelper.getStrengthsAndGoals()}\n`);

console.log('🔧 Relevant Experience for React:');
const reactExperience = PersonalProfileHelper.getRelevantExperience('React development');
reactExperience.forEach((exp, index) => {
  console.log(`   ${index + 1}. ${exp}`);
});

console.log('\n✅ Personal Profile System is Ready!');
console.log('\n📝 Next Steps:');
console.log('1. Update PersonalProfile.ts with your actual information');
console.log('2. Test with: node test-personal-interview-responses.js');
console.log('3. Run the app and try asking interview questions via audio');
console.log('4. The app will now provide personalized responses!');
