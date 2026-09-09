"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { TrendingUp, Info } from "lucide-react";
import { generateIndexValues } from "@/lib/demo-data";
import { chartTooltipContentStyle, chartTooltipLabelStyle, chartAxisTick, CHART } from "@/lib/utils";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";

const periods = [
  { label: "24 hours", value: "24h", days: 1 },
  { label: "7 days", value: "7d", days: 7 },
  { label: "30 days", value: "30d", days: 30 },
  { label: "90 days", value: "90d", days: 90 },
  { label: "1 year", value: "1y", days: 365 },
];

export default function IndexPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const allValues = generateIndexValues();
  const currentValue = allValues[allValues.length - 1] || { indexValue: 127.6, dailyChange: 0.8, weeklyChange: 2.4, monthlyChange: 5.2 };

  const filteredValues = selectedPeriod === "1y" ? allValues :
    allValues.slice(-(periods.find(p => p.value === selectedPeriod)?.days ?? 30));

  return (
    <div className="animate-rise">
      <PageHeader
        title="Airfare Price Index"
        description="Measuring relative change in standardized airfare prices over time"
        icon={TrendingUp}
        badge="DEMO DATA"
        badgeColor="bg-[color:var(--peach-soft)] text-[color:var(--accent-strong)]"
      />

      {/* Methodology Note */}
      <div className="bg-[color:var(--lavender-soft)]/70 border border-[#ddd5ec] rounded-2xl p-5 mb-9 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-[color:var(--cyan)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#4c4370]">AeroCPI Prototype Index — Demonstration Data</p>
          <p className="text-sm text-[#5d5578] mt-1 leading-relaxed">
            The Airfare Price Index measures the relative change in standardized airfare prices over time
            using a defined basket of representative domestic city-pairs and consistent observation rules.
            This is a prototype index using simulated data.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-9">
        <MetricCard title="Current Index" value={currentValue.indexValue.toString()} icon={TrendingUp} compact />
        <MetricCard title="Base Period" value="100.0" subtitle="Jan 2026" compact />
        <MetricCard title="Daily Change" value={`${currentValue.dailyChange >= 0 ? "+" : ""}${currentValue.dailyChange}%`} change={currentValue.dailyChange} compact />
        <MetricCard title="Weekly Change" value={`${currentValue.weeklyChange >= 0 ? "+" : ""}${currentValue.weeklyChange}%`} change={currentValue.weeklyChange} compact />
        <MetricCard title="Monthly Change" value={`${currentValue.monthlyChange >= 0 ? "+" : ""}${currentValue.monthlyChange}%`} change={currentValue.monthlyChange} compact />
        <MetricCard title="YoY Change" value="+27.6%" change={27.6} compact />
      </div>

      {/* Period Selector */}
      <div className="card p-6 sm:p-7 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xl text-[color:var(--foreground)]">Index Trend</h3>
            <p className="text-sm text-[color:var(--muted)] mt-0.5">AeroCPI Prototype Index value over time</p>
          </div>
          <div className="seg mt-3 sm:mt-0" role="group" aria-label="Time period">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setSelectedPeriod(p.value)}
                data-active={selectedPeriod === p.value}
                aria-pressed={selectedPeriod === p.value}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredValues}>
              <defs>
                <linearGradient id="idxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART.accent} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={CHART.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke={CHART.grid} vertical={false} />
              <XAxis
                dataKey="date"
                tick={chartAxisTick}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.length > 7 ? v.slice(0, 7) : v}
              />
              <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} domain={["auto", "auto"]} width={44} />
              <Tooltip
                contentStyle={chartTooltipContentStyle}
                labelStyle={chartTooltipLabelStyle}
                cursor={{ stroke: CHART.grid, strokeWidth: 1.5 }}
                formatter={(value: unknown) => [`Index: ${value}`, "Value"]}
              />
              <Area type="monotone" dataKey="indexValue" stroke={CHART.accent} strokeWidth={2.5} fill="url(#idxGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "#fffdf9" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Index Formula */}
      <div className="card p-6 sm:p-7">
        <h3 className="text-xl text-[color:var(--foreground)] mb-5">Index Formula</h3>
        <div className="bg-[color:var(--well)]/70 rounded-2xl p-7 text-center">
          <p className="kicker mb-4">Price Relative</p>
          <div className="flex flex-col items-center gap-2.5">
            <p className="text-lg font-mono text-[color:var(--foreground)]">Current standardized price</p>
            <div className="w-48 h-px bg-[color:var(--border)]" />
            <p className="text-lg font-mono text-[color:var(--foreground)]">Base-period standardized price</p>
          </div>
          <div className="mt-7 pt-5 border-t border-[color:var(--border)]">
            <p className="kicker mb-2.5">National Airfare Index</p>
            <p className="text-lg font-mono text-[color:var(--accent-strong)]">
              = Σ (Route Weight × Route Price Relative)
            </p>
          </div>
        </div>
        <p className="mt-5 text-xs text-[color:var(--muted)]/85 leading-relaxed">
          Note: This is a prototype methodology — configurable and subject to validation.
          This is not claiming to reproduce the official CPI methodology.
        </p>
      </div>
    </div>
  );
}
