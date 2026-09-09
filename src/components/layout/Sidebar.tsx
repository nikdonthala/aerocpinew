"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Route,
  Plane,
  BarChart3,
  Search,
  Database,
  FileText,
  BookOpen,
  Settings,
  Map,
  AlertTriangle,
  Activity,
  Monitor,
  Sparkles,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Airfare Index", href: "/index-page", icon: TrendingUp },
  { name: "Routes", href: "/routes", icon: Route },
  { name: "Airlines", href: "/airlines", icon: Plane },
  { name: "Forecasts", href: "/forecast", icon: BarChart3 },
  { name: "Price Monitor", href: "/prices", icon: Activity },
  { name: "Anomalies", href: "/anomalies", icon: AlertTriangle },
  { name: "Data Explorer", href: "/data", icon: Database },
  { name: "Search", href: "/search", icon: Search },
  { name: "AI Assistant", href: "/assistant", icon: Sparkles },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Methodology", href: "/methodology", icon: BookOpen },
  { name: "Map", href: "/map", icon: Map },
  { name: "Source Monitor", href: "/admin/sources", icon: Monitor },
  { name: "AI Setup Guide", href: "/admin/ai-setup", icon: Settings },
];

// Brand mark: aircraft trajectory crossing an index line — minimal,
// works at favicon size, no literal airplane illustration.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 17.5 8.2 11l3.6 3.4L21 5.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="5.5" r="2.1" fill="currentColor" />
      <path
        d="M8.2 11 6.4 6.2M11.8 14.4l4.9.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:my-5 lg:ml-5 rounded-[1.4rem] glass overflow-hidden">
      <Link
        href="/"
        className="flex items-center gap-3 px-5 py-5 border-b border-[color:var(--border)]/70"
      >
        <div className="w-9 h-9 bg-[color:var(--accent)] rounded-[0.7rem] flex items-center justify-center shadow-[0_6px_16px_-6px_rgba(176,83,44,0.55)]">
          <BrandMark className="w-5 h-5 text-[#fff8f2]" />
        </div>
        <div>
          <span className="text-lg text-[color:var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 560 }}>
            AeroCPI
          </span>
          <p className="text-[10px] text-[color:var(--muted)] uppercase tracking-[0.18em] font-medium">
            Airfare Intelligence
          </p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const isAI = item.href === "/assistant";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200",
                isActive
                  ? "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] font-semibold shadow-[inset_0_0_0_1px_rgba(176,83,44,0.14)]"
                  : "text-[color:var(--muted)] hover:bg-white/70 hover:text-[color:var(--foreground)] hover:translate-x-0.5",
                isAI && !isActive && "text-[color:var(--cyan)]"
              )}
            >
              <item.icon
                className={cn(
                  "w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive && "text-[color:var(--accent)]"
                )}
              />
              {item.name}
              {isAI && !isActive && (
                <span className="ml-auto pill bg-[color:var(--lavender-soft)] text-[color:var(--cyan)] !py-0.5 !px-2">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[color:var(--border)]/70">
        <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--down)] opacity-50" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[color:var(--down)]" />
          </span>
          AeroCPI v1.0 — Price Intelligence
        </div>
      </div>
    </aside>
  );
}
