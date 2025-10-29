/**
 * Personal Profile for Sahil Kulkarni - JavaScript Version
 * Updated according to latest resume
 */

const personalProfile = {
  name: "Sahil Kulkarni",
  title: "Full Stack Developer | AI/ML Enthusiast",
  email: "kulkarnisahil882@gmail.com",
  phone: "+91-8329076760",
  location: "Nashik, Maharashtra, India",
  
  experience: {
    totalYears: 1, // Based on project and hackathon experience
  },

  education: [
    {
      degree: "B.Tech in Computer Engineering",
      institution: "K. K. Wagh Institute of Engineering Education and Research, Nashik",
      year: "2022 - 2026"
    },
    {
      degree: "HSC",
      institution: "Amro Junior College of Arts, Science and Commerce",
      year: "2020 - 2022",
      percentage: "70%"
    },
    {
      degree: "CBSE",
      institution: "Delhi Public School, Nashik",
      year: "2018 - 2020",
      percentage: "81%"
    }
  ],

  certifications: [
    "Machine Learning A-Z: AI, Python & R + ChatGPT Prize (2024), Udemy",
    "The Complete 2024 Web Development Bootcamp, React Native, Udemy",
    "AWS Academy Graduate - AWS Academy Cloud Foundations"
  ],

  skills: {
    programmingLanguages: ["C++", "C", "SQL", "Python", "JavaScript", "HTML"],
    frameworksLibraries: [
      "React.js", "Express.js", "Node.js", "Tailwind CSS", "jQuery",
      "TensorFlow", "PyTorch", "CSS", "Next.js"
    ],
    databasesTools: [
      "MongoDB", "SQL", "Docker", "Git", "LangChain", "Linux", "macOS",
      "Google Cloud Platform", "MCP"
    ],
    other: [
      "AI Agents", "SaaS Module Development", "Critical Thinking",
      "Remote Collaboration", "System Design Thinking"
    ]
  },

  projects: [
    {
      name: "Resume Agent – AI-Powered Job Application Bot",
      description: "AI agent to auto-apply for internships on Internshala via headless browser automation.",
      technologies: ["Python", "LangChain", "Gemini (Google Generative AI)", "Browser-use"],
      highlights: [
        "Automates internship applications via headless browser",
        "Uses AI for intelligent internship selection and auto-form filling"
      ],
      link: "https://github.com/SahilKulkarni10/Resume_Agent"
    },
    {
      name: "CampusConnect",
      description: "Collaborative platform connecting students for hackathons and college events.",
      technologies: ["MERN Stack", "Socket.IO"],
      highlights: [
        "Real-time chat features using WebSockets",
        "Enhanced peer communication for events and hackathons"
      ],
      link: "https://github.com/SahilKulkarni10/CampusConnect"
    },
    {
      name: "ResumeRefine",
      description: "AI platform for job description analysis, resume parsing, and candidate ranking.",
      technologies: ["MERN Stack", "AI/ML"],
      highlights: [
        "Automated job-candidate matching",
        "Improved accuracy using advanced ML techniques"
      ],
      link: "https://github.com/SahilKulkarni10/ResumeRefine"
    },
    {
      name: "MetaConnect – AI-Powered Networking App",
      description: "Mobile-first platform enabling developers to discover events, connect, and chat in real time.",
      technologies: ["React Native", "Socket.IO", "MongoDB"],
      highlights: [
        "Smart filtering and personalized recommendations",
        "Real-time chat and community engagement"
      ],
      link: "https://github.com/SahilKulkarni10/MetaConnect"
    },
    {
      name: "Research Paper Agent – AI-Powered Search Tool",
      description: "AI agent to search research papers on sepsis detection.",
      technologies: ["Python", "LangChain", "Gemini (Google Generative AI)", "Browser-use"],
      highlights: [
        "Autonomous browsing for PubMed, arXiv, Google Scholar",
        "Extracts and compiles relevant research paper links"
      ],
      link: "https://github.com/SahilKulkarni10/researchpaper.ai"
    }
  ],

  achievements: [
    "Top 10 finalist among 580 teams in National Shastra Smart City Challenge",
    "Top 30 in Kleos 2.0 Hackathon from over 500 teams"
  ],

  strengths: [
    "Strong problem-solving and analytical skills",
    "Excellent communication and teamwork abilities",
    "Quick learner with adaptability to new technologies",
    "Detail-oriented with focus on code quality",
    "Passionate about continuous learning and improvement"
  ],

  careerGoals: [
    "Become a senior full-stack developer with expertise in modern technologies",
    "Lead development teams and mentor other developers",
    "Contribute to large-scale, impactful software projects",
    "Stay updated with emerging technologies and industry trends",
    "Build innovative solutions that solve real-world problems"
  ],

  coCurricular: [
    "Core Member of CSI – Event organization, teamwork, leadership, sponsorship management",
    "Winner of intra-college football tournament",
    "Champion of CPL (Computer Premier League)"
  ]
};

/**
 * Helper class to format interview-ready responses
 */
class PersonalProfileHelper {
  static getIntroduction() {
    const profile = personalProfile;
    return `Hi, I'm ${profile.name}, a ${profile.title} with strong experience in building AI-powered and full-stack applications. I specialize in modern frameworks like React.js and Node.js, AI/ML integrations, and cloud platforms.`;
  }

  static getTechnicalSkillsSummary() {
    const profile = personalProfile;
    return `My technical expertise spans programming languages like ${profile.skills.programmingLanguages.join(', ')}, frameworks such as ${profile.skills.frameworksLibraries.slice(0, 5).join(', ')}, and tools like ${profile.skills.databasesTools.slice(0, 5).join(', ')}. I also excel in AI Agents and system design thinking.`;
  }

  static getProjectHighlight() {
    const profile = personalProfile;
    const mainProject = profile.projects[0];
    return `One of my recent projects is ${mainProject.name}, which is ${mainProject.description} Built using ${mainProject.technologies.join(', ')}, it showcases my expertise in AI integration, automation, and full-stack development.`;
  }

  static getStrengthsAndGoals() {
    const profile = personalProfile;
    return `My key strengths include ${profile.strengths.slice(0, 2).join(' and ')}. I aim to ${profile.careerGoals[0].toLowerCase()} while contributing to impactful and innovative software products.`;
  }

  static getRelevantExperience(topic) {
    const profile = personalProfile;
    const topicLower = topic.toLowerCase();
    const experiences = [];

    profile.projects.forEach(project => {
      if (project.technologies.some(tech => tech.toLowerCase().includes(topicLower))) {
        experiences.push(`${project.name}: ${project.highlights.join('; ')}`);
      }
    });

    return experiences.length > 0 ? experiences : ["Relevant experience not found for this topic."];
  }
}

module.exports = {
  personalProfile,
  PersonalProfileHelper
};
