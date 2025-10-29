# Free Cluely - AI-Powered Coding & Interview Assistant

A personalized desktop application that helps with coding problems and interview preparation using AI. Now includes **personalized interview responses** based on your professional profile!

## 🚀 Quick Start Guide

### Prerequisites
- Make sure you have Node.js installed on your computer
- Git installed on your computer
- A Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation Steps

1. Clone the repository:
```bash
git clone [repository-url]
cd free-cluely
```

2. Install dependencies:
```bash
npm install
```

3. **IMPORTANT**: Personalize your profile:
   - Open `electron/PersonalProfile.ts`
   - Update your personal information:
     - Name, title, experience
     - Skills, projects, achievements
     - Current role and company
   - This enables personalized interview responses!

4. Set up environment variables:
   - Create a file named `.env` in the root folder
   - Add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   - Save the file

### Running the App

#### Method 1: Development Mode (Recommended for first run)
1. Open a terminal and run:
```bash
npm run dev -- --port 5180
```

2. Open another terminal in the same folder and run:
```bash
NODE_ENV=development npm run electron:dev
```

#### Method 2: Production Mode
```bash
npm run build
```
The built app will be in the `release` folder.

### ⚠️ Important Notes

1. **Closing the App**: 
   - Press `Cmd + Q` (Mac) or `Ctrl + Q` (Windows/Linux) to quit
   - Or use Activity Monitor/Task Manager to close `Interview Coder`
   - The X button currently doesn't work (known issue)

2. **If the app doesn't start**:
   - Make sure no other app is using port 5180
   - Try killing existing processes:
     ```bash
     # Find processes using port 5180
     lsof -i :5180
     # Kill them (replace [PID] with the process ID)
     kill [PID]
     ```

3. **Keyboard Shortcuts**:
   - `Cmd/Ctrl + B`: Toggle window visibility
   - `Cmd/Ctrl + H`: Take screenshot
   - 'Cmd/Enter': Get solution
   - `Cmd/Ctrl + Arrow Keys`: Move window

### Troubleshooting

If you see errors:
1. Delete the `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. Try running the app again using Method 1

## 🎯 Personalized Interview Features

This app now includes **personalized interview responses** based on your professional profile!

### How It Works

1. **Personal Profile Setup**: 
   - Your information is stored in `electron/PersonalProfile.ts`
   - Update it with your real experience, skills, and projects
   - This enables contextual, personalized responses

2. **Interview Question Detection**:
   - The app automatically detects interview-style questions
   - Personal questions get customized responses about YOU
   - Technical questions include your relevant experience

3. **Supported Question Types**:
   - **Personal**: "Tell me about yourself", "What's your experience?", "Why should we hire you?"
   - **Technical**: "Explain React", "How does authentication work?", "Node.js vs Python"
   - **Experience**: "Tell me about your projects", "What are your strengths?"

### Example Responses

**Before (Generic)**:
- Question: "Tell me about yourself"
- Response: "I'm a software engineer with experience in web development..."

**After (Personalized)**:
- Question: "Tell me about yourself"  
- Response: "Hi, I'm Sahil Kulkarni, a Full Stack Developer with 2+ years of experience. I'm currently working as a Software Engineer at Tech Company, where I focus on full-stack development using modern technologies like React, Node.js, and cloud platforms..."

### Testing Your Personal Profile

Run the test script to verify your personalization:
```bash
# Set your API key first
export GOOGLE_API_KEY="your-gemini-api-key"

# Run the test
node test-personal-interview-responses.js
```

### Audio Interview Mode

When you record audio questions, the app will:
1. Transcribe your question
2. Detect if it's interview-related
3. Provide personalized responses using your profile
4. Display your profile card in "interview-ready" mode

### Customizing Your Profile

Edit `electron/PersonalProfile.ts` with your information:

```typescript
export const personalProfile: PersonalProfile = {
  name: "Your Name",
  title: "Your Title", 
  experience: {
    totalYears: 3,
    current: {
      position: "Your Current Role",
      company: "Your Company",
      // ...your responsibilities
    }
  },
  skills: {
    frontend: ["React.js", "TypeScript", "etc."],
    backend: ["Node.js", "Python", "etc."],
    // ...your actual skills
  },
  projects: [
    {
      name: "Your Key Project",
      description: "What it does...",
      technologies: ["Tech", "Stack"],
      highlights: ["Key achievements..."]
    }
  ]
  // ...more sections
};
```

After updating, rebuild the app:
```bash
npm run build
```

## Contribution

I'm unable to maintain this repo actively because I do not have the time for it. Please do not create issues, if you have any PRs feel free to create them and i'll review and merge it.

If you are looking to integrate this for your company, i can work with you to create custom solution. Reach out on [twitter](https://x.com/prathitjoshi_)
