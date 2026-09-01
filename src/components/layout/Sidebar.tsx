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
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Methodology", href: "/methodology", icon: BookOpen },
  { name: "Map", href: "/map", icon: Map },
  { name: "Source Monitor", href: "/admin/sources", icon: Monitor },
  { name: "Admin", href: "/admin", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">AeroCPI</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-blue-600 dark:text-blue-400" : "")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
          AeroCPI v1.0 — Prototype
        </div>
      </div>
    </aside>
  );
}
