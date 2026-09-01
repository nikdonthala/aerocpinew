"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Database, Download, Search } from "lucide-react";
import { generateFareObservations, ROUTES, AIRLINES, DATA_SOURCES } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const PAGE_SIZE = 20;

export default function DataPage() {
  const [observations] = useState(() => generateFareObservations());
  const [routeFilter, setRouteFilter] = useState("");
  const [airlineFilter, setAirlineFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [bwFilter, setBwFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return observations.filter(o => {
      if (routeFilter && o.routeId !== routeFilter) return false;
      if (airlineFilter && o.airlineCode !== airlineFilter) return false;
      if (sourceFilter && o.sourceId !== sourceFilter) return false;
      if (bwFilter && o.bookingWindow !== bwFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          o.flightNumber.toLowerCase().includes(s) ||
          o.origin.toLowerCase().includes(s) ||
          o.destination.toLowerCase().includes(s) ||
          o.airline.toLowerCase().includes(s) ||
          o.sourceName.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [observations, routeFilter, airlineFilter, sourceFilter, bwFilter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const exportCSV = () => {
    const headers = ["Timestamp", "Source", "Airline", "Flight", "Route", "Travel Date", "Booking Window", "Fare", "Cabin", "Stops"];
    const rows = filtered.map(o => [
      o.timestamp, o.sourceName, o.airline, o.flightNumber, `${o.origin}-${o.destination}`,
      o.departureDate, o.bookingWindow, o.totalFare, o.cabinClass, o.stops === 0 ? "Non-stop" : `${o.stops} stop`,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aerocpi-data-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Data Explorer"
        description="Browse and export raw fare observations"
        icon={Database}
        badge={`${filtered.length.toLocaleString("en-IN")} records`}
        badgeColor="bg-blue-100 text-blue-700"
      />

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <select value={routeFilter} onChange={(e) => { setRouteFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">All Routes</option>
            {ROUTES.map(r => <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>)}
          </select>
          <select value={airlineFilter} onChange={(e) => { setAirlineFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">All Airlines</option>
            {AIRLINES.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
          </select>
          <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">All Sources</option>
            {DATA_SOURCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={bwFilter} onChange={(e) => { setBwFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">All Windows</option>
            {["T+1", "T+7", "T+15", "T+30", "T+45"].map(bw => <option key={bw} value={bw}>{bw}</option>)}
          </select>
          <button onClick={exportCSV} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Source</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Airline</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Flight</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Route</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Travel Date</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">BW</th>
                <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Fare</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Cabin</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Stops</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((obs) => (
                <tr key={obs.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(obs.timestamp).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300">{obs.sourceName}</td>
                  <td className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300">{obs.airline}</td>
                  <td className="px-3 py-2 text-xs font-medium text-gray-900 dark:text-white">{obs.flightNumber}</td>
                  <td className="px-3 py-2 text-xs font-medium text-gray-900 dark:text-white">{obs.origin}–{obs.destination}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{obs.departureDate}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{obs.bookingWindow}</td>
                  <td className="px-3 py-2 text-xs font-semibold text-gray-900 dark:text-white text-right">
                    {formatCurrency(obs.totalFare)}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">{obs.cabinClass}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{obs.stops === 0 ? "Non-stop" : `${obs.stops} stop`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p>Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString("en-IN")}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
