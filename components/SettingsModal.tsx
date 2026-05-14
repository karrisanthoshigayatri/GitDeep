"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { AI_PROVIDERS, AIProvider, PromptSize } from '@/lib/types';
import { Settings, X } from 'lucide-react';

export function SettingsModal({ inline }: { inline?: boolean }) {
  const { settings, updateSettings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  if (inline) {
    return (
      <button onClick={() => setIsOpen(true)} className="text-xs text-white/50 hover:text-white premium-transition flex items-center gap-1.5">
        <Settings className="w-3.5 h-3.5" /> Settings
      </button>
    );
  }

  return null;

  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleProviderChange = (providerId: AIProvider) => {
    const info = AI_PROVIDERS.find(p => p.id === providerId);
    setLocalSettings(prev => ({
      ...prev,
      aiProvider: providerId,
      apiEndpoint: info?.defaultEndpoint || '',
      model: info?.defaultModel || '',
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setIsOpen(false);
  };

  const currentProvider = AI_PROVIDERS.find(p => p.id === localSettings.aiProvider) || AI_PROVIDERS[0];

  if (!isOpen) {
    if (inline) {
      return (
        <button onClick={() => setIsOpen(true)} className="text-xs text-white/50 hover:text-white premium-transition flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5" /> Settings
        </button>
      );
    }
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-white p-3 rounded-full premium-transition z-50 flex items-center justify-center backdrop-blur-xl"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="double-bezel">
          <div className="inner p-0 overflow-hidden">
            <div className="p-6 text-[#C9D1D9]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight">Settings</h2>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] flex items-center justify-center premium-transition text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">GitHub PAT Token (Optional)</label>
                  <input 
                    type="password"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-[#58A6FF]/50 focus:bg-white/[0.06] premium-transition text-sm placeholder-white/20"
                    value={localSettings.githubToken}
                    onChange={e => setLocalSettings({...localSettings, githubToken: e.target.value})}
                    placeholder="ghp_..."
                  />
                  <p className="text-[10px] text-white/30 mt-1">Needed for private repos or higher rate limits.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">AI Provider</label>
                  <select 
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-[#58A6FF]/50 focus:bg-white/[0.06] premium-transition text-sm"
                    value={localSettings.aiProvider}
                    onChange={e => handleProviderChange(e.target.value as AIProvider)}
                  >
                    {AI_PROVIDERS.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#0A0A0F]">{p.label}</option>
                    ))}
                  </select>
                </div>

                {currentProvider.needsKey && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-white/60 uppercase tracking-wider">API Key</label>
                      {currentProvider.docsUrl && (
                        <a href={currentProvider.docsUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#58A6FF] hover:underline">
                          Get key →
                        </a>
                      )}
                    </div>
                    <input 
                      type="password"
                      className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-[#58A6FF]/50 focus:bg-white/[0.06] premium-transition text-sm placeholder-white/20"
                      value={localSettings.apiKey}
                      onChange={e => setLocalSettings({...localSettings, apiKey: e.target.value})}
                      placeholder={`Enter your ${currentProvider.label} key`}
                    />
                  </div>
                )}

                {currentProvider.needsEndpoint && (
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">API Endpoint</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-[#58A6FF]/50 focus:bg-white/[0.06] premium-transition text-sm placeholder-white/20"
                      value={localSettings.apiEndpoint}
                      onChange={e => setLocalSettings({...localSettings, apiEndpoint: e.target.value})}
                      placeholder={currentProvider.defaultEndpoint || 'https://...'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">Model</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-[#58A6FF]/50 focus:bg-white/[0.06] premium-transition text-sm placeholder-white/20"
                    value={localSettings.model}
                    onChange={e => setLocalSettings({...localSettings, model: e.target.value})}
                    placeholder={currentProvider.defaultModel || 'model-name'}
                  />
                  <p className="text-[10px] text-white/30 mt-1">Default: {currentProvider.defaultModel}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">Prompt Size</label>
                  <select
                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-[#58A6FF]/50 focus:bg-white/[0.06] premium-transition text-sm"
                    value={localSettings.promptSize}
                    onChange={e => setLocalSettings({...localSettings, promptSize: e.target.value as PromptSize})}
                  >
                    <option value="full" className="bg-[#0A0A0F]">Full (in-depth) — cloud models</option>
                    <option value="small" className="bg-[#0A0A0F]">Small (compact) — local/small models</option>
                  </select>
                  <p className="text-[10px] text-white/30 mt-1">Full = detailed (~1200 tokens). Small = compact (~400 tokens).</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-sm text-white/40 hover:text-white premium-transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="group relative overflow-hidden rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 premium-transition btn-press"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#58A6FF]/10 to-[#8957E5]/10 opacity-0 group-hover:opacity-100 premium-transition" />
                  <div className="relative flex items-center gap-2 px-5 py-2.5">
                    <span className="text-xs font-bold text-white/80 group-hover:text-white premium-transition uppercase tracking-wider">Save Settings</span>
                    <div className="w-6 h-6 rounded-full bg-white/[0.06] group-hover:bg-white/[0.1] flex items-center justify-center premium-transition">
                      <X className="w-3 h-3 text-white/60 group-hover:text-white premium-transition rotate-45" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
