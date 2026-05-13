import { Octokit } from 'octokit';

export interface RepoData {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  updatedAt: string;
  hasReadme: boolean;
  readmeContent?: string;
  hasLicense: boolean;
  licenseName?: string;
  language: string;
  topics: string[];
  isFork: boolean;
  defaultBranch: string;
}

export interface PRData {
  title: string;
  repo: string;
  state: 'merged' | 'closed' | 'open';
  createdAt: string;
  mergedAt: string;
  url: string;
  linesAdded: number;
  linesDeleted: number;
}

export interface UserAssessmentData {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  twitterUsername: string;
  linkedinUrl: string;
  leetcodeUrl: string;
  instagramUrl: string;
  hireable: boolean;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  totalStars: number;
  totalPrs: number;
  repos: RepoData[];
  pullRequests: PRData[];
  languages: Record<string, number>;
}

export async function fetchGitHubProfile(username: string, token: string): Promise<UserAssessmentData> {
  const octokit = new Octokit({ auth: token || undefined });

  // 1. Fetch user profile
  const { data: user } = await octokit.rest.users.getByUsername({ username });

  function extractUrl(text: string, domain: string): string {
    const patterns = [
      new RegExp(`https?://(?:www\\.)?${domain}\\/[^\\s,)]+`, 'i'),
      new RegExp(`(?:https?://)?(?:www\\.)?${domain}\\/[^\\s,)]+`, 'i'),
    ];
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m) {
        let url = m[0];
        if (!url.startsWith('http')) url = `https://${url}`;
        return url;
      }
    }
    return '';
  }

  const bioText = [user.blog || '', user.bio || ''].join(' ');
  let linkedinUrl = extractUrl(bioText, 'linkedin\\.com');
  let leetcodeUrl = extractUrl(bioText, 'leetcode\\.com');
  let instagramUrl = extractUrl(bioText, 'instagram\\.com');

  if (!instagramUrl) {
    const igUsername = user.bio?.match(/ig:\s*@?([a-zA-Z0-9_.]+)/i);
    if (igUsername) instagramUrl = `https://instagram.com/${igUsername[1]}`;
  }

  // 2. Fetch repos
  const { data: reposRaw } = await octokit.rest.repos.listForUser({
    username,
    per_page: 100,
    sort: 'pushed',
  });

  const repos: RepoData[] = [];
  const languageBytes: Record<string, number> = {};
  const reposToAssess = reposRaw.filter(r => !r.fork).slice(0, 15);
  const totalStars = reposToAssess.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);

  for (const r of reposToAssess) {
    // Fetch actual language byte counts per repo for accurate distribution
    try {
      const { data: langs } = await octokit.rest.repos.listLanguages({
        owner: username,
        repo: r.name,
      });
      for (const [lang, bytes] of Object.entries(langs)) {
        languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
      }
    } catch {
      // fallback: use primary language with a nominal byte count
      if (r.language) {
        languageBytes[r.language] = (languageBytes[r.language] || 0) + 1;
      }
    }

    let readmeContent = '';
    let hasReadme = false;
    try {
      if ((r.size ?? 0) > 0) {
        const { data: readmeRaw } = await octokit.rest.repos.getReadme({
          owner: username,
          repo: r.name,
          mediaType: {
            format: 'raw',
          },
        });
        hasReadme = true;
        readmeContent = (readmeRaw as unknown as string).substring(0, 1500);
      }
    } catch (e) {
      // no readme
    }

    repos.push({
      name: r.name,
      description: r.description || '',
      url: r.html_url,
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      updatedAt: r.updated_at || '',
      hasReadme,
      readmeContent,
      hasLicense: !!r.license,
      licenseName: r.license?.name,
      language: r.language || 'Unknown',
      topics: r.topics || [],
      isFork: r.fork,
      defaultBranch: r.default_branch || 'main',
    });
  }

  // 3. Fetch PRs (merged in other repos)
  const prs: PRData[] = [];
  let totalPrs = 0;
  try {
    // We fetch a few PRs even without a token (Search API has 10 req/min for unauth, 30 req/min for auth)
    const q = `is:pr author:${username} is:merged`;
    const { data: searchPrs } = await octokit.rest.search.issuesAndPullRequests({
      q,
      per_page: 15,
      sort: 'created',
      order: 'desc'
    });
    
    totalPrs = searchPrs.total_count || 0;

    for (const item of searchPrs.items) {
      // the api returns something like https://api.github.com/repos/vercel/next.js
      const repoUrlParts = item.repository_url.split('/');
      const repoName = repoUrlParts.slice(-2).join('/');
      
      prs.push({
        title: item.title,
        repo: repoName,
        state: 'merged',
        createdAt: item.created_at,
        mergedAt: item.closed_at || '',
        url: item.html_url,
        linesAdded: 0, 
        linesDeleted: 0,
      });
    }
  } catch (e) {
    console.warn("Failed to fetch PRs", e);
  }

  return {
    username: user.login,
    name: user.name || '',
    avatarUrl: user.avatar_url,
    bio: user.bio || '',
    company: user.company || '',
    blog: user.blog || '',
    location: user.location || '',
    email: user.email || '',
    twitterUsername: (user as any).twitter_username || '',
    linkedinUrl,
    leetcodeUrl,
    instagramUrl,
    hireable: user.hireable || false,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    createdAt: user.created_at,
    totalStars,
    totalPrs,
    repos,
    pullRequests: prs,
    languages: languageBytes,
  };
}
