"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Route, ArrowUpDown, Search } from "lucide-react";
import { generateRouteAnalytics, getBookingWindowAnalysis } from "@/lib/demo-data";
import { chartTooltipContentStyle, chartAxisTick, CHART } from "@/lib/utils";
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
    <div className="animate-rise">
      <PageHeader
        title="Route Analytics"
        description="Airfare index and statistics by route"
        icon={Route}
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routes (e.g., DEL-BOM)"
            aria-label="Search routes"
            className="input !rounded-full !pl-10"
          />
        </div>
      </div>

      {/* Routes Table */}
      <div className="card overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full table-lux">
            <thead>
              <tr>
                <th>Route</th>
                {[
                  { key: "index", label: "Index" },
                  { key: "mom", label: "MoM %" },
                  { key: "avgFare", label: "Avg Fare" },
                  { key: "observations", label: "Obs." },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => { setSortBy(col.key as typeof sortBy); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}
                    className="cursor-pointer hover:text-[color:var(--accent)] transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      {col.label} <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </span>
                  </th>
                ))}
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((route) => (
                <tr
                  key={route.routeId}
                  onClick={() => setSelectedRoute(route.routeId)}
                  className={`cursor-pointer ${selectedRoute === route.routeId ? "bg-[color:var(--accent-soft)]/60" : ""}`}
                >
                  <td>
                    <span className="text-sm font-semibold text-[color:var(--foreground)]">{route.routeId}</span>
                    <p className="text-xs text-[color:var(--muted)]">{route.origin} → {route.destination}</p>
                  </td>
                  <td className="num text-sm font-semibold text-[color:var(--foreground)]">{route.index}</td>
                  <td>
                    <span className={`num text-sm font-medium ${route.mom >= 0 ? "text-[color:var(--up)]" : "text-[color:var(--down)]"}`}>
                      {route.mom >= 0 ? "+" : ""}{route.mom}%
                    </span>
                  </td>
                  <td className="num text-sm text-[color:var(--foreground)]/85">₹{route.avgFare.toLocaleString("en-IN")}</td>
                  <td className="num text-sm text-[color:var(--foreground)]/85">{route.observations.toLocaleString("en-IN")}</td>
                  <td>
                    <span className={`text-lg ${route.trend === "up" ? "text-[color:var(--up)]" : route.trend === "down" ? "text-[color:var(--down)]" : "text-[color:var(--muted)]"}`}>
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
        <div className="card-glass p-7 animate-rise">
          <h3 className="text-2xl text-[color:var(--foreground)] mb-1">
            {selectedRouteData.originCode} → {selectedRouteData.destCode}
          </h3>
          <p className="text-sm text-[color:var(--muted)] mb-6">{selectedRouteData.origin} → {selectedRouteData.destination}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-7">
            <div>
              <p className="kicker mb-1">Current Index</p>
              <p className="num text-2xl text-[color:var(--foreground)]">{selectedRouteData.index}</p>
            </div>
            <div>
              <p className="kicker mb-1">MoM Change</p>
              <p className={`num text-2xl ${selectedRouteData.mom >= 0 ? "text-[color:var(--up)]" : "text-[color:var(--down)]"}`}>
                {selectedRouteData.mom >= 0 ? "+" : ""}{selectedRouteData.mom}%
              </p>
            </div>
            <div>
              <p className="kicker mb-1">Average Fare</p>
              <p className="num text-2xl text-[color:var(--foreground)]">₹{selectedRouteData.avgFare.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="kicker mb-1">Observations</p>
              <p className="num text-2xl text-[color:var(--foreground)]">{selectedRouteData.observations.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {bwData.length > 0 && (
            <div>
              <h4 className="kicker mb-3.5">Booking Window Analysis</h4>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bwData}>
                    <CartesianGrid strokeDasharray="4 6" stroke={CHART.grid} vertical={false} />
                    <XAxis dataKey="bookingWindow" tick={chartAxisTick} tickLine={false} axisLine={false} />
                    <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} width={48} />
                    <Tooltip
                      contentStyle={chartTooltipContentStyle}
                      cursor={{ fill: "rgba(174, 152, 122, 0.08)" }}
                      formatter={(value: unknown) => [`₹${Number(value).toLocaleString("en-IN")}`, "Avg Fare"]}
                    />
                    <Bar dataKey="avgFare" fill={CHART.accent} radius={[6, 6, 2, 2]} barSize={28} />
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
