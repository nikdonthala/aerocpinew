import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  subtitle?: string;
  className?: string;
  compact?: boolean;
}

export function MetricCard({ title, value, change, changeLabel, icon: Icon, subtitle, className, compact }: MetricCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5",
      compact && "p-3",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn("font-medium text-gray-500 dark:text-gray-400", compact ? "text-xs" : "text-sm")}>{title}</p>
          <p className={cn("font-bold text-gray-900 dark:text-white mt-1", compact ? "text-xl" : "text-2xl")}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center",
            compact ? "w-8 h-8" : "w-10 h-10"
          )}>
            <Icon className={cn("text-blue-600 dark:text-blue-400", compact ? "w-4 h-4" : "w-5 h-5")} />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
              change > 0 ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800" :
              change < 0 ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" :
              "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            )}
          >
            {change > 0 ? "↑" : change < 0 ? "↓" : "→"} {change > 0 ? "+" : ""}{change.toFixed(1)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-gray-400 dark:text-gray-500">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
