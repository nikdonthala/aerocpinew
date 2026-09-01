"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, TrendingUp, Monitor, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDemoMode } from "@/components/DemoModeProvider";

const mobileNav = [
  { name: "Overview", href: "/dashboard" },
  { name: "Index", href: "/index-page" },
  { name: "Routes", href: "/routes" },
  { name: "Search", href: "/search" },
  { name: "Admin", href: "/admin" },
];

export function Header() {
  const pathname = usePathname();
  const { isDemoMode } = useDemoMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-4 sm:px-6 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white">AeroCPI</span>
      </div>

      <div className="flex-1" />

      {isDemoMode && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-full">
          <Monitor className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
            Demo Data
          </span>
        </div>
      )}

      <Link
        href="/dashboard"
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </Link>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-950 shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">AeroCPI</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
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
                    "block px-3 py-2.5 rounded-lg text-sm font-medium",
                    pathname === item.href
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
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
