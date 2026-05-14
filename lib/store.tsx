"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, defaultSettings } from './types';

interface StoreContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('github-assessor-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old settings format (geminiKey, ollamaEndpoint, ollamaModel -> apiKey, apiEndpoint, model)
        if (!parsed.apiKey && parsed.geminiKey) parsed.apiKey = parsed.geminiKey;
        if (!parsed.apiEndpoint && parsed.ollamaEndpoint) parsed.apiEndpoint = parsed.ollamaEndpoint;
        if (!parsed.model && parsed.ollamaModel) parsed.model = parsed.ollamaModel;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      sessionStorage.setItem('github-assessor-settings', JSON.stringify(updated));
      return updated;
    });
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <StoreContext.Provider value={{ settings, updateSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
