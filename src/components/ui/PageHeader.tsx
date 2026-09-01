import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

export function PageHeader({ title, description, icon: Icon, badge, badgeColor = "bg-blue-100 text-blue-700" }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            {badge && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
