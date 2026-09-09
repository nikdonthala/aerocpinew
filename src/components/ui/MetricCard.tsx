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
        "card-glass p-5 hover:-translate-y-0.5",
        compact && "p-4",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className={cn("font-medium text-[color:var(--muted)]", compact ? "text-xs" : "text-sm")}>
            {title}
          </p>
          <p
            className={cn(
              "num text-[color:var(--foreground)] mt-1.5",
              compact ? "text-xl" : "text-[1.7rem] leading-tight"
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-[color:var(--muted)]/80 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "rounded-[0.8rem] bg-[color:var(--accent-soft)] flex items-center justify-center border border-[#ecd9c4]/60 flex-shrink-0",
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
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border num",
              change > 0
                ? "bg-[#f7e7e2] text-[color:var(--up)] border-[#e8c8c0]"
                : change < 0
                ? "bg-[#e9efe6] text-[color:var(--down)] border-[#cddcc7]"
                : "bg-white/70 text-gray-500 border-[color:var(--border)]"
            )}
          >
            {change > 0 ? "↑" : change < 0 ? "↓" : "→"} {change > 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-[color:var(--muted)]/80">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
