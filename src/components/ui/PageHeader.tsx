import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  badgeColor = "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]",
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[color:var(--accent-soft)] to-white border border-blue-100/60 flex items-center justify-center shadow-sm">
            <Icon className="w-5 h-5 text-[color:var(--accent)]" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[color:var(--foreground)] tracking-tight">{title}</h1>
            {badge && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-[color:var(--muted)]">{description}</p>
        </div>
      </div>
    </div>
  );
}
