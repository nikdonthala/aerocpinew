"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { BookOpen, ArrowDown, CheckCircle2 } from "lucide-react";

const pipelineSteps = [
  {
    step: 1,
    title: "Airline / OTA Sources",
    description: "Raw data from airline websites, APIs, and Online Travel Aggregator portals.",
    icon: "📡",
    detail: "Sources include direct airline APIs (IndiGo, Air India, SpiceJet, Akasa, Vistara) and OTA platforms (MakeMyTrip, Cleartrip, Goibibo, EaseMyTrip, Yatra). All collection is compliant with publicly accessible data sources.",
  },
  {
    step: 2,
    title: "Data Collection",
    description: "Automated, scheduled collection of fare observations from each source.",
    icon: "🔄",
    detail: "Modular source connectors run on configurable schedules. Each connector produces standardized fare snapshots that are immediately logged for auditability.",
  },
  {
    step: 3,
    title: "Validation",
    description: "Verify data completeness and structural integrity of each observation.",
    icon: "✅",
    detail: "Every observation is checked for required fields (route, fare, timestamp, airline, flight number). Observations with missing critical fields are flagged but retained for transparency.",
  },
  {
    step: 4,
    title: "Fare Normalization",
    description: "Convert all observed fares into a comparable 'total mandatory payable fare'.",
    icon: "⚖️",
    detail: "Each source may report fares differently. Normalization separates base fare, taxes, and mandatory fees from optional extras (meals, seat selection, baggage upgrades). The result is a comparable total mandatory payable fare.",
  },
  {
    step: 5,
    title: "Flight Matching",
    description: "Identify observations of the same flight across different sources.",
    icon: "🔗",
    detail: "The same flight may appear differently across sources (6E-2045, 6E2045, IndiGo 2045). Canonical Flight ID matching normalizes these into a single identifier based on airline, flight number, origin, destination, travel date, and departure time.",
  },
  {
    step: 6,
    title: "Outlier Detection",
    description: "Flag observations that deviate significantly from historical patterns.",
    icon: "⚠️",
    detail: "Each observation is compared against its route's historical fare distribution. Observations exceeding configurable deviation thresholds are flagged as anomalies with severity classifications (LOW, MEDIUM, HIGH, CRITICAL).",
  },
  {
    step: 7,
    title: "Representative Route Basket",
    description: "Select a basket of routes that represent India's domestic airfare market.",
    icon: "🧺",
    detail: "Routes are selected based on traffic importance and representative coverage. The basket includes high-traffic corridors (DEL-BOM, DEL-BLR, BOM-BLR) and diverse geographic coverage.",
  },
  {
    step: 8,
    title: "Route Weighting",
    description: "Assign configurable weights to each route in the basket.",
    icon: "⚖️",
    detail: "Each route is assigned a weight reflecting its importance in the overall market. Weights are configurable by administrators and should be validated against actual traffic data.",
  },
  {
    step: 9,
    title: "Aggregation",
    description: "Calculate route-level price relatives and aggregate into the national index.",
    icon: "📊",
    detail: "Price Relative = Current standardized price / Base-period standardized price. The national index is the weighted sum of route price relatives.",
  },
  {
    step: 10,
    title: "Airfare Price Index",
    description: "The final output: a time-series indicator of airfare price movement in India.",
    icon: "📈",
    detail: "The Airfare Price Index is produced daily and published with full transparency on methodology, data sources, and quality metrics.",
  },
];

const routeBasket = [
  { route: "DEL–BOM", weight: "18%", importance: "Highest traffic corridor in India" },
  { route: "DEL–BLR", weight: "15%", importance: "Key business route, North-South" },
  { route: "BOM–BLR", weight: "12%", importance: "Western business corridor" },
  { route: "DEL–CCU", weight: "10%", importance: "North-East connectivity" },
  { route: "BLR–HYD", weight: "8%", importance: "South India tech corridor" },
  { route: "MAA–DEL", weight: "10%", importance: "South-North connectivity" },
  { route: "HYD–DEL", weight: "9%", importance: "Central-South corridor" },
  { route: "DEL–GOI", weight: "5%", importance: "Leisure travel representative" },
  { route: "BOM–HYD", weight: "6%", importance: "Western-Central corridor" },
  { route: "BLR–CCU", weight: "7%", importance: "South-East connectivity" },
];

const bookingWindows = [
  { window: "T+1", description: "1 day before departure", typical: "Highest fares, last-minute bookings" },
  { window: "T+7", description: "7 days before departure", typical: "Elevated fares, short-notice travel" },
  { window: "T+15", description: "15 days before departure", typical: "Moderate fares" },
  { window: "T+30", description: "30 days before departure", typical: "Standard advance purchase" },
  { window: "T+45", description: "45 days before departure", typical: "Lowest fares, advance planning" },
];

