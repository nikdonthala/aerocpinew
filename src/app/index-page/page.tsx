"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { TrendingUp, Info } from "lucide-react";
import { generateIndexValues } from "@/lib/demo-data";
import { chartTooltipContentStyle, chartTooltipLabelStyle } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
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
    <div>
      <PageHeader
        title="Airfare Price Index"
        description="Measuring relative change in standardized airfare prices over time"
        icon={TrendingUp}
        badge="DEMO DATA"
        badgeColor="bg-amber-100 text-amber-700"
      />

      {/* Methodology Note */}
      <div className="bg-blue-50  border border-blue-200  rounded-xl p-4 mb-8 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600  flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800 ">AeroCPI Prototype Index — Demonstration Data</p>
          <p className="text-sm text-blue-700  mt-1">
            The Airfare Price Index measures the relative change in standardized airfare prices over time
            using a defined basket of representative domestic city-pairs and consistent observation rules.
            This is a prototype index using simulated data.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard title="Current Index" value={currentValue.indexValue.toString()} icon={TrendingUp} compact />
        <MetricCard title="Base Period" value="100.0" subtitle="Jan 2026" compact />
        <MetricCard title="Daily Change" value={`${currentValue.dailyChange >= 0 ? "+" : ""}${currentValue.dailyChange}%`} change={currentValue.dailyChange} compact />
        <MetricCard title="Weekly Change" value={`${currentValue.weeklyChange >= 0 ? "+" : ""}${currentValue.weeklyChange}%`} change={currentValue.weeklyChange} compact />
        <MetricCard title="Monthly Change" value={`${currentValue.monthlyChange >= 0 ? "+" : ""}${currentValue.monthlyChange}%`} change={currentValue.monthlyChange} compact />
        <MetricCard title="YoY Change" value="+27.6%" change={27.6} compact />
      </div>

      {/* Period Selector */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 ">Index Trend</h3>
            <p className="text-sm text-gray-500 ">AeroCPI Prototype Index value over time</p>
          </div>
          <div className="flex gap-1 mt-3 sm:mt-0 bg-gray-100  rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setSelectedPeriod(p.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedPeriod === p.value
                    ? "bg-white  text-blue-600  shadow-sm"
                    : "text-gray-500 hover:text-gray-700 "
                }`}
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
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.length > 7 ? v.slice(0, 7) : v}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={chartTooltipContentStyle}
                labelStyle={chartTooltipLabelStyle}
                formatter={(value: unknown) => [`Index: ${value}`, "Value"]}
              />
              <Area type="monotone" dataKey="indexValue" stroke="#3B82F6" strokeWidth={2.5} fill="url(#idxGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Index Formula */}
      <div className="mt-8 card p-6">
        <h3 className="text-lg font-semibold text-gray-900  mb-4">Index Formula</h3>
        <div className="bg-gray-50  rounded-lg p-6 text-center">
          <p className="text-sm text-gray-500  mb-3">Price Relative</p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-mono text-gray-900 ">Current standardized price</p>
            <div className="w-48 h-px bg-gray-400" />
            <p className="text-lg font-mono text-gray-900 ">Base-period standardized price</p>
          </div>
          <div className="mt-6 pt-4 border-t border-[color:var(--border)] ">
            <p className="text-sm text-gray-500  mb-2">National Airfare Index</p>
            <p className="text-lg font-mono text-gray-900 ">
              = Σ (Route Weight × Route Price Relative)
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400 ">
          Note: This is a prototype methodology — configurable and subject to validation.
          This is not claiming to reproduce the official CPI methodology.
        </p>
      </div>
    </div>
  );
}
