"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { BarChart3, Info } from "lucide-react";
import { generateForecasts, ROUTES } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function ForecastPage() {
  const [selectedRoute, setSelectedRoute] = useState("HYD-DEL");
  const forecasts = generateForecasts();

  const routeForecasts = forecasts.filter(f => f.routeId === selectedRoute);
  const route = ROUTES.find(r => r.id === selectedRoute);

  return (
    <div className="animate-rise">
      <PageHeader
        title="Price Forecasting"
        description="ML-powered fare prediction ranges with confidence intervals"
        icon={BarChart3}
        badge="DEMO DATA"
        badgeColor="bg-[color:var(--peach-soft)] text-[color:var(--accent-strong)]"
      />

      <div className="bg-[color:var(--lavender-soft)]/70 border border-[#ddd5ec] rounded-2xl p-5 mb-8 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-[color:var(--cyan)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#4c4370]">Model Transparency</p>
          <p className="text-sm text-[#5d5578] mt-1 leading-relaxed">
            Forecasts use historical fare patterns, booking window data, route seasonality, and day-of-week effects.
            Predictions are presented as <strong>model-estimated ranges</strong> — not guarantees.
          </p>
        </div>
      </div>

      {/* Route Selector */}
      <div className="mb-7">
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
      </div>

      {/* Forecast Cards */}
      {routeForecasts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
          {routeForecasts.map((fc) => (
            <div key={fc.id} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-[color:var(--foreground)]">{fc.horizon}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold num ${
                  fc.confidence >= 75 ? "bg-[#e9efe6] text-[color:var(--down)]" :
                  fc.confidence >= 60 ? "bg-[#f3ecda] text-[#8a6f2c]" :
                  "bg-[#f7e7e2] text-[color:var(--up)]"
                }`}>
                  {fc.confidence}% confidence
                </span>
              </div>
              <div className="mb-4">
                <p className="kicker mb-1.5">Predicted Range</p>
                <p className="num text-xl text-[color:var(--foreground)]">
                  {formatCurrency(fc.predictedMin)} — {formatCurrency(fc.predictedMax)}
                </p>
              </div>
              {/* Visual range bar */}
              <div className="h-2.5 bg-[color:var(--well)] rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-[#cf9d7d] to-[color:var(--accent)] rounded-full"
                  style={{
                    marginLeft: `${Math.max(0, (fc.predictedMin - 3000) / 100)}%`,
                    width: `${Math.min(80, (fc.predictedMax - fc.predictedMin) / 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-[color:var(--muted)]">
                Model: {fc.modelVersion}
              </p>
              <p className="text-xs text-[color:var(--muted)]">
                Generated: Sep 1, 2026
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-14 text-center mb-9">
          <BarChart3 className="w-10 h-10 text-[color:var(--border)] mx-auto mb-4" />
          <p className="text-[color:var(--muted)]">No forecasts available for this route.</p>
        </div>
      )}

      {/* Model Details */}
      <div className="card p-6 sm:p-7">
        <h3 className="text-xl text-[color:var(--foreground)] mb-5">Model Features</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {[
            "Historical Fare",
            "Days to Departure",
            "Route",
            "Airline",
            "Booking Window",
            "Day of Week",
            "Month",
            "Historical Volatility",
            "Seasonality",
            "Observed Availability",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[color:var(--well)]/70 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] flex-shrink-0" />
              <span className="text-sm text-[color:var(--foreground)]/85">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-5 bg-[color:var(--well)]/70 rounded-xl">
          <p className="kicker mb-3">Model Version</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[color:var(--muted)]">Model</p>
              <p className="font-semibold text-[color:var(--foreground)]">AeroForecast-v1</p>
            </div>
            <div>
              <p className="text-[color:var(--muted)]">Training Data Window</p>
              <p className="font-semibold text-[color:var(--foreground)]">Demo dataset</p>
            </div>
            <div>
              <p className="text-[color:var(--muted)]">Architecture</p>
              <p className="font-semibold text-[color:var(--foreground)]">Gradient Boosting (sklearn)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
