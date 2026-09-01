"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Map as MapIcon } from "lucide-react";
import { generateRouteAnalytics, AIRPORTS } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function MapPage() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const routes = generateRouteAnalytics();

  const selected = selectedRoute ? routes.find(r => r.routeId === selectedRoute) : null;

  // Airport positions for SVG (approximate India map positions)
  const airportPositions: Record<string, { x: number; y: number }> = {
    DEL: { x: 310, y: 150 },
    BOM: { x: 220, y: 280 },
    BLR: { x: 240, y: 380 },
    HYD: { x: 270, y: 330 },
    MAA: { x: 280, y: 400 },
    CCU: { x: 380, y: 210 },
    GOI: { x: 200, y: 320 },
    PNQ: { x: 215, y: 295 },
    COK: { x: 240, y: 420 },
    AMD: { x: 230, y: 220 },
  };

  return (
    <div>
      <PageHeader
        title="India Airfare Map"
        description="Visualize route activity, price index, and anomalies across India"
        icon={MapIcon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="relative">
            <svg viewBox="100 50 400 420" className="w-full h-auto">
              {/* Simplified India outline */}
              <path
                d="M250,80 L320,90 L370,120 L400,150 L410,180 L400,210 L390,230 L380,260 L360,290 L340,310 L310,340 L290,370 L270,390 L250,410 L230,420 L210,400 L190,380 L180,350 L175,320 L180,290 L190,260 L200,230 L210,200 L220,170 L230,140 L240,110 Z"
                fill="#E5E7EB"
                stroke="#D1D5DB"
                strokeWidth="2"
              />

              {/* Route lines */}
              {routes.map((route) => {
                const from = airportPositions[route.originCode];
                const to = airportPositions[route.destCode];
                if (!from || !to) return null;

                const isSelected = selectedRoute === route.routeId;
                const color = route.mom > 3 ? "#EF4444" : route.mom < -3 ? "#22C55E" : "#3B82F6";
                const strokeWidth = isSelected ? 4 : 2;
                const opacity = selectedRoute && !isSelected ? 0.2 : 0.6;

                return (
                  <g key={route.routeId} onClick={() => setSelectedRoute(route.routeId)} className="cursor-pointer">
                    <line
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke={color}
                      strokeWidth={strokeWidth}
                      opacity={opacity}
                    />
                  </g>
                );
              })}

              {/* Airport dots */}
              {AIRPORTS.map((airport) => {
                const pos = airportPositions[airport.iataCode];
                if (!pos) return null;
                return (
                  <g key={airport.iataCode}>
                    <circle cx={pos.x} cy={pos.y} r={6} fill="#1E40AF" stroke="white" strokeWidth={2} />
                    <text x={pos.x} y={pos.y - 12} textAnchor="middle" className="text-[10px] font-bold fill-gray-700 dark:fill-gray-300">
                      {airport.iataCode}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-red-500 inline-block" /> Rising routes (+3%+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-green-500 inline-block" /> Falling routes (-3%+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-blue-500 inline-block" /> Stable routes
            </span>
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-4">
          {selected ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {selected.originCode} → {selected.destCode}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Current Index</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selected.index}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">MoM Change</p>
                  <p className={`text-lg font-semibold ${selected.mom >= 0 ? "text-red-500" : "text-green-500"}`}>
                    {selected.mom >= 0 ? "+" : ""}{selected.mom}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Average Fare</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(selected.avgFare)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Observations</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {selected.observations.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Trend</p>
                  <p className={`text-lg font-bold ${
                    selected.trend === "up" ? "text-red-500" :
                    selected.trend === "down" ? "text-green-500" : "text-gray-500"
                  }`}>
                    {selected.trend === "up" ? "↑ Rising" : selected.trend === "down" ? "↓ Falling" : "→ Stable"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <MapIcon className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Click a route on the map to view details</p>
            </div>
          )}

          {/* Route List */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Routes</h3>
            <div className="space-y-2">
              {routes.sort((a, b) => b.observations - a.observations).map((route) => (
                <button
                  key={route.routeId}
                  onClick={() => setSelectedRoute(route.routeId)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                    selectedRoute === route.routeId
                      ? "bg-blue-50 dark:bg-blue-950"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{route.routeId}</span>
                    <p className="text-xs text-gray-400">{route.observations.toLocaleString("en-IN")} obs</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold ${route.mom >= 0 ? "text-red-500" : "text-green-500"}`}>
                      {route.mom >= 0 ? "+" : ""}{route.mom}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
