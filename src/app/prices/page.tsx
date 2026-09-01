"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { Activity, Target, Eye } from "lucide-react";
import { generateFareObservations, ROUTES, AIRLINES, generateWatchlist, generateAlerts, getPriceHistory, getBookingWindowAnalysis } from "@/lib/demo-data";
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
    <div>
      <PageHeader
        title="Price Monitor"
        description="Track historical fares, booking windows, and watchlist"
        icon={Activity}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {ROUTES.map(r => (
            <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>
          ))}
        </select>
        <select
          value={selectedAirline}
          onChange={(e) => setSelectedAirline(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Airlines</option>
          {AIRLINES.map(a => (
            <option key={a.code} value={a.code}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Price Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Current Average Fare" value={formatCurrency(currentFare)} compact />
        <MetricCard title="Historical Average" value={formatCurrency(historicalAvg)} compact />
        <MetricCard title="Historical Minimum" value={formatCurrency(historicalMin)} compact />
        <MetricCard title="Historical Maximum" value={formatCurrency(historicalMax)} compact />
      </div>

      {/* Price History Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price History</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(1)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#F9FAFB", fontSize: "12px" }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, ""]}
              />
              <Line type="monotone" dataKey="maxFare" stroke="#EF4444" strokeWidth={1} dot={false} strokeDasharray="3 3" name="Max" />
              <Line type="monotone" dataKey="avgFare" stroke="#3B82F6" strokeWidth={2.5} dot={false} name="Average" />
              <Line type="monotone" dataKey="minFare" stroke="#22C55E" strokeWidth={1} dot={false} strokeDasharray="3 3" name="Min" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-400 inline-block" /> Max</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> Average</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-400 inline-block" /> Min</span>
        </div>
      </div>

      {/* Booking Window Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Window Analysis</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">How airfare varies with advance purchase</p>
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

        {/* Watchlist */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Watchlist</h3>
          </div>
          <div className="space-y-3">
            {watchlist.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.routeName}</span>
                  <Target className="w-4 h-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Target</span>
                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.targetFare)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Current</span>
                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.currentFare)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status</span>
                    <p className={`font-medium ${item.currentFare <= item.targetFare ? "text-green-600" : "text-red-600"}`}>
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
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Alerts</h3>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg ${alert.read ? "bg-gray-50 dark:bg-gray-800/50" : "bg-blue-50 dark:bg-blue-950"}`}>
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${alert.read ? "bg-gray-300" : "bg-blue-500"}`} />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(alert.timestamp).toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
