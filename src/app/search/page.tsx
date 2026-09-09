"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Search as SearchIcon, Plane, ArrowRight, Minus, AlertTriangle } from "lucide-react";
import { AIRPORTS, AIRLINES, generateFareObservations, getBookWaitSignal, getPriceHistory } from "@/lib/demo-data";
import { chartTooltipContentStyle, chartAxisTick, CHART } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";

function SearchPageInner() {
  const searchParams = useSearchParams();

  // Accept deep-links from the global search bar: /search?origin=DEL&destination=BOM
  // or /search?q=DEL-BOM (two 3-letter codes). Lazily initialized — no effect needed.
  const qOrigin = searchParams.get("origin");
  const qDestination = searchParams.get("destination");
  const q = searchParams.get("q");
  const qCodes = q && !qOrigin ? q.toUpperCase().match(/\b[A-Z]{3}\b/g) : null;
  const known = (code: string, fallback: string) =>
    AIRPORTS.some((a) => a.iataCode === code) ? code : fallback;
  const initOrigin = known(
    (qOrigin ?? qCodes?.[0] ?? "HYD").toUpperCase(),
    "HYD"
  );
  const initDestination = known(
    (qDestination ?? qCodes?.[1] ?? "DEL").toUpperCase(),
    "DEL"
  );
  const hasDeepLink = Boolean(qOrigin || (qCodes && qCodes.length >= 2));

  const [origin, setOrigin] = useState(initOrigin);
  const [destination, setDestination] = useState(initDestination);
  const [travelDate, setTravelDate] = useState("2026-09-30");
  const [airline, setAirline] = useState("");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [searched, setSearched] = useState(hasDeepLink);
  const [observations] = useState(() => generateFareObservations());

  const handleSearch = () => {
    setSearched(true);
  };

  // Filter observations
  const results = observations.filter(o =>
    o.origin === origin &&
    o.destination === destination &&
    o.departureDate === travelDate &&
    (!airline || o.airlineCode === airline) &&
    o.cabinClass === cabinClass
  );

  // Group by canonical flight ID
  const flightGroups: Record<string, typeof results> = {};
  for (const obs of results) {
    const key = `${obs.canonicalFlightId}-${obs.departureTime}`;
    if (!flightGroups[key]) flightGroups[key] = [];
    flightGroups[key].push(obs);
  }

  // Get unique flights with best price
  const flights = Object.entries(flightGroups).map(([key, obs]) => {
    const rep = obs[0];
    const fares = obs.map(o => o.totalFare);
    const avgFare = Math.round(fares.reduce((a, b) => a + b, 0) / fares.length);
    const minFare = Math.min(...fares);
    const maxFare = Math.max(...fares);
    const sourceCount = new Set(obs.map(o => o.sourceName)).size;

    // Get price history for this route
    const history = getPriceHistory(observations, rep.routeId, rep.airlineCode).slice(-14);
    const historicalAvg = history.length > 0 ? Math.round(history.reduce((a, b) => a + b.avgFare, 0) / history.length) : avgFare;
    const trend = history.length >= 2 ? history[history.length - 1].avgFare - history[history.length - 2].avgFare : 0;

    const signal = getBookWaitSignal(avgFare, historicalAvg, trend);

    return {
      ...rep,
      avgFare,
      minFare,
      maxFare,
      sourceCount,
      sources: obs.map(o => ({ name: o.sourceName, fare: o.totalFare })),
      history,
      historicalAvg,
      signal,
      bookingWindows: obs.reduce((acc, o) => {
        if (!acc[o.bookingWindow]) acc[o.bookingWindow] = [];
        acc[o.bookingWindow].push(o.totalFare);
        return acc;
      }, {} as Record<string, number[]>),
    };
  });

  // Format date
  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="animate-rise">
      <PageHeader
        title="Search Flights"
        description="Search and compare fares across multiple sources"
        icon={SearchIcon}
      />

      {/* Search Form */}
      <div className="card-glass p-6 mb-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="kicker block mb-1.5">From</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="input"
              aria-label="Origin airport"
            >
              {AIRPORTS.map(a => (
                <option key={a.iataCode} value={a.iataCode}>{a.city} ({a.iataCode})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="kicker block mb-1.5">To</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input"
              aria-label="Destination airport"
            >
              {AIRPORTS.filter(a => a.iataCode !== origin).map(a => (
                <option key={a.iataCode} value={a.iataCode}>{a.city} ({a.iataCode})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="kicker block mb-1.5">Travel Date</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="input"
              aria-label="Travel date"
            />
          </div>
          <div>
            <label className="kicker block mb-1.5">Airline</label>
            <select
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              className="input"
              aria-label="Airline filter"
            >
              <option value="">All Airlines</option>
              {AIRLINES.map(a => (
                <option key={a.code} value={a.code}>{a.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="btn-primary px-6 py-2.5 text-sm flex items-center justify-center gap-2 h-[42px]"
          >
            <SearchIcon className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl text-[color:var(--foreground)]">
              {flights.length} flight{flights.length !== 1 ? "s" : ""} found ·{" "}
              <span className="text-[color:var(--muted)]">{origin} → {destination} · {formatDate(travelDate)}</span>
            </h3>
          </div>

          {flights.length === 0 ? (
            <div className="card p-14 text-center">
              <Plane className="w-10 h-10 text-[color:var(--border)] mx-auto mb-4" />
              <p className="text-[color:var(--muted)]">No flights found for this search.</p>
              <p className="text-sm text-[color:var(--muted)]/80 mt-1">Try different dates or filters.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {flights.map((flight) => (
                <div key={flight.canonicalFlightId + flight.departureTime} className="card overflow-hidden">
                  {/* Flight Card */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                      {/* Flight Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-9 h-9 rounded-[0.7rem] flex items-center justify-center text-white text-xs font-bold tracking-wide"
                            style={{ backgroundColor: AIRLINES.find(a => a.code === flight.airlineCode)?.color || "#8a8378" }}
                          >
                            {flight.airlineCode}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[color:var(--foreground)]">{flight.airline}</p>
                            <p className="text-xs text-[color:var(--muted)]">Flight {flight.flightNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4 max-w-xs">
                          <div>
                            <p className="num text-lg text-[color:var(--foreground)]">{flight.departureTime}</p>
                            <p className="text-xs text-[color:var(--muted)] mt-0.5">{flight.origin}</p>
                          </div>
                          <div className="flex-1 flex items-center gap-2 px-1">
                            <div className="flex-1 h-px bg-[color:var(--border)]" />
                            <Plane className="w-3.5 h-3.5 text-[color:var(--muted)] rotate-90" />
                            <div className="flex-1 h-px bg-[color:var(--border)]" />
                          </div>
                          <div>
                            <p className="num text-lg text-[color:var(--foreground)]">{flight.arrivalTime}</p>
                            <p className="text-xs text-[color:var(--muted)] mt-0.5">{flight.destination}</p>
                          </div>
                        </div>
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-3 text-xs text-[color:var(--muted)]">
                          <span>{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</span>
                          <Minus className="w-2.5 h-2.5 text-[color:var(--border)]" />
                          <span>{flight.cabinClass}</span>
                          <Minus className="w-2.5 h-2.5 text-[color:var(--border)]" />
                          <span>Matched across {flight.sourceCount} source{flight.sourceCount > 1 ? "s" : ""}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="lg:text-right lg:min-w-[150px]">
                        <p className="num text-3xl text-[color:var(--foreground)]">
                          {formatCurrency(flight.avgFare)}
                        </p>
                        <p className="text-xs text-[color:var(--muted)] mt-0.5">avg across {flight.sourceCount} sources</p>
                      </div>

                      {/* Signal */}
                      <div className={`inline-flex self-start lg:self-center px-3.5 py-2 rounded-full border text-xs font-semibold tracking-wide ${
                        flight.signal.signal === "BOOK NOW"
                          ? "bg-[#e9efe6] text-[color:var(--down)] border-[#cddcc7]"
                          : flight.signal.signal === "WAIT"
                          ? "bg-[#f3ecda] text-[#8a6f2c] border-[#e2d7ba]"
                          : "bg-white/70 text-[color:var(--muted)] border-[color:var(--border)]"
                      }`}>
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            flight.signal.signal === "BOOK NOW"
                              ? "bg-[color:var(--down)]"
                              : flight.signal.signal === "WAIT"
                              ? "bg-[#c9a23f]"
                              : "bg-[color:var(--muted)]"
                          }`}
                        />
                        {flight.signal.signal}
                      </div>
                    </div>
                  </div>

                  {/* Source Comparison */}
                  <div className="border-t border-[color:var(--border)]/60 bg-[color:var(--well)]/50 px-6 py-4">
                    <p className="kicker mb-2.5">Source Comparison</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {flight.sources.sort((a, b) => a.fare - b.fare).map((src, i) => (
                        <div key={i} className="bg-[color:var(--surface)] rounded-xl p-3 border border-[color:var(--border)]/60">
                          <p className="text-xs text-[color:var(--muted)]">{src.name}</p>
                          <p className="num text-sm font-semibold text-[color:var(--foreground)] mt-0.5">{formatCurrency(src.fare)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Info */}
                  <div className="border-t border-[color:var(--border)]/60 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      {/* Signal Reason */}
                      <div>
                        <p className="kicker mb-2">Recommendation</p>
                        <p className="text-sm text-[color:var(--foreground)]/85 leading-relaxed">{flight.signal.reason}</p>
                        <p className="text-xs text-[color:var(--muted)] mt-2">
                          Historical average on this route:{" "}
                          <span className="num font-semibold text-[color:var(--foreground)]/80">{formatCurrency(flight.historicalAvg)}</span>
                        </p>
                      </div>

                      {/* Price History Chart */}
                      <div>
                        <p className="kicker mb-2.5">Recent Price Trend</p>
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={flight.history.slice(-7)}>
                              <XAxis dataKey="date" tick={chartAxisTick} tickLine={false} axisLine={false} />
                              <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} hide />
                              <Tooltip
                                contentStyle={chartTooltipContentStyle}
                                cursor={{ stroke: CHART.grid, strokeWidth: 1.5 }}
                                formatter={(value: unknown) => [`₹${Number(value).toLocaleString("en-IN")}`, "Avg"]}
                              />
                              <Line type="monotone" dataKey="avgFare" stroke={CHART.accent} strokeWidth={2} dot={{ r: 2.5, fill: CHART.accent, strokeWidth: 0 }} activeDot={{ r: 4, strokeWidth: 2, stroke: "#fffdf9" }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}
