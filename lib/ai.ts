import { GoogleGenAI, Type } from '@google/genai';
import { UserAssessmentData } from './github';
import { AppSettings } from './types';

export type AssessmentMode = 'employer' | 'developer';

export interface AssessmentResult {
  summary: string;
  tags: string[];
  timeline: {
    title: string;
    description: string;
    year: string;
  }[];
  growthMeter: number;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  metrics: {
    creativity: number;
    potential: number;
    aiUsage: number;
    security: number;
    professionalism: number;
    codeQuality: number;
  };
  weaknessMetrics: {
    buzzwordDensity: number;
    aiSlop: number;
    lackOfDocs: number;
    inconsistency: number;
    arrogance: number;
    poorArchitecture: number;
  };
  slopeAnalysis: {
    slopeTrajectory: string;
    slopeScore: number;
    consistencyRating: string;
    analysisSummary: string;
    burnoutRisk: string;
  };
  buzzwordAnalysis: {
    buzzwordsDetected: string[];
    actualTechStack: string[];
    buzzwordToRealityRatio: number;
    verdict: string;
    roastOrPraise: string;
  };
  behavioralAnalysis: {
    confidenceScore: number;
    arroganceScore: number;
    primaryArchetype: string;
    behavioralFlags: string[];
    vibeCheck: string;
  };
  hirabilityScore: number;
  hirabilityRoles: string[];
  notSuitedRoles: string[];
  detailedReport: string;
  mentorshipPlan?: string;
  repoAssessments: {
    repoName: string;
    repoScore: number;
    repoVerdict: string;
    repoAnalysis: string;
    keyHighlights: string[];
    redFlags: string[];
  }[];
}

export interface ComparisonCandidate {
  username: string;
  avatarUrl: string;
  assessment: AssessmentResult;
}

export interface ComparisonResult {
  candidates: {
    username: string;
    strengths: string[];
    weaknesses: string[];
    potential: number;
    bestSuitedRole: string;
    worstSuitedRole: string;
  }[];
  overallRanking: {
    username: string;
    recommendedFor: string;
  }[];
  verdict: string;
}

const ASSESSMENT_SYSTEM_PROMPT = "You are an expert tech recruiter and senior engineering manager evaluating a candidate's GitHub profile. YOU MUST OUTPUT ONLY VALID MINIFIED JSON. NO MARKDOWN OR HTML WRAPPERS.";
const COMPARISON_SYSTEM_PROMPT = "You are an expert tech recruiter comparing candidates. OUTPUT ONLY VALID JSON.";

const assessmentSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    timeline: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, year: { type: Type.STRING } } } },
    growthMeter: { type: Type.NUMBER },
    swot: { type: Type.OBJECT, properties: { strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, opportunities: { type: Type.ARRAY, items: { type: Type.STRING } }, threats: { type: Type.ARRAY, items: { type: Type.STRING } } } },
    metrics: { type: Type.OBJECT, properties: { creativity: { type: Type.NUMBER }, potential: { type: Type.NUMBER }, aiUsage: { type: Type.NUMBER }, security: { type: Type.NUMBER }, professionalism: { type: Type.NUMBER }, codeQuality: { type: Type.NUMBER } } },
    weaknessMetrics: { type: Type.OBJECT, properties: { buzzwordDensity: { type: Type.NUMBER }, aiSlop: { type: Type.NUMBER }, lackOfDocs: { type: Type.NUMBER }, inconsistency: { type: Type.NUMBER }, arrogance: { type: Type.NUMBER }, poorArchitecture: { type: Type.NUMBER } } },
    slopeAnalysis: { type: Type.OBJECT, properties: { slopeTrajectory: { type: Type.STRING }, slopeScore: { type: Type.NUMBER }, consistencyRating: { type: Type.STRING }, analysisSummary: { type: Type.STRING }, burnoutRisk: { type: Type.STRING } } },
    buzzwordAnalysis: { type: Type.OBJECT, properties: { buzzwordsDetected: { type: Type.ARRAY, items: { type: Type.STRING } }, actualTechStack: { type: Type.ARRAY, items: { type: Type.STRING } }, buzzwordToRealityRatio: { type: Type.NUMBER }, verdict: { type: Type.STRING }, roastOrPraise: { type: Type.STRING } } },
    behavioralAnalysis: { type: Type.OBJECT, properties: { confidenceScore: { type: Type.NUMBER }, arroganceScore: { type: Type.NUMBER }, primaryArchetype: { type: Type.STRING }, behavioralFlags: { type: Type.ARRAY, items: { type: Type.STRING } }, vibeCheck: { type: Type.STRING } } },
    hirabilityScore: { type: Type.NUMBER },
    hirabilityRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
    notSuitedRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
    detailedReport: { type: Type.STRING },
    mentorshipPlan: { type: Type.STRING },
    repoAssessments: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { repoName: { type: Type.STRING }, repoScore: { type: Type.NUMBER }, repoVerdict: { type: Type.STRING }, repoAnalysis: { type: Type.STRING }, keyHighlights: { type: Type.ARRAY, items: { type: Type.STRING } }, redFlags: { type: Type.ARRAY, items: { type: Type.STRING } } } } }
  },
  required: ["summary", "tags", "timeline", "growthMeter", "swot", "metrics", "weaknessMetrics", "slopeAnalysis", "buzzwordAnalysis", "behavioralAnalysis", "hirabilityScore", "hirabilityRoles", "notSuitedRoles", "detailedReport", "repoAssessments"]
};

