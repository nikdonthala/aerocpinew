"use client";

import Link from "next/link";
import { TrendingUp, ArrowRight, BarChart3, Plane, Shield, Database, Activity, MapPin, Zap, Eye, GitBranch } from "lucide-react";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { useDemoMode } from "@/components/DemoModeProvider";

const liveStats = [
  { label: "AeroCPI Index", value: "127.6", change: "+4.8%", sub: "MoM" },
  { label: "Routes Monitored", value: "50", change: "", sub: "" },
  { label: "Price Observations", value: "1,24,580", change: "", sub: "" },
  { label: "Data Sources", value: "10", change: "", sub: "" },
  { label: "Data Quality", value: "97.9%", change: "", sub: "" },
  { label: "Daily Change", value: "+0.8%", change: "", sub: "" },
];

const features = [
  {
    icon: Database,
    title: "Multi-Source Collection",
    description: "Automated collection from airline APIs and OTA portals with compliant data connectors.",
  },
  {
    icon: GitBranch,
    title: "Canonical Flight Matching",
    description: "Same flight normalized across different sources into a single canonical identifier.",
  },
  {
    icon: BarChart3,
    title: "Airfare Price Index",
    description: "A statistically meaningful indicator of airfare-price movement using a representative route basket.",
  },
  {
    icon: TrendingUp,
    title: "Price Forecasting",
    description: "Machine-learning-ready architecture generating confidence-bounded price predictions.",
  },
  {
    icon: Shield,
    title: "Anomaly Detection",
    description: "Automatic detection of unusual price movements with severity classification.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Every data point traceable. Every methodology configurable and documented.",
  },
];

const pipelineSteps = [
  "COLLECT", "VALIDATE", "NORMALIZE", "MATCH", "STORE",
  "ANALYZE", "FORECAST", "AGGREGATE", "INDEX", "REPORT",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <DemoModeBanner />
      <LandingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">Real-Time Airfare Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Measuring India&apos;s Airfare Economy in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Real Time
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">
              An automated airfare intelligence platform that collects, standardizes and analyzes
              flight-price observations to generate a real-time Airfare Price Index for India.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/index-page"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                Explore Airfare Index
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
              >
                <Plane className="w-5 h-5" />
                Search Flights
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
              >
                View Methodology
              </Link>
            </div>
          </div>

          {/* Index visualization card */}
          <div className="mt-12 max-w-lg">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-300">India Airfare Price Index</span>
                <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded-full">Live</span>
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-5xl font-bold text-white">127.6</span>
                <span className="text-green-400 text-lg font-semibold">+0.8% today</span>
              </div>
              {/* Mini chart visualization */}
              <svg viewBox="0 0 400 80" className="w-full h-16">
                <defs>
                  <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,60 Q50,55 80,48 Q120,40 160,42 Q200,44 240,35 Q280,30 320,25 Q360,22 400,15"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M0,60 Q50,55 80,48 Q120,40 160,42 Q200,44 240,35 Q280,30 320,25 Q360,22 400,15"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                />
              </svg>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Jan 2026</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {liveStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-green-500 font-medium mt-0.5">{stat.change} {stat.sub}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Not a Flight Search Engine — An Airfare Intelligence Platform
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              AeroCPI transforms fragmented, dynamic airfare observations into standardized and explainable intelligence for monitoring India&apos;s air-travel price movement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Traditional */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-6 h-6 text-gray-400" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Traditional Flight Website</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-6">
                &ldquo;Find the cheapest ticket.&rdquo;
              </p>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Shows price</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Booking-focused</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Single-source view</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> No historical context</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> No price index</div>
              </div>
            </div>

            {/* AeroCPI */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-8 relative">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                AeroCPI
              </div>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Airfare Intelligence Platform</span>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-lg font-medium mb-6">
                &ldquo;Understand how airfare prices are changing.&rdquo;
              </p>
              <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Standardized Airfare Price Index</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Multi-source normalization</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Historical trend analysis</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> ML-powered forecasting</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Anomaly detection & alerts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Core Pipeline</h2>
            <p className="text-gray-500 dark:text-gray-400">From raw observations to economic indicators</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-0">
            {pipelineSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg">
                  {step}
                </div>
                {i < pipelineSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-300 mx-1 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Platform Capabilities</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">AeroCPI</span>
              <span className="text-xs text-gray-500 ml-2">Prototype v1.0</span>
            </div>
            <p className="text-sm text-gray-500">
              AeroCPI Prototype Index — Demonstration Data. Not an official government index.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">AeroCPI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">Dashboard</Link>
          <Link href="/index-page" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">Airfare Index</Link>
          <Link href="/routes" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">Routes</Link>
          <Link href="/methodology" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">Methodology</Link>
          <Link href="/search" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Search Flights</Link>
        </nav>
      </div>
    </header>
  );
}
