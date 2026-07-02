import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface DashboardMetricCardProps {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

const DashboardMetricCard = ({
  label,
  value,
  description,
  icon: Icon,
  className,
}: DashboardMetricCardProps) => {
  return (
    <div className={cn("card-border w-full", className)}>
      <div className="card flex h-full flex-col gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-light-100/65">
            {label}
          </p>
          <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary-100">
            <Icon className="size-4" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-3xl text-primary-100">{value}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetricCard;