const comparisonSchema = {
  type: Type.OBJECT,
  properties: {
    candidates: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { username: { type: Type.STRING }, strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, potential: { type: Type.NUMBER }, bestSuitedRole: { type: Type.STRING }, worstSuitedRole: { type: Type.STRING } } } },
    overallRanking: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { username: { type: Type.STRING }, recommendedFor: { type: Type.STRING } } } },
    verdict: { type: Type.STRING }
  }
};

async function callGemini(apiKey: string, model: string, systemMsg: string, userPrompt: string, schema: any): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model,
    contents: userPrompt,
    config: { temperature: 0, topP: 1, topK: 1, systemInstruction: systemMsg, responseMimeType: "application/json", responseSchema: schema }
  });
  return response.text || '{}';
}

async function callOllama(endpoint: string, model: string, systemMsg: string, userPrompt: string): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'ollama', prompt: userPrompt, systemInstruction: systemMsg, endpoint, model })
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Ollama API route error');
  }
  const result = await response.json();
  return result.response || '{}';
}

async function callAnthropic(endpoint: string, apiKey: string, model: string, systemMsg: string, userPrompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 150000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, system: systemMsg, messages: [{ role: 'user', content: userPrompt }], max_tokens: 4096, temperature: 0 }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Anthropic error (${response.status}): ${await response.text()}`);
    const data = await response.json();
    return data.content?.[0]?.text || '{}';
  } finally {
    clearTimeout(timeout);
  }
}

async function callOpenAICompatible(endpoint: string, apiKey: string, model: string, systemMsg: string, userPrompt: string): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'openai-compatible', prompt: userPrompt, systemInstruction: systemMsg, apiKey, model, endpoint })
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'API route error');
  }
  const result = await response.json();
  return result.response || '{}';
}

function getAISuggestion(error: Error, provider: string): string {
  const msg = error.message.toLowerCase();
  if (msg.includes('timeout') || msg.includes('abort') || msg.includes('timed out')) {
    return `AI timed out. Switch to Gemini API or a larger local model like mistral or qwen2.5:7b.`;
  }
  if (msg.includes('413') || msg.includes('payload') || msg.includes('too large') || msg.includes('context length') || msg.includes('maximum context')) {
    return `Prompt exceeds context window. Switch to Gemini 2.5 Flash (1M tokens) or a model with 32K+ context.`;
  }
  if (msg.includes('json') || msg.includes('parse') || msg.includes('malformed')) {
    return `AI returned invalid JSON. Switch to Gemini API for native schema enforcement, or use a larger model.`;
  }
  if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('api key')) {
    return `Authentication failed. Check your API key for ${provider}.`;
  }
  if (msg.includes('429') || msg.includes('rate limit')) {
    return `Rate limited by ${provider}. Wait and retry or switch providers.`;
  }
  if (msg.includes('echo') || msg.includes('input data')) {
    return `Model too small for this task. Switch to Gemini API or a larger local model.`;
  }
  return error.message;
}

async function callAI(settings: AppSettings, systemMsg: string, userPrompt: string, provider: 'assessment' | 'comparison'): Promise<string> {
  const providerType = settings.aiProvider;
  switch (providerType) {
    case 'gemini': {
      const key = settings.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      if (!key) throw new Error('Gemini API key is required.');
      return callGemini(key, settings.model || 'gemini-2.5-flash', systemMsg, userPrompt, provider === 'assessment' ? assessmentSchema : comparisonSchema);
    }
    case 'ollama': {
      if (!settings.apiEndpoint) throw new Error('Ollama endpoint is required.');
      return callOllama(settings.apiEndpoint, settings.model || 'llama3.2', systemMsg, userPrompt);
    }
    case 'anthropic': {
      if (!settings.apiKey) throw new Error('Anthropic API key is required.');
      if (!settings.apiEndpoint) throw new Error('Anthropic endpoint is required.');
      return callAnthropic(settings.apiEndpoint, settings.apiKey, settings.model || 'claude-sonnet-4-20250514', systemMsg, userPrompt);
    }
    default: {
      if (!settings.apiKey) throw new Error(`API key is required for ${providerType}.`);
      if (!settings.apiEndpoint) throw new Error(`API endpoint is required for ${providerType}.`);
      return callOpenAICompatible(settings.apiEndpoint, settings.apiKey, settings.model || 'gpt-4o', systemMsg, userPrompt);
    }
  }
}

export async function generateAssessment(
  data: UserAssessmentData, 
  settings: AppSettings, 
  mode: AssessmentMode,
  customQuestions: string = ''
): Promise<AssessmentResult> {
  const prompt = settings.promptSize === 'small' ? buildSmallPrompt(data, mode, customQuestions) : buildPrompt(data, mode, customQuestions);
  const rawResponse = await callAI(settings, ASSESSMENT_SYSTEM_PROMPT, prompt, 'assessment');

  try {
    const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    if (parsed.profile || parsed.topLanguages || parsed.recentRepos) {
      throw new Error('AI echoed input data instead of generating assessment');
    }
    
    return normalizeAssessment(parsed);
  } catch (e: any) {
    const suggestion = getAISuggestion(e, settings.aiProvider);
    throw new Error(suggestion);
  }
}

function normalizeAssessment(raw: any): AssessmentResult {
  const m = (obj: any, defaults: Record<string, number>): Record<string, number> => {
    const d = { ...defaults };
    if (!obj || typeof obj !== 'object') return d;
    for (const key of Object.keys(defaults)) {
      if (typeof obj[key] === 'number') d[key] = obj[key];
    }
    return d;
  };
  return {
    summary: raw.summary || '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
    growthMeter: typeof raw.growthMeter === 'number' ? raw.growthMeter : 50,
    swot: {
      strengths: Array.isArray(raw.swot?.strengths) ? raw.swot.strengths : [],
      weaknesses: Array.isArray(raw.swot?.weaknesses) ? raw.swot.weaknesses : [],
      opportunities: Array.isArray(raw.swot?.opportunities) ? raw.swot.opportunities : [],
      threats: Array.isArray(raw.swot?.threats) ? raw.swot.threats : [],
    },
    metrics: m(raw.metrics, { creativity: 50, potential: 50, aiUsage: 50, security: 50, professionalism: 50, codeQuality: 50 }) as AssessmentResult['metrics'],
    weaknessMetrics: m(raw.weaknessMetrics, { buzzwordDensity: 50, aiSlop: 50, lackOfDocs: 50, inconsistency: 50, arrogance: 50, poorArchitecture: 50 }) as AssessmentResult['weaknessMetrics'],
    slopeAnalysis: raw.slopeAnalysis ? { ...{ slopeTrajectory: 'Unknown', slopeScore: 5, consistencyRating: 'Unknown', analysisSummary: '', burnoutRisk: 'Unknown' }, ...raw.slopeAnalysis } : { slopeTrajectory: 'Unknown', slopeScore: 5, consistencyRating: 'Unknown', analysisSummary: '', burnoutRisk: 'Unknown' },
    buzzwordAnalysis: raw.buzzwordAnalysis ? { ...{ buzzwordsDetected: [], actualTechStack: [], buzzwordToRealityRatio: 5, verdict: '', roastOrPraise: '' }, ...raw.buzzwordAnalysis } : { buzzwordsDetected: [], actualTechStack: [], buzzwordToRealityRatio: 5, verdict: '', roastOrPraise: '' },
    behavioralAnalysis: raw.behavioralAnalysis ? { ...{ confidenceScore: 5, arroganceScore: 5, primaryArchetype: 'Unknown', behavioralFlags: [], vibeCheck: '' }, ...raw.behavioralAnalysis } : { confidenceScore: 5, arroganceScore: 5, primaryArchetype: 'Unknown', behavioralFlags: [], vibeCheck: '' },
    hirabilityScore: typeof raw.hirabilityScore === 'number' ? raw.hirabilityScore : 5,
    hirabilityRoles: Array.isArray(raw.hirabilityRoles) ? raw.hirabilityRoles : [],
    notSuitedRoles: Array.isArray(raw.notSuitedRoles) ? raw.notSuitedRoles : [],
    detailedReport: raw.detailedReport || '',
    mentorshipPlan: raw.mentorshipPlan,
    repoAssessments: Array.isArray(raw.repoAssessments) ? raw.repoAssessments.map((r: any) => ({
      repoName: r.repoName || '',
      repoScore: typeof r.repoScore === 'number' ? r.repoScore : 5,
      repoVerdict: r.repoVerdict || '',
      repoAnalysis: r.repoAnalysis || '',
      keyHighlights: Array.isArray(r.keyHighlights) ? r.keyHighlights : [],
      redFlags: Array.isArray(r.redFlags) ? r.redFlags : [],
    })) : [],
  };
}

function buildPrompt(data: UserAssessmentData, mode: AssessmentMode, customQuestions: string): string {
  const userJson = JSON.stringify({
    profile: {
      name: data.name,
      username: data.username,
      bio: data.bio,
      company: data.company,
      location: data.location,
      blog: data.blog,
      email: data.email,
      twitterUsername: data.twitterUsername,
      hireable: data.hireable,
      followers: data.followers,
      following: data.following,
      publicRepos: data.publicRepos,
      createdAt: data.createdAt,
      totalStars: data.totalStars,
      totalMergedPRs: data.totalPrs,
    },
    topLanguages: data.languages,
    recentRepos: data.repos.map(r => ({
      name: r.name,
      url: r.url,
      description: r.description,
      stars: r.stars,
      forks: r.forks,
      language: r.language,
      topics: r.topics,
      isFork: r.isFork,
      hasReadme: r.hasReadme,
      readmeSnippet: r.readmeContent,
      hasLicense: r.hasLicense,
      licenseName: r.licenseName,
      defaultBranch: r.defaultBranch,
      updatedAt: r.updatedAt
    })),
    pullRequestsInOtherRepos: data.pullRequests
  }, null, 2);

  let basePrompt = `Analyze the following GitHub profile data:
  
