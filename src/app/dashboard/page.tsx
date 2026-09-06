"use client";

import { useState } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import {
  TrendingUp, Route, Radio, BarChart3,
  Database, Shield, ArrowUpRight, ArrowDownRight, AlertTriangle, ExternalLink,
} from "lucide-react";
import { getCurrentStats, generateIndexValues, generateRouteAnalytics, generateAnomalies } from "@/lib/demo-data";
import { chartTooltipContentStyle, chartTooltipLabelStyle } from "@/lib/utils";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
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
    <div>
      <DemoModeBanner />

      {/* Editorial hero — National Airfare Overview */}
      <section className="mb-8" aria-labelledby="hero-index-heading">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--muted)] mb-3">
          01 — National Airfare Overview
        </p>
        <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
          <h1
            id="hero-index-heading"
            className="text-5xl sm:text-6xl font-semibold text-[color:var(--foreground)] tracking-tight leading-none"
          >
            <span className="num">{stats.currentIndex}</span>
          </h1>
          <div className="pb-1.5">
            <p className="text-base font-semibold text-emerald-600">
              +{stats.monthlyChange}%{" "}
              <span className="font-normal text-[color:var(--muted)]">vs previous month</span>
            </p>
            <p className="text-sm text-[color:var(--muted)] mt-0.5">
              India Airfare Price Index — automated price intelligence across
              representative Indian domestic routes.
            </p>
          </div>
        </div>
      </section>

      {/* Index & Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Observations" value="1,24,580" icon={Database} compact />
        <MetricCard title="Routes" value="50" icon={Route} compact />
        <MetricCard title="Sources" value="10" icon={Radio} compact />
        <MetricCard title="Data Quality" value="97.9%" icon={Shield} compact />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Index Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 ">Airfare Price Index</h3>
              <p className="text-sm text-gray-500 ">
                {PERIOD_LABELS[period] ?? "last 30 days"} ·{" "}
                <span className={periodChange >= 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                  {periodChange >= 0 ? "+" : ""}{periodChange.toFixed(1)}%
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              {["7D", "30D", "90D", "1Y"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  aria-pressed={period === p}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    p === period
                      ? "bg-blue-100  text-blue-700 "
                      : "text-gray-500 hover:bg-gray-100 "
                  }`}
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
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.length > 7 ? v.slice(5) : v} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={chartTooltipContentStyle}
                  labelStyle={chartTooltipLabelStyle}
                />
                <Area type="monotone" dataKey="indexValue" stroke="#3B82F6" strokeWidth={2} fill="url(#indexGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Routes */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900  mb-4">Top Routes</h3>
            <div className="space-y-3">
              {routeAnalytics.slice(0, 5).map((route) => (
                <Link
                  key={route.routeId}
                  href={`/routes?route=${route.routeId}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50  transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900 ">
                      {route.originCode} → {route.destCode}
                    </span>
                    <p className="text-xs text-gray-400">₹{route.avgFare.toLocaleString("en-IN")} avg</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900 ">{route.index}</span>
                    <p className={`text-xs font-medium ${route.mom >= 0 ? "text-red-500" : "text-green-500"}`}>
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
              <h3 className="text-lg font-semibold text-gray-900 ">Recent Anomalies</h3>
              <Link href="/anomalies" className="text-xs text-blue-600  hover:underline flex items-center gap-1">
                View all <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {anomalies.slice(0, 3).map((anomaly) => (
                <div key={anomaly.id} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50 ">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    anomaly.severity === "CRITICAL" ? "text-red-500" :
                    anomaly.severity === "HIGH" ? "text-orange-500" :
                    anomaly.severity === "MEDIUM" ? "text-yellow-500" : "text-blue-500"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 ">{anomaly.routeName}</p>
                    <p className="text-xs text-gray-500 ">
                      ₹{anomaly.observedValue.toLocaleString("en-IN")} vs ₹{anomaly.referenceValue.toLocaleString("en-IN")} ({anomaly.deviation > 0 ? "+" : ""}{anomaly.deviation}%)
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      anomaly.severity === "CRITICAL" ? "bg-red-100 text-red-700" :
                      anomaly.severity === "HIGH" ? "bg-orange-100 text-orange-700" :
                      anomaly.severity === "MEDIUM" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
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
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900  mb-4">Route Index Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeAnalytics.slice(0, 7)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="routeId" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  contentStyle={chartTooltipContentStyle}
                />
                <Bar dataKey="index" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Status */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900  mb-4">Data Source Health</h3>
          <div className="space-y-3">
            {[
              { name: "IndiGo Direct", status: "Active", records: "12,450", quality: 99.8 },
              { name: "Air India Direct", status: "Active", records: "10,820", quality: 99.5 },
              { name: "SpiceJet Direct", status: "Active", records: "8,210", quality: 99.6 },
              { name: "MakeMyTrip", status: "Active", records: "15,680", quality: 98.2 },
              { name: "Cleartrip", status: "Delayed", records: "9,840", quality: 95.1 },
              { name: "Yatra", status: "Failed", records: "5,430", quality: 72.3 },
            ].map((src) => (
              <div key={src.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 ">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    src.status === "Active" ? "bg-green-500" :
                    src.status === "Delayed" ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 ">{src.name}</p>
                    <p className="text-xs text-gray-400">{src.records} records</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  src.status === "Active" ? "bg-green-100 text-green-700" :
                  src.status === "Delayed" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
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
