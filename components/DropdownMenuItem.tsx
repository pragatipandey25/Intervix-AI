"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface DropdownMenuItemProps {
  label: string;
  icon: LucideIcon;
  href?: string;
  accent?: boolean;
  onSelect?: () => void;
}

const DropdownMenuItem = ({
  label,
  icon: Icon,
  href,
  accent = false,
  onSelect,
}: DropdownMenuItemProps) => {
  const baseClasses = cn(
    "flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-left text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200/30 active:scale-[0.99]",
    accent
      ? "text-[#ff7b7b] hover:bg-red-500/10 hover:text-[#ff8f8f]"
      : "text-white/90 hover:bg-white/6 hover:text-white",
  );

  const iconClasses = accent ? "text-inherit" : "text-white/70";

  const content = (
    <>
      <Icon className={cn("size-4 shrink-0", iconClasses)} />
      <span className="font-medium">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onSelect} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onSelect} className={baseClasses}>
      {content}
    </button>
  );
};

export default DropdownMenuItem;
