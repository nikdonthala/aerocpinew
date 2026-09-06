"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  TrendingUp,
  Monitor,
  X,
  Sparkles,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDemoMode } from "@/components/DemoModeProvider";

const mobileNav = [
  { name: "Overview", href: "/dashboard" },
  { name: "Index", href: "/index-page" },
  { name: "Routes", href: "/routes" },
  { name: "Search", href: "/search" },
  { name: "AI Assistant", href: "/assistant" },
  { name: "AI Setup", href: "/admin/ai-setup" },
  { name: "Admin", href: "/admin" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDemoMode } = useDemoMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string>("");

  // Live "Updated X min ago" clock — lightweight, client-only.
  useEffect(() => {
    const format = () => {
      const mins = Math.floor((Date.now() - PIPELINE_LAST_RUN) / 60000);
      setUpdatedAt(mins <= 0 ? "just now" : `${mins} min ago`);
    };
    format();
    const id = setInterval(format, 30_000);
    return () => clearInterval(id);
  }, []);

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    // Accept "DEL-BOM", "DEL → BOM", "DEL BOM" or a free-text query.
    const codes = q.toUpperCase().match(/\b([A-Z]{3})\b/g);
    if (codes && codes.length >= 2) {
      router.push(`/search?origin=${codes[0]}&destination=${codes[1]}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <header className="glass sticky top-0 z-40 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 border-x-0 border-t-0 rounded-none">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
        className="lg:hidden p-2 rounded-lg hover:bg-white/60"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--cyan)] rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-[color:var(--foreground)]">AeroCPI</span>
      </Link>

      {/* Global search (desktop) */}
      <div className="hidden md:flex items-center relative w-full max-w-sm">
        <Search className="absolute left-3 w-4 h-4 text-[color:var(--muted)] pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
          placeholder="Search routes, airlines, datasets…"
          aria-label="Search routes, airlines and datasets"
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/60 border border-[color:var(--border)] text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30 focus:border-[color:var(--accent)]/40 transition-colors"
        />
      </div>

      <div className="flex-1" />

      {/* Pipeline status */}
      <div className="hidden lg:flex items-center gap-4 pr-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-700">
            {isDemoMode ? "Demo Pipeline" : "Data Pipeline Live"}
          </span>
        </div>
        <span className="text-xs text-[color:var(--muted)]">
          Updated {updatedAt || "just now"}
        </span>
      </div>

      {isDemoMode && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50/80 border border-amber-200 rounded-full">
          <Monitor className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            Demo Data
          </span>
        </div>
      )}

      <Link
        href="/assistant"
        aria-label="Open AI Assistant"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full pill bg-[color:var(--accent-soft)] text-[color:var(--accent)] hover:bg-blue-100 transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Ask AI
      </Link>

      <Link
        href="/admin/sources"
        aria-label="View notifications"
        className="relative p-2 rounded-lg hover:bg-white/60"
      >
        <Bell className="w-5 h-5 text-[color:var(--muted)]" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </Link>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[color:var(--ink-navy)]/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-[color:var(--surface)] shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--cyan)] rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-[color:var(--foreground)]">
                  AeroCPI
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-lg hover:bg-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {mobileNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 rounded-xl text-sm font-medium",
                    pathname === item.href
                      ? "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
                      : "text-[color:var(--muted)] hover:bg-white/70"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

// Reference timestamp of the last simulated collection cycle (demo dataset).
const PIPELINE_LAST_RUN = Date.now() - 2 * 60 * 1000;
