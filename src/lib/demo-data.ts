// AeroCPI Demo Data Engine
// Generates realistic, internally consistent airfare observations

// ===== TYPES =====
export interface Airport {
  id: string;
  name: string;
  city: string;
  iataCode: string;
  latitude: number;
  longitude: number;
}

export interface Airline {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  active: boolean;
}

export interface FareObservation {
  id: string;
  sourceId: string;
  sourceName: string;
  flightId: string;
  canonicalFlightId: string;
  routeId: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  baseFare: number;
  taxes: number;
  mandatoryFees: number;
  totalFare: number;
  currency: string;
  cabinClass: string;
  stops: number;
  bookingWindow: string;
  timestamp: string;
}

export interface IndexValue {
  date: string;
  indexValue: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
}

export interface Forecast {
  id: string;
  routeId: string;
  routeName: string;
  generatedAt: string;
  horizon: string;
  predictedMin: number;
  predictedMax: number;
  confidence: number;
  modelVersion: string;
}

export interface Anomaly {
  id: string;
  routeId: string;
  routeName: string;
  timestamp: string;
  observedValue: number;
  referenceValue: number;
  deviation: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface DataSource {
  id: string;
  name: string;
  type: string;
  status: "Active" | "Delayed" | "Failed";
  lastUpdate: string;
  records: number;
  errorCount: number;
  quality: number;
}

export interface RouteAnalytics {
  routeId: string;
  origin: string;
  destination: string;
  originCode: string;
  destCode: string;
  index: number;
  mom: number;
  avgFare: number;
  trend: "up" | "down" | "stable";
  observations: number;
}

export interface AirlineAnalytics {
  airline: string;
  airlineCode: string;
  avgFare: number;
  volatility: number;
  observations: number;
  routesMonitored: number;
  monthlyMovement: number;
  color: string;
}

export interface WatchlistItem {
  id: string;
  routeName: string;
  origin: string;
  destination: string;
  targetFare: number;
  currentFare: number;
  status: string;
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// ===== CONSTANTS =====
export const AIRPORTS: Airport[] = [
  { id: "DEL", name: "Indira Gandhi International Airport", city: "Delhi", iataCode: "DEL", latitude: 28.5562, longitude: 77.1000 },
  { id: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", iataCode: "BOM", latitude: 19.0896, longitude: 72.8656 },
  { id: "BLR", name: "Kempegowda International Airport", city: "Bangalore", iataCode: "BLR", latitude: 13.1986, longitude: 77.7066 },
  { id: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", iataCode: "HYD", latitude: 17.2403, longitude: 78.4294 },
  { id: "MAA", name: "Chennai International Airport", city: "Chennai", iataCode: "MAA", latitude: 12.9941, longitude: 80.1709 },
  { id: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", iataCode: "CCU", latitude: 22.6547, longitude: 88.4467 },
  { id: "GOI", name: "Goa International Airport", city: "Goa", iataCode: "GOI", latitude: 15.3809, longitude: 73.8314 },
  { id: "PNQ", name: "Pune Airport", city: "Pune", iataCode: "PNQ", latitude: 18.5822, longitude: 73.9197 },
  { id: "COK", name: "Cochin International Airport", city: "Kochi", iataCode: "COK", latitude: 9.9471, longitude: 76.2733 },
  { id: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", iataCode: "AMD", latitude: 23.0770, longitude: 72.6347 },
];

export const AIRLINES: Airline[] = [
  { id: "6E", name: "IndiGo", code: "6E", color: "#1E3A8A" },
  { id: "AI", name: "Air India", code: "AI", color: "#DC2626" },
  { id: "SG", name: "SpiceJet", code: "SG", color: "#F59E0B" },
  { id: "IX", name: "Air India Express", code: "IX", color: "#EF4444" },
  { id: "QP", name: "Akasa Air", code: "QP", color: "#F97316" },
  { id: "UK", name: "Vistara", code: "UK", color: "#7C3AED" },
];

export const DATA_SOURCES: DataSource[] = [
  { id: "src-1", name: "IndiGo Direct", type: "Airline API", status: "Active", lastUpdate: "10:02 AM", records: 12450, errorCount: 2, quality: 99.8 },
  { id: "src-2", name: "Air India Direct", type: "Airline API", status: "Active", lastUpdate: "10:01 AM", records: 10820, errorCount: 5, quality: 99.5 },
  { id: "src-3", name: "SpiceJet Direct", type: "Airline API", status: "Active", lastUpdate: "10:00 AM", records: 8210, errorCount: 3, quality: 99.6 },
  { id: "src-4", name: "MakeMyTrip", type: "OTA", status: "Active", lastUpdate: "09:58 AM", records: 15680, errorCount: 12, quality: 98.2 },
  { id: "src-5", name: "Cleartrip", type: "OTA", status: "Delayed", lastUpdate: "09:30 AM", records: 9840, errorCount: 28, quality: 95.1 },
  { id: "src-6", name: "Goibibo", type: "OTA", status: "Active", lastUpdate: "09:55 AM", records: 11200, errorCount: 8, quality: 99.3 },
  { id: "src-7", name: "EaseMyTrip", type: "OTA", status: "Active", lastUpdate: "09:52 AM", records: 8960, errorCount: 6, quality: 99.0 },
  { id: "src-8", name: "Akasa Air Direct", type: "Airline API", status: "Active", lastUpdate: "10:01 AM", records: 6540, errorCount: 1, quality: 99.9 },
  { id: "src-9", name: "Vistara Direct", type: "Airline API", status: "Active", lastUpdate: "09:59 AM", records: 7820, errorCount: 4, quality: 99.4 },
  { id: "src-10", name: "Yatra", type: "OTA", status: "Failed", lastUpdate: "08:15 AM", records: 5430, errorCount: 142, quality: 72.3 },
];

export const ROUTES: Route[] = [
  { id: "DEL-BOM", origin: "DEL", destination: "BOM", weight: 0.18, active: true },
  { id: "DEL-BLR", origin: "DEL", destination: "BLR", weight: 0.15, active: true },
  { id: "BOM-BLR", origin: "BOM", destination: "BLR", weight: 0.12, active: true },
  { id: "DEL-CCU", origin: "DEL", destination: "CCU", weight: 0.10, active: true },
  { id: "BLR-HYD", origin: "BLR", destination: "HYD", weight: 0.08, active: true },
  { id: "MAA-DEL", origin: "MAA", destination: "DEL", weight: 0.10, active: true },
  { id: "HYD-DEL", origin: "HYD", destination: "DEL", weight: 0.09, active: true },
  { id: "DEL-GOI", origin: "DEL", destination: "GOI", weight: 0.05, active: true },
  { id: "BOM-HYD", origin: "BOM", destination: "HYD", weight: 0.06, active: true },
  { id: "BLR-CCU", origin: "BLR", destination: "CCU", weight: 0.07, active: true },
];

// ===== UTILITY FUNCTIONS =====
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function randomInRange(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min);
}

function generateFlightNumber(airlineCode: string, rand: () => number): string {
  const num = Math.floor(rand() * 9000) + 1000;
  return `${airlineCode}${num}`;
}

function generateTime(rand: () => number, hourMin: number, hourMax: number): string {
  const hour = Math.floor(randomInRange(rand, hourMin, hourMax));
  const min = Math.floor(rand() * 60);
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

function generateArrivalTime(departureTime: string, durationMinutes: number): string {
  const [h, m] = departureTime.split(":").map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;
  const arrH = Math.floor(totalMinutes / 60) % 24;
  const arrM = totalMinutes % 60;
  return `${arrH.toString().padStart(2, "0")}:${arrM.toString().padStart(2, "0")}`;
}

// ===== BASE FARE MATRIX (₹) =====
const BASE_FARE_MATRIX: Record<string, Record<string, [number, number]>> = {
  DEL: { BOM: [4200, 7800], BLR: [4800, 8500], CCU: [4500, 7200], GOI: [5000, 9000] },
  BOM: { DEL: [4200, 7800], BLR: [3800, 7200], HYD: [4000, 7000] },
  BLR: { DEL: [4800, 8500], BOM: [3800, 7200], HYD: [2800, 5200], CCU: [5200, 8800] },
  HYD: { DEL: [3800, 6800], BLR: [2800, 5200], BOM: [4000, 7000] },
  MAA: { DEL: [4200, 7500] },
  CCU: { DEL: [4500, 7200], BLR: [5200, 8800] },
};

// ===== GENERATE HISTORICAL INDEX VALUES =====
export function generateIndexValues(): IndexValue[] {
  const values: IndexValue[] = [];
  let current = 100.0;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let year = 2025; year <= 2026; year++) {
    const endMonth = year === 2026 ? 9 : 12;
    for (let month = (year === 2025 ? 1 : 1); month <= endMonth; month++) {
      const change = (Math.sin(month * 0.5) * 3 + (Math.random() - 0.3) * 4);
      current = Math.max(85, Math.min(145, current + change));
      values.push({
        date: `${months[month - 1]} ${year}`,
        indexValue: parseFloat(current.toFixed(1)),
        dailyChange: parseFloat(((Math.random() - 0.4) * 2).toFixed(1)),
        weeklyChange: parseFloat(((Math.random() - 0.35) * 4).toFixed(1)),
        monthlyChange: parseFloat(((Math.random() - 0.3) * 6).toFixed(1)),
      });
    }
  }

  // Add daily values for recent period
  const recentDate = new Date(2026, 8, 1); // Sep 1, 2026
  for (let day = 30; day >= 0; day--) {
    const d = new Date(recentDate);
    d.setDate(d.getDate() - day);
    const dailyChange = (Math.random() - 0.45) * 1.5;
    current = Math.max(85, Math.min(145, current + dailyChange));
    const dailyChangePercent = parseFloat((dailyChange / current * 100).toFixed(2));
    values.push({
      date: d.toISOString().split("T")[0],
      indexValue: parseFloat(current.toFixed(1)),
      dailyChange: dailyChangePercent,
      weeklyChange: parseFloat(((Math.random() - 0.35) * 3).toFixed(1)),
      monthlyChange: parseFloat(((Math.random() - 0.3) * 5).toFixed(1)),
    });
  }

  return values;
}

// ===== GENERATE FARE OBSERVATIONS =====
export function generateFareObservations(): FareObservation[] {
  const observations: FareObservation[] = [];
  const rand = seededRandom(42);
  const bookingWindows = ["T+1", "T+7", "T+15", "T+30", "T+45"];
  const sources = DATA_SOURCES.filter((s) => s.status !== "Failed");
  const cabinClasses = ["Economy", "Premium Economy", "Business"];

  let obsId = 1;

  // Generate observations for each route, airline, source, date combination
  for (const route of ROUTES) {
    const fareRange = BASE_FARE_MATRIX[route.origin]?.[route.destination];
    if (!fareRange) continue;

    for (const airline of AIRLINES) {
      for (const source of sources) {
        // Generate observations for last 30 days
        for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
          const baseDate = new Date(2026, 8, 1);
          baseDate.setDate(baseDate.getDate() - dayOffset);
          const travelDate = new Date(baseDate);
          travelDate.setDate(travelDate.getDate() + Math.floor(randomInRange(rand, 1, 45)));

          for (const bw of bookingWindows) {
            if (rand() > 0.3) continue; // Not all combinations exist

            const [minFare, maxFare] = fareRange;
            const baseFare = Math.round(randomInRange(rand, minFare, maxFare));

            // Airline premium/discount
            const airlineMultiplier = airline.code === "AI" ? 1.12 :
              airline.code === "6E" ? 0.95 :
              airline.code === "SG" ? 0.92 :
              airline.code === "IX" ? 0.88 :
              airline.code === "QP" ? 0.90 :
              airline.code === "UK" ? 1.15 : 1.0;

            // Booking window pricing: closer = more expensive
            const bwMultiplier =
              bw === "T+1" ? 1.45 :
              bw === "T+7" ? 1.20 :
              bw === "T+15" ? 1.05 :
              bw === "T+30" ? 0.95 :
              0.90;

            const adjustedBase = Math.round(baseFare * airlineMultiplier * bwMultiplier);
            const taxes = Math.round(adjustedBase * 0.12);
            const mandatoryFees = Math.round(adjustedBase * 0.02);
            const totalFare = adjustedBase + taxes + mandatoryFees;

            // Source variation
            const sourceVariation = 1 + (rand() - 0.5) * 0.06;
            const finalFare = Math.round(totalFare * sourceVariation);

            const fn = generateFlightNumber(airline.code, rand);
            const depTime = generateTime(rand, 5, 23);
            const durationMinutes = Math.round(randomInRange(rand, 60, 200));
            const arrTime = generateArrivalTime(depTime, durationMinutes);
            const stops = durationMinutes < 120 ? 0 : rand() > 0.6 ? 1 : 0;

            const cabinClass = rand() > 0.85 ? "Premium Economy" : rand() > 0.97 ? "Business" : "Economy";

            observations.push({
              id: `obs-${obsId++}`,
              sourceId: source.id,
              sourceName: source.name,
              flightId: `flight-${airline.code}-${fn}`,
              canonicalFlightId: fn,
              routeId: route.id,
              airline: airline.name,
              airlineCode: airline.code,
              flightNumber: fn,
              origin: route.origin,
              destination: route.destination,
              departureDate: travelDate.toISOString().split("T")[0],
              departureTime: depTime,
              arrivalTime: arrTime,
              baseFare: adjustedBase,
              taxes,
              mandatoryFees,
              totalFare: finalFare,
              currency: "INR",
              cabinClass,
              stops,
              bookingWindow: bw,
              timestamp: baseDate.toISOString(),
            });
          }
        }
      }
    }
  }

  return observations;
}

// ===== GENERATE FORECASTS =====
export function generateForecasts(): Forecast[] {
  const forecasts: Forecast[] = [];
  const horizons = ["1 day", "3 days", "7 days", "15 days"];
  const rand = seededRandom(77);

  for (const route of ROUTES) {
    const fareRange = BASE_FARE_MATRIX[route.origin]?.[route.destination];
    if (!fareRange) continue;

    for (const horizon of horizons) {
      const [minFare, maxFare] = fareRange;
      const baseFare = randomInRange(rand, minFare, maxFare);
      const spread = randomInRange(rand, 200, 800);
      const confidence = Math.round(randomInRange(rand, 55, 92));

      forecasts.push({
        id: `fc-${route.id}-${horizon.replace(" ", "-")}`,
        routeId: route.id,
        routeName: `${route.origin} → ${route.destination}`,
        generatedAt: "2026-09-01T10:00:00Z",
        horizon,
        predictedMin: Math.round(baseFare - spread / 2),
        predictedMax: Math.round(baseFare + spread / 2),
        confidence,
        modelVersion: "AeroForecast-v1",
      });
    }
  }

  return forecasts;
}

// ===== GENERATE ANOMALIES =====
export function generateAnomalies(): Anomaly[] {
  const anomalies: Anomaly[] = [
    {
      id: "anom-1",
      routeId: "DEL-BOM",
      routeName: "DEL → BOM",
      timestamp: "2026-08-30T14:23:00Z",
      observedValue: 9840,
      referenceValue: 5420,
      deviation: 81.5,
      severity: "HIGH",
    },
    {
      id: "anom-2",
      routeId: "HYD-DEL",
      routeName: "HYD → DEL",
      timestamp: "2026-08-29T11:45:00Z",
      observedValue: 8200,
      referenceValue: 5421,
      deviation: 51.3,
      severity: "MEDIUM",
    },
    {
      id: "anom-3",
      routeId: "BLR-HYD",
      routeName: "BLR → HYD",
      timestamp: "2026-08-28T09:12:00Z",
      observedValue: 3200,
      referenceValue: 4200,
      deviation: -23.8,
      severity: "LOW",
    },
    {
      id: "anom-4",
      routeId: "DEL-BLR",
      routeName: "DEL → BLR",
      timestamp: "2026-08-27T16:30:00Z",
      observedValue: 12400,
      referenceValue: 6100,
      deviation: 103.3,
      severity: "CRITICAL",
    },
    {
      id: "anom-5",
      routeId: "BOM-BLR",
      routeName: "BOM → BLR",
      timestamp: "2026-08-26T08:00:00Z",
      observedValue: 2800,
      referenceValue: 4900,
      deviation: -42.9,
      severity: "MEDIUM",
    },
  ];

  return anomalies;
}

// ===== GENERATE ROUTE ANALYTICS =====
export function generateRouteAnalytics(): RouteAnalytics[] {
  return ROUTES.map((route) => ({
    routeId: route.id,
    origin: AIRPORTS.find((a) => a.iataCode === route.origin)?.city || route.origin,
    destination: AIRPORTS.find((a) => a.iataCode === route.destination)?.city || route.destination,
    originCode: route.origin,
    destCode: route.destination,
    index: Math.round((100 + (Math.random() - 0.3) * 40) * 10) / 10,
    mom: parseFloat(((Math.random() - 0.35) * 12).toFixed(1)),
    avgFare: Math.round(4000 + Math.random() * 4000),
    trend: Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "down" : "stable",
    observations: Math.round(2000 + Math.random() * 8000),
  }));
}

// ===== GENERATE AIRLINE ANALYTICS =====
export function generateAirlineAnalytics(): AirlineAnalytics[] {
  return AIRLINES.map((airline) => ({
    airline: airline.name,
    airlineCode: airline.code,
    avgFare: Math.round(4000 + Math.random() * 3000),
    volatility: parseFloat((Math.random() * 15 + 5).toFixed(1)),
    observations: Math.round(8000 + Math.random() * 12000),
    routesMonitored: Math.round(5 + Math.random() * 15),
    monthlyMovement: parseFloat(((Math.random() - 0.35) * 10).toFixed(1)),
    color: airline.color,
  }));
}

// ===== GENERATE WATCHLIST =====
export function generateWatchlist(): WatchlistItem[] {
  return [
    { id: "wl-1", routeName: "HYD → DEL", origin: "HYD", destination: "DEL", targetFare: 5000, currentFare: 5421, status: "₹421 above target" },
    { id: "wl-2", routeName: "DEL → BOM", origin: "DEL", destination: "BOM", targetFare: 4500, currentFare: 4380, status: "₹120 below target" },
    { id: "wl-3", routeName: "BLR → HYD", origin: "BLR", destination: "HYD", targetFare: 3000, currentFare: 3100, status: "₹100 above target" },
    { id: "wl-4", routeName: "DEL → BLR", origin: "DEL", destination: "BLR", targetFare: 5500, currentFare: 5200, status: "₹300 below target" },
  ];
}

// ===== GENERATE ALERTS =====
export function generateAlerts(): Alert[] {
  return [
    { id: "al-1", type: "price_drop", message: "🔔 HYD → DEL dropped 8.2% compared with yesterday's observed median.", timestamp: "2026-09-01T08:30:00Z", read: false },
    { id: "al-2", type: "anomaly", message: "⚠️ DEL → BOM fare spike detected: ₹9,840 vs historical ₹5,420.", timestamp: "2026-08-30T14:25:00Z", read: false },
    { id: "al-3", type: "forecast", message: "📈 DEL → BLR forecast suggests 5-8% increase in next 7 days.", timestamp: "2026-08-29T10:00:00Z", read: true },
    { id: "al-4", type: "index", message: "📊 AeroCPI Index moved +0.8% today, now at 127.6.", timestamp: "2026-09-01T06:00:00Z", read: false },
    { id: "al-5", type: "price_increase", message: "🔔 DEL → GOI fares increased 12% this week.", timestamp: "2026-08-31T09:00:00Z", read: true },
  ];
}

// ===== GENERATE HEATMAP DATA =====
export function generateHeatmapData(): Record<string, number[]> {
  const routes = ["DEL-BOM", "DEL-BLR", "BOM-BLR", "BLR-HYD", "HYD-DEL", "MAA-DEL", "DEL-CCU"];
  const data: Record<string, number[]> = {};

  for (const route of routes) {
    data[route] = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
  }

  return data;
}

// ===== CANONICAL FLIGHT MATCHING =====
export function getCanonicalFlightMatches(observations: FareObservation[], flightNumber: string, origin: string, destination: string, date: string): FareObservation[] {
  return observations.filter(
    (o) => o.canonicalFlightId === flightNumber && o.origin === origin && o.destination === destination && o.departureDate === date
  );
}

// ===== BOOKING WINDOW ANALYSIS =====
export function getBookingWindowAnalysis(observations: FareObservation[], routeId: string, airlineCode?: string): Record<string, number> {
  const filtered = observations.filter((o) => o.routeId === routeId && (!airlineCode || o.airlineCode === airlineCode));
  const windows: Record<string, number[]> = {};

  for (const obs of filtered) {
    if (!windows[obs.bookingWindow]) windows[obs.bookingWindow] = [];
    windows[obs.bookingWindow].push(obs.totalFare);
  }

  const result: Record<string, number> = {};
  for (const [bw, fares] of Object.entries(windows)) {
    result[bw] = Math.round(fares.reduce((a, b) => a + b, 0) / fares.length);
  }

  return result;
}

// ===== PRICE HISTORY =====
export function getPriceHistory(observations: FareObservation[], routeId: string, airlineCode?: string): { date: string; avgFare: number; minFare: number; maxFare: number }[] {
  const filtered = observations.filter((o) => o.routeId === routeId && (!airlineCode || o.airlineCode === airlineCode));
  const dateMap: Record<string, number[]> = {};

  for (const obs of filtered) {
    if (!dateMap[obs.departureDate]) dateMap[obs.departureDate] = [];
    dateMap[obs.departureDate].push(obs.totalFare);
  }

  return Object.entries(dateMap)
    .map(([date, fares]) => ({
      date,
      avgFare: Math.round(fares.reduce((a, b) => a + b, 0) / fares.length),
      minFare: Math.min(...fares),
      maxFare: Math.max(...fares),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ===== BOOK/WAIT SIGNAL =====
export function getBookWaitSignal(currentFare: number, historicalAvg: number, trend: number): { signal: "BOOK NOW" | "WAIT" | "NO CLEAR SIGNAL"; color: string; reason: string } {
  const deviation = ((currentFare - historicalAvg) / historicalAvg) * 100;

  if (deviation < -8 && trend < 0) {
    return { signal: "BOOK NOW", color: "green", reason: "Current observed fare is below the historical range for this route and booking window, and prices are trending downward." };
  } else if (deviation > 10 && trend < 0) {
    return { signal: "WAIT", color: "yellow", reason: "Current fare is above the recent historical range and recent observations show a downward trend. Prices may decrease further." };
  } else if (deviation > 15 && trend > 0) {
    return { signal: "WAIT", color: "yellow", reason: "Current fare is significantly above historical average. Recent trend shows continued increase — consider booking if urgent." };
  } else if (Math.abs(trend) > 5) {
    return { signal: "NO CLEAR SIGNAL", color: "gray", reason: "Recent price movement is highly volatile and the model does not have sufficient confidence to recommend booking or waiting." };
  } else {
    return { signal: "NO CLEAR SIGNAL", color: "gray", reason: "Current fare is within the normal historical range. No strong signal in either direction." };
  }
}

// ===== CURRENT STATS =====
export function getCurrentStats() {
  return {
    currentIndex: 127.6,
    dailyChange: 0.8,
    weeklyChange: 2.4,
    monthlyChange: 5.2,
    routesMonitored: 50,
    totalObservations: 124580,
    dataSources: 10,
    dataQuality: 97.9,
  };
}

// ===== DEMO DEMO STEP DATA =====
export const DEMO_STEPS = [
  { step: 1, title: "Select Route", description: "HYDERABAD → DELHI" },
  { step: 2, title: "Collect Observations", description: "Multiple sources report fares for this route" },
  { step: 3, title: "Normalize Fares", description: "Standardize base fare, taxes, and mandatory fees" },
  { step: 4, title: "Match Canonical Flight", description: "Identify that several listings represent the same flight" },
  { step: 5, title: "Historical Analysis", description: "Compare against historical price data" },
  { step: 6, title: "Booking Window", description: "Analyze T+1 through T+45 pricing" },
  { step: 7, title: "Forecast", description: "Generate price prediction range" },
  { step: 8, title: "Anomaly Check", description: "Detect unusual price movements" },
  { step: 9, title: "Route Index", description: "Update route-level airfare index" },
  { step: 10, title: "National Index", description: "Aggregate into India Airfare Price Index" },
];
