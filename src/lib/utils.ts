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
// Recharts tooltip theme — warm ivory, consistent with globals.css.
// Dark panels would clash with the light theme; keep one shared style.
// ============================================================
export const chartTooltipContentStyle = {
  backgroundColor: "rgba(255, 253, 249, 0.95)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  color: "#1f2937",
  fontSize: "12px",
  boxShadow: "0 8px 32px rgba(31, 41, 55, 0.10)",
} as const;

export const chartTooltipLabelStyle = { color: "#6b7280", fontWeight: 600 } as const;

export function getStatusDot(status: string): string {
  switch (status) {
    case "Active": return "bg-green-500";
    case "Delayed": return "bg-yellow-500";
    case "Failed": return "bg-red-500";
    default: return "bg-gray-500";
  }
}
