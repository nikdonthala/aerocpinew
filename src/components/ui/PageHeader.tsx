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
    <div className="mb-9">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="w-11 h-11 rounded-[0.9rem] bg-[color:var(--accent-soft)] border border-[#ecd9c4]/70 flex items-center justify-center shadow-[0_4px_14px_-6px_rgba(176,83,44,0.25)] flex-shrink-0 mt-0.5">
            <Icon className="w-5 h-5 text-[color:var(--accent)]" />
          </div>
        )}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl text-[color:var(--foreground)] tracking-tight leading-tight">{title}</h1>
            {badge && (
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-[color:var(--muted)] mt-1.5">{description}</p>
        </div>
      </div>
    </div>
  );
}
