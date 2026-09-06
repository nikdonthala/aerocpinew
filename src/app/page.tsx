"use client";

import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  BarChart3,
  Plane,
  Shield,
  Database,
  Activity,
  Sparkles,
  Eye,
  GitBranch,
  LayoutDashboard,
  Route,
  Search,
  FileText,
  BookOpen,
  Map,
  Monitor,
  AlertTriangle,
  Radio,
  Settings,
} from "lucide-react";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";

const liveStats = [
  { label: "AeroCPI Index", value: "127.6", href: "/index-page" },
  { label: "Routes Monitored", value: "50", href: "/routes" },
  { label: "Price Observations", value: "1,24,580", href: "/data" },
  { label: "Data Sources", value: "10", href: "/admin/sources" },
  { label: "Data Quality", value: "97.9%", href: "/data" },
  { label: "Daily Change", value: "+0.8%", href: "/prices" },
];

const features = [
  {
    icon: Database,
    title: "Multi-Source Collection",
    description:
      "Automated collection from airline APIs and OTA portals with compliant data connectors.",
    href: "/admin/sources",
  },
  {
    icon: GitBranch,
    title: "Canonical Flight Matching",
    description:
      "The same flight normalized across different sources into a single canonical identifier.",
    href: "/data",
  },
  {
    icon: BarChart3,
    title: "Airfare Price Index",
    description:
      "A statistically meaningful indicator of airfare-price movement using a representative route basket.",
    href: "/index-page",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description:
      "Ask questions in natural language. Answers grounded strictly in AeroCPI data — no invention.",
    href: "/assistant",
  },
  {
    icon: Shield,
    title: "Anomaly Detection",
    description:
      "Automatic detection of unusual price movements with severity classification.",
    href: "/anomalies",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description:
      "Every data point traceable. Every methodology configurable and documented.",
    href: "/methodology",
  },
];

// Pipeline steps map to the subpage that demonstrates each stage.
const pipelineSteps = [
  { step: "COLLECT", href: "/admin/sources" },
  { step: "VALIDATE", href: "/data" },
  { step: "NORMALIZE", href: "/methodology" },
  { step: "MATCH", href: "/search" },
  { step: "STORE", href: "/data" },
  { step: "ANALYZE", href: "/routes" },
  { step: "FORECAST", href: "/forecast" },
  { step: "AGGREGATE", href: "/index-page" },
  { step: "INDEX", href: "/index-page" },
  { step: "REPORT", href: "/reports" },
];

