"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FileText, Download, Printer, FileSpreadsheet, File } from "lucide-react";
import { getCurrentStats, generateRouteAnalytics, generateAnomalies, DATA_SOURCES } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const stats = getCurrentStats();
  const routes = generateRouteAnalytics();
  const anomalies = generateAnomalies();

  const downloadFile = (content: string, mime: string, filename: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = (label: string) => {
    const date = new Date().toISOString().split("T")[0];
    const base = `aerocpi-report-${date}`;
    const summary = {
      report: "Daily Airfare Intelligence Report (demo data)",
      generatedAt: new Date().toISOString(),
      index: {
        current: stats.currentIndex,
        dailyChange: stats.dailyChange,
        weeklyChange: stats.weeklyChange,
        monthlyChange: stats.monthlyChange,
      },
      topRisingRoutes: topRising,
      topFallingRoutes: topFalling,
      dataSources: DATA_SOURCES.map(({ id, name, type, status, quality }) => ({ id, name, type, status, quality })),
      anomalyCount: anomalies.length,
    };
    if (label === "Export CSV") {
      const rows = routes.map((r) => [r.routeId, r.avgFare, r.mom, r.observations]);
      const csv =
        ["Route,Avg Fare,Monthly Change %,Observations", ...rows.map((r) => r.join(","))].join("\n");
      downloadFile(csv, "text/csv", `${base}.csv`);
    } else if (label === "Export Excel") {
      // Excel-compatible: same CSV served with a spreadsheet MIME type.
      const rows = routes.map((r) => [r.routeId, r.avgFare, r.mom, r.observations]);
      const csv =
        ["Route,Avg Fare,Monthly Change %,Observations", ...rows.map((r) => r.join(","))].join("\n");
      downloadFile(csv, "application/vnd.ms-excel", `${base}.xls`);
    } else if (label === "Export PDF") {
      // Print dialog → "Save as PDF" gives a real PDF without extra dependencies.
      window.print();
    } else {
      downloadFile(JSON.stringify(summary, null, 2), "application/json", `${base}.json`);
    }
  };

  const topRising = routes.filter(r => r.mom > 0).sort((a, b) => b.mom - a.mom).slice(0, 5);
  const topFalling = routes.filter(r => r.mom < 0).sort((a, b) => a.mom - b.mom).slice(0, 5);

  const activeSources = DATA_SOURCES.filter(s => s.status === "Active").length;
  const totalQuality = Math.round(DATA_SOURCES.reduce((a, b) => a + b.quality, 0) / DATA_SOURCES.length * 10) / 10;

  const exportButtons = [
    { icon: File, label: "Export PDF" },
    { icon: FileSpreadsheet, label: "Export Excel" },
    { icon: Download, label: "Export CSV" },
    { icon: Printer, label: "Print Report" },
  ];

  return (
    <div className="animate-rise">
      <PageHeader
        title="Reports"
        description="Generate and export airfare intelligence reports"
        icon={FileText}
      />

      {/* Export Options */}
      <div className="flex flex-wrap gap-3 mb-9">
        {exportButtons.map((btn) => (
          <button
            key={btn.label}
            onClick={() =>
              btn.label === "Export PDF" || btn.label === "Print Report"
                ? window.print()
                : handleExport(btn.label)
            }
            className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm"
          >
            <btn.icon className="w-4 h-4 text-[color:var(--accent)]" />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Report Preview */}
      <div className="card overflow-hidden">
        {/* Report Header */}
        <div className="bg-[color:var(--ink-navy)] p-7 text-[#f5efe6]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl">Daily Airfare Intelligence Report</h2>
              <p className="text-sm text-[#c9bfae] mt-1.5">September 1, 2026 — AeroCPI Prototype</p>
            </div>
            <div className="text-right">
              <p className="num text-3xl">{stats.currentIndex}</p>
              <p className="text-sm text-[#a8c39a] mt-0.5">+{stats.dailyChange}% today</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-9">
          {/* Index Summary */}
          <section>
            <h3 className="text-lg text-[color:var(--foreground)] mb-4">Index Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[color:var(--well)]/70 rounded-xl p-4">
                <p className="kicker mb-1.5">Current Index</p>
                <p className="num text-xl text-[color:var(--foreground)]">{stats.currentIndex}</p>
              </div>
              <div className="bg-[color:var(--well)]/70 rounded-xl p-4">
                <p className="kicker mb-1.5">Daily Change</p>
                <p className="num text-xl text-[color:var(--up)]">+{stats.dailyChange}%</p>
              </div>
              <div className="bg-[color:var(--well)]/70 rounded-xl p-4">
                <p className="kicker mb-1.5">Weekly Change</p>
                <p className="num text-xl text-[color:var(--up)]">+{stats.weeklyChange}%</p>
              </div>
              <div className="bg-[color:var(--well)]/70 rounded-xl p-4">
                <p className="kicker mb-1.5">Monthly Change</p>
                <p className="num text-xl text-[color:var(--up)]">+{stats.monthlyChange}%</p>
              </div>
            </div>
          </section>

          {/* Top Rising Routes */}
          <section>
            <h3 className="text-lg text-[color:var(--foreground)] mb-4">Top Rising Routes</h3>
            <div className="space-y-2">
              {topRising.map((route, i) => (
                <div key={route.routeId} className="flex items-center justify-between p-3.5 bg-[#f7e7e2]/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="num text-sm font-semibold text-[color:var(--muted)]">#{i + 1}</span>
                    <span className="text-sm font-semibold text-[color:var(--foreground)]">{route.routeId}</span>
                    <span className="text-xs text-[color:var(--muted)]">₹{route.avgFare.toLocaleString("en-IN")} avg</span>
                  </div>
                  <span className="num text-sm font-semibold text-[color:var(--up)]">+{route.mom}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* Top Falling Routes */}
          {topFalling.length > 0 && (
            <section>
              <h3 className="text-lg text-[color:var(--foreground)] mb-4">Top Falling Routes</h3>
              <div className="space-y-2">
                {topFalling.map((route, i) => (
                  <div key={route.routeId} className="flex items-center justify-between p-3.5 bg-[#e9efe6]/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="num text-sm font-semibold text-[color:var(--muted)]">#{i + 1}</span>
                      <span className="text-sm font-semibold text-[color:var(--foreground)]">{route.routeId}</span>
                      <span className="text-xs text-[color:var(--muted)]">₹{route.avgFare.toLocaleString("en-IN")} avg</span>
                    </div>
                    <span className="num text-sm font-semibold text-[color:var(--down)]">{route.mom}%</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Anomalies */}
          <section>
            <h3 className="text-lg text-[color:var(--foreground)] mb-4">Anomalies Detected</h3>
            <div className="space-y-2">
              {anomalies.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3.5 bg-[#f3ecda]/60 rounded-xl">
                  <div>
                    <span className="text-sm font-semibold text-[color:var(--foreground)]">{a.routeName}</span>
                    <span className="text-xs text-[color:var(--muted)] ml-2">₹{a.observedValue.toLocaleString("en-IN")} vs ₹{a.referenceValue.toLocaleString("en-IN")}</span>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-semibold",
                    a.severity === "CRITICAL" ? "bg-[#f7e7e2] text-[color:var(--up)]" :
                    a.severity === "HIGH" ? "bg-[#f5e9dc] text-[#9a5f2c]" :
                    a.severity === "MEDIUM" ? "bg-[#f3ecda] text-[#8a6f2c]" :
                    "bg-[color:var(--lavender-soft)] text-[color:var(--cyan)]"
                  )}>{a.severity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Data Quality */}
          <section>
            <h3 className="text-lg text-[color:var(--foreground)] mb-4">Data Quality & Source Coverage</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[color:var(--well)]/70 rounded-xl p-4">
                <p className="kicker mb-1.5">Total Observations</p>
                <p className="num text-lg text-[color:var(--foreground)]">{stats.totalObservations.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-[color:var(--well)]/70 rounded-xl p-4">
                <p className="kicker mb-1.5">Active Sources</p>
                <p className="num text-lg text-[color:var(--foreground)]">{activeSources}/{DATA_SOURCES.length}</p>
              </div>
              <div className="bg-[color:var(--well)]/70 rounded-xl p-4">
                <p className="kicker mb-1.5">Avg Quality Score</p>
                <p className="num text-lg text-[color:var(--down)]">{totalQuality}%</p>
              </div>
              <div className="bg-[color:var(--well)]/70 rounded-xl p-4">
                <p className="kicker mb-1.5">Routes Monitored</p>
                <p className="num text-lg text-[color:var(--foreground)]">{stats.routesMonitored}</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-5 border-t border-[color:var(--border)] text-xs text-[color:var(--muted)] leading-relaxed">
            <p>This report is generated from simulated data for demonstration purposes.</p>
            <p>AeroCPI Prototype — Not an official government index.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
