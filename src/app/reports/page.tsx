"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FileText, Download, Printer, FileSpreadsheet, File } from "lucide-react";
import { getCurrentStats, generateRouteAnalytics, generateAnomalies, DATA_SOURCES } from "@/lib/demo-data";

export default function ReportsPage() {
  const stats = getCurrentStats();
  const routes = generateRouteAnalytics();
  const anomalies = generateAnomalies();

  const topRising = routes.filter(r => r.mom > 0).sort((a, b) => b.mom - a.mom).slice(0, 5);
  const topFalling = routes.filter(r => r.mom < 0).sort((a, b) => a.mom - b.mom).slice(0, 5);

  const activeSources = DATA_SOURCES.filter(s => s.status === "Active").length;
  const totalQuality = Math.round(DATA_SOURCES.reduce((a, b) => a + b.quality, 0) / DATA_SOURCES.length * 10) / 10;

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and export airfare intelligence reports"
        icon={FileText}
      />

      {/* Export Options */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { icon: File, label: "Export PDF", color: "bg-red-600 hover:bg-red-700" },
          { icon: FileSpreadsheet, label: "Export Excel", color: "bg-green-600 hover:bg-green-700" },
          { icon: Download, label: "Export CSV", color: "bg-blue-600 hover:bg-blue-700" },
          { icon: Printer, label: "Print Report", color: "bg-gray-600 hover:bg-gray-700" },
        ].map((btn) => (
          <button
            key={btn.label}
            className={`flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors ${btn.color}`}
          >
            <btn.icon className="w-4 h-4" />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Report Preview */}
      <div className="card overflow-hidden">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Daily Airfare Intelligence Report</h2>
              <p className="text-sm text-blue-200 mt-1">September 1, 2026 — AeroCPI Prototype</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.currentIndex}</p>
              <p className="text-sm text-green-300">+{stats.dailyChange}% today</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Index Summary */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900  mb-4">Index Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50  rounded-lg p-3">
                <p className="text-xs text-gray-400">Current Index</p>
                <p className="text-xl font-bold text-gray-900 ">{stats.currentIndex}</p>
              </div>
              <div className="bg-gray-50  rounded-lg p-3">
                <p className="text-xs text-gray-400">Daily Change</p>
                <p className="text-xl font-bold text-red-500">+{stats.dailyChange}%</p>
              </div>
              <div className="bg-gray-50  rounded-lg p-3">
                <p className="text-xs text-gray-400">Weekly Change</p>
                <p className="text-xl font-bold text-red-500">+{stats.weeklyChange}%</p>
              </div>
              <div className="bg-gray-50  rounded-lg p-3">
                <p className="text-xs text-gray-400">Monthly Change</p>
                <p className="text-xl font-bold text-red-500">+{stats.monthlyChange}%</p>
              </div>
            </div>
          </section>

          {/* Top Rising Routes */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900  mb-4">Top Rising Routes</h3>
            <div className="space-y-2">
              {topRising.map((route, i) => (
                <div key={route.routeId} className="flex items-center justify-between p-3 bg-red-50  rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                    <span className="text-sm font-semibold text-gray-900 ">{route.routeId}</span>
                    <span className="text-xs text-gray-500">₹{route.avgFare.toLocaleString("en-IN")} avg</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">+{route.mom}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* Top Falling Routes */}
          {topFalling.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900  mb-4">Top Falling Routes</h3>
              <div className="space-y-2">
                {topFalling.map((route, i) => (
                  <div key={route.routeId} className="flex items-center justify-between p-3 bg-green-50  rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                      <span className="text-sm font-semibold text-gray-900 ">{route.routeId}</span>
                      <span className="text-xs text-gray-500">₹{route.avgFare.toLocaleString("en-IN")} avg</span>
                    </div>
                    <span className="text-sm font-semibold text-green-500">{route.mom}%</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Anomalies */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900  mb-4">Anomalies Detected</h3>
            <div className="space-y-2">
              {anomalies.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-yellow-50  rounded-lg">
                  <div>
                    <span className="text-sm font-semibold text-gray-900 ">{a.routeName}</span>
                    <span className="text-xs text-gray-500 ml-2">₹{a.observedValue.toLocaleString("en-IN")} vs ₹{a.referenceValue.toLocaleString("en-IN")}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    a.severity === "CRITICAL" ? "bg-red-100 text-red-700" :
                    a.severity === "HIGH" ? "bg-orange-100 text-orange-700" :
                    a.severity === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>{a.severity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Data Quality */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900  mb-4">Data Quality & Source Coverage</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50  rounded-lg p-3">
                <p className="text-xs text-gray-400">Total Observations</p>
                <p className="text-lg font-bold text-gray-900 ">{stats.totalObservations.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-gray-50  rounded-lg p-3">
                <p className="text-xs text-gray-400">Active Sources</p>
                <p className="text-lg font-bold text-gray-900 ">{activeSources}/{DATA_SOURCES.length}</p>
              </div>
              <div className="bg-gray-50  rounded-lg p-3">
                <p className="text-xs text-gray-400">Avg Quality Score</p>
                <p className="text-lg font-bold text-green-600">{totalQuality}%</p>
              </div>
              <div className="bg-gray-50  rounded-lg p-3">
                <p className="text-xs text-gray-400">Routes Monitored</p>
                <p className="text-lg font-bold text-gray-900 ">{stats.routesMonitored}</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-[color:var(--border)]  text-xs text-gray-400">
            <p>This report is generated from simulated data for demonstration purposes.</p>
            <p>AeroCPI Prototype — Not an official government index.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
