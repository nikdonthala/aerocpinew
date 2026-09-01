"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Route, ArrowUpDown, Search } from "lucide-react";
import { generateRouteAnalytics, getBookingWindowAnalysis } from "@/lib/demo-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RoutesPage() {
  const [sortBy, setSortBy] = useState<"index" | "mom" | "avgFare" | "observations">("index");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes = generateRouteAnalytics();
  const filtered = routes
    .filter(r => search === "" || r.routeId.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]);

  const selectedRouteData = selectedRoute ? routes.find(r => r.routeId === selectedRoute) : null;
  const bookingWindows = selectedRoute ? getBookingWindowAnalysis([], selectedRoute) : null;

  const bwData = bookingWindows ? Object.entries(bookingWindows).map(([bw, fare]) => ({
    bookingWindow: bw,
    avgFare: fare,
  })).sort((a, b) => {
    const order = ["T+1", "T+7", "T+15", "T+30", "T+45"];
    return order.indexOf(a.bookingWindow) - order.indexOf(b.bookingWindow);
  }) : [];

  return (
    <div>
      <PageHeader
        title="Route Analytics"
        description="Airfare index and statistics by route"
        icon={Route}
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routes (e.g., DEL-BOM)"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Route</th>
                {[
                  { key: "index", label: "Index" },
                  { key: "mom", label: "MoM %" },
                  { key: "avgFare", label: "Avg Fare" },
                  { key: "observations", label: "Obs." },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => { setSortBy(col.key as typeof sortBy); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  >
                    <span className="flex items-center gap-1">
                      {col.label} <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((route) => (
                <tr
                  key={route.routeId}
                  onClick={() => setSelectedRoute(route.routeId)}
                  className={`border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    selectedRoute === route.routeId ? "bg-blue-50 dark:bg-blue-950" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{route.routeId}</span>
                    <p className="text-xs text-gray-400">{route.origin} → {route.destination}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{route.index}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${route.mom >= 0 ? "text-red-500" : "text-green-500"}`}>
                      {route.mom >= 0 ? "+" : ""}{route.mom}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">₹{route.avgFare.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{route.observations.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-lg ${route.trend === "up" ? "text-red-500" : route.trend === "down" ? "text-green-500" : "text-gray-400"}`}>
                      {route.trend === "up" ? "↑" : route.trend === "down" ? "↓" : "→"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Route Detail */}
      {selectedRouteData && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {selectedRouteData.originCode} → {selectedRouteData.destCode}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-400">Current Index</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedRouteData.index}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">MoM Change</p>
              <p className={`text-xl font-bold ${selectedRouteData.mom >= 0 ? "text-red-500" : "text-green-500"}`}>
                {selectedRouteData.mom >= 0 ? "+" : ""}{selectedRouteData.mom}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Average Fare</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">₹{selectedRouteData.avgFare.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Observations</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedRouteData.observations.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {bwData.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Booking Window Analysis</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bwData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="bookingWindow" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#F9FAFB", fontSize: "12px" }}
                      formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Avg Fare"]}
                    />
                    <Bar dataKey="avgFare" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
