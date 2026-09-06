"use client";

import { Monitor, X } from "lucide-react";
import { useDemoMode } from "@/components/DemoModeProvider";

export function DemoModeBanner() {
  const { isDemoMode, setDemoMode } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 backdrop-blur-sm border-b border-amber-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="text-sm text-amber-800">
            <span className="font-semibold">SIMULATED DATA</span> — All data shown is
            demo/simulated for prototype demonstration. No live fares are displayed.
          </span>
        </div>
        <button
          onClick={() => setDemoMode(false)}
          aria-label="Dismiss demo data banner"
          className="p-1 rounded hover:bg-amber-100"
        >
          <X className="w-4 h-4 text-amber-600" />
        </button>
      </div>
    </div>
  );
}
