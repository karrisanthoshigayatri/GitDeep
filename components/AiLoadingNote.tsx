"use client";

import { Loader2 } from "lucide-react";
import { useLoadingMessage } from "@/hooks/useLoadingMessage";

interface AiLoadingNoteProps {
  /** Optional custom messages. Defaults to the built-in set. */
  messages?: readonly string[];
  /** ms between message rotations. */
  intervalMs?: number;
  /** Visual size variant. */
  variant?: "banner" | "inline";
  className?: string;
}

/**
 * Renders a live "AI is running..." note with a rotating fun one-liner.
 *
 * Use `variant="banner"` for the full-width skeleton header, and
 * `variant="inline"` for compact fallbacks (e.g. Suspense fallback).
 */
export function AiLoadingNote({
  messages,
  intervalMs,
  variant = "banner",
  className = "",
}: AiLoadingNoteProps) {
  const message = useLoadingMessage(messages, intervalMs);

  if (variant === "inline") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex flex-col items-center justify-center gap-4 text-center ${className}`}
      >
        <Loader2 className="w-10 h-10 text-[#8B949E] animate-spin" aria-hidden="true" />
        <div className="font-mono text-sm text-[#8B949E] min-h-[1.25rem] animate-pulse">
          {message}
        </div>
      </div>
    );
 }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-[#58A6FF]/20 bg-gradient-to-r from-[#58A6FF]/[0.06] via-[#8957E5]/[0.06] to-[#58A6FF]/[0.06] px-5 py-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* shimmer sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_2.2s_ease-in-out_infinite]" />

      <div className="relative flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-[#58A6FF] animate-spin" aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#58A6FF]">
              AI is running
            </span>
            <span className="flex gap-1" aria-hidden="true">
              <span className="w-1 h-1 rounded-full bg-[#58A6FF]/60 animate-pulse" />
              <span className="w-1 h-1 rounded-full bg-[#8957E5]/60 animate-pulse [animation-delay:200ms]" />
              <span className="w-1 h-1 rounded-full bg-[#58A6FF]/60 animate-pulse [animation-delay:400ms]" />
            </span>
          </div>
          <p
            key={message}
            className="font-mono text-sm text-white/80 animate-[fadeUp_0.4s_ease-out] truncate"
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AiLoadingNote;
