"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, TrendingUp, Monitor, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  const { isDemoMode } = useDemoMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-40 flex items-center gap-4 px-4 sm:px-6 py-3 border-x-0 border-t-0 rounded-none">
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

      <div className="flex-1" />

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
        href="/dashboard"
        aria-label="View notifications"
        className="relative p-2 rounded-lg hover:bg-white/60"
      >
        <Bell className="w-5 h-5 text-[color:var(--muted)]" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </Link>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-[color:var(--ink-navy)]/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-[color:var(--surface)] shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--cyan)] rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-[color:var(--foreground)]">AeroCPI</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="p-2 rounded-lg hover:bg-white/60">
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
