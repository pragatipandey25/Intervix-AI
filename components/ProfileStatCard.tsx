import { cn } from "@/lib/utils";

interface ProfileStatCardProps {
  label: string;
  value: string;
  description?: string;
  className?: string;
}

const ProfileStatCard = ({
  label,
  value,
  description,
  className,
}: ProfileStatCardProps) => {
  return (
    <div className={cn("card-border w-full", className)}>
      <div className="card flex h-full flex-col gap-2 p-5 transition-transform duration-200 hover:-translate-y-0.5">
        <p className="text-xs uppercase tracking-[0.2em] text-light-100/70">
          {label}
        </p>
        <h3 className="text-2xl text-primary-100">{value}</h3>
        {description ? <p className="text-sm">{description}</p> : null}
      </div>
    </div>
  );
};

export default ProfileStatCard;
