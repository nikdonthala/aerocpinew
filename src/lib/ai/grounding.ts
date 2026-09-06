// AeroCPI AI Grounding Context Builder
// Builds a compact, factual data summary from the demo-data engine so the AI
// can answer from real AeroCPI numbers instead of inventing them.
// Server-side only.

import {
  AIRPORTS,
  AIRLINES,
  ROUTES,
  DATA_SOURCES,
  generateIndexValues,
  generateFareObservations,
  generateRouteAnalytics,
  generateAirlineAnalytics,
  generateAnomalies,
  getBookingWindowAnalysis,
  type FareObservation,
} from "@/lib/demo-data";

export interface GroundingContext {
  stats: string;
  routes: string;
  airlines: string;
  anomalies: string;
  indexTrend: string;
  bookingWindows: string;
}

export function buildGroundingContext(): GroundingContext {
  const stats = {
    currentIndex: 127.6,
    dailyChange: 0.8,
    weeklyChange: 2.4,
    monthlyChange: 5.2,
    routesMonitored: 50,
    totalObservations: 124580,
    dataSources: 10,
    dataQuality: 97.9,
  };

  const routeAnalytics = generateRouteAnalytics();
  const airlineAnalytics = generateAirlineAnalytics();
  const anomalies = generateAnomalies();
  const indexValues = generateIndexValues().slice(-8);

  // Booking-window analysis for the flagship route
  const bookingWindows = getBookingWindowAnalysis(getCachedObservations(), "HYD-DEL");

  const routes = ROUTES.map((r) => {
    const a = routeAnalytics.find((x) => x.routeId === r.id);
    return a
      ? `${r.id}: index ${a.index}, MoM ${a.mom > 0 ? "+" : ""}${a.mom}%, avg fare INR ${a.avgFare}, trend ${a.trend}, ${a.observations} observations, weight ${r.weight}`
      : `${r.id}: weight ${r.weight}`;
  }).join("\n");

  const airlines = airlineAnalytics
    .map(
      (a) =>
        `${a.airline}: avg fare INR ${a.avgFare}, volatility ${a.volatility}%, monthly movement ${a.monthlyMovement > 0 ? "+" : ""}${a.monthlyMovement}%, ${a.observations} observations`
    )
    .join("\n");

  const anomalyLines = anomalies
    .map(
      (a) =>
        `${a.routeName} at ${a.timestamp}: observed INR ${a.observedValue} vs reference INR ${a.referenceValue} (${a.deviation > 0 ? "+" : ""}${a.deviation}%), severity ${a.severity}`
    )
    .join("\n");

  const indexTrend = indexValues
    .map((v) => `${v.date}: index ${v.indexValue}, daily ${v.dailyChange > 0 ? "+" : ""}${v.dailyChange}%`)
    .join("\n");

  const bwLine = Object.entries(bookingWindows)
    .map(([bw, fare]) => `${bw}: avg INR ${fare}`)
    .join(" | ");

  return {
    stats: `Current India Airfare Price Index: ${stats.currentIndex}. Daily change ${stats.dailyChange > 0 ? "+" : ""}${stats.dailyChange}%. Weekly ${stats.weeklyChange > 0 ? "+" : ""}${stats.weeklyChange}%. Monthly ${stats.monthlyChange > 0 ? "+" : ""}${stats.monthlyChange}%. Routes monitored: ${stats.routesMonitored}. Observations: ${stats.totalObservations}. Data sources: ${stats.dataSources}. Data quality: ${stats.dataQuality}%. Base period Jan 2025 = 100.`,
    routes,
    airlines,
    anomalies: anomalyLines || "No anomalies recorded in the current window.",
    indexTrend,
    bookingWindows: `HYD-DEL average total fare by advance-purchase window — ${bwLine}`,
  };
}

// Cache observations once per process to keep AI responses fast.
let cachedObs: FareObservation[] | null = null;
function getCachedObservations(): FareObservation[] {
  if (!cachedObs) {
    cachedObs = generateFareObservations();
  }
  return cachedObs;
}

export const AIRPORT_LIST = AIRPORTS.map((a) => `${a.iataCode} (${a.city})`).join(", ");
export const AIRLINE_LIST = AIRLINES.map((a) => a.name).join(", ");
export const SOURCE_LIST = DATA_SOURCES.map((s) => s.name).join(", ");

export function buildSystemPrompt(ctx: GroundingContext): string {
  return `You are the AeroCPI Assistant — an economic data analyst embedded in AeroCPI, India's Real-Time Airfare Price Intelligence platform.

STRICT GROUNDING RULES:
1. Answer ONLY using the AeroCPI data provided below. Never invent fares, routes, percentages or dates.
2. If the requested information is not in the data, state clearly: "That information is not available in the current AeroCPI dataset."
3. All figures refer to demo/simulated data — mention this when giving specific numbers.
4. Quote exact numbers with units (INR, %, index points).
5. Be concise: 2-5 short paragraphs or a tight bullet list. Use Markdown-lite (bold, bullets) only.
6. You are an index/analytics tool, NOT a booking site. Never claim to book, price-live-quote, or guarantee fares.

CURRENT AEROCPI DATA SNAPSHOT (demo dataset):

## NATIONAL STATS
${ctx.stats}

## ROUTE-LEVEL DATA
${ctx.routes}

## AIRLINE DATA
${ctx.airlines}

## BOOKING WINDOW ANALYSIS
${ctx.bookingWindows}

## RECENT INDEX TREND
${ctx.indexTrend}

## RECENT ANOMALIES
${ctx.anomalies}

## COVERAGE
Airports: ${AIRPORT_LIST}
Airlines: ${AIRLINE_LIST}
Data sources: ${SOURCE_LIST}`;
}
