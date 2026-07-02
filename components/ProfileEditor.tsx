"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  CalendarDays,
  Globe,
  Hourglass,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import UserAvatar from "@/components/UserAvatar";
import ProfileField from "@/components/ProfileField";
import ProfileStatCard from "@/components/ProfileStatCard";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/lib/actions/auth.action";

interface ProfileEditorProps {
  user: User;
}

type ProfileFormState = {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  country: string;
  timeZone: string;
  bio: string;
};

const statCards = [
  { label: "Interviews Completed", value: "42", icon: Trophy },
  { label: "Average Score", value: "87%", icon: ShieldCheck },
  { label: "Practice Hours", value: "128h", icon: Hourglass },
  { label: "Member Since", value: "Jan 2025", icon: CalendarDays },
];

const getFormState = (user: User): ProfileFormState => ({
  name: user.name || "",
  email: user.email || "",
  phoneNumber: user.phoneNumber || "",
  role: user.role || "AI Interview Candidate",
  country: user.country || "",
  timeZone: user.timeZone || "",
  bio:
    user.bio ||
    "Aspiring product-minded engineer preparing for high-stakes interviews.",
});

const computeCompletion = (state: ProfileFormState) => {
  const fields = [
    state.name,
    state.email,
    state.phoneNumber,
    state.role,
    state.country,
    state.timeZone,
    state.bio,
  ];

  const completed = fields.filter((value) => value.trim().length > 0).length;
  return Math.round((completed / fields.length) * 100);
};

const ProfileEditor = ({ user }: ProfileEditorProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<ProfileFormState>(() =>
    getFormState(user),
  );

  useEffect(() => {
    setFormState(getFormState(user));
  }, [user]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormState(getFormState(user));
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateUserProfile({
        userId: user.id,
        name: formState.name,
        email: formState.email,
        phoneNumber: formState.phoneNumber,
        role: formState.role,
        country: formState.country,
        timeZone: formState.timeZone,
        bio: formState.bio,
        avatarUrl: user.avatarUrl,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  const completion = computeCompletion(formState);

  return (
    <section className="mt-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.22em] text-light-100/60">
          Account
        </p>
        <h2>My Profile</h2>
        <p className="max-w-2xl">
          Manage your account details, avatar, and preferences from one premium
          dashboard view.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="card-border w-full">
          <form onSubmit={handleSave} className="card flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <UserAvatar
                    name={formState.name}
                    avatarUrl={user.avatarUrl}
                    variant="panel"
                    className="size-20 text-2xl"
                  />

                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border border-white/10 bg-primary-200 text-dark-100 shadow-[0_12px_28px_rgba(202,197,254,0.3)] transition-transform duration-200 hover:scale-105"
                    aria-label="Change avatar"
                  >
                    <Camera className="size-4" />
                  </button>
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-primary-100">
                    {formState.name}
                  </h3>
                  <div className="mt-1 flex flex-col gap-1 text-sm text-light-100/80">
                    <span className="flex items-center gap-2">
                      <Mail className="size-4" />
                      {formState.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone className="size-4" />
                      {formState.phoneNumber || "+1 (555) 000-0000"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={handleCancel}
                >
                  <X className="size-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-full px-5"
                  disabled={isPending}
                >
                  <Save className="size-4" />
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ProfileField
                label="Full Name"
                value={formState.name}
                onChange={handleChange}
                name="name"
              />
              <ProfileField
                label="Email"
                value={formState.email}
                onChange={handleChange}
                name="email"
                type="email"
                icon="mail"
              />
              <ProfileField
                label="Phone Number"
                value={formState.phoneNumber}
                onChange={handleChange}
                name="phoneNumber"
                placeholder="Enter your phone number"
                icon="phone"
              />
              <ProfileField
                label="Role"
                value={formState.role}
                onChange={handleChange}
                name="role"
                placeholder="Enter your role"
                icon="user"
              />
              <ProfileField
                label="Country"
                value={formState.country}
                onChange={handleChange}
                name="country"
                placeholder="Enter your country"
                icon="map"
              />
              <ProfileField
                label="Time Zone"
                value={formState.timeZone}
                onChange={handleChange}
                name="timeZone"
                placeholder="Enter your time zone"
                icon="globe"
              />
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-primary-100">Bio</span>
              <textarea
                value={formState.bio}
                onChange={handleChange}
                name="bio"
                rows={5}
                className="min-h-32 rounded-3xl border border-white/10 bg-dark-200 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-light-100/50 focus:border-primary-200/50 focus:ring-2 focus:ring-primary-200/20"
                placeholder="Write a short bio"
              />
            </label>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card-border w-full">
            <div className="card flex flex-col gap-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-light-100/70">
                    Profile Completion
                  </p>
                  <h3 className="mt-1 text-primary-100">{completion}%</h3>
                </div>
                <Sparkles className="size-5 text-primary-200" />
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-linear-to-r from-primary-200 to-white/80 transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <p>
                Complete your missing fields and upload a custom avatar to reach
                full profile strength.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {statCards.map((stat) => (
              <ProfileStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                description="Updated from your interview activity"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileEditor;
