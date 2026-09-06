"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Search as SearchIcon, Plane, Clock, MapPin, ArrowRight, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { AIRPORTS, AIRLINES, generateFareObservations, getBookWaitSignal, getPriceHistory } from "@/lib/demo-data";
import { chartTooltipContentStyle } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SearchPage() {
  const [origin, setOrigin] = useState("HYD");
  const [destination, setDestination] = useState("DEL");
  const [travelDate, setTravelDate] = useState("2026-09-30");
  const [airline, setAirline] = useState("");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [searched, setSearched] = useState(false);
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
    <div>
      <PageHeader
        title="Search Flights"
        description="Search and compare fares across multiple sources"
        icon={SearchIcon}
      />

      {/* Search Form */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500  mb-1.5">From</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50  border border-[color:var(--border)]  rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {AIRPORTS.map(a => (
                <option key={a.iataCode} value={a.iataCode}>{a.city} ({a.iataCode})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500  mb-1.5">To</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50  border border-[color:var(--border)]  rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {AIRPORTS.filter(a => a.iataCode !== origin).map(a => (
                <option key={a.iataCode} value={a.iataCode}>{a.city} ({a.iataCode})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500  mb-1.5">Travel Date</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50  border border-[color:var(--border)]  rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500  mb-1.5">Airline (optional)</label>
            <select
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50  border border-[color:var(--border)]  rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Airlines</option>
              {AIRLINES.map(a => (
                <option key={a.code} value={a.code}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <SearchIcon className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 ">
              {flights.length} flight{flights.length !== 1 ? "s" : ""} found — {origin} → {destination} — {formatDate(travelDate)}
            </h3>
          </div>

          {flights.length === 0 ? (
            <div className="card p-12 text-center">
              <Plane className="w-12 h-12 text-gray-300  mx-auto mb-4" />
              <p className="text-gray-500 ">No flights found for this search.</p>
              <p className="text-sm text-gray-400  mt-1">Try different dates or filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flights.map((flight) => (
                <div key={flight.canonicalFlightId + flight.departureTime} className="card overflow-hidden">
                  {/* Flight Card */}
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Flight Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: AIRLINES.find(a => a.code === flight.airlineCode)?.color || "#666" }}
                          >
                            {flight.airlineCode}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 ">{flight.airline}</p>
                            <p className="text-xs text-gray-400">Flight {flight.flightNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900 ">{flight.departureTime}</p>
                            <p className="text-xs text-gray-400">{flight.origin}</p>
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 h-px bg-gray-300 " />
                            <Plane className="w-4 h-4 text-gray-400" />
                            <div className="flex-1 h-px bg-gray-300 " />
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900 ">{flight.arrivalTime}</p>
                            <p className="text-xs text-gray-400">{flight.destination}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</span>
                          <span>•</span>
                          <span>{flight.cabinClass}</span>
                          <span>•</span>
                          <span>Matched across {flight.sourceCount} source{flight.sourceCount > 1 ? "s" : ""}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right lg:min-w-[160px]">
                        <p className="text-2xl font-bold text-gray-900 ">
                          {formatCurrency(flight.avgFare)}
                        </p>
                        <p className="text-xs text-gray-400">avg across {flight.sourceCount} sources</p>
                      </div>

                      {/* Signal */}
                      <div className={`px-3 py-2 rounded-lg border text-sm font-semibold ${
                        flight.signal.signal === "BOOK NOW"
                          ? "bg-green-50 text-green-700 border-green-200   "
                          : flight.signal.signal === "WAIT"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200   "
                          : "bg-gray-50 text-gray-700 border-[color:var(--border)]   "
                      }`}>
                        {flight.signal.signal === "BOOK NOW" ? "🟢" : flight.signal.signal === "WAIT" ? "🟡" : "⚪"} {flight.signal.signal}
                      </div>
                    </div>
                  </div>

                  {/* Source Comparison */}
                  <div className="border-t border-gray-100  bg-gray-50 /50 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Source Comparison</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {flight.sources.sort((a, b) => a.fare - b.fare).map((src, i) => (
                        <div key={i} className="bg-white  rounded-lg p-2.5 border border-gray-100 ">
                          <p className="text-xs text-gray-500">{src.name}</p>
                          <p className="text-sm font-bold text-gray-900 ">{formatCurrency(src.fare)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Info */}
                  <div className="border-t border-gray-100  p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Signal Reason */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Recommendation Reason</p>
                        <p className="text-sm text-gray-600 ">{flight.signal.reason}</p>
                      </div>

                      {/* Price History Chart */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Price Trend</p>
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={flight.history.slice(-7)}>
                              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                              <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} hide />
                              <Tooltip
                                contentStyle={chartTooltipContentStyle}
                                formatter={(value: unknown) => [`₹${Number(value).toLocaleString("en-IN")}`, "Avg"]}
                              />
                              <Line type="monotone" dataKey="avgFare" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
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
