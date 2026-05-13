export interface AppSettings {
  githubToken: string;
  aiProvider: 'gemini' | 'ollama';
  geminiKey: string;
  ollamaEndpoint: string;
}

export const defaultSettings: AppSettings = {
  githubToken: '',
  aiProvider: 'gemini',
  geminiKey: '',
  ollamaEndpoint: 'http://localhost:11434',
};
