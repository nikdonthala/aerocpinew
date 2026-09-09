"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Monitor,
  X,
  Sparkles,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDemoMode } from "@/components/DemoModeProvider";
import { BrandMark } from "./Sidebar";

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
        className="lg:hidden p-2 rounded-lg hover:bg-white/70 transition-colors"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <Link href="/" className="flex items-center gap-2.5 lg:hidden">
        <div className="w-8 h-8 bg-[color:var(--accent)] rounded-[0.6rem] flex items-center justify-center shadow-[0_4px_12px_-4px_rgba(176,83,44,0.5)]">
          <BrandMark className="w-[18px] h-[18px] text-[#fff8f2]" />
        </div>
        <span className="text-base text-[color:var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 560 }}>
          AeroCPI
        </span>
      </Link>

      {/* Global search (desktop) */}
      <div className="hidden md:flex items-center relative w-full max-w-sm">
        <Search className="absolute left-3.5 w-4 h-4 text-[color:var(--muted)] pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
          placeholder="Search routes, airlines, datasets…"
          aria-label="Search routes, airlines and datasets"
          className="input !rounded-full !pl-10 !py-2 !pr-4"
        />
      </div>

      <div className="flex-1" />

      {/* Pipeline status */}
      <div className="hidden lg:flex items-center gap-4 pr-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--down)] opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--down)]" />
          </span>
          <span className="text-xs font-semibold text-[color:var(--down)]">
            {isDemoMode ? "Demo Pipeline" : "Data Pipeline Live"}
          </span>
        </div>
        <span className="text-xs text-[color:var(--muted)]">
          Updated {updatedAt || "just now"}
        </span>
      </div>

      {isDemoMode && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[color:var(--peach-soft)] border border-[#ecd9c4] rounded-full">
          <Monitor className="w-3.5 h-3.5 text-[color:var(--accent-strong)]" />
          <span className="text-xs font-semibold text-[color:var(--accent-strong)] uppercase tracking-wide">
            Demo Data
          </span>
        </div>
      )}

      <Link
        href="/assistant"
        aria-label="Open AI Assistant"
        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full pill bg-[color:var(--lavender-soft)] text-[color:var(--cyan)] hover:brightness-[0.97] transition-all"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Ask AI
      </Link>

      <Link
        href="/admin/sources"
        aria-label="View notifications"
        className="relative p-2 rounded-lg hover:bg-white/70 transition-colors"
      >
        <Bell className="w-5 h-5 text-[color:var(--muted)]" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-[color:var(--up)] rounded-full ring-2 ring-[#fffdf9]" />
      </Link>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[color:var(--ink-navy)]/45 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-[color:var(--surface)] shadow-2xl animate-rise">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--border)]/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[color:var(--accent)] rounded-[0.6rem] flex items-center justify-center">
                  <BrandMark className="w-[18px] h-[18px] text-[#fff8f2]" />
                </div>
                <span className="text-lg text-[color:var(--foreground)]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 560 }}>
                  AeroCPI
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-lg hover:bg-white/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-0.5">
              {mobileNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
                      : "text-[color:var(--muted)] hover:bg-white/70 hover:text-[color:var(--foreground)]"
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
