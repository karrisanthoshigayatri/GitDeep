# GitDeep

> **An AI-powered GitHub profile analyzer that delivers brutal, honest assessments of any developer's work — from code quality to career trajectory.**

<div align="center">

[![GitDeep Logo](https://raw.githubusercontent.com/Yuvraj-Sarathe/GitDeep/main/app/logo.png)](https://gitdeep.vercel.app)

### [🚀 Try GitDeep Live →](https://gitdeep.vercel.app)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-gitdeep.vercel.app-58A6FF?style=for-the-badge)](https://gitdeep.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-2EA043?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

</div>

GitDeep is a client-side web application that uses advanced AI models to evaluate GitHub profiles with unprecedented depth. Unlike traditional portfolio scanners, GitDeep performs behavioral analysis, buzzword detection, career slope tracking, and per-repository assessments to give you the full picture.

---

## ✨ Features

### 🎯 Dual Assessment Modes
- **Employer Mode**: Brutal hirability analysis with no sugar-coating. Evaluates weaknesses, red flags, buzzword density, and provides a 1-10 hirability score with role recommendations.
- **Developer Mode**: Same honest assessment plus a detailed mentorship plan with actionable improvement steps, project suggestions, and learning paths.

### 🔍 Deep Analysis Capabilities
- **Career Slope Detection**: Tracks trajectory from account creation to present — Rising Star, Steady Maintainer, Declining Activity, or Sporadic patterns. Includes burnout risk assessment.
- **Buzzword vs Reality Check**: Compares bio/README hype words against actual code. Detects when developers claim "AI/ML expert" but write basic CRUD apps.
- **AI Usage Quality Assessment**: Distinguishes lazy AI slop (generic gradients, broken links, emoji spam) from high-quality AI orchestration (production-grade architecture, intentional tech choices).
- **Behavioral Analysis**: Confidence vs Arrogance scoring. Detects toxic patterns in PRs and communication style.
- **Per-Repository Scoring**: Each repo gets an independent 1-10 score with verdict, key highlights, and red flags.
- **SWOT Analysis**: Strengths, Weaknesses, Opportunities (market positioning), and Threats.
- **Merged PR Analysis**: Evaluates contributions to external repositories, not just owned repos.

### 🔒 Privacy-First Architecture
- **No Database**: 100% session-based. Zero data storage on servers.
- **Client-Side Processing**: All AI calls happen from your browser. Your API keys never touch our servers.
- **No Tracking**: No analytics, no cookies, no telemetry.

### 🤖 AI Provider Flexibility
Choose from 12+ AI providers:
- **Cloud**: Gemini (free tier), OpenAI, Anthropic, Groq, DeepSeek, Mistral, OpenRouter, Grok, Qwen, Kimi, NVIDIA NIM
- **Local**: Ollama (run models like Llama 3.1, Qwen 2.5, Mistral locally)

### 📊 Rich Visualizations
- Language distribution pie charts
- Strength/weakness radar charts
- Career timeline with growth meter
- Comparative candidate analysis (Employer Mode)

### 🔧 Advanced Features
- **GitHub PAT Support**: Analyze private repos and increase API rate limits
- **Custom Questions**: Ask the AI specific questions about a candidate's suitability
- **Candidate Comparison**: Compare up to 5 developers side-by-side with AI-powered ranking
- **Prompt Size Options**: Full (1200 tokens) for cloud models, Small (400 tokens) for weak local models

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- An AI provider API key (Gemini recommended — has free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/Yuvraj-Sarathe/GitDeep.git
cd GitDeep

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

1. **Get an API Key** (Recommended: Gemini)
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Click "Get API Key" → Create API key (free tier available)
   - Copy the key

2. **Configure in App**
   - Click the Settings gear icon (bottom-right or top navigation)
   - Select AI Provider: **Gemini API**
   - Paste your API key
   - Model: `gemini-2.5-flash` (default)
   - Prompt Size: **Full** (recommended)

3. **Optional: GitHub PAT Token**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Generate token with `repo` and `user` scopes
   - Add in Settings → GitHub PAT Token field
   - Benefits: Higher API rate limits, private repo analysis, more PR data

### Usage

1. Enter a GitHub username (e.g., `torvalds`)
2. Choose mode: **Employer** (hiring) or **Developer** (mentorship)
3. Click **Generate Assessment**
4. Wait 10-30 seconds for analysis
5. Review the detailed report, metrics, and recommendations

---

## 🐳 Docker Deployment

```bash
# Build the image
docker build -t gitdeep .

# Run the container
docker run -p 3000:3000 gitdeep
```

Access at [http://localhost:3000](http://localhost:3000)

---

## 🧠 Using Local AI Models (Ollama)

For complete privacy and no API costs, run AI models locally:

### Setup Ollama

1. **Install Ollama**
   - Download from [ollama.com](https://ollama.com)
   - Install for your OS (Windows/Mac/Linux)

2. **Pull a Model**
   ```bash
   # Recommended for 8GB RAM (best balance)
   ollama pull qwen2.5:7b
   
   # Alternative: Mistral 7B
   ollama pull mistral
   
   # For 16GB+ RAM (better quality)
   ollama pull llama3.1:8b
   
   # ⚠️ NOT recommended (too small for this task)
   # ollama pull phi
   # ollama pull llama3.2:1b
   ```

3. **Start Ollama Server**
   ```bash
   ollama serve
   ```
   Keep this terminal running.

4. **Configure GitDeep**
   - Settings → AI Provider → **Local Ollama**
   - Endpoint: `http://localhost:11434`
   - Model: `qwen2.5:7b`
   - Prompt Size: **Full** (if using 7B+ model)

### Model Recommendations

| Scenario | Model | RAM | Prompt Size | Employer Mode? |
|----------|-------|-----|-------------|----------------|
| **Best Overall** | Gemini 2.5 Flash (cloud) | N/A | Full | ✅ Yes |
| **Premium Cloud** | GPT-4o, Claude Sonnet 4 | N/A | Full | ✅ Yes |
| **Local Strong** | Llama 3.1 8B, Gemma 2 9B | 16GB | Full | ✅ Yes |
| **Local Mid** | Qwen 2.5 7B, Mistral 7B | 8GB | Full | ✅ Yes |
| **Local Weak** | Phi-3, Llama 3.2 3B | 4GB | Small | ❌ No |
| **Too Small** | Phi-1, TinyLlama | 2GB | Small | ❌ No |

**Important**: Small models (< 7B parameters) produce inaccurate results including wrong scores, missing red flags, and useless analysis. Use cloud models or 7B+ local models for reliable assessments.

---

## 📖 How It Works

### Assessment Logic

1. **Data Collection** (via GitHub API)
   - User profile (bio, location, company, social links)
   - Top 15 non-fork repositories
   - README contents (first 1500 chars per repo)
   - Language statistics (actual byte counts)
   - Merged pull requests in external repos
   - Account age and activity patterns

2. **AI Analysis** (1200-token instruction prompt)
   - 3-tier band scoring system (1-4 Weak, 5-7 Average, 8-10 Strong)
   - Hard signals: (a) merged PRs, (b) original repos with READMEs, (c) 6+ months consistency
   - Behavioral pattern detection
   - Buzzword extraction and tech stack verification
   - AI slop detection vs quality orchestration
   - Career trajectory calculation
   - Per-repo independent scoring

3. **Output Generation**
   - Hirability score (1.0-10.0, never exactly 7.0)
   - SWOT analysis (all 4 fields always populated)
   - Detailed markdown report with structured sections
   - Radar charts for strengths/weaknesses
   - Timeline visualization
   - Role recommendations

### Score Stability

The hirability score uses a **fixed 3-tier band system** to ensure consistency:
- Maximum deviation between assessments of the same profile: **±1.0**
- Temperature locked to 0 for deterministic output
- Band determined by presence/absence of 3 hard signals
- Fine-tuning within band based on quality factors

---

## ⚠️ Known Limitations & Drawbacks

### Current Issues

1. **Small Model Performance**
   - Models under 7B parameters (Phi, Llama 3.2 1B/3B, TinyLlama) produce unreliable results
   - Small prompt mode (400 tokens) sacrifices depth and accuracy
   - **Status**: Actively working on optimizing small prompts for employer mode

2. **API Rate Limits**
   - GitHub API: 60 requests/hour without token, 5000 with token
   - Search API (for PRs): 10 requests/min without token, 30 with token
   - Analyzing multiple candidates quickly can hit limits

3. **PR Data Limitations**
   - Only fetches top 15 merged PRs (GitHub Search API limit)
   - Cannot access PR diff details without individual API calls (would hit rate limits)
   - Lines added/deleted currently set to 0

4. **README Truncation**
   - Only first 1500 characters of each README analyzed
   - Large documentation may be incompletely assessed

5. **Language Detection**
   - Relies on GitHub's language detection (can be inaccurate for mixed projects)
   - Generated/vendor code may skew language percentages

6. **Private Repo Analysis**
   - Requires GitHub PAT token with appropriate scopes
   - Token must be manually entered (no OAuth flow)

7. **Session Storage Limits**
   - Assessed candidates stored in browser session storage (~5-10MB limit)
   - Clearing browser data loses comparison history
   - Private/incognito mode may block session storage

8. **AI Hallucinations**
   - AI may occasionally infer details not present in data
   - Behavioral analysis based on limited text samples (READMEs, bio)
   - Confidence scores are AI estimates, not measured metrics

9. **No Real-Time Updates**
   - Assessment is a snapshot at analysis time
   - Must re-run to see updated profile data

10. **Context Window Constraints**
    - Full prompt + profile data can exceed 8K tokens for prolific developers
    - May require switching to models with larger context (32K+)

### Planned Improvements

- [ ] Optimize small prompt for employer mode accuracy
- [ ] Add caching layer for GitHub API responses
- [ ] Implement progressive README loading
- [ ] Add PR diff analysis (with rate limit handling)
- [ ] Export assessment reports as PDF/Markdown
- [ ] Add assessment history persistence (localStorage)
- [ ] Implement OAuth flow for GitHub authentication
- [ ] Add support for GitLab and Bitbucket profiles

---

## 🤝 Contributing

**Help is appreciated!** GitDeep is actively being improved, and contributions are welcome.

### How to Contribute

1. **Report Issues**
   - Found a bug? [Open an issue](https://github.com/Yuvraj-Sarathe/GitDeep/issues)
   - Include: Steps to reproduce, expected vs actual behavior, browser/OS, AI provider used

2. **Request Features**
   - Have an idea? [Open a feature request](https://github.com/Yuvraj-Sarathe/GitDeep/issues)
   - Describe the use case and expected behavior

3. **Submit Pull Requests**
   - Fork the repository
   - Create a feature branch (`git checkout -b feature/amazing-feature`)
   - Commit changes (`git commit -m 'Add amazing feature'`)
   - Push to branch (`git push origin feature/amazing-feature`)
   - Open a Pull Request

### Current Focus Areas

- **Small Model Optimization**: Making 3B-7B models produce employer-grade assessments
- **Prompt Engineering**: Reducing token count while maintaining analysis depth
- **Rate Limit Handling**: Smarter API call batching and caching
- **UI/UX Improvements**: Better mobile responsiveness, loading states

### Development Guidelines

- Follow existing code style (ESLint config provided)
- Test with multiple AI providers before submitting
- Update README if adding new features
- Keep client-side architecture (no server-side data storage)

---

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1
- **Charts**: Recharts 3.8
- **GitHub API**: Octokit 5.0
- **AI SDKs**: Google GenAI, native fetch for others
- **Markdown**: react-markdown 10.1

### Project Structure

```
GitDeep/
├── app/
│   ├── page.tsx              # Home page (username input)
│   ├── assessment/page.tsx   # Assessment results page
│   ├── help/page.tsx         # Help & documentation
│   ├── layout.tsx            # Root layout with footer
│   ├── globals.css           # Global styles
│   └── api/ai/route.ts       # Server-side AI proxy (Ollama, OpenAI-compatible)
├── components/
│   └── SettingsModal.tsx     # Settings configuration UI
├── lib/
│   ├── ai.ts                 # AI provider logic & prompt engineering
│   ├── github.ts             # GitHub API data fetching
│   ├── store.tsx             # React Context for settings
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # Utility functions
├── public/
│   └── icon.svg              # Favicon
└── package.json
```

### Data Flow

1. User enters GitHub username → `app/page.tsx`
2. Navigate to `/assessment?user=username&mode=employer`
3. `fetchGitHubProfile()` calls GitHub API → `lib/github.ts`
4. `generateAssessment()` sends data to AI → `lib/ai.ts`
5. AI response parsed and normalized → `AssessmentResult`
6. Results rendered with charts and markdown → `app/assessment/page.tsx`
7. Session storage saves candidate for comparison

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨💻 Developer

**Yuvraj Sarathe**

- 🐙 GitHub: [@Yuvraj-Sarathe](https://github.com/Yuvraj-Sarathe)
- 🌐 Portfolio: [yuvraj-sarathe.github.io/Portfolio](https://yuvraj-sarathe.github.io/Portfolio/)
- 💼 LinkedIn: [yuvraj-sarathe](https://www.linkedin.com/in/yuvraj-sarathe)
- 🧩 LeetCode: [Yuvraj_Sarathe](https://leetcode.com/u/Yuvraj_Sarathe/)

---

## 🙏 Acknowledgments

- GitHub API for comprehensive developer data
- Google Gemini for reliable free-tier AI access
- Ollama community for local model support
- Next.js team for excellent developer experience

---

## 📞 Support

If you find GitDeep useful, please ⭐ star the repository!

For questions or issues:
- Open an issue on [GitHub Issues](https://github.com/Yuvraj-Sarathe/GitDeep/issues)
- Check the [Help Page](https://gitdeep.vercel.app/help) for detailed documentation
- Try the live app at [gitdeep.vercel.app](https://gitdeep.vercel.app)

---

<div align="center">

**Built with ❤️ by developers, for developers**

[Try GitDeep Now](https://gitdeep.vercel.app) | [Report Bug](https://github.com/Yuvraj-Sarathe/GitDeep/issues) | [Request Feature](https://github.com/Yuvraj-Sarathe/GitDeep/issues)

</div>
