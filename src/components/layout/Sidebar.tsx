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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r border-[color:var(--border)] bg-[color:var(--surface)]/70 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2.5 px-6 py-5 border-b border-[color:var(--border)]">
        <div className="w-9 h-9 bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--cyan)] rounded-xl flex items-center justify-center shadow-md shadow-blue-900/10">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-[color:var(--foreground)] tracking-tight">AeroCPI</span>
          <p className="text-[10px] text-[color:var(--muted)] uppercase tracking-widest font-medium">
            Airfare Intelligence
          </p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isAI = item.href === "/assistant";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] shadow-sm"
                  : "text-[color:var(--muted)] hover:bg-white/70 hover:text-[color:var(--foreground)]",
                isAI && !isActive && "text-[color:var(--cyan)]"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive && "text-[color:var(--accent)]")} />
              {item.name}
              {isAI && !isActive && (
                <span className="ml-auto pill bg-[color:var(--accent-soft)] text-[color:var(--accent)] !py-0.5 !px-2">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[color:var(--border)]">
        <div className="px-3 py-2 text-xs text-[color:var(--muted)]">
          AeroCPI v1.0 — Airfare Price Intelligence
        </div>
      </div>
    </aside>
  );
}
