"use client";

import { Monitor, X } from "lucide-react";
import { useDemoMode } from "@/components/DemoModeProvider";

export function DemoModeBanner() {
  const { isDemoMode, setDemoMode } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div className="bg-[color:var(--peach-soft)]/90 backdrop-blur-sm border-b border-[#ecd9c4]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Monitor className="w-4 h-4 text-[color:var(--accent-strong)] flex-shrink-0" />
          <span className="text-sm text-[color:var(--accent-strong)] truncate">
            <span className="font-semibold">SIMULATED DATA</span> — All data shown is
            demo/simulated for prototype demonstration. No live fares are displayed.
          </span>
        </div>
        <button
          onClick={() => setDemoMode(false)}
          aria-label="Dismiss demo data banner"
          className="p-1.5 rounded-full hover:bg-[#f0e2d2] transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-[color:var(--accent-strong)]" />
        </button>
      </div>
    </div>
  );
}