${userJson}

Please adhere to these overarching assessment logic rules:
1. Slope Detection: Calculate the trajectory of their career based on their code (from account creation to recent activity). Is it a Rising Star, Steady Maintainer, Declining Activity, or Sporadic/Spiky? Analyze burnout risk based on their activity volumes.
2. Buzzword to Reality Ratio: Compare hype words (AI, LLM, Web3, etc.) in their bio/readmes against the ACTUAL tech stack they write in (based on language stats and repo contents). Is it all hype, or accurate representation? Provide a cheeky roast or praise based on this.
3. Arrogance vs Confidence: Analyze their vibe (PRs, Readmes, bio). Confidence is assertive but helpful ("Please follow guidelines", owning mistakes). Arrogance is condescending ("This is the ONLY right way", toxic). Classify behavioral flags and assign a vibe check.
4. AI Usage Quality (DISTINGUISH SLOP FROM ORCHESTRATION): Scrutinize their AI usage. Look for common AI slop: excessive slash comments, generic AI CSS (e.g., generic purple/blue gradients, cookie-cutter Tailwind patterns), broken links, stylistic imbalances across the project, heavy use of emojis in readmes, and buzzword salads lacking technical depth. HOWEVER, you MUST also detect when a developer uses AI heavily but with HIGH QUALITY — look for signs of tech stack awareness, architectural understanding, intentional tech choices, and ability to guide AI toward production-grade output. If the developer shows this superior orchestration, call it out explicitly. Add a "### 🤖 AI Partnership Assessment" section in the detailedReport highlighting this as a strength. This should positively influence 'potential', 'aiUsage' metrics, and 'hirabilityScore'.
5. Missing documentation: Search for repos lacking READMEs or descriptions. Flag projects that don't look production-ready.
6. Check for mentions of data security in their projects.
7. Credit creative/new ideas.
8. Look at what they contributed to vs what is just in their repo. Evaluate their merged PRs.
9. Profile tags: Extrapolate multiple tags to describe the developer's archetype (e.g. Frontend Dev, Vibe Coder, Backend, Cybersecurity, etc).
10. SWOT analysis: Detail their Strengths, Weaknesses, Opportunities, and Threats. Provide 3-4 bullet points each. Keep them concise. NEVER leave any SWOT field empty — always populate all four. Opportunities are EXTERNAL market/role factors the dev could leverage (industries they'd suit, roles they fit, tech trends they can ride), NOT self-improvement tips. MODE-SPECIFIC: In employer mode, Weaknesses and Threats must dominate with no improvement framing, and Opportunities should describe where this candidate could add value or fit in the market. In developer mode, Opportunities should contain actionable growth advice and learning paths.
11. Timeline & Growth Meter: Assess their timeline from github creation until now. Create phases (e.g. Student -> Extracurricular -> Professional). Add a few short lines for each phase. Evaluate their consistency over this timeline to calculate a growthMeter (percentage 0-100) reflecting their growth and potential.
12. Hirability Criteria: Expand criteria to differentiate between internships and full-time roles. A student or junior might be worthy of an internship but not full-time. Clearly specify levels in 'hirabilityRoles' and 'notSuitedRoles'.
13. Formatting & Nuance (CRITICAL):
    - 'hirabilityScore' MUST be a float strictly between 1.0 and 10.0.
    - In 'detailedReport', use STANDARD MARKDOWN new lines to separate distinct topics/headings. NO literal \\n\\n, just output the JSON string with standard formatting.
    - KEEP THE DETAILED REPORT PUNCHY AND CONCISE. DO NOT write walls of text. Use bullet points heavily.
    - If you mention the user's handle or other developers, format it as a clickable markdown link: \`[@username](https://github.com/username)\`.
    - If a detail seems negative at first glance (e.g., massive AI usage, unconventional structure) but is actually brilliant or implies high leverage/orchestration when dug deeper, you MUST highlight this nuance in the 'detailedReport' using ***bold and italic*** markdown. For example: "***While the project is heavily assisted by AI, their ability to orchestrate complex tools effectively to achieve a production-grade result puts them leagues above their peers.***"
14. STRUCTURED REPORT FORMAT (CRITICAL):
    - Use \`##\` headers for each major topic, \`###\` for sub-topics.
    - Separate distinct sections with \`---\` horizontal dividers.
    - Use \`> **NOTE:**\` callout blocks for important observations that need emphasis.
    - Prefix warnings with \`⚠️\`, positive findings with \`✅\`, and deep-dive insights with \`🔍\`.
    - Use **bold** for key metrics/numbers, and ***bold italic*** for critical nuance callouts.
    - Add 2 blank lines after each sub-topic section to create visual breathing room.
15. PER-REPO ASSESSMENT:
    - For each repo in 'recentRepos', populate a 'repoAssessments' entry.
    - Evaluate each repo independently on: code quality, documentation quality, tech stack relevance, architecture decisions, AI slop presence, and production-readiness.
    - Score each repo 1.0-10.0 independently.
    - Provide a verdict string ("Excellent", "Good", "Needs Work", "Red Flag"), 2-3 sentence analysis, key highlights, and red flags.
    - This appears in the structured JSON output under 'repoAssessments'.
    - IMPORTANT: The 'detailedReport' field must NOT repeat per-repo breakdowns. They already exist in 'repoAssessments'. Keep detailedReport focused on the overall account-level assessment only.
16. SCORE STABILITY AND CONSISTENCY (CRITICAL — OVERRIDES ALL SUBJECTIVITY):
    - Your 'hirabilityScore' MUST use this FIXED 3-TIER BAND SYSTEM. Pick the tier first, THEN assign a score within it:
      * TIER 1 (1-4) — WEAK: No merged PRs, repos are forks/tutorials/stale, no docs, buzzword-heavy bio with no code to back it up, heavy AI slop.
      * TIER 2 (5-7) — AVERAGE: Some original repos, a few merged PRs, mixed documentation quality, reasonable tech stack, moderate activity. NOTE: 7.0 is BANNED — use 6.9 or 7.1 instead.
      * TIER 3 (8-10) — STRONG: Multiple merged PRs in external repos, well-documented original projects, consistent activity over 6+ months, coherent tech stack matching bio claims, minimal slop.
    - LOGIC: The tier is determined by the presence or absence of 3 hard signals: (a) merged PRs in other people's repos, (b) original non-fork repos with READMEs, (c) >6 months of consistent activity. 0/3 = Tier 1, 1/3 = Tier 2, 2-3/3 = Tier 3. THEN fine-tune ±0.5 within the band based on subjective quality. This guarantees a deviation of at most 0.5 between evaluations.
    - CRITICAL: A score deviation of more than ±1.0 between two evaluations of the SAME profile is UNACCEPTABLE. The band system guarantees this. Do not override the bands.
    - NEVER give a score of exactly 7.0 for ANY field — hirabilityScore, repoAssessments[].repoScore, confidenceScore, arroganceScore, or any other numeric score. Use 6.9 or 7.1 instead. 7.0 is banned everywhere.
    - Do NOT let writing style, vibes, or subjective impressions affect the score. Only the 3-signal band logic above.

17. MODE PARITY (CRITICAL): Your hirabilityScore, hirabilityRoles, notSuitedRoles, metrics, weaknessMetrics, swot, tags, slopeAnalysis, buzzwordAnalysis, behavioralAnalysis, growthMeter, timeline, summary, detailedReport, and repoAssessments MUST BE IDENTICAL regardless of mode. Do NOT change your assessment based on mode. The mode ONLY controls whether you populate the 'mentorshipPlan' field.
18. MENTORSHIP PLAN (developer mode only): In developer mode, populate the 'mentorshipPlan' field with open-ended upgrade instructions. Do NOT limit to a fixed timeline. Cover: improving READMEs and documentation, sounding more professional, reducing arrogant tone, suggesting specific new projects that fill skill gaps, concrete improvements to existing projects, learning resources, and any other actionable advice. Let the scope emerge naturally from the profile. In employer mode, leave mentorshipPlan empty/null.

Your role (MODE-SPECIFIC — only tone differs, never your scores):
${mode === 'employer' ? "BRUTALLY HONEST. Focus on evaluating qualities, failures, deficiencies, and risk factors. Zero tips or improvement advice in any field except swot.opportunities." : "CONSTRUCTIVE BUT CRITICAL. Same scores and ratings as employer mode, but additionally populate mentorshipPlan with upgrade instructions."}

${customQuestions ? `The employer has customized questions for you to answer: "${customQuestions}"` : ''}

You MUST output ONLY a valid JSON object matching the requested schema exactly. Do not output anything outside of the JSON block.
`;

  return basePrompt;
}

