"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { AlertTriangle } from "lucide-react";
import { generateAnomalies } from "@/lib/demo-data";
import { formatCurrency, getSeverityColor } from "@/lib/utils";

export default function AnomaliesPage() {
  const anomalies = generateAnomalies();

  return (
    <div className="animate-rise">
      <PageHeader
        title="Price Anomalies"
        description="Detection of unusual price movements from historical patterns"
        icon={AlertTriangle}
      />

      <div className="bg-[color:var(--lavender-soft)]/70 border border-[#ddd5ec] rounded-2xl p-5 mb-8 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-[color:var(--cyan)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#4c4370]">Anomaly Detection Method</p>
          <p className="text-sm text-[#5d5578] mt-1 leading-relaxed">
            Each observation is compared against its route&apos;s historical fare distribution. Observations exceeding
            configurable deviation thresholds are flagged. Anomalies are described based on statistical deviation,
            not causal attribution.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-9">
        <div className="card p-5 text-center">
          <p className="num text-3xl text-[color:var(--up)]">{anomalies.filter(a => a.severity === "CRITICAL").length}</p>
          <p className="kicker mt-1">Critical</p>
        </div>
        <div className="card p-5 text-center">
          <p className="num text-3xl text-[#c07a3d]">{anomalies.filter(a => a.severity === "HIGH").length}</p>
          <p className="kicker mt-1">High</p>
        </div>
        <div className="card p-5 text-center">
          <p className="num text-3xl text-[#a98a3d]">{anomalies.filter(a => a.severity === "MEDIUM").length}</p>
          <p className="kicker mt-1">Medium</p>
        </div>
        <div className="card p-5 text-center">
          <p className="num text-3xl text-[color:var(--cyan)]">{anomalies.filter(a => a.severity === "LOW").length}</p>
          <p className="kicker mt-1">Low</p>
        </div>
      </div>

      {/* Anomaly Cards */}
      <div className="space-y-5">
        {anomalies.map((anomaly) => (
          <div key={anomaly.id} className="card p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-[0.8rem] flex items-center justify-center ${
                  anomaly.severity === "CRITICAL" ? "bg-[#f7e7e2]" :
                  anomaly.severity === "HIGH" ? "bg-[#f5e9dc]" :
                  anomaly.severity === "MEDIUM" ? "bg-[#f3ecda]" : "bg-[color:var(--lavender-soft)]"
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    anomaly.severity === "CRITICAL" ? "text-[color:var(--up)]" :
                    anomaly.severity === "HIGH" ? "text-[#c07a3d]" :
                    anomaly.severity === "MEDIUM" ? "text-[#a98a3d]" : "text-[color:var(--cyan)]"
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg text-[color:var(--foreground)]">{anomaly.routeName}</h3>
                  <p className="text-sm text-[color:var(--muted)]">
                    {new Date(anomaly.timestamp).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(anomaly.severity)}`}>
                {anomaly.severity}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-5">
              <div>
                <p className="kicker mb-1">Observed Fare</p>
                <p className="num text-lg text-[color:var(--foreground)]">
                  {formatCurrency(anomaly.observedValue)}
                </p>
              </div>
              <div>
                <p className="kicker mb-1">Reference Value</p>
                <p className="num text-lg text-[color:var(--foreground)]">
                  {formatCurrency(anomaly.referenceValue)}
                </p>
              </div>
              <div>
                <p className="kicker mb-1">Deviation</p>
                <p className={`num text-lg ${anomaly.deviation >= 0 ? "text-[color:var(--up)]" : "text-[color:var(--down)]"}`}>
                  {anomaly.deviation >= 0 ? "+" : ""}{anomaly.deviation}%
                </p>
              </div>
              <div>
                <p className="kicker mb-1">Absolute Difference</p>
                <p className="num text-lg text-[color:var(--foreground)]">
                  {formatCurrency(Math.abs(anomaly.observedValue - anomaly.referenceValue))}
                </p>
              </div>
            </div>

            {/* Visual deviation bar */}
            <div className="bg-[color:var(--well)]/70 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <span className="text-xs text-[color:var(--muted)] w-20">Reference</span>
                <div className="flex-1 h-5 bg-[color:var(--border)]/60 rounded-full overflow-hidden relative">
                  <div
                    className={`absolute top-0 h-full rounded-full ${
                      anomaly.deviation >= 0 ? "bg-[#cf9d7d]" : "bg-[#9db894]"
                    }`}
                    style={{
                      left: "50%",
                      width: `${Math.min(50, Math.abs(anomaly.deviation) / 2)}%`,
                    }}
                  />
                  <div className="absolute left-1/2 top-0 w-px h-full bg-[color:var(--muted)]/50" />
                </div>
                <span className="text-xs text-[color:var(--muted)] w-20 text-right">Observed</span>
              </div>
              <p className="text-xs text-[color:var(--muted)] mt-2.5 text-center">
                This observation is statistically unusual relative to the selected historical baseline.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
