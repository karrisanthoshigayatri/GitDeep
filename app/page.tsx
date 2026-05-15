"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Briefcase, Code, HelpCircle, Settings, ArrowUpRight, Github } from 'lucide-react';
import { SettingsModal } from '@/components/SettingsModal';
import DotField from '@/components/DotField';
import Image from 'next/image';
import logo from './logo.png';

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
    <>
      <div className="grain" />
      <div className="fixed inset-0 z-0">
        <DotField
          dotRadius={2.5}
          dotSpacing={20}
          bulgeStrength={110}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(138, 87, 229, 0.6)"
          gradientTo="rgba(88, 166, 255, 0.5)"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 py-8">

        {/* Floating Island Nav */}
        <nav className="animate-fade-up fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="glass rounded-full px-5 py-2 flex items-center gap-6 shadow-2xl">
            <span className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Image src={logo} alt="GitDeep" width={20} height={20} className="rounded" />
              <span className="hidden sm:inline">GitDeep</span>
            </span>
            <div className="w-px h-4 bg-white/10" />
            <a href="/help" className="text-xs text-white/50 hover:text-white premium-transition flex items-center gap-1.5">
               <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" /> Guide
            </a>
            <div className="w-px h-4 bg-white/10" />
            <SettingsModal inline />
          </div>
        </nav>

        {/* Hero */}
        <div className="w-full max-w-5xl mx-auto mt-24 md:mt-32">
          <div className="text-center mb-12 md:mb-16 animate-fade-up">
            <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium mb-5">
              AI-Powered Analysis
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.95] max-w-3xl mx-auto">
              Assess any GitHub<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A6FF] via-[#8957E5] to-[#58A6FF]">profile in seconds</span>
            </h1>
            <p className="mt-4 text-sm md:text-base text-white/40 max-w-xl mx-auto leading-relaxed">
              Brutal honesty meets deep intelligence. Get a comprehensive breakdown of any developer&apos;s work — from code quality to career trajectory.
            </p>
          </div>

          {/* Asymmetrical Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">

            {/* Left — Mode Selection (larger card) */}
            <div className="md:col-span-7 animate-fade-up delay-100">
              <div className="double-bezel">
                <div className="inner">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-6 block">
                    1. Select Perspective
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMode('employer')}
                      className={`group relative text-left p-5 rounded-xl border premium-transition ${
                        mode === 'employer'
                          ? 'border-[#2EA043]/50 bg-[#2EA043]/[0.06]'
                          : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          mode === 'employer' ? 'bg-[#2EA043]/20' : 'bg-white/[0.04]'
                        } premium-transition group-hover:scale-105`}>
                          <Briefcase className={`w-5 h-5 ${mode === 'employer' ? 'text-[#46E363]' : 'text-white/40'}`} aria-hidden="true" />
                        </div>
                        <ArrowUpRight className={`w-4 h-4 premium-transition ${
                          mode === 'employer' ? 'text-[#46E363] opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-40'
                        }`} aria-hidden="true" />
                      </div>
                      <div className="text-sm font-bold text-white mb-1">Employer Mode</div>
                      <div className="text-xs text-white/40 leading-relaxed">Brutal hirability &amp; weakness check</div>
                      {mode === 'employer' && (
                        <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-[#2EA043] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => setMode('developer')}
                      className={`group relative text-left p-5 rounded-xl border premium-transition ${
                        mode === 'developer'
                          ? 'border-[#58A6FF]/50 bg-[#58A6FF]/[0.06]'
                          : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          mode === 'developer' ? 'bg-[#58A6FF]/20' : 'bg-white/[0.04]'
                        } premium-transition group-hover:scale-105`}>
                          <Code className={`w-5 h-5 ${mode === 'developer' ? 'text-[#58A6FF]' : 'text-white/40'}`} aria-hidden="true" />
                        </div>
                        <ArrowUpRight className={`w-4 h-4 premium-transition ${
                          mode === 'developer' ? 'text-[#58A6FF] opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-40'
                        }`} aria-hidden="true" />
                      </div>
                      <div className="text-sm font-bold text-white mb-1">Developer Mode</div>
                      <div className="text-xs text-white/40 leading-relaxed">Mentorship &amp; growth roadmap</div>
                      {mode === 'developer' && (
                        <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-[#58A6FF] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Top — Username Input */}
            <div className="md:col-span-5 animate-fade-up delay-200">
              <div className="double-bezel h-full">
                <div className="inner h-full flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-4 block">
                    2. Enter Username
                  </span>
                  <form onSubmit={handleAnalyze} className="flex-1 flex flex-col justify-between gap-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <Search className="w-4 h-4 text-white/30" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="github-username"
                        autoComplete="off"
                        spellCheck={false}
                        className="w-full h-full min-h-[56px] pl-11 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58A6FF]/50 focus:border-[#58A6FF]/50 focus:bg-white/[0.06] premium-transition text-sm text-white placeholder-white/20 font-mono"
                        placeholder="e.g. torvalds…"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="group relative w-full overflow-hidden rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 premium-transition btn-press"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#58A6FF]/10 to-[#8957E5]/10 opacity-0 group-hover:opacity-100 premium-transition" />
                      <div className="relative flex items-center justify-between px-6 py-4">
                        <span className="text-sm font-bold text-white/80 group-hover:text-white premium-transition">
                          Generate Assessment
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/[0.06] group-hover:bg-white/[0.1] flex items-center justify-center premium-transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white premium-transition" aria-hidden="true" />
                        </div>
                      </div>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Bottom — Tagline / Info card */}
            <div className="md:col-span-12 animate-fade-up delay-300">
              <div className="double-bezel">
                <div className="inner py-3 px-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#58A6FF]" />
                      No database
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2EA043]" />
                      Session-based
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8957E5]" />
                      Privacy first
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['gemini', 'openai', 'anthropic', 'ollama'].map((p, i) => (
                        <div key={p} className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[8px] text-white/40 font-mono">
                          {p.slice(0, 2)}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-white/20">12 providers supported</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
