"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { AlertTriangle } from "lucide-react";
import { generateAnomalies } from "@/lib/demo-data";
import { formatCurrency, getSeverityColor } from "@/lib/utils";

export default function AnomaliesPage() {
  const anomalies = generateAnomalies();

  return (
    <div>
      <PageHeader
        title="Price Anomalies"
        description="Detection of unusual price movements from historical patterns"
        icon={AlertTriangle}
      />

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Anomaly Detection Method</p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Each observation is compared against its route&apos;s historical fare distribution. Observations exceeding
            configurable deviation thresholds are flagged. Anomalies are described based on statistical deviation,
            not causal attribution.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{anomalies.filter(a => a.severity === "CRITICAL").length}</p>
          <p className="text-xs text-gray-400">Critical</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">{anomalies.filter(a => a.severity === "HIGH").length}</p>
          <p className="text-xs text-gray-400">High</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{anomalies.filter(a => a.severity === "MEDIUM").length}</p>
          <p className="text-xs text-gray-400">Medium</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{anomalies.filter(a => a.severity === "LOW").length}</p>
          <p className="text-xs text-gray-400">Low</p>
        </div>
      </div>

      {/* Anomaly Cards */}
      <div className="space-y-4">
        {anomalies.map((anomaly) => (
          <div key={anomaly.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  anomaly.severity === "CRITICAL" ? "bg-red-100" :
                  anomaly.severity === "HIGH" ? "bg-orange-100" :
                  anomaly.severity === "MEDIUM" ? "bg-yellow-100" : "bg-blue-100"
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    anomaly.severity === "CRITICAL" ? "text-red-600" :
                    anomaly.severity === "HIGH" ? "text-orange-600" :
                    anomaly.severity === "MEDIUM" ? "text-yellow-600" : "text-blue-600"
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{anomaly.routeName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(anomaly.timestamp).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(anomaly.severity)}`}>
                {anomaly.severity}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400">Observed Fare</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(anomaly.observedValue)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Reference Value</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(anomaly.referenceValue)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Deviation</p>
                <p className={`text-lg font-bold ${anomaly.deviation >= 0 ? "text-red-500" : "text-green-500"}`}>
                  {anomaly.deviation >= 0 ? "+" : ""}{anomaly.deviation}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Absolute Difference</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(Math.abs(anomaly.observedValue - anomaly.referenceValue))}
                </p>
              </div>
            </div>

            {/* Visual deviation bar */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 w-20">Reference</span>
                <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                  <div
                    className={`absolute top-0 h-full rounded-full ${
                      anomaly.deviation >= 0 ? "bg-red-400" : "bg-green-400"
                    }`}
                    style={{
                      left: "50%",
                      width: `${Math.min(50, Math.abs(anomaly.deviation) / 2)}%`,
                    }}
                  />
                  <div className="absolute left-1/2 top-0 w-px h-full bg-gray-400" />
                </div>
                <span className="text-xs text-gray-400 w-20 text-right">Observed</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                This observation is statistically unusual relative to the selected historical baseline.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
