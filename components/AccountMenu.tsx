"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings2,
  UserRound,
} from "lucide-react";

import { signOut } from "@/lib/actions/auth.action";

interface AccountMenuProps {
  name: string;
  email: string;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const AccountMenu = ({ name, email }: AccountMenuProps) => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

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

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
    router.replace("/sign-up");
    router.refresh();
  };

  const menuItems = [
    { label: "Account", icon: CircleUserRound },
    { label: "Profile", icon: UserRound },
    { label: "Settings", icon: Settings2 },
    { label: "Billing", icon: CreditCard },
    { label: "Notifications", icon: Bell },
    { label: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div ref={menuRef} className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open account menu"
        className="group relative flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_16px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-200 hover:border-white/15 hover:bg-white/8 hover:shadow-[0_20px_80px_rgba(0,0,0,0.38)]"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-linear-to-br from-primary-200 to-white/70 text-sm font-bold text-dark-100 shadow-[0_8px_24px_rgba(202,197,254,0.24)]">
          {getInitials(name)}
        </div>

        <ChevronDown
          className={`absolute -bottom-1 -right-1 size-3.5 shrink-0 rounded-full border border-white/10 bg-[#111318] p-0.5 text-light-100 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] w-88 overflow-hidden rounded-[20px] border border-white/10 bg-[#111318]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl ring-1 ring-white/5 max-sm:right-auto max-sm:left-0 max-sm:w-[calc(100vw-2rem)]">
          <div className="-top-1.5 absolute right-8 size-3 rotate-45 border-l border-t border-white/10 bg-[#111318]/95" />

          <div className="border-b border-white/10 px-4 py-4.5">
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-linear-to-br from-primary-200 to-white/70 text-lg font-bold text-dark-100 shadow-[0_10px_30px_rgba(202,197,254,0.24)]">
                {getInitials(name)}
              </div>

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
              {menuItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-left text-sm text-white/90 transition-all duration-200 hover:bg-white/6 hover:text-white"
                >
                  <Icon className="size-4 text-white/70" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}

              <div className="my-2 h-px bg-white/10" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-left text-sm text-[#ff7b7b] transition-all duration-200 hover:bg-red-500/10 hover:text-[#ff8f8f]"
              >
                <LogOut className="size-4 text-inherit" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
