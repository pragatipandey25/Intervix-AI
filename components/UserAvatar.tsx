import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  variant?: "nav" | "panel";
  className?: string;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const variantClasses = {
  nav: "size-11 text-sm",
  panel: "size-14 text-lg",
};

const UserAvatar = ({
  name,
  avatarUrl,
  variant = "nav",
  className,
}: UserAvatarProps) => {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-linear-to-br from-primary-200 to-white/70 font-bold text-dark-100 shadow-[0_8px_24px_rgba(202,197,254,0.24)]",
        variantClasses[variant],
        className,
      )}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name} avatar`}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default UserAvatar;
