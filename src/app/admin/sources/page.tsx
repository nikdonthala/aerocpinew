"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Monitor, RefreshCw } from "lucide-react";
import { DATA_SOURCES } from "@/lib/demo-data";

export default function SourcesPage() {
  return (
    <div>
      <PageHeader
        title="Source Monitor"
        description="Real-time status of data collection sources"
        icon={Monitor}
      />

      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh All
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Update</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Records</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Errors</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quality</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map((src) => (
                <tr key={src.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        src.status === "Active" ? "bg-green-500" :
                        src.status === "Delayed" ? "bg-yellow-500" : "bg-red-500"
                      }`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{src.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{src.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      src.status === "Active" ? "bg-green-100 text-green-700" :
                      src.status === "Delayed" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {src.status === "Active" ? "🟢" : src.status === "Delayed" ? "🟡" : "🔴"} {src.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{src.lastUpdate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">{src.records.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={src.errorCount > 50 ? "text-red-600 font-semibold" : src.errorCount > 10 ? "text-yellow-600" : "text-gray-500"}>
                      {src.errorCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            src.quality >= 98 ? "bg-green-500" :
                            src.quality >= 95 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${src.quality}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        src.quality >= 98 ? "text-green-600" :
                        src.quality >= 95 ? "text-yellow-600" : "text-red-600"
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
      <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Source Freshness</h3>
        <div className="space-y-3">
          {DATA_SOURCES.sort((a, b) => {
            const freshness: Record<string, number> = { "Active": 0, "Delayed": 1, "Failed": 2 };
            return freshness[a.status] - freshness[b.status];
          }).map((src) => (
            <div key={src.id} className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300 w-36 truncate">{src.name}</span>
              <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    src.status === "Active" ? "bg-green-400" :
                    src.status === "Delayed" ? "bg-yellow-400" : "bg-red-400"
                  }`}
                  style={{ width: `${src.quality}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-16 text-right">{src.lastUpdate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
