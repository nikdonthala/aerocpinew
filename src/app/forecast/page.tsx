"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { BarChart3, Info } from "lucide-react";
import { generateForecasts, ROUTES, AIRLINES } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function ForecastPage() {
  const [selectedRoute, setSelectedRoute] = useState("HYD-DEL");
  const forecasts = generateForecasts();

  const routeForecasts = forecasts.filter(f => f.routeId === selectedRoute);
  const route = ROUTES.find(r => r.id === selectedRoute);

  return (
    <div>
      <PageHeader
        title="Price Forecasting"
        description="ML-powered fare prediction ranges with confidence intervals"
        icon={BarChart3}
        badge="DEMO DATA"
        badgeColor="bg-amber-100 text-amber-700"
      />

      <div className="bg-blue-50  border border-blue-200  rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600  flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800 ">Model Transparency</p>
          <p className="text-sm text-blue-700  mt-1">
            Forecasts use historical fare patterns, booking window data, route seasonality, and day-of-week effects.
            Predictions are presented as <strong>model-estimated ranges</strong> — not guarantees.
          </p>
        </div>
      </div>

      {/* Route Selector */}
      <div className="mb-6">
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="px-4 py-2.5 bg-white  border border-[color:var(--border)]  rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {ROUTES.map(r => (
            <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>
          ))}
        </select>
      </div>

      {/* Forecast Cards */}
      {routeForecasts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {routeForecasts.map((fc) => (
            <div key={fc.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900 ">{fc.horizon}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  fc.confidence >= 75 ? "bg-green-100 text-green-700" :
                  fc.confidence >= 60 ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {fc.confidence}% confidence
                </span>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Predicted Range</p>
                <p className="text-xl font-bold text-gray-900 ">
                  {formatCurrency(fc.predictedMin)} — {formatCurrency(fc.predictedMax)}
                </p>
              </div>
              {/* Visual range bar */}
              <div className="h-3 bg-gray-100  rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  style={{
                    marginLeft: `${Math.max(0, (fc.predictedMin - 3000) / 100)}%`,
                    width: `${Math.min(80, (fc.predictedMax - fc.predictedMin) / 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">
                Model: {fc.modelVersion}
              </p>
              <p className="text-xs text-gray-400">
                Generated: Sep 1, 2026
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center mb-8">
          <BarChart3 className="w-12 h-12 text-gray-300  mx-auto mb-4" />
          <p className="text-gray-500 ">No forecasts available for this route.</p>
        </div>
      )}

      {/* Model Details */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900  mb-4">Model Features</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <div key={feature} className="flex items-center gap-2 px-3 py-2 bg-gray-50  rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-700 ">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50  rounded-lg">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Model Version</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Model</p>
              <p className="font-medium text-gray-900 ">AeroForecast-v1</p>
            </div>
            <div>
              <p className="text-gray-400">Training Data Window</p>
              <p className="font-medium text-gray-900 ">Demo dataset</p>
            </div>
            <div>
              <p className="text-gray-400">Architecture</p>
              <p className="font-medium text-gray-900 ">Gradient Boosting (sklearn)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
