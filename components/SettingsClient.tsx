"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Download,
  Eye,
  Lock,
  MoonStar,
  Paintbrush,
  Palette,
  Shield,
  UserRoundPen,
  Upload,
  SunMedium,
  Monitor,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface SettingsClientProps {
  user: User;
}

type ThemeOption = "midnight" | "ember" | "aurora";

type ToggleKey =
  | "emailNotifications"
  | "pushNotifications"
  | "weeklyReports"
  | "darkMode"
  | "editProfile"
  | "changeAvatar"
  | "changePassword"
  | "twoFactor"
  | "emailVerification"
  | "deleteAccount"
  | "downloadData";

const themeOptions: {
  id: ThemeOption;
  label: string;
  description: string;
}[] = [
  {
    id: "midnight",
    label: "Midnight",
    description: "Deep slate with crisp contrast.",
  },
  {
    id: "ember",
    label: "Ember",
    description: "Warm highlights and energetic accents.",
  },
  {
    id: "aurora",
    label: "Aurora",
    description: "Soft gradient tones with a cooler feel.",
  },
];

const initialToggles: Record<ToggleKey, boolean> = {
  emailNotifications: true,
  pushNotifications: false,
  weeklyReports: true,
  darkMode: true,
  editProfile: true,
  changeAvatar: false,
  changePassword: false,
  twoFactor: false,
  emailVerification: true,
  deleteAccount: false,
  downloadData: false,
};

