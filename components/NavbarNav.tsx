"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlayCircle,
  MessageSquareText,
  Bookmark,
  FileSearch,
  History,
  BarChart3,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Start Interview", href: "/interview", icon: PlayCircle },
  { label: "Practice Drills", href: "/practice-questions", icon: MessageSquareText },
  { label: "Saved Questions", href: "/saved-questions", icon: Bookmark },
  { label: "Resume Analysis", href: "/resume-analysis", icon: FileSearch },
  { label: "History", href: "/interview/history", icon: History },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function NavbarNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-200/80 border border-white/10 backdrop-blur-md">
      {NAV_LINKS.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? "bg-primary-200 text-dark-100 font-semibold shadow-sm"
                : "text-light-100/70 hover:text-light-100 hover:bg-white/5"
            }`}
          >
            <Icon className="size-3.5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
