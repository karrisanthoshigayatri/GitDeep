"use client";

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Settings, X } from 'lucide-react';

export function SettingsModal() {
  const { settings, updateSettings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-[#2EA043] text-white p-3 rounded-full shadow-lg hover:bg-[#238636] transition-all z-50 flex items-center justify-center border border-[#30363D]"
        aria-label="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <div className="p-6 text-[#C9D1D9]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">App Settings</h2>
            <button onClick={() => setIsOpen(false)} className="text-[#8B949E] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-1">GitHub PAT Token (Optional)</label>
              <input 
                type="password"
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] text-white rounded-md focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF]"
                value={localSettings.githubToken}
                onChange={e => setLocalSettings({...localSettings, githubToken: e.target.value})}
                placeholder="ghp_..."
              />
              <p className="text-[10px] text-[#8B949E] mt-1">Needed for analyzing private repos or preventing rate limits.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-1">AI Provider</label>
              <select 
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] text-white rounded-md focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF]"
                value={localSettings.aiProvider}
                onChange={e => setLocalSettings({...localSettings, aiProvider: e.target.value as 'gemini' | 'ollama'})}
              >
                <option value="gemini">Gemini API</option>
                <option value="ollama">Local Ollama</option>
              </select>
            </div>

            {localSettings.aiProvider === 'gemini' ? (
              <div>
                <label className="block text-sm font-bold text-white mb-1">Gemini API Key</label>
                <input 
                  type="password"
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] text-white rounded-md focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF]"
                  value={localSettings.geminiKey}
                  onChange={e => setLocalSettings({...localSettings, geminiKey: e.target.value})}
                  placeholder="Leave empty to use AI Studio's default key"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-white mb-1">Ollama API Endpoint</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] text-white rounded-md focus:outline-none focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF]"
                  value={localSettings.ollamaEndpoint}
                  onChange={e => setLocalSettings({...localSettings, ollamaEndpoint: e.target.value})}
                  placeholder="http://localhost:11434"
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-[#8B949E] hover:text-white font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-[#2EA043] text-white rounded-md hover:bg-[#238636] font-bold shadow-sm uppercase tracking-widest text-xs"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
