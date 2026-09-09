"use client";

import { useState } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import {
  TrendingUp, Route, Radio, BarChart3,
  Database, Shield, ExternalLink, AlertTriangle,
} from "lucide-react";
import { getCurrentStats, generateIndexValues, generateRouteAnalytics, generateAnomalies } from "@/lib/demo-data";
import { chartTooltipContentStyle, chartTooltipLabelStyle, chartAxisTick, CHART } from "@/lib/utils";
import Link from "next/link";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
} from "recharts";

// How many trailing data points each chart period tab shows.
const PERIOD_POINTS: Record<string, number> = { "7D": 7, "30D": 31, "90D": 40, "1Y": 999 };
const PERIOD_LABELS: Record<string, string> = {
  "7D": "last 7 days",
  "30D": "last 30 days",
  "90D": "last 90 days",
  "1Y": "last 12 months",
};

export default function DashboardPage() {
  const stats = getCurrentStats();
  const indexValues = generateIndexValues();
  const routeAnalytics = generateRouteAnalytics();
  const anomalies = generateAnomalies();
  const [period, setPeriod] = useState("30D");

  const recentIndex = indexValues.slice(
    -Math.min(PERIOD_POINTS[period] ?? 31, indexValues.length)
  );
  const periodStart = recentIndex[0]?.indexValue ?? stats.currentIndex;
  const periodChange = periodStart
    ? ((stats.currentIndex - periodStart) / periodStart) * 100
    : 0;

  return (
    <div className="animate-rise">
      <DemoModeBanner />

      {/* Editorial hero — National Airfare Overview */}
      <section className="mb-10" aria-labelledby="hero-index-heading">
        <p className="kicker mb-3">01 — National Airfare Overview</p>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <h1
            id="hero-index-heading"
            className="num text-6xl sm:text-7xl text-[color:var(--foreground)] tracking-tight leading-none"
          >
            {stats.currentIndex}
          </h1>
          <div className="pb-2">
            <p className="text-base font-semibold text-[color:var(--up)]">
              +{stats.monthlyChange}%{" "}
              <span className="font-normal text-[color:var(--muted)]">vs previous month</span>
            </p>
            <p className="text-sm text-[color:var(--muted)] mt-0.5 max-w-md">
              India Airfare Price Index — automated price intelligence across
              representative Indian domestic routes.
            </p>
          </div>
        </div>
      </section>

      {/* Index & Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <MetricCard
          title="India Airfare Price Index"
          value={stats.currentIndex.toString()}
          change={stats.monthlyChange}
          changeLabel="MoM"
          icon={TrendingUp}
          subtitle="AeroCPI Prototype Index"
        />
        <MetricCard
          title="Today's Movement"
          value={`+${stats.dailyChange}%`}
          change={stats.dailyChange}
          changeLabel="today"
          icon={BarChart3}
        />
        <MetricCard
          title="Weekly Movement"
          value={`+${stats.weeklyChange}%`}
          change={stats.weeklyChange}
          changeLabel="7-day"
          icon={Radio}
        />
        <MetricCard
          title="Monthly Movement"
          value={`+${stats.monthlyChange}%`}
          change={stats.monthlyChange}
          changeLabel="30-day"
          icon={TrendingUp}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-10">
        <MetricCard title="Observations" value="1,24,580" icon={Database} compact />
        <MetricCard title="Routes" value="50" icon={Route} compact />
        <MetricCard title="Sources" value="10" icon={Radio} compact />
        <MetricCard title="Data Quality" value="97.9%" icon={Shield} compact />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Main Index Chart */}
        <div className="lg:col-span-2 card p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl text-[color:var(--foreground)]">Airfare Price Index</h3>
              <p className="text-sm text-[color:var(--muted)] mt-0.5">
                {PERIOD_LABELS[period] ?? "last 30 days"} ·{" "}
                <span className={periodChange >= 0 ? "text-[color:var(--up)] font-semibold num" : "text-[color:var(--down)] font-semibold num"}>
                  {periodChange >= 0 ? "+" : ""}{periodChange.toFixed(1)}%
                </span>
              </p>
            </div>
            <div className="seg" role="group" aria-label="Chart period">
              {["7D", "30D", "90D", "1Y"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  aria-pressed={period === p}
                  data-active={p === period}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentIndex}>
                <defs>
                  <linearGradient id="indexGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART.accent} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={CHART.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="date" tick={chartAxisTick} tickLine={false} axisLine={false} tickFormatter={(v) => v.length > 7 ? v.slice(5) : v} />
                <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} domain={["auto", "auto"]} width={44} />
                <Tooltip
                  contentStyle={chartTooltipContentStyle}
                  labelStyle={chartTooltipLabelStyle}
                  cursor={{ stroke: CHART.grid, strokeWidth: 1.5 }}
                />
                <Area type="monotone" dataKey="indexValue" stroke={CHART.accent} strokeWidth={2.5} fill="url(#indexGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "#fffdf9" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Routes */}
          <div className="card p-6">
            <h3 className="text-lg text-[color:var(--foreground)] mb-4">Top Routes</h3>
            <div className="space-y-1">
              {routeAnalytics.slice(0, 5).map((route) => (
                <Link
                  key={route.routeId}
                  href={`/routes?route=${route.routeId}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[color:var(--peach-soft)]/70 transition-colors"
                >
                  <div>
                    <span className="text-sm font-semibold text-[color:var(--foreground)]">
                      {route.originCode} → {route.destCode}
                    </span>
                    <p className="text-xs text-[color:var(--muted)]">₹{route.avgFare.toLocaleString("en-IN")} avg</p>
                  </div>
                  <div className="text-right">
                    <span className="num text-sm font-semibold text-[color:var(--foreground)]">{route.index}</span>
                    <p className={`text-xs font-medium num ${route.mom >= 0 ? "text-[color:var(--up)]" : "text-[color:var(--down)]"}`}>
                      {route.mom >= 0 ? "+" : ""}{route.mom}%
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Anomalies */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-[color:var(--foreground)]">Recent Anomalies</h3>
              <Link href="/anomalies" className="text-xs font-semibold text-[color:var(--accent)] hover:text-[color:var(--accent-strong)] flex items-center gap-1 transition-colors">
                View all <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {anomalies.slice(0, 3).map((anomaly) => (
                <div key={anomaly.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-[color:var(--well)]/70">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    anomaly.severity === "CRITICAL" ? "text-[color:var(--up)]" :
                    anomaly.severity === "HIGH" ? "text-[#c07a3d]" :
                    anomaly.severity === "MEDIUM" ? "text-[#a98a3d]" : "text-[color:var(--cyan)]"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[color:var(--foreground)]">{anomaly.routeName}</p>
                    <p className="text-xs text-[color:var(--muted)]">
                      ₹{anomaly.observedValue.toLocaleString("en-IN")} vs ₹{anomaly.referenceValue.toLocaleString("en-IN")} ({anomaly.deviation > 0 ? "+" : ""}{anomaly.deviation}%)
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      anomaly.severity === "CRITICAL" ? "bg-[#f7e7e2] text-[color:var(--up)]" :
                      anomaly.severity === "HIGH" ? "bg-[#f5e9dc] text-[#9a5f2c]" :
                      anomaly.severity === "MEDIUM" ? "bg-[#f3ecda] text-[#8a6f2c]" : "bg-[color:var(--lavender-soft)] text-[color:var(--cyan)]"
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Comparison */}
        <div className="card p-6 sm:p-7">
          <h3 className="text-xl text-[color:var(--foreground)] mb-5">Route Index Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeAnalytics.slice(0, 7)} layout="vertical">
                <CartesianGrid strokeDasharray="4 6" stroke={CHART.grid} horizontal={false} />
                <XAxis type="number" tick={chartAxisTick} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="routeId" tick={chartAxisTick} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  contentStyle={chartTooltipContentStyle}
                  cursor={{ fill: "rgba(174, 152, 122, 0.08)" }}
                />
                <Bar dataKey="index" fill={CHART.accent} radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Status */}
        <div className="card p-6 sm:p-7">
          <h3 className="text-xl text-[color:var(--foreground)] mb-5">Data Source Health</h3>
          <div className="space-y-2.5">
            {[
              { name: "IndiGo Direct", status: "Active", records: "12,450", quality: 99.8 },
              { name: "Air India Direct", status: "Active", records: "10,820", quality: 99.5 },
              { name: "SpiceJet Direct", status: "Active", records: "8,210", quality: 99.6 },
              { name: "MakeMyTrip", status: "Active", records: "15,680", quality: 98.2 },
              { name: "Cleartrip", status: "Delayed", records: "9,840", quality: 95.1 },
              { name: "Yatra", status: "Failed", records: "5,430", quality: 72.3 },
            ].map((src) => (
              <div key={src.name} className="flex items-center justify-between p-3 rounded-xl bg-[color:var(--well)]/70">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    src.status === "Active" ? "bg-[color:var(--down)]" :
                    src.status === "Delayed" ? "bg-[#c9a23f]" : "bg-[color:var(--up)]"
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-[color:var(--foreground)]">{src.name}</p>
                    <p className="text-xs text-[color:var(--muted)]">{src.records} records</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  src.status === "Active" ? "bg-[#e9efe6] text-[color:var(--down)]" :
                  src.status === "Delayed" ? "bg-[#f3ecda] text-[#8a6f2c]" : "bg-[#f7e7e2] text-[color:var(--up)]"
                }`}>
                  {src.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
