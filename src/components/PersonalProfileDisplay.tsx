import React from 'react';

interface PersonalProfileDisplayProps {
  variant?: 'full' | 'compact' | 'interview-ready';
}

const PersonalProfileDisplay: React.FC<PersonalProfileDisplayProps> = ({ variant = 'compact' }) => {
  // This component could fetch personal info from the backend in a real implementation
  // For now, we'll display static info that matches what's in PersonalProfile.ts
  
  const profile = {
    name: "Sahil Kulkarni",
    title: "Full Stack Developer | AI/ML Enthusiast",
    location: "Nashik, Maharashtra, India",
    experience: {
      totalYears: 1
    },
    skills: {
      programmingLanguages: ["C++", "C", "SQL", "Python", "JavaScript", "HTML"],
      frameworksLibraries: ["React.js", "Express.js", "Node.js", "Tailwind CSS", "jQuery", "TensorFlow", "PyTorch", "CSS", "Next.js"],
      databasesTools: ["MongoDB", "SQL", "Docker", "Git", "LangChain", "Linux", "macOS", "Google Cloud Platform", "MCP"]
    },
    projects: [
      {
        name: "Resume Agent – AI-Powered Job Application Bot",
        description: "AI agent to auto-apply for internships on Internshala via headless browser automation using Python, LangChain, and Gemini AI"
      }
    ]
  };

  if (variant === 'compact') {
    return (
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <span className="text-blue-400 font-semibold text-sm">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{profile.name}</h3>
            <p className="text-gray-400 text-xs">{profile.title} • {profile.experience.totalYears}+ years exp</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'interview-ready') {
    return (
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <span className="text-green-400 font-semibold">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="text-white font-medium">{profile.name}</h3>
            <p className="text-gray-400 text-sm">{profile.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs">Interview Mode Active</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-xs">
            <span className="text-gray-400">Experience:</span>
            <span className="text-gray-200 ml-2">{profile.experience.totalYears}+ years in Full Stack Development</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-400">Primary Skills:</span>
            <span className="text-gray-200 ml-2">{profile.skills.frameworksLibraries.slice(0, 2).join(', ')}, {profile.skills.programmingLanguages.slice(0, 2).join(', ')}</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-400">Key Project:</span>
            <span className="text-gray-200 ml-2">{profile.projects[0].name}</span>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
          <span className="text-blue-400 font-semibold text-lg">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">{profile.name}</h3>
          <p className="text-gray-400">{profile.title}</p>
          <p className="text-gray-500 text-sm">{profile.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-white font-medium text-sm mb-2">Experience</h4>
          <p className="text-gray-300 text-xs">
            {profile.experience.totalYears}+ years in Full Stack Development & AI/ML
          </p>
          <p className="text-gray-400 text-xs">Student at K. K. Wagh Institute of Engineering</p>
        </div>

        <div>
          <h4 className="text-white font-medium text-sm mb-2">Technical Skills</h4>
          <div className="space-y-1">
            <div className="text-xs">
              <span className="text-gray-400">Languages:</span>
              <span className="text-gray-300 ml-1">{profile.skills.programmingLanguages.slice(0, 4).join(', ')}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">Frameworks:</span>
              <span className="text-gray-300 ml-1">{profile.skills.frameworksLibraries.slice(0, 4).join(', ')}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">Tools:</span>
              <span className="text-gray-300 ml-1">{profile.skills.databasesTools.slice(0, 4).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-white font-medium text-sm mb-2">Featured Project</h4>
        <div className="bg-gray-800/50 rounded p-3">
          <h5 className="text-blue-400 font-medium text-xs">{profile.projects[0].name}</h5>
          <p className="text-gray-300 text-xs mt-1">{profile.projects[0].description}</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfileDisplay;
