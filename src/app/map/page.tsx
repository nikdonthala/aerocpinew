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
    <div className="animate-rise">
      <PageHeader
        title="India Airfare Map"
        description="Visualize route activity, price index, and anomalies across India"
        icon={MapIcon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 card p-6">
          <div className="relative">
            <svg viewBox="100 50 400 420" className="w-full h-auto">
              {/* Simplified India outline */}
              <path
                d="M250,80 L320,90 L370,120 L400,150 L410,180 L400,210 L390,230 L380,260 L360,290 L340,310 L310,340 L290,370 L270,390 L250,410 L230,420 L210,400 L190,380 L180,350 L175,320 L180,290 L190,260 L200,230 L210,200 L220,170 L230,140 L240,110 Z"
                fill="#efe8d9"
                stroke="#dccfb8"
                strokeWidth="2"
              />

              {/* Route lines */}
              {routes.map((route) => {
                const from = airportPositions[route.originCode];
                const to = airportPositions[route.destCode];
                if (!from || !to) return null;

                const isSelected = selectedRoute === route.routeId;
                const color = route.mom > 3 ? "#b9605b" : route.mom < -3 ? "#5f7f5c" : "#b0532c";
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
                    <circle cx={pos.x} cy={pos.y} r={6} fill="#8f431f" stroke="#fffdf9" strokeWidth={2} />
                    <text x={pos.x} y={pos.y - 12} textAnchor="middle" className="text-[10px] font-bold fill-gray-700 ">
                      {airport.iataCode}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 text-xs text-[color:var(--muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#b9605b] inline-block rounded-full" /> Rising routes (+3%+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#5f7f5c] inline-block rounded-full" /> Falling routes (-3%+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#b0532c] inline-block rounded-full" /> Stable routes
            </span>
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-4">
          {selected ? (
            <div className="card p-6">
              <h3 className="text-xl text-[color:var(--foreground)] mb-5">
                {selected.originCode} → {selected.destCode}
              </h3>
              <div className="space-y-3.5">
                <div>
                  <p className="kicker mb-1">Current Index</p>
                  <p className="num text-2xl text-[color:var(--foreground)]">{selected.index}</p>
                </div>
                <div>
                  <p className="kicker mb-1">MoM Change</p>
                  <p className={`num text-lg font-semibold ${selected.mom >= 0 ? "text-[color:var(--up)]" : "text-[color:var(--down)]"}`}>
                    {selected.mom >= 0 ? "+" : ""}{selected.mom}%
                  </p>
                </div>
                <div>
                  <p className="kicker mb-1">Average Fare</p>
                  <p className="num text-lg text-[color:var(--foreground)]">
                    {formatCurrency(selected.avgFare)}
                  </p>
                </div>
                <div>
                  <p className="kicker mb-1">Observations</p>
                  <p className="num text-lg text-[color:var(--foreground)]">
                    {selected.observations.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="kicker mb-1">Trend</p>
                  <p className={`num text-lg font-semibold ${
                    selected.trend === "up" ? "text-[color:var(--up)]" :
                    selected.trend === "down" ? "text-[color:var(--down)]" : "text-[color:var(--muted)]"
                  }`}>
                    {selected.trend === "up" ? "↑ Rising" : selected.trend === "down" ? "↓ Falling" : "→ Stable"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center">
              <MapIcon className="w-10 h-10 text-[color:var(--border)] mx-auto mb-3" />
              <p className="text-sm text-[color:var(--muted)]">Click a route on the map to view details</p>
            </div>
          )}

          {/* Route List */}
          <div className="card p-6">
            <h3 className="text-xl text-[color:var(--foreground)] mb-4">All Routes</h3>
            <div className="space-y-1">
              {routes.sort((a, b) => b.observations - a.observations).map((route) => (
                <button
                  key={route.routeId}
                  onClick={() => setSelectedRoute(route.routeId)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                    selectedRoute === route.routeId
                      ? "bg-[color:var(--accent-soft)]/70"
                      : "hover:bg-[color:var(--peach-soft)]/70"
                  }`}
                >
                  <div>
                    <span className="text-sm font-medium text-[color:var(--foreground)]">{route.routeId}</span>
                    <p className="text-xs text-[color:var(--muted)]">{route.observations.toLocaleString("en-IN")} obs</p>
                  </div>
                  <div className="text-right">
                    <span className={`num text-xs font-semibold ${route.mom >= 0 ? "text-[color:var(--up)]" : "text-[color:var(--down)]"}`}>
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
