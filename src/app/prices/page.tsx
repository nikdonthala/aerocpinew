"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { Activity, Target, Eye } from "lucide-react";
import { generateFareObservations, ROUTES, AIRLINES, generateWatchlist, generateAlerts, getPriceHistory, getBookingWindowAnalysis } from "@/lib/demo-data";
import { chartTooltipContentStyle, chartAxisTick, CHART } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

export default function PricesPage() {
  const [selectedRoute, setSelectedRoute] = useState("HYD-DEL");
  const [selectedAirline, setSelectedAirline] = useState("");
  const observations = generateFareObservations();
  const watchlist = generateWatchlist();
  const alerts = generateAlerts();

  const priceHistory = getPriceHistory(observations, selectedRoute, selectedAirline || undefined);
  const bookingWindows = getBookingWindowAnalysis(observations, selectedRoute, selectedAirline || undefined);

  const bwData = Object.entries(bookingWindows)
    .map(([bw, fare]) => ({ bookingWindow: bw, avgFare: fare }))
    .sort((a, b) => {
      const order = ["T+1", "T+7", "T+15", "T+30", "T+45"];
      return order.indexOf(a.bookingWindow) - order.indexOf(b.bookingWindow);
    });

  const routeObs = observations.filter(o => o.routeId === selectedRoute);
  const fares = routeObs.map(o => o.totalFare);
  const currentFare = fares.length > 0 ? Math.round(fares.reduce((a, b) => a + b, 0) / fares.length) : 0;
  const historicalAvg = priceHistory.length > 0 ? Math.round(priceHistory.reduce((a, b) => a + b.avgFare, 0) / priceHistory.length) : 0;
  const historicalMin = priceHistory.length > 0 ? Math.min(...priceHistory.map(p => p.minFare)) : 0;
  const historicalMax = priceHistory.length > 0 ? Math.max(...priceHistory.map(p => p.maxFare)) : 0;

  return (
    <div className="animate-rise">
      <PageHeader
        title="Price Monitor"
        description="Track historical fares, booking windows, and watchlist"
        icon={Activity}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-7">
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="input !w-auto min-w-[13rem]"
          aria-label="Route"
        >
          {ROUTES.map(r => (
            <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>
          ))}
        </select>
        <select
          value={selectedAirline}
          onChange={(e) => setSelectedAirline(e.target.value)}
          className="input !w-auto min-w-[11rem]"
          aria-label="Airline"
        >
          <option value="">All Airlines</option>
          {AIRLINES.map(a => (
            <option key={a.code} value={a.code}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Price Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-9">
        <MetricCard title="Current Average Fare" value={formatCurrency(currentFare)} compact />
        <MetricCard title="Historical Average" value={formatCurrency(historicalAvg)} compact />
        <MetricCard title="Historical Minimum" value={formatCurrency(historicalMin)} compact />
        <MetricCard title="Historical Maximum" value={formatCurrency(historicalMax)} compact />
      </div>

      {/* Price History Chart */}
      <div className="card p-6 sm:p-7 mb-9">
        <h3 className="text-xl text-[color:var(--foreground)] mb-5">Price History</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="4 6" stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="date" tick={chartAxisTick} tickLine={false} axisLine={false} />
              <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(1)}k`} width={48} />
              <Tooltip
                contentStyle={chartTooltipContentStyle}
                cursor={{ stroke: CHART.grid, strokeWidth: 1.5 }}
                formatter={(value: unknown) => [`₹${Number(value).toLocaleString("en-IN")}`, ""]}
              />
              <Line type="monotone" dataKey="maxFare" stroke={CHART.rose} strokeWidth={1.25} dot={false} strokeDasharray="4 4" name="Max" />
              <Line type="monotone" dataKey="avgFare" stroke={CHART.accent} strokeWidth={2.5} dot={false} name="Average" />
              <Line type="monotone" dataKey="minFare" stroke={CHART.down} strokeWidth={1.25} dot={false} strokeDasharray="4 4" name="Min" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-5 mt-3 text-xs text-[color:var(--muted)]">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#c98a94] inline-block rounded-full" /> Max</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[color:var(--accent)] inline-block rounded-full" /> Average</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[color:var(--down)] inline-block rounded-full" /> Min</span>
        </div>
      </div>

      {/* Booking Window Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-9">
        <div className="card p-6 sm:p-7">
          <h3 className="text-xl text-[color:var(--foreground)] mb-1">Booking Window Analysis</h3>
          <p className="text-sm text-[color:var(--muted)] mb-5">How airfare varies with advance purchase</p>
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
                <Bar dataKey="avgFare" fill={CHART.lavender} radius={[6, 6, 2, 2]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watchlist */}
        <div className="card p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-[0.7rem] bg-[color:var(--lavender-soft)] flex items-center justify-center">
              <Eye className="w-4 h-4 text-[color:var(--cyan)]" />
            </div>
            <h3 className="text-xl text-[color:var(--foreground)]">Watchlist</h3>
          </div>
          <div className="space-y-3">
            {watchlist.map((item) => (
              <div key={item.id} className="p-3.5 bg-[color:var(--well)]/70 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-[color:var(--foreground)]">{item.routeName}</span>
                  <Target className="w-4 h-4 text-[color:var(--muted)]" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[color:var(--muted)]">Target</span>
                    <p className="num font-semibold text-[color:var(--foreground)]">{formatCurrency(item.targetFare)}</p>
                  </div>
                  <div>
                    <span className="text-[color:var(--muted)]">Current</span>
                    <p className="num font-semibold text-[color:var(--foreground)]">{formatCurrency(item.currentFare)}</p>
                  </div>
                  <div>
                    <span className="text-[color:var(--muted)]">Status</span>
                    <p className={`font-semibold ${item.currentFare <= item.targetFare ? "text-[color:var(--down)]" : "text-[color:var(--up)]"}`}>
                      {item.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="card p-6 sm:p-7">
        <h3 className="text-xl text-[color:var(--foreground)] mb-5">Recent Alerts</h3>
        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div key={alert.id} className={`flex items-start gap-3 p-3.5 rounded-xl ${alert.read ? "bg-[color:var(--well)]/50" : "bg-[color:var(--accent-soft)]/70"}`}>
              <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${alert.read ? "bg-[color:var(--border)]" : "bg-[color:var(--accent)]"}`} />
              <div>
                <p className="text-sm text-[color:var(--foreground)]/85">{alert.message}</p>
                <p className="text-xs text-[color:var(--muted)] mt-1">{new Date(alert.timestamp).toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
