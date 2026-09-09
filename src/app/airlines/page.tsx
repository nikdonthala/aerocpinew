"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Plane } from "lucide-react";
import { generateAirlineAnalytics } from "@/lib/demo-data";
import { chartTooltipContentStyle, chartAxisTick, CHART } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar,
} from "recharts";

export default function AirlinesPage() {
  const airlines = generateAirlineAnalytics();

  const radarData = airlines.map(a => ({
    airline: a.airlineCode,
    avgFare: a.avgFare / 100,
    volatility: a.volatility,
    observations: a.observations / 1000,
    movement: Math.abs(a.monthlyMovement) * 10,
  }));

  return (
    <div className="animate-rise">
      <PageHeader
        title="Airline Analytics"
        description="Aggregate airfare metrics by airline"
        icon={Plane}
        badge="DEMO DATA"
        badgeColor="bg-[color:var(--peach-soft)] text-[color:var(--accent-strong)]"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Airline Cards */}
        <div className="space-y-4">
          {airlines.map((airline) => (
            <div key={airline.airlineCode} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-[0.8rem] flex items-center justify-center text-white font-bold text-xs tracking-wide shadow-[0_4px_12px_-4px_rgba(87,60,38,0.3)]"
                    style={{ backgroundColor: airline.color }}
                  >
                    {airline.airlineCode}
                  </div>
                  <div>
                    <h3 className="text-base text-[color:var(--foreground)]">{airline.airline}</h3>
                    <p className="text-xs text-[color:var(--muted)]">{airline.routesMonitored} routes monitored</p>
                  </div>
                </div>
                <span className={`num text-sm font-semibold ${airline.monthlyMovement >= 0 ? "text-[color:var(--up)]" : "text-[color:var(--down)]"}`}>
                  {airline.monthlyMovement >= 0 ? "+" : ""}{airline.monthlyMovement}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="kicker mb-1">Avg Fare</p>
                  <p className="num text-sm font-semibold text-[color:var(--foreground)]">₹{airline.avgFare.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="kicker mb-1">Volatility</p>
                  <p className="num text-sm font-semibold text-[color:var(--foreground)]">{airline.volatility}%</p>
                </div>
                <div>
                  <p className="kicker mb-1">Observations</p>
                  <p className="num text-sm font-semibold text-[color:var(--foreground)]">{airline.observations.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-xl text-[color:var(--foreground)] mb-5">Average Fare by Airline</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={airlines}>
                  <CartesianGrid strokeDasharray="4 6" stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="airlineCode" tick={chartAxisTick} tickLine={false} axisLine={false} />
                  <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} width={48} />
                  <Tooltip
                    contentStyle={chartTooltipContentStyle}
                    cursor={{ fill: "rgba(174, 152, 122, 0.08)" }}
                    formatter={(value: unknown) => [`₹${Number(value).toLocaleString("en-IN")}`, "Avg Fare"]}
                  />
                  <Bar dataKey="avgFare" radius={[6, 6, 2, 2]} barSize={30}>
                    {airlines.map((entry, index) => (
                      <rect key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl text-[color:var(--foreground)] mb-5">Airline Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={CHART.grid} />
                  <PolarAngleAxis dataKey="airline" tick={{ fontSize: 11, fill: CHART.axisTick }} />
                  <PolarRadiusAxis tick={{ fontSize: 10, fill: CHART.axisTick }} />
                  <Radar name="Avg Fare" dataKey="avgFare" stroke={CHART.accent} fill={CHART.accent} fillOpacity={0.14} strokeWidth={2} />
                  <Radar name="Volatility" dataKey="volatility" stroke={CHART.rose} fill={CHART.rose} fillOpacity={0.14} strokeWidth={2} />
                  <Tooltip
                    contentStyle={chartTooltipContentStyle}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-[color:var(--muted)]/85 leading-relaxed mt-2">
        Note: These aggregate prototype statistics are not official airline statistics. Data shown is simulated for demonstration purposes.
      </p>
    </div>
  );
}
