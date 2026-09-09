"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Monitor, RefreshCw } from "lucide-react";
import { DATA_SOURCES } from "@/lib/demo-data";

export default function SourcesPage() {
  // Demo refresh: simulates a new collection cycle for all connectors.
  const [sources, setSources] = useState(DATA_SOURCES);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const refreshAll = () => {
    if (refreshing) return;
    setRefreshing(true);
    // Simulate collection latency, then bump records and refresh timestamps.
    setTimeout(() => {
      const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      setSources((prev) =>
        prev.map((src) => ({
          ...src,
          lastUpdate: now,
          records: src.records + Math.floor(Math.random() * 120) + 20,
        }))
      );
      setLastRefresh(now);
      setRefreshing(false);
    }, 900);
  };

  return (
    <div className="animate-rise">
      <PageHeader
        title="Source Monitor"
        description="Real-time status of data collection sources"
        icon={Monitor}
      />

      <div className="flex items-center justify-end gap-3 mb-6">
        {lastRefresh && (
          <span className="text-xs text-[color:var(--muted)]">
            Last refresh: {lastRefresh} IST
          </span>
        )}
        <button
          onClick={refreshAll}
          disabled={refreshing}
          aria-busy={refreshing}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing…" : "Refresh All"}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-lux">
            <thead>
              <tr>
                <th>Source</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Update</th>
                <th className="!text-right">Records</th>
                <th className="!text-right">Errors</th>
                <th className="!text-right">Quality</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((src) => (
                <tr key={src.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        src.status === "Active" ? "bg-[color:var(--down)]" :
                        src.status === "Delayed" ? "bg-[#c9a23f]" : "bg-[color:var(--up)]"
                      }`} />
                      <span className="text-sm font-medium text-[color:var(--foreground)]">{src.name}</span>
                    </div>
                  </td>
                  <td className="text-sm text-[color:var(--muted)]">{src.type}</td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      src.status === "Active" ? "bg-[#e9efe6] text-[color:var(--down)]" :
                      src.status === "Delayed" ? "bg-[#f3ecda] text-[#8a6f2c]" :
                      "bg-[#f7e7e2] text-[color:var(--up)]"
                    }`}>
                      {src.status}
                    </span>
                  </td>
                  <td className="text-sm text-[color:var(--muted)]">{src.lastUpdate}</td>
                  <td className="text-sm text-[color:var(--foreground)]/85 text-right num">{src.records.toLocaleString("en-IN")}</td>
                  <td className="text-sm text-right">
                    <span className={src.errorCount > 50 ? "text-[color:var(--up)] font-semibold" : src.errorCount > 10 ? "text-[#a98a3d]" : "text-[color:var(--muted)]"}>
                      {src.errorCount}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-[color:var(--border)]/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            src.quality >= 98 ? "bg-[color:var(--down)]" :
                            src.quality >= 95 ? "bg-[#c9a23f]" : "bg-[color:var(--up)]"
                          }`}
                          style={{ width: `${src.quality}%` }}
                        />
                      </div>
                      <span className={`num text-xs font-semibold ${
                        src.quality >= 98 ? "text-[color:var(--down)]" :
                        src.quality >= 95 ? "text-[#a98a3d]" : "text-[color:var(--up)]"
                      }`}>
                        {src.quality}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Freshness Chart */}
      <div className="mt-8 card p-6 sm:p-7">
        <h3 className="text-xl text-[color:var(--foreground)] mb-5">Source Freshness</h3>
        <div className="space-y-3">
          {DATA_SOURCES.sort((a, b) => {
            const freshness: Record<string, number> = { "Active": 0, "Delayed": 1, "Failed": 2 };
            return freshness[a.status] - freshness[b.status];
          }).map((src) => (
            <div key={src.id} className="flex items-center gap-4">
              <span className="text-sm text-[color:var(--foreground)]/85 w-36 truncate">{src.name}</span>
              <div className="flex-1 h-3.5 bg-[color:var(--well)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    src.status === "Active" ? "bg-[#9db894]" :
                    src.status === "Delayed" ? "bg-[#d9c27a]" : "bg-[#cf9d7d]"
                  }`}
                  style={{ width: `${src.quality}%` }}
                />
              </div>
              <span className="text-xs text-[color:var(--muted)] w-16 text-right">{src.lastUpdate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
