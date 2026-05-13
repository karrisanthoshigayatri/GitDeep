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
  repoAssessments: {
    repoName: string;
    repoScore: number;
    repoVerdict: string;
    repoAnalysis: string;
    keyHighlights: string[];
    redFlags: string[];
  }[];
}

export async function generateAssessment(
  data: UserAssessmentData, 
  settings: AppSettings, 
  mode: AssessmentMode,
  customQuestions: string = ''
): Promise<AssessmentResult> {
  const prompt = buildPrompt(data, mode, customQuestions);

  let rawResponse = '';

  if (settings.aiProvider === 'gemini') {
    const apiKey = settings.geminiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key is required.");
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // In client-side, we must ensure we are using the beta for streaming or just standard chat
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // A standard model for text tasks
      contents: prompt,
      config: {
        temperature: 0,
        topP: 1,
        topK: 1,
        systemInstruction: "You are an expert tech recruiter and senior engineering manager evaluating a candidate's GitHub profile. YOU MUST OUTPUT ONLY VALID MINIFIED JSON. NO MARKDOWN OR HTML WRAPPERS.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  year: { type: Type.STRING },
                }
              }
            },
            growthMeter: { type: Type.NUMBER },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
            },
            metrics: {
              type: Type.OBJECT,
              properties: {
                creativity: { type: Type.NUMBER },
                potential: { type: Type.NUMBER },
                aiUsage: { type: Type.NUMBER },
                security: { type: Type.NUMBER },
                professionalism: { type: Type.NUMBER },
                codeQuality: { type: Type.NUMBER }
              },
            },
            weaknessMetrics: {
              type: Type.OBJECT,
              properties: {
                buzzwordDensity: { type: Type.NUMBER },
                aiSlop: { type: Type.NUMBER },
                lackOfDocs: { type: Type.NUMBER },
                inconsistency: { type: Type.NUMBER },
                arrogance: { type: Type.NUMBER },
                poorArchitecture: { type: Type.NUMBER }
              },
            },
            slopeAnalysis: {
              type: Type.OBJECT,
              properties: {
                slopeTrajectory: { type: Type.STRING },
                slopeScore: { type: Type.NUMBER },
                consistencyRating: { type: Type.STRING },
                analysisSummary: { type: Type.STRING },
                burnoutRisk: { type: Type.STRING },
              }
            },
            buzzwordAnalysis: {
              type: Type.OBJECT,
              properties: {
                buzzwordsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
                actualTechStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                buzzwordToRealityRatio: { type: Type.NUMBER },
                verdict: { type: Type.STRING },
                roastOrPraise: { type: Type.STRING },
              }
            },
            behavioralAnalysis: {
              type: Type.OBJECT,
              properties: {
                confidenceScore: { type: Type.NUMBER },
                arroganceScore: { type: Type.NUMBER },
                primaryArchetype: { type: Type.STRING },
                behavioralFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                vibeCheck: { type: Type.STRING },
              }
            },
            hirabilityScore: { type: Type.NUMBER },
            hirabilityRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
            notSuitedRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
            detailedReport: { type: Type.STRING },
            repoAssessments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  repoName: { type: Type.STRING },
                  repoScore: { type: Type.NUMBER },
                  repoVerdict: { type: Type.STRING },
                  repoAnalysis: { type: Type.STRING },
                  keyHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                  redFlags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          },
          required: ["summary", "tags", "timeline", "growthMeter", "swot", "metrics", "weaknessMetrics", "slopeAnalysis", "buzzwordAnalysis", "behavioralAnalysis", "hirabilityScore", "hirabilityRoles", "notSuitedRoles", "detailedReport", "repoAssessments"]
        }
      }
    });
    rawResponse = response.text || '{}';
  } else {
    // Ollama integration
    if (!settings.ollamaEndpoint) throw new Error("Ollama endpoint is required.");
    const response = await fetch(`${settings.ollamaEndpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3', // User can change this ideally, sticking to llama3 or mistral
        prompt: prompt,
        system: "You are an expert tech recruiter and senior engineering manager evaluating a candidate's GitHub profile. YOU MUST OUTPUT ONLY VALID MINIFIED JSON. NO MARKDOWN OR HTML WRAPPERS.",
        stream: false,
        options: {
          temperature: 0
        },
        format: 'json'
      })
    });
    
    if (!response.ok) {
        let errMessage = 'Failed to fetch from Ollama';
        try {
            const errData = await response.json();
            errMessage = errData.error || errMessage;
        } catch { /* empty */ }
        throw new Error(errMessage);
    }
    const result = await response.json();
    rawResponse = result.response || '{}';
  }

  try {
    const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as AssessmentResult;
  } catch (e) {
    console.error("Failed to parse AI JSON response", rawResponse);
    throw new Error("AI returned malformed data. Let's assume it failed to parse the JSON. Try again.");
  }
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
    - NEVER give a score of exactly 7.0. Skip it. Use 6.9 or 7.1 instead.
    - Do NOT let writing style, vibes, or subjective impressions affect the score. Only the 3-signal band logic above.

Your role (MODE-SPECIFIC — follow exactly):
${mode === 'employer' ? "You are an employer reviewing this candidate for hiring. BE BRUTALLY HONEST and unforgiving. Focus STRICTLY on evaluating the candidate's qualities, failures, deficiencies, and risk factors. Do NOT give any tips, advice, constructive feedback, learning suggestions, or improvement paths — those belong in developer mode only. Weaknesses, red flags, gaps, and shortcomings must dominate the assessment. If strengths exist, mention them briefly, but the primary focus is what disqualifies or risks this candidate. Zero improvement language in summary, detailedReport, timeline, and swot.weaknesses/swot.threats. However, swot.opportunities is for EXTERNAL market positioning (roles they'd fit, industries where their skills match), NOT self-improvement tips — populate it." : "You are a senior mentor evaluating this developer to help them improve. BE CONSTRUCTIVE BUT CRITICAL. Point out flaws honestly but always frame them as actionable growth opportunities. Provide specific tips, learning resources, and a clear improvement path. Tone should be that of a senior mentor giving direct but helpful feedback — honest enough to sting, but framed to motivate growth."}

${customQuestions ? `The employer has customized questions for you to answer: "${customQuestions}"` : ''}

You MUST output ONLY a valid JSON object matching the requested schema exactly. Do not output anything outside of the JSON block.
`;

  return basePrompt;
}
