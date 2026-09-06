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

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  subtitle,
  className,
  compact,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "card-glass p-5 transition-transform duration-200 hover:-translate-y-0.5",
        compact && "p-3.5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn("font-medium text-[color:var(--muted)]", compact ? "text-xs" : "text-sm")}>
            {title}
          </p>
          <p
            className={cn(
              "num font-bold text-[color:var(--foreground)] mt-1 tracking-tight",
              compact ? "text-xl" : "text-2xl"
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-[color:var(--muted)]/70 mt-0.5">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "rounded-xl bg-gradient-to-br from-[color:var(--accent-soft)] to-white flex items-center justify-center border border-blue-100/60",
              compact ? "w-8 h-8" : "w-10 h-10"
            )}
          >
            <Icon className={cn("text-[color:var(--accent)]", compact ? "w-4 h-4" : "w-5 h-5")} />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
              change > 0
                ? "bg-red-50 text-red-700 border-red-200"
                : change < 0
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-white/70 text-gray-700 border-[color:var(--border)]"
            )}
          >
            {change > 0 ? "↑" : change < 0 ? "↓" : "→"} {change > 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-[color:var(--muted)]/70">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
