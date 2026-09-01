"use client";

import { Monitor, X } from "lucide-react";
import { useDemoMode } from "@/components/DemoModeProvider";

export function DemoModeBanner() {
  const { isDemoMode, setDemoMode } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-semibold">SIMULATED DATA</span> — All data shown is demo/simulated for prototype demonstration.
          </span>
        </div>
        <button
          onClick={() => setDemoMode(false)}
          className="p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900"
        >
          <X className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </button>
      </div>
    </div>
  );
}
