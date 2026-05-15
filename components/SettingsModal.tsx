"use client";

import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';

export function SettingsModal({ inline }: { inline?: boolean }) {
  const router = useRouter();

  if (inline) {
    return (
      <button onClick={() => router.push('/settings')} className="text-xs text-white/50 hover:text-white premium-transition flex items-center gap-1.5">
        <Settings className="w-3.5 h-3.5" /> Settings
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push('/settings')}
      className="fixed bottom-4 right-4 bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-white p-3 rounded-full premium-transition z-50 flex items-center justify-center backdrop-blur-xl"
      aria-label="Settings"
    >
      <Settings className="w-5 h-5" />
    </button>
  );
}