const SettingsClient = ({ user }: SettingsClientProps) => {
  const [displayName, setDisplayName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user.image || "");
  const [theme, setTheme] = useState<ThemeOption>("midnight");
  const [toggles, setToggles] = useState(initialToggles);
  const [savedState, setSavedState] = useState(
    "All changes are local to this session.",
  );

  const profileProgress = useMemo(() => {
    const activeFields = [displayName, email, avatarUrl].filter(Boolean).length;
    return Math.round((activeFields / 3) * 100);
  }, [displayName, email, avatarUrl]);

  const handleReset = () => {
    setDisplayName(user.name || "");
    setEmail(user.email || "");
    setAvatarUrl(user.image || "");
    setTheme("midnight");
    setToggles(initialToggles);
    setSavedState("Settings were reset to your last saved baseline.");
  };

  const handleSave = () => {
    setSavedState(
      "Changes saved. Connect this form to persistence when ready.",
    );
  };

  const toggleButtonClass = (active: boolean) =>
    cn(
      "relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-200",
      active
        ? "border-emerald-500/40 bg-emerald-500/20"
        : "border-white/10 bg-white/5",
    );

  const knobClass = (active: boolean) =>
    cn(
      "absolute left-1 h-5 w-5 rounded-full transition-transform duration-200",
      active ? "translate-x-5 bg-emerald-400" : "translate-x-0 bg-slate-300",
    );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.9))] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-sm">
              <Sparkles className="size-3.5 text-cyan-300" />
              Settings Center
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Personalize your account, notifications, and privacy.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage the profile details, appearance, and security options
                that shape your interview workspace.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 backdrop-blur-sm sm:min-w-80">
            <div className="flex items-center justify-between gap-4">
              <span>Account</span>
              <span className="font-medium text-white">
                {user.name || "New user"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Email</span>
              <span className="truncate font-medium text-white">
                {user.email}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Profile completion</span>
              <span className="font-medium text-cyan-300">
                {profileProgress}%
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
        <div className="grid gap-6">
          <section className="grid gap-6 md:grid-cols-2">
            <div className="card-border w-full">
              <div className="card flex h-full flex-col gap-5 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                      <UserRoundPen className="size-4 text-cyan-300" />
                      Profile Settings
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Edit how your profile appears across the app.
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Active
                  </span>
                </div>

                <div className="space-y-4">
                  <label className="block space-y-2 text-sm text-slate-200">
                    <span>Display name</span>
                    <Input
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                      placeholder="Enter your display name"
                    />
                  </label>

                  <label className="block space-y-2 text-sm text-slate-200">
                    <span>Email address</span>
                    <Input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                      placeholder="name@company.com"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="card-border w-full">
              <div className="card flex h-full flex-col gap-5 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                      <Upload className="size-4 text-cyan-300" />
                      Change Avatar
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Replace your current photo with a sharper headshot.
                    </p>
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br from-cyan-400/25 to-blue-500/10 text-sm font-semibold text-cyan-100">
                    {(displayName || user.email).slice(0, 1).toUpperCase()}
                  </div>
                </div>

                <label className="block space-y-2 text-sm text-slate-200">
                  <span>Avatar URL</span>
                  <Input
                    value={avatarUrl}
                    onChange={(event) => setAvatarUrl(event.target.value)}
                    className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                    placeholder="https://..."
                  />
                </label>

                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="font-medium text-white">
                    Recommended upload tips
                  </p>
                  <p className="mt-1 leading-6">
                    Use a square image with clear lighting and a neutral
                    background for the best avatar crop.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="card-border w-full">
            <div className="card flex flex-col gap-6 p-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                  <Lock className="size-4 text-cyan-300" />
                  Account Settings
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Security controls for login and access management.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Change password",
                    description: "Rotate credentials regularly.",
                    icon: <Lock className="size-4 text-cyan-300" />,
                    active: toggles.changePassword,
                    key: "changePassword" as const,
                  },
                  {
                    title: "Two-factor authentication",
                    description: "Add a second verification step.",
                    icon: <Shield className="size-4 text-cyan-300" />,
                    active: toggles.twoFactor,
                    key: "twoFactor" as const,
                  },
                  {
                    title: "Email verification",
                    description: "Keep your account contact verified.",
                    icon: <CheckCircle2 className="size-4 text-cyan-300" />,
                    active: toggles.emailVerification,
                    key: "emailVerification" as const,
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() =>
                      setToggles((current) => ({
                        ...current,
                        [item.key]: !current[item.key],
                      }))
                    }
                    className={cn(
                      "group rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5",
                      item.active
                        ? "border-cyan-400/30 bg-cyan-500/10"
                        : "border-white/10 bg-white/3 hover:border-white/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          {item.icon}
                          {item.title}
                        </div>
                        <p className="text-sm leading-6 text-slate-400">
                          {item.description}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          item.active
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-white/5 text-slate-400",
                        )}
                      >
                        {item.active ? "On" : "Off"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="card-border w-full">
            <div className="card flex flex-col gap-6 p-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                  <Bell className="size-4 text-cyan-300" />
                  Notification Settings
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Choose how and when you want to be updated.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Email notifications",
                    description: "Receive task and feedback updates.",
                    key: "emailNotifications" as const,
                  },
                  {
                    title: "Push notifications",
                    description: "Get real-time browser alerts.",
                    key: "pushNotifications" as const,
                  },
                  {
                    title: "Weekly reports",
                    description: "Summary of progress and trends.",
                    key: "weeklyReports" as const,
                  },
                ].map((item) => {
                  const active = toggles[item.key];
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() =>
                        setToggles((current) => ({
                          ...current,
                          [item.key]: !current[item.key],
                        }))
                      }
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5",
                        active
                          ? "border-emerald-400/30 bg-emerald-500/10"
                          : "border-white/10 bg-white/3 hover:border-white/20",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-white">
                            {item.title}
                          </div>
                          <p className="text-sm leading-6 text-slate-400">
                            {item.description}
                          </p>
                        </div>
                        <span
                          className={toggleButtonClass(active)}
                          aria-hidden="true"
                        >
                          <span className={knobClass(active)} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <aside className="grid gap-6">
          <section className="card-border w-full">
            <div className="card flex flex-col gap-6 p-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                  <Paintbrush className="size-4 text-cyan-300" />
                  Appearance
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Match the workspace to your visual preference.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() =>
                    setToggles((current) => ({
                      ...current,
                      darkMode: !current.darkMode,
                    }))
                  }
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all duration-200",
                    toggles.darkMode
                      ? "border-cyan-400/30 bg-cyan-500/10"
                      : "border-white/10 bg-white/3 hover:border-white/20",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-cyan-300">
                      {toggles.darkMode ? (
                        <MoonStar className="size-5" />
                      ) : (
                        <SunMedium className="size-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        Dark mode
                      </div>
                      <p className="text-sm text-slate-400">
                        Reduce glare and keep focus in low light.
                      </p>
                    </div>
                  </div>
                  <span
                    className={toggleButtonClass(toggles.darkMode)}
                    aria-hidden="true"
                  >
                    <span className={knobClass(toggles.darkMode)} />
                  </span>
                </button>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                    <Palette className="size-4 text-cyan-300" />
                    Theme selection
                  </div>
                  <div className="grid gap-3">
                    {themeOptions.map((option) => {
                      const active = theme === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setTheme(option.id)}
                          className={cn(
                            "rounded-2xl border p-4 text-left transition-all duration-200",
                            active
                              ? "border-cyan-400/40 bg-cyan-500/10"
                              : "border-white/10 bg-white/3 hover:border-white/20",
                          )}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="text-sm font-medium text-white">
                                {option.label}
                              </div>
                              <p className="mt-1 text-sm text-slate-400">
                                {option.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "size-2.5 rounded-full",
                                  option.id === "midnight"
                                    ? "bg-slate-300"
                                    : option.id === "ember"
                                      ? "bg-orange-400"
                                      : "bg-cyan-300",
                                )}
                              />
                              <span
                                className={cn(
                                  "size-2.5 rounded-full",
                                  active ? "bg-white" : "bg-white/30",
                                )}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="card-border w-full">
            <div className="card flex flex-col gap-6 p-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                  <Eye className="size-4 text-cyan-300" />
                  Privacy
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Manage your account data and sensitive actions.
                </p>
              </div>

              <div className="grid gap-3">
                <button
                  type="button"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 p-4 text-left transition-all duration-200 hover:border-white/20"
                >
                  <div>
                    <div className="text-sm font-medium text-white">
                      Download account data
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Export profile, activity, and interview records.
                    </p>
                  </div>
                  <Download className="size-4 text-cyan-300" />
                </button>

                <button
                  type="button"
                  className="flex items-center justify-between rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-left transition-all duration-200 hover:bg-rose-500/15"
                >
                  <div>
                    <div className="text-sm font-medium text-white">
                      Delete account
                    </div>
                    <p className="mt-1 text-sm text-rose-200/80">
                      Permanently remove your profile and data.
                    </p>
                  </div>
                  <Trash2 className="size-4 text-rose-300" />
                </button>
              </div>
            </div>
          </section>

          <section className="card-border w-full">
            <div className="card flex flex-col gap-4 p-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                  <Monitor className="size-4 text-cyan-300" />
                  Session overview
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Quick glance at the current state of this settings profile.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-xl bg-white/3 px-4 py-3">
                  <span>Avatar connected</span>
                  <span
                    className={cn(
                      "font-medium",
                      avatarUrl ? "text-emerald-300" : "text-amber-300",
                    )}
                  >
                    {avatarUrl ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/3 px-4 py-3">
                  <span>Security ready</span>
                  <span
                    className={cn(
                      "font-medium",
                      toggles.twoFactor ? "text-emerald-300" : "text-amber-300",
                    )}
                  >
                    {toggles.twoFactor ? "Enabled" : "Review"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/3 px-4 py-3">
                  <span>Notification coverage</span>
                  <span className="font-medium text-cyan-300">
                    {
                      [
                        toggles.emailNotifications,
                        toggles.pushNotifications,
                        toggles.weeklyReports,
                      ].filter(Boolean).length
                    }
                    /3
                  </span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <section className="card-border w-full">
        <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-white">
              Save your changes when you are done.
            </div>
            <p className="mt-1 text-sm text-slate-400">{savedState}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="h-11 border-white/10 bg-white/5 px-5 text-white hover:bg-white/10"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              className="h-11 bg-cyan-500 px-5 text-slate-950 hover:bg-cyan-400"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsClient;
