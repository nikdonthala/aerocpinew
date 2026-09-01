"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Plane } from "lucide-react";
import { generateAirlineAnalytics } from "@/lib/demo-data";
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
    <div>
      <PageHeader
        title="Airline Analytics"
        description="Aggregate airfare metrics by airline"
        icon={Plane}
        badge="DEMO DATA"
        badgeColor="bg-amber-100 text-amber-700"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Airline Cards */}
        <div className="space-y-4">
          {airlines.map((airline) => (
            <div key={airline.airlineCode} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: airline.color }}
                  >
                    {airline.airlineCode}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{airline.airline}</h3>
                    <p className="text-xs text-gray-400">{airline.routesMonitored} routes monitored</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${airline.monthlyMovement >= 0 ? "text-red-500" : "text-green-500"}`}>
                  {airline.monthlyMovement >= 0 ? "+" : ""}{airline.monthlyMovement}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Avg Fare</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">₹{airline.avgFare.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Volatility</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{airline.volatility}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Observations</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{airline.observations.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Average Fare by Airline</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={airlines}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="airlineCode" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#F9FAFB", fontSize: "12px" }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Avg Fare"]}
                  />
                  <Bar dataKey="avgFare" radius={[4, 4, 0, 0]}>
                    {airlines.map((entry, index) => (
                      <rect key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Airline Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="airline" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar name="Avg Fare" dataKey="avgFare" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                  <Radar name="Volatility" dataKey="volatility" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#F9FAFB", fontSize: "12px" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        Note: These aggregate prototype statistics are not official airline statistics. Data shown is simulated for demonstration purposes.
      </p>
    </div>
  );
}
