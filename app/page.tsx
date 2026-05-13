"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Github, Briefcase, Code } from 'lucide-react';
import { SettingsModal } from '@/components/SettingsModal';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState<'employer' | 'developer'>('employer');

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    router.push(`/assessment?user=${encodeURIComponent(username.trim())}&mode=${mode}`);
  };

  return (
    <main className="flex-1 bg-[#0D1117] flex items-center justify-center p-4 relative">
      <SettingsModal />
      
      <div className="absolute top-0 w-full p-6 flex justify-center items-center opacity-10 select-none pointer-events-none">
        <Github className="w-96 h-96 absolute -top-10 -right-20 text-[#8B949E]" />
      </div>

      <div className="bg-[#161B22] rounded-xl shadow-2xl p-8 md:p-12 w-full max-w-2xl relative z-10 border border-[#30363D]">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3 flex items-center justify-center gap-3">
            <Github className="w-10 h-10" />
            GitHub AI Assessor
          </h1>
          <p className="text-lg text-[#8B949E] mb-4">
            Brutal, honest, and smart analysis of any developer&apos;s GitHub profile.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-2 py-1 bg-[#1F2428] border border-[#30363D] text-[#8B949E] text-xs rounded uppercase font-bold">5-Week Roadmap</span>
            <span className="px-2 py-1 bg-[#1F2428] border border-[#30363D] text-[#8B949E] text-xs rounded uppercase font-bold">AI SLOP Checks</span>
            <span className="px-2 py-1 bg-[#1F2428] border border-[#30363D] text-[#8B949E] text-xs rounded uppercase font-bold">Hirability Score</span>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-[#8B949E] mb-3 uppercase tracking-wider">
              1. Select Perspective
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode('employer')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${mode === 'employer' ? 'border-[#2EA043] bg-[#238636]/20 text-[#3FB950]' : 'border-[#30363D] hover:border-[#8B949E] text-[#8B949E]'}`}
              >
                <Briefcase className="w-8 h-8 mb-2" />
                <span className="font-medium inline-block">Employer Mode</span>
                <span className="text-xs text-center mt-1 opacity-80">Brutal hirability & weakness check</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('developer')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${mode === 'developer' ? 'border-[#58A6FF] bg-[#58A6FF]/20 text-[#58A6FF]' : 'border-[#30363D] hover:border-[#8B949E] text-[#8B949E]'}`}
              >
                <Code className="w-8 h-8 mb-2" />
                <span className="font-medium inline-block">Developer Mode</span>
                <span className="text-xs text-center mt-1 opacity-80">5-Week Roadmap & profile improvement</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#8B949E] mb-3 uppercase tracking-wider">
              2. Enter GitHub Username
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#8B949E]" />
              </div>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-4 bg-[#0D1117] border border-[#30363D] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:bg-[#161B22] transition-colors text-lg text-white placeholder-[#484F58]"
                placeholder="e.g. torvalds"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2EA043] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#238636] transition-colors shadow-lg active:scale-[0.99] uppercase tracking-widest"
          >
            Generate Assessment
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-[#30363D] text-center text-sm text-[#8B949E]">
          <p>Privacy First: No DB, session-based only. Set your token/keys in Settings ⚙️.</p>
        </div>
      </div>
    </main>
  );
}
