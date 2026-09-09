import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatPercent(num: number): string {
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(1)}%`;
}

export function getChangeColor(change: number): string {
  if (change > 0) return "text-red-500";
  if (change < 0) return "text-green-500";
  return "text-gray-500";
}

export function getChangeBg(change: number): string {
  if (change > 0) return "bg-red-50 text-red-700 border-red-200";
  if (change < 0) return "bg-green-50 text-green-700 border-green-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "CRITICAL": return "bg-red-100 text-red-800 border-red-300";
    case "HIGH": return "bg-orange-100 text-orange-800 border-orange-300";
    case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "LOW": return "bg-blue-100 text-blue-800 border-blue-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Delayed": return "bg-yellow-100 text-yellow-800";
    case "Failed": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

// ============================================================
// Recharts theme — warm ivory, consistent with globals.css.
// One shared palette: clay for primary series, lavender/rose for
// secondary, muted sage for "falling" semantics.
// ============================================================
export const CHART = {
  accent: "#b0532c",
  accentStrong: "#8f431f",
  lavender: "#7e6ba8",
  rose: "#c98a94",
  up: "#b9605b",
  down: "#5f7f5c",
  grid: "rgba(174, 152, 122, 0.22)",
  axisTick: "#8a8378",
} as const;

export const chartTooltipContentStyle = {
  backgroundColor: "rgba(255, 253, 249, 0.96)",
  border: "1px solid rgba(219, 205, 182, 0.8)",
  borderRadius: "0.85rem",
  color: "#292524",
  fontSize: "12px",
  boxShadow: "0 12px 32px -12px rgba(90, 62, 40, 0.22)",
  padding: "8px 12px",
} as const;

export const chartTooltipLabelStyle = { color: "#8a8378", fontWeight: 600 } as const;

export const chartAxisTick = { fontSize: 11, fill: CHART.axisTick } as const;

export function getStatusDot(status: string): string {
  switch (status) {
    case "Active": return "bg-green-500";
    case "Delayed": return "bg-yellow-500";
    case "Failed": return "bg-red-500";
    default: return "bg-gray-500";
  }
}