export default function MethodologyPage() {
  return (
    <div>
      <PageHeader
        title="Index Methodology"
        description="How the AeroCPI Airfare Price Index is calculated"
        icon={BookOpen}
      />

      {/* Pipeline */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900  mb-6">Processing Pipeline</h2>
        <div className="space-y-4">
          {pipelineSteps.map((step, i) => (
            <div key={step.step}>
              <div className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100  flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-600 ">STEP {step.step}</span>
                      <h3 className="text-base font-semibold text-gray-900 ">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500  mb-2">{step.description}</p>
                    <p className="text-sm text-gray-600  bg-gray-50  rounded-lg p-3">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
              {i < pipelineSteps.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-5 h-5 text-gray-300 " />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Base Period */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900  mb-4">Base Period</h2>
        <div className="bg-blue-50  rounded-lg p-4 inline-flex items-center gap-3">
          <span className="text-3xl font-bold text-blue-600 ">100.0</span>
          <div>
            <p className="text-sm font-semibold text-gray-900 ">January 2026 = 100</p>
            <p className="text-xs text-gray-500 ">All index values are relative to this base period</p>
          </div>
        </div>
      </div>

      {/* Route Basket */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900  mb-2">Representative Route Basket</h2>
        <p className="text-sm text-gray-500  mb-4">
          Routes are selected based on traffic importance and representative geographic coverage.
          The administrator can modify this basket.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--border)] ">
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Route</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Weight</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Importance</th>
              </tr>
            </thead>
            <tbody>
              {routeBasket.map((r) => (
                <tr key={r.route} className="border-b border-gray-100 ">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 ">{r.route}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 ">{r.weight}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 ">{r.importance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Windows */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900  mb-2">Booking Windows</h2>
        <p className="text-sm text-gray-500  mb-4">
          Mandatory observation windows represent how many days before departure the fare is observed.
        </p>
        <div className="space-y-3">
          {bookingWindows.map((bw) => (
            <div key={bw.window} className="flex items-center gap-4 p-3 bg-gray-50  rounded-lg">
              <span className="text-lg font-bold text-blue-600  w-12">{bw.window}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 ">{bw.description}</p>
                <p className="text-xs text-gray-400">{bw.typical}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Index Formula */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900  mb-4">Index Formula</h2>
        <div className="bg-gray-50  rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase mb-3">Price Relative</p>
              <div className="text-center">
                <p className="font-mono text-gray-900 ">Current standardized price</p>
                <div className="w-full h-px bg-gray-400 my-2" />
                <p className="font-mono text-gray-900 ">Base-period standardized price</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase mb-3">National Airfare Index</p>
              <div className="text-center">
                <p className="font-mono text-gray-900 ">
                  Σ (Route Weight × Route Price Relative)
                </p>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  "Route-level index",
                  "Airline-level index",
                  "National aggregate index",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700 ">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400 ">
          Note: This is a prototype methodology — configurable and subject to validation.
          Not claiming to reproduce the official CPI methodology.
        </p>
      </div>

      {/* Standardized Observation */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900  mb-4">Standardized Fare Observation</h2>
        <p className="text-sm text-gray-500  mb-4">
          Each observation is standardized into a common structure for comparability across sources.
        </p>
        <div className="bg-gray-50  rounded-lg p-4 font-mono text-sm space-y-1">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <span className="text-gray-500">airline:</span>
            <span className="text-gray-900 ">IndiGo</span>
            <span className="text-gray-500">flight_number:</span>
            <span className="text-gray-900 ">6E2045</span>
            <span className="text-gray-500">origin:</span>
            <span className="text-gray-900 ">HYD</span>
            <span className="text-gray-500">destination:</span>
            <span className="text-gray-900 ">DEL</span>
            <span className="text-gray-500">departure_date:</span>
            <span className="text-gray-900 ">2026-09-30</span>
            <span className="text-gray-500">departure_time:</span>
            <span className="text-gray-900 ">08:30</span>
            <span className="text-gray-500">arrival_time:</span>
            <span className="text-gray-900 ">10:45</span>
            <span className="text-gray-500">booking_window:</span>
            <span className="text-gray-900 ">T+30</span>
            <span className="text-gray-500">cabin_class:</span>
            <span className="text-gray-900 ">Economy</span>
            <span className="text-gray-500">stops:</span>
            <span className="text-gray-900 ">Non-stop</span>
            <span className="text-gray-500">total_fare:</span>
            <span className="text-gray-900 ">₹5,421</span>
            <span className="text-gray-500">source:</span>
            <span className="text-gray-900 ">MakeMyTrip</span>
            <span className="text-gray-500">collected:</span>
            <span className="text-gray-900 ">2026-09-01 10:00:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
