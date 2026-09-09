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
    <div className="animate-rise">
      <PageHeader
        title="Data Explorer"
        description="Browse and export raw fare observations"
        icon={Database}
        badge={`${filtered.length.toLocaleString("en-IN")} records`}
        badgeColor="bg-[color:var(--lavender-soft)] text-[color:var(--cyan)]"
      />

      {/* Filters */}
      <div className="card p-5 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)] pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search..."
              aria-label="Search observations"
              className="input !pl-9"
            />
          </div>
          <select value={routeFilter} onChange={(e) => { setRouteFilter(e.target.value); setPage(0); }} aria-label="Route filter" className="input">
            <option value="">All Routes</option>
            {ROUTES.map(r => <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>)}
          </select>
          <select value={airlineFilter} onChange={(e) => { setAirlineFilter(e.target.value); setPage(0); }} aria-label="Airline filter" className="input">
            <option value="">All Airlines</option>
            {AIRLINES.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
          </select>
          <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(0); }} aria-label="Source filter" className="input">
            <option value="">All Sources</option>
            {DATA_SOURCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={bwFilter} onChange={(e) => { setBwFilter(e.target.value); setPage(0); }} aria-label="Booking window filter" className="input">
            <option value="">All Windows</option>
            {["T+1", "T+7", "T+15", "T+30", "T+45"].map(bw => <option key={bw} value={bw}>{bw}</option>)}
          </select>
          <button onClick={exportCSV} className="btn-primary flex items-center justify-center gap-2 px-4 py-2 text-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full table-lux">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Source</th>
                <th>Airline</th>
                <th>Flight</th>
                <th>Route</th>
                <th>Travel Date</th>
                <th>BW</th>
                <th className="!text-right">Fare</th>
                <th>Cabin</th>
                <th>Stops</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((obs) => (
                <tr key={obs.id}>
                  <td className="text-xs text-[color:var(--muted)] whitespace-nowrap">
                    {new Date(obs.timestamp).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="text-xs text-[color:var(--foreground)]/80">{obs.sourceName}</td>
                  <td className="text-xs text-[color:var(--foreground)]/80">{obs.airline}</td>
                  <td className="text-xs font-semibold text-[color:var(--foreground)]">{obs.flightNumber}</td>
                  <td className="text-xs font-semibold text-[color:var(--foreground)]">{obs.origin}–{obs.destination}</td>
                  <td className="text-xs text-[color:var(--muted)]">{obs.departureDate}</td>
                  <td className="text-xs text-[color:var(--muted)]">{obs.bookingWindow}</td>
                  <td className="text-xs font-semibold text-[color:var(--foreground)] text-right num">
                    {formatCurrency(obs.totalFare)}
                  </td>
                  <td className="text-xs text-[color:var(--muted)]">{obs.cabinClass}</td>
                  <td className="text-xs text-[color:var(--muted)]">{obs.stops === 0 ? "Non-stop" : `${obs.stops} stop`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
        <p>Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString("en-IN")}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="btn-secondary px-3.5 py-1.5 text-xs disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="btn-secondary px-3.5 py-1.5 text-xs disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
