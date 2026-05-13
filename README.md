# GitHub AI Assessor

An AI-powered web platform that provides brutal, honest, and analytical assessments of any developer's GitHub profile. Built completely **client-side** to ensure your API keys and data remain entirely private.

## Features

- **No Database:** Session-based only. No data leakage or storage. Everything is analyzed dynamically on your client.
- **Employer Mode:** Brutal breakdown of candidate strengths, weaknesses, actual skills vs buzzwords, PRs analyzed, and overall hirability score.
- **Developer Mode:** A critical but constructive report on what to add, omit, edit. Includes a structured 5-week roadmap for improvement based on repo history.
- **GitHub Token & Private Repos:** Add your GitHub token in the settings menu (gear icon) to increase rate limits or analyze your private repositories.
- **AI Freedom:** Choose between the 'gemini' API directly or run your own local 'ollama' server!
- **Deep Metrics:** Includes language breakdown and activity statistics.

## Setup & Usage

### Web Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Open \`http://localhost:3000\`

### Using Local Ollama

1. Ensure Ollama is installed and running on your device (default: \`http://localhost:11434\`).
2. Make sure you have pulled a model like Llama 3 (\`ollama run llama3\`).
3. In the web app, click the Settings (gear) icon in the bottom right.
4. Switch the AI Provider to **Local Ollama**.
5. Set the Endpoint (if different from default). Note: Ensure your Ollama server has \`OLLAMA_ORIGINS="*"\` set in its environment variables if you run into CORS issues.

### Deployment / Docker

You can easily deploy this using the standard Docker workflow. Since it's client-side, the backend doesn't store tokens.

\`\`\`bash
docker build -t github-ai-assessor .
docker run -p 3000:3000 github-ai-assessor
\`\`\`

## Architecture

- **Next.js 15:** Core framework
- **Tailwind CSS:** Styling
- **Recharts:** Infographics and charts
- **Octokit / REST / GraphQL:** Fetches User Profile, Readmes, and PR contributions.