function buildSmallPrompt(data: UserAssessmentData, mode: AssessmentMode, customQuestions: string): string {
  const userJson = JSON.stringify({
    profile: {
      name: data.name, username: data.username, bio: data.bio, company: data.company,
      location: data.location, blog: data.blog, email: data.email, twitterUsername: data.twitterUsername,
      hireable: data.hireable, followers: data.followers, following: data.following,
      publicRepos: data.publicRepos, createdAt: data.createdAt, totalStars: data.totalStars, totalMergedPRs: data.totalPrs,
    },
    topLanguages: data.languages,
    recentRepos: data.repos.map(r => ({
      name: r.name, url: r.url, description: r.description, stars: r.stars, forks: r.forks,
      language: r.language, topics: r.topics, isFork: r.isFork,
      hasReadme: r.hasReadme, readmeSnippet: r.readmeContent, hasLicense: r.hasLicense,
      licenseName: r.licenseName, defaultBranch: r.defaultBranch, updatedAt: r.updatedAt
    })),
    pullRequestsInOtherRepos: data.pullRequests
  }, null, 2);

  let prompt = `Analyze this GitHub profile:
${userJson}

Rules:
1. Slope: Rising Star, Steady, Declining, or Sporadic? Assess burnout.
2. Buzzword vs Reality: Compare bio hype against actual languages. Roast or praise.
3. Arrogance vs Confidence: Confidence is helpful, arrogance is toxic. Flag it.
4. AI Usage: Detect slop OR quality orchestration. Flag superior AI use.
5. Missing docs: Flag repos without READMEs.
6-7. Security mentions. Credit creative ideas.
8. Evaluate merged PRs vs owned repos.
9. Tags: Archetype labels (e.g. Frontend, Vibe Coder, Backend).
10. SWOT: 2-3 bullets each. Never empty. Opportunities = external market positioning, not self-improvement.
11. Timeline phases from account creation. growthMeter 0-100.
12. Hirability: Intern vs full-time levels. suitedRoles + notSuitedRoles.
13. Score 1.0-10.0. Never 7.0 anywhere (hirabilityScore, repoScore, confidenceScore, arroganceScore — none can be 7.0). Use 6.9 or 7.1. Tier: 1-4 WEAK, 5-6.9 AVERAGE, 7.1-10 STRONG.
14. Per-repo: Score 1-10, verdict, 1-sentence analysis. Keep detailedReport at account level.

Mode: ${mode === 'employer' ? 'Brutally honest. No tips.' : 'Constructive. Add mentorshipPlan.'}
${customQuestions ? `Custom Q: "${customQuestions}"` : ''}

KEEP IT CONCISE. Output ONLY valid JSON.`;

  return prompt;
}