// Complete platform map — every subpage reachable from the homepage.
const platformPages = [
  { name: "Dashboard", description: "National airfare overview & KPIs", href: "/dashboard", icon: LayoutDashboard, accent: true },
  { name: "Airfare Index", description: "Index levels, base period & movement", href: "/index-page", icon: TrendingUp },
  { name: "Route Analytics", description: "Route-level fares, trends & changes", href: "/routes", icon: Route },
  { name: "Airlines", description: "Carrier comparison & fare trends", href: "/airlines", icon: Plane },
  { name: "Forecasts", description: "Model estimates with confidence ranges", href: "/forecast", icon: BarChart3 },
  { name: "Live Prices", description: "Latest fare observations by window", href: "/prices", icon: Activity },
  { name: "Anomalies", description: "Unusual price movements detected", href: "/anomalies", icon: AlertTriangle },
  { name: "Data Explorer", description: "Browse, filter & export observations", href: "/data", icon: Database },
  { name: "Search Flights", description: "Cross-source fare comparison", href: "/search", icon: Search },
  { name: "AI Assistant", description: "Ask anything about the data", href: "/assistant", icon: Sparkles, accent: true },
  { name: "Reports", description: "Daily, weekly & monthly summaries", href: "/reports", icon: FileText },
  { name: "Methodology", description: "How the index is calculated", href: "/methodology", icon: BookOpen },
  { name: "Route Map", description: "Geographic route coverage", href: "/map", icon: Map },
  { name: "Source Monitor", description: "Pipeline health & collection status", href: "/admin/sources", icon: Monitor },
  { name: "Admin Panel", description: "System configuration & logs", href: "/admin", icon: Settings },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <DemoModeBanner />
      <LandingHeader />

      {/* Hero — warm ivory, premium */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60rem 36rem at 15% 0%, rgba(30,64,175,0.08), transparent 55%), radial-gradient(50rem 30rem at 90% 20%, rgba(8,145,178,0.07), transparent 55%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/70 border border-blue-100 rounded-full mb-6 shadow-sm backdrop-blur">
              <Activity className="w-4 h-4 text-[color:var(--accent)]" />
              <span className="text-sm text-[color:var(--accent-strong)] font-medium">
                Real-Time Airfare Intelligence Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[color:var(--foreground)] leading-[1.1] tracking-tight mb-6">
              Measuring India&apos;s Airfare Economy in{" "}
              <span className="text-gradient-accent">Real Time</span>
            </h1>

            <p className="text-lg sm:text-xl text-[color:var(--muted)] leading-relaxed mb-8 max-w-2xl">
              An automated airfare intelligence platform that collects, standardizes and
              analyzes flight-price observations to generate a real-time Airfare Price
              Index for India.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/index-page"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base"
              >
                <TrendingUp className="w-5 h-5" />
                Explore Airfare Index
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/assistant"
                className="glass inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base rounded-xl font-semibold text-[color:var(--foreground)] hover:bg-white/80 transition-colors"
              >
                <Sparkles className="w-5 h-5 text-[color:var(--cyan)]" />
                Ask the AI
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base rounded-xl font-semibold text-[color:var(--accent-strong)] border border-blue-200/70 bg-white/60 hover:bg-white transition-colors"
              >
                View Methodology
              </Link>
            </div>
          </div>

          {/* Index visualization card — glass on ivory */}
          <div className="mt-14 max-w-lg">
            <Link href="/index-page" className="block group" aria-label="Open the Airfare Index page">
              <div className="card-glass p-6 transition-transform duration-200 group-hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[color:var(--muted)]">India Airfare Price Index</span>
                  <span className="pill bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                    <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="num text-5xl font-bold text-[color:var(--foreground)] tracking-tight">127.6</span>
                  <span className="text-green-600 text-lg font-semibold">+0.8% today</span>
                </div>
                {/* Mini chart visualization */}
                <svg viewBox="0 0 400 80" className="w-full h-16" aria-hidden="true">
                  <defs>
                    <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,60 C40,55 60,40 100,42 C140,44 160,30 200,32 C240,34 260,20 300,24 C340,28 370,15 400,12 L400,80 L0,80 Z"
                    fill="url(#heroArea)"
                  />
                  <path
                    d="M0,60 C40,55 60,40 100,42 C140,44 160,30 200,32 C240,34 260,20 300,24 C340,28 370,15 400,12"
                    fill="none"
                    stroke="#1d4ed8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="400" cy="12" r="4" fill="#0891b2" />
                </svg>
                <div className="flex justify-between text-xs text-[color:var(--muted)] mt-2">
                  <span>Base period: Jan 2025 = 100</span>
                  <span>Updated 10:02 IST</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Live stats strip — each stat links to its subpage */}
      <section className="border-y border-[color:var(--border)] bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {liveStats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="text-center sm:text-left rounded-xl px-2 py-1.5 -mx-2 hover:bg-white/70 transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]"
              >
                <p className="num text-xl sm:text-2xl font-bold text-[color:var(--foreground)] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-[color:var(--muted)] mt-0.5">{stat.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline — each stage links to the page demonstrating it */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[color:var(--foreground)] tracking-tight mb-3">
          From raw fares to a national index
        </h2>
        <p className="text-[color:var(--muted)] mb-8 max-w-2xl">
          AeroCPI is not a flight comparison site. It is a measurement system — a
          reproducible pipeline that turns millions of fare observations into a single,
          trustworthy number.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {pipelineSteps.map(({ step, href }, i) => (
            <div key={step} className="flex items-center gap-2">
              <Link
                href={href}
                title={`Open the ${step.toLowerCase()} stage`}
                className="px-3 py-1.5 rounded-lg bg-white/80 border border-[color:var(--border)] text-xs font-semibold text-[color:var(--accent-strong)] tracking-wide shadow-sm hover:bg-[color:var(--accent-soft)] hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200"
              >
                {step}
              </Link>
              {i < pipelineSteps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-[color:var(--muted)]/50" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features — cards navigate to the page demonstrating each capability */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="card group p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[color:var(--accent-soft)] to-white border border-blue-100/60 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-[color:var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-1.5 group-hover:text-[color:var(--accent-strong)] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-[color:var(--muted)] leading-relaxed">
                {feature.description}
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[color:var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Platform map — every subpage, one grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-[color:var(--foreground)] tracking-tight mb-3">
          Explore the platform
        </h2>
        <p className="text-[color:var(--muted)] mb-8 max-w-2xl">
          Dashboard, route analytics, forecasts, anomaly detection and an AI assistant
          that answers only from AeroCPI data — everything is one click away.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {platformPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="card group p-4 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                  page.accent
                    ? "bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--cyan)] shadow-md shadow-blue-900/10"
                    : "bg-[color:var(--accent-soft)] border border-blue-100/60"
                }`}
              >
                <page.icon
                  className={`w-[18px] h-[18px] ${page.accent ? "text-white" : "text-[color:var(--accent)]"}`}
                />
              </div>
              <h3 className="text-sm font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent-strong)] transition-colors">
                {page.name}
              </h3>
              <p className="text-xs text-[color:var(--muted)] mt-1 leading-relaxed">
                {page.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Secondary CTA row */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link href="/dashboard" className="btn-primary px-6 py-3">
            Open Dashboard
          </Link>
          <Link
            href="/admin/ai-setup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[color:var(--accent-strong)] border border-blue-200/70 bg-white/70 hover:bg-white transition-colors"
          >
            AI Setup Guide
          </Link>
        </div>
      </section>

      <footer className="border-t border-[color:var(--border)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-[color:var(--muted)]">
            AeroCPI — India&apos;s Real-Time Airfare Price Intelligence Platform
          </p>
          <p className="text-xs text-[color:var(--muted)]/70">
            Prototype · Demo data · SIH 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

function LandingHeader() {
  return (
    <header className="glass sticky top-0 z-40 border-x-0 border-t-0 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--cyan)] rounded-xl flex items-center justify-center shadow-md shadow-blue-900/10">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-[color:var(--foreground)] tracking-tight">AeroCPI</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/dashboard"
            className="px-3 py-2 text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)] rounded-lg hover:bg-white/60 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/methodology"
            className="px-3 py-2 text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)] rounded-lg hover:bg-white/60 transition-colors hidden sm:block"
          >
            Methodology
          </Link>
          <Link
            href="/reports"
            className="px-3 py-2 text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)] rounded-lg hover:bg-white/60 transition-colors hidden md:block"
          >
            Reports
          </Link>
          <Link href="/assistant" className="btn-primary px-4 py-2 text-sm ml-1">
            Ask AI
          </Link>
        </nav>
      </div>
    </header>
  );
}
