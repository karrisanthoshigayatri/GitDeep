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

  let linkedinUrl = '';
  if (user.blog && user.blog.includes('linkedin.com')) {
    linkedinUrl = user.blog;
  } else if (user.bio && user.bio.includes('linkedin.com')) {
    const match = user.bio.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/);
    if (match) linkedinUrl = match[0];
  }

  let leetcodeUrl = '';
  if (user.blog && user.blog.includes('leetcode.com')) {
    leetcodeUrl = user.blog;
  } else if (user.bio && user.bio.includes('leetcode.com')) {
    const match = user.bio.match(/https?:\/\/(?:www\.)?leetcode\.com\/[^\s]+/);
    if (match) leetcodeUrl = match[0];
  }

  let instagramUrl = '';
  if (user.blog && user.blog.includes('instagram.com')) {
    instagramUrl = user.blog;
  } else if (user.bio && user.bio.includes('instagram.com')) {
    const match = user.bio.match(/https?:\/\/(?:www\.)?instagram\.com\/[^\s]+/);
    if (match) instagramUrl = match[0];
  } else {
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
  const languages: Record<string, number> = {};

  const totalStars = reposRaw.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);

  // Limit to at most 15 most recent repos to avoid massive context and rate limits
  const recentRepos = reposRaw.filter(r => !r.fork).slice(0, 15);
  
  for (const r of recentRepos) {
    if (r.language) {
      languages[r.language] = (languages[r.language] || 0) + 1;
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
        // Truncate readme to avoid too much text
        readmeContent = (readmeRaw as unknown as string).substring(0, 1500) + '...';
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
    languages,
  };
}
