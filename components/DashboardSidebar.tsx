import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  History,
  LayoutDashboard,
  PlayCircle,
  Sparkles,
  UserRound,
} from "lucide-react";

import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  user: User;
  totalInterviews: number;
  averageScore: number;
  active?: "dashboard" | "profile" | "history" | "analytics";
}

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, key: "dashboard" },
  { label: "My Profile", href: "/profile", icon: UserRound, key: "profile" },
  {
    label: "Interview History",
    href: "/interview/history",
    icon: History,
    key: "history",
  },
  {
    label: "Performance Analytics",
    href: "/analytics",
    icon: BarChart3,
    key: "analytics",
  },
] as const satisfies Array<{
  label: string;
  href: string;
  icon: LucideIcon;
  key: string;
}>;

const DashboardSidebar = ({
  user,
  totalInterviews,
  averageScore,
  active = "dashboard",
}: DashboardSidebarProps) => {
  return (
    <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-6">
      <div className="card-border w-full">
        <div className="card flex flex-col gap-5 p-5">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={user.name}
              avatarUrl={user.avatarUrl}
              variant="panel"
              className="size-16 text-xl"
            />

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.22em] text-light-100/60">
                Welcome back
              </p>
              <h3 className="truncate text-primary-100">{user.name}</h3>
              <p className="truncate text-sm text-light-100/75">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-light-100/60">Interviews</p>
              <p className="mt-1 text-2xl font-semibold text-primary-100">
                {totalInterviews}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-light-100/60">Avg Score</p>
              <p className="mt-1 text-2xl font-semibold text-primary-100">
                {averageScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card-border w-full">
        <div className="card flex flex-col gap-4 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary-200" />
            <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
              Navigation
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = item.key === active;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary-200 text-dark-100 shadow-[0_10px_30px_rgba(202,197,254,0.2)]"
                      : "text-white/85 hover:bg-white/6 hover:text-white",
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card-border w-full">
        <div className="card flex flex-col gap-3 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
            Quick Focus
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-primary-100">
              {averageScore >= 85
                ? "You are in a strong performance zone. Keep sharpening system design."
                : "Focus on consistency, clarity, and structured answers this week."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
