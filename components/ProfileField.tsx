"use client";

import { forwardRef } from "react";
import { Globe, Mail, MapPin, Phone, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProfileFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  icon?: "mail" | "phone" | "user" | "map" | "globe";
}

const iconMap = {
  mail: Mail,
  phone: Phone,
  user: UserRound,
  map: MapPin,
  globe: Globe,
} as const;

const ProfileField = forwardRef<HTMLInputElement, ProfileFieldProps>(
  ({ label, hint, icon, className, ...props }, ref) => {
    const Icon = icon ? iconMap[icon] : null;

    return (
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-primary-100">{label}</span>
        <div className="group flex h-12 items-center gap-3 rounded-full border border-white/10 bg-dark-200 px-4 text-sm text-white transition-all duration-200 focus-within:border-primary-200/50 focus-within:ring-2 focus-within:ring-primary-200/20">
          {Icon ? <Icon className="size-4 shrink-0 text-light-100/70" /> : null}
          <input
            ref={ref}
            className={cn(
              "h-full w-full bg-transparent outline-none placeholder:text-light-100/50",
              className,
            )}
            {...props}
          />
        </div>
        {hint ? (
          <span className="text-xs text-light-100/70">{hint}</span>
        ) : null}
      </label>
    );
  },
);

ProfileField.displayName = "ProfileField";

export default ProfileField;