function normalizeComparison(raw: any): ComparisonResult {
  return {
    candidates: Array.isArray(raw.candidates) ? raw.candidates.map((c: any) => ({
      username: c.username || '',
      strengths: Array.isArray(c.strengths) ? c.strengths : [],
      weaknesses: Array.isArray(c.weaknesses) ? c.weaknesses : [],
      potential: typeof c.potential === 'number' ? c.potential : 50,
      bestSuitedRole: c.bestSuitedRole || '',
      worstSuitedRole: c.worstSuitedRole || '',
    })) : [],
    overallRanking: Array.isArray(raw.overallRanking) ? raw.overallRanking.map((r: any) => ({
      username: r.username || '',
      recommendedFor: r.recommendedFor || '',
    })) : [],
    verdict: raw.verdict || '',
  };
}

function buildComparisonPrompt(candidates: ComparisonCandidate[], customQuestion: string): string {
  if (!candidates || candidates.length === 0) {
    return 'Produce a comparison result with empty candidates array and verdict "No candidates provided for comparison."';
  }
  const summaries = candidates.map(c => ({
    username: c.username,
    avatarUrl: c.avatarUrl,
    hirabilityScore: c.assessment.hirabilityScore,
    hirabilityRoles: c.assessment.hirabilityRoles,
    notSuitedRoles: c.assessment.notSuitedRoles,
    summary: c.assessment.summary,
    detailedReport: c.assessment.detailedReport?.substring(0, 500),
    strengths: c.assessment.swot.strengths,
    weaknesses: c.assessment.swot.weaknesses,
    opportunities: c.assessment.swot.opportunities,
    threats: c.assessment.swot.threats,
    growthMeter: c.assessment.growthMeter,
    metrics: c.assessment.metrics,
    weaknessMetrics: c.assessment.weaknessMetrics,
    buzzwordAnalysis: c.assessment.buzzwordAnalysis,
    slopeAnalysis: c.assessment.slopeAnalysis,
    behavioralAnalysis: c.assessment.behavioralAnalysis,
    tags: c.assessment.tags,
  }));

  return `Compare these GitHub developer candidates for hiring. Analyze them side by side and produce a structured comparison.

CANDIDATES:
${JSON.stringify(summaries, null, 2)}

${customQuestion ? `The employer has a specific question: "${customQuestion}" - answer it directly in the verdict field.` : 'Determine which candidate is best suited for which roles based on their assessment data.'}

INSTRUCTIONS:
- For each candidate, list their top strengths, top weaknesses, potential score (0-100), the role they are best suited for, and the role they are worst suited for.
- Provide an overall ranking where each candidate is assigned to roles they would excel at (e.g. "user1 is best for AI/ML engineering", "user2 is best for full-stack development").
- The verdict should summarize: either "All candidates are ineligible - move to the next batch of candidates" or specify which candidate(s) are recommended.
- Be brutally honest. If none are good, say so.
- Output ONLY valid JSON. No markdown, no wrappers.
`;
}

export async function compareCandidates(
  candidates: ComparisonCandidate[],
  settings: AppSettings,
  customQuestion: string = ''
): Promise<ComparisonResult> {
  const prompt = buildComparisonPrompt(candidates.slice(0, 5), customQuestion);
  const rawResponse = await callAI(settings, COMPARISON_SYSTEM_PROMPT, prompt, 'comparison');

  try {
    const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    return normalizeComparison(JSON.parse(cleaned));
  } catch (e: any) {
    const suggestion = getAISuggestion(e, settings.aiProvider);
    throw new Error(suggestion);
  }
}
