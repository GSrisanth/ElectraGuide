# ElectraGuide 🗳️

ElectraGuide is a modern, interactive web application designed to simplify the Indian election process. It serves as an educational dashboard featuring a step-by-step timeline, a glossary of key terms, an eligibility checker, a voting day guide, an interactive quiz, and an AI-powered assistant (powered by Google Gemini) to answer any questions related to elections.

## ✨ Features

- **Dynamic Dashboard:** A beautiful, responsive grid layout for easy navigation.
- **Dark Mode:** A sleek, fully integrated dark mode toggle for comfortable nighttime reading.
- **AI Assistant:** A secure backend proxy connecting to Google Gemini 2.5 Flash to answer user queries safely without exposing API keys.
- **State-Based Navigation:** Fast, seamless transitions between sections without page reloads.
- **Modern UI:** Built with Tailwind CSS v4, featuring glassmorphism, smooth animations, and premium color palettes.

## 🚀 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS v4, Lucide React (Icons)
- **Backend:** Node.js, Express, CORS, dotenv
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`)

## 🛠️ Getting Started

To run this project locally, you will need Node.js installed.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/electraguide.git
cd electraguide
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API key:
\`\`\`env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
\`\`\`

### 4. Run the Backend Server
In one terminal, start the Express proxy server:
\`\`\`bash
node server.js
\`\`\`

### 5. Run the Frontend Server
In a second terminal, start the Vite development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application!

## 🔒 Security Note
The `.env` file is intentionally added to `.gitignore` to prevent your API key from being pushed to GitHub. Never commit your API key to a public repository!
