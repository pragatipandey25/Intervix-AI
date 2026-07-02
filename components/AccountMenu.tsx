"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Bookmark,
  ChevronDown,
  CircleHelp,
  History,
  LayoutDashboard,
  LogOut,
  Settings2,
  UserRound,
} from "lucide-react";
import { signOut as firebaseSignOut } from "firebase/auth";

import { auth } from "@/firebase/client";
import { signOut as clearSession } from "@/lib/actions/auth.action";
import UserAvatar from "@/components/UserAvatar";
import DropdownMenuItem from "@/components/DropdownMenuItem";

interface AccountMenuProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

const menuItems = [
  { label: "My Profile", href: "/profile", icon: UserRound },
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Interview History", href: "/interview/history", icon: History },
  { label: "Saved Questions", href: "/saved-questions", icon: Bookmark },
  {
    label: "Performance Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  { label: "Settings", href: "/settings", icon: Settings2 },
  { label: "Help & Support", href: "/help", icon: CircleHelp },
] as const;

const AccountMenu = ({ name, email, avatarUrl }: AccountMenuProps) => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (open) {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      setRendered(true);
      return;
    }

    if (!rendered) return;

    closeTimerRef.current = window.setTimeout(() => {
      setRendered(false);
      closeTimerRef.current = null;
    }, 200);

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [open, rendered]);

  const handleLogout = async () => {
    await firebaseSignOut(auth);
    await clearSession();
    setOpen(false);
    router.replace("/login");
    router.refresh();
  };

  return (
    <div ref={menuRef} className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className="group relative flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_16px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-200 hover:border-white/15 hover:bg-white/10 hover:shadow-[0_20px_80px_rgba(0,0,0,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200/40"
      >
        <UserAvatar name={name} avatarUrl={avatarUrl} variant="nav" />

        <ChevronDown
          className={`absolute -bottom-1 -right-1 size-3.5 shrink-0 rounded-full border border-white/10 bg-[#111318] p-0.5 text-light-100 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {rendered && (
        <div
          role="menu"
          aria-label="Profile menu"
          className={`absolute right-0 top-[calc(100%+12px)] w-88 overflow-hidden rounded-[20px] border border-white/10 bg-[#111318]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl ring-1 ring-white/5 transition-all duration-200 ease-out max-sm:right-auto max-sm:left-0 max-sm:w-[calc(100vw-2rem)] ${
            open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-95 opacity-0"
          }`}
        >
          <div className="absolute -top-1.5 right-8 size-3 rotate-45 border-l border-t border-white/10 bg-[#111318]/95" />

          <div className="border-b border-white/10 px-4 py-4">
            <div className="flex items-center gap-3">
              <UserAvatar name={name} avatarUrl={avatarUrl} variant="panel" />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-[-0.01em] text-primary-100">
                  {name}
                </p>
                <p className="truncate text-xs text-light-100/80">{email}</p>
              </div>
            </div>
          </div>

          <div className="p-2.5">
            <div className="space-y-1.5">
              {menuItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  onSelect={() => setOpen(false)}
                />
              ))}

              <div className="my-2 h-px bg-white/10" />

              <DropdownMenuItem
                label="Logout"
                icon={LogOut}
                accent
                onSelect={handleLogout}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
