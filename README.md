# AI Resume Analyzer 🚀

A next-generation, AI-powered resume optimization tool that uses highly-advanced gamification, cyberpunk aesthetics, and a multi-tier AI fallback engine to dramatically increase your chances of bypassing Applicant Tracking Systems (ATS) and impressing human recruiters.

## ✨ Features
- **Cyberpunk UI:** Built with React Router 7, Tailwind CSS v4, and Framer Motion.
- **AI Engine:** Analyzes your resume using a multi-tier AI setup (Google Gemini 2.0 Flash -> Groq -> OpenRouter).
- **OCR Integration:** Automatically rasterizes and reads your PDF uploads using PDF.js.
- **Supabase Backend:** Serverless API architecture securely managed with Row Level Security (RLS) in PostgreSQL.
- **Flawless PDF Export:** Custom native print layout to effortlessly export your analysis as an A4 document without black bars or cutoffs.
- **Docker & CI/CD Ready:** Configured with GitHub Actions and Docker Compose for instant cloud deployment.

## 🚀 How to Run Locally

If you are opening this project on a new laptop, follow these exact steps to get it running flawlessly:

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **Git**
- A free **Supabase** account (for your database and storage).

### 2. Setup the Code
```bash
# Clone the repository
git clone https://github.com/KARTIKEYARAWAT/AIResumeAnalyzer.git
cd AIResumeAnalyzer

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of the project and add the following keys. You must provide your own API keys.
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Provider Keys
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Setup the Supabase Database
Run the included setup scripts to automatically construct your Postgres tables and storage buckets:
```bash
# Ensure your .env file is populated first!
node setup-db.js
node setup-storage.js
```

### 5. Launch the App
```bash
npm run dev
```
The app will now be running at `http://localhost:5173`. 

## 🐳 Docker Deployment
You can deploy this anywhere using the provided `docker-compose.yml`:
```bash
docker-compose up -d
```
*Note: Make sure your `.env` file is present in the same directory before running Docker.*
