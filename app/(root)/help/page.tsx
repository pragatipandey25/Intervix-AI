"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type HelpArticle = {
  id: string;
  title: string;
  category:
    | "Getting Started"
    | "Account"
    | "Billing"
    | "Interviews"
    | "Troubleshooting";
  keywords: string[];
  summary: string;
};

type Announcement = {
  id: string;
  title: string;
  date: string;
  badge?: string;
  body: string;
};

type FaqItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

const helpArticles: HelpArticle[] = [
  {
    id: "getting-started-01",
    title: "How to start your first mock interview",
    category: "Getting Started",
    keywords: ["first", "mock", "interview", "start", "practice"],
    summary: "A quick checklist to run your first session in under 5 minutes.",
  },
  {
    id: "account-01",
    title: "Updating your profile & preferences",
    category: "Account",
    keywords: ["profile", "preferences", "settings", "avatar"],
    summary: "Learn how to update your name, email, and interview preferences.",
  },
  {
    id: "interviews-01",
    title: "How to export interview history",
    category: "Interviews",
    keywords: ["export", "history", "download", "transcript"],
    summary: "Find your previous sessions and download/share relevant details.",
  },
  {
    id: "troubleshooting-01",
    title: "Resolving audio / microphone issues",
    category: "Troubleshooting",
    keywords: ["audio", "microphone", "permission", "browser"],
    summary:
      "Common fixes for microphone permissions and input device selection.",
  },
  {
    id: "billing-01",
    title: "Understanding subscription billing",
    category: "Billing",
    keywords: ["subscription", "billing", "plan", "invoice"],
    summary: "An overview of plans, invoices, and how billing cycles work.",
  },
];

const announcements: Announcement[] = [
  {
    id: "a-01",
    title: "New: Report a bug form + status updates",
    date: "Jun 18, 2026",
    badge: "Release",
    body: "File a bug report from the Help Center. We’ll use your details to reproduce and resolve issues faster.",
  },
  {
    id: "a-02",
    title: "Performance improvements to session playback",
    date: "May 30, 2026",
    badge: "Update",
    body: "Interview history loading is faster and transcript rendering has been optimized.",
  },
  {
    id: "a-03",
    title: "FAQ expansion: more onboarding answers",
    date: "Apr 12, 2026",
    badge: "FAQ",
    body: "We added common questions for setup, permissions, and first-session tips.",
  },
];

const faqs: FaqItem[] = [
  {
    id: "f-01",
    question: "Do I need to download anything?",
    answer: (
      <p>
        No. IntervixAI runs in your browser. You may need to allow microphone
        permissions for voice-based features.
      </p>
    ),
  },
  {
    id: "f-02",
    question: "How do I change my interview settings?",
    answer: (
      <p>
        Go to <span className="font-semibold">Settings</span> and update your
        preferences. Your next session will use the latest configuration.
      </p>
    ),
  },
  {
    id: "f-03",
    question: "Why is my microphone not working?",
    answer: (
      <ul className="list-disc ml-5">
        <li>Check browser permissions for the microphone.</li>
        <li>Verify the correct input device is selected.</li>
        <li>Try refreshing the page and restarting the session.</li>
      </ul>
    ),
  },
  {
    id: "f-04",
    question: "Can I request new features?",
    answer: (
      <p>
        Yes—use the <span className="font-semibold">Feature request</span> form
        below. Include examples and what outcome you want.
      </p>
    ),
  },
];

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function useFilteredArticles() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<
    HelpArticle["category"] | "All"
  >("All");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return helpArticles.filter((a) => {
      const matchesCategory =
        category === "All" ? true : a.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [a.title, a.category, a.summary, ...a.keywords]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category]);

  return { query, setQuery, category, setCategory, filtered };
}

function Accordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = React.useState<string | null>(
    items[0]?.id ?? null,
  );

  return (
    <div
      className="flex flex-col gap-3"
      role="region"
      aria-label="Frequently asked questions"
    >
      {items.map((it) => {
        const isOpen = it.id === openId;
        return (
          <div
            key={it.id}
            className={cn(
              "rounded-2xl border border-border/60 bg-card/70",
              "p-4",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
              "transition-colors",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : it.id)}
              className="w-full text-left flex items-center justify-between gap-4"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-primary-100">
                {it.question}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex items-center justify-center",
                  "size-8 rounded-full",
                  "bg-dark-200/60 border border-border/40",
                  "text-light-100",
                  "transition-transform",
                  isOpen ? "rotate-45" : "rotate-0",
                )}
              >
                +
              </span>
            </button>

            {isOpen ? (
              <div className="mt-3 text-light-100/95">{it.answer}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function HelpSupportPage() {
  const { query, setQuery, category, setCategory, filtered } =
    useFilteredArticles();

  const [bug, setBug] = React.useState({
    name: "",
    email: "",
    productArea: "Interviews" as
      | "Interviews"
      | "Login"
      | "Settings"
      | "Billing"
      | "Other",
    steps: "",
    expected: "",
    actual: "",
  });
  const [feature, setFeature] = React.useState({
    name: "",
    email: "",
    title: "",
    details: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  });

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function onBugSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bug.name.trim()) return toast.error("Please enter your name.");
    if (!validateEmail(bug.email))
      return toast.error("Please enter a valid email.");
    if (!bug.steps.trim())
      return toast.error("Please describe the steps to reproduce.");
    if (!bug.actual.trim())
      return toast.error("Please include what actually happened.");

    toast.success(
      "Bug report submitted successfully! Our engineering team will review it shortly.",
    );
    setBug({
      name: "",
      email: "",
      productArea: "Interviews",
      steps: "",
      expected: "",
      actual: "",
    });
  }

  function onFeatureSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feature.name.trim()) return toast.error("Please enter your name.");
    if (!validateEmail(feature.email))
      return toast.error("Please enter a valid email.");
    if (!feature.title.trim())
      return toast.error("Please provide a feature title.");
    if (!feature.details.trim())
      return toast.error("Please describe your feature request.");

    toast.success(
      "Feature request submitted! Thank you for helping us improve Intervix AI.",
    );
    setFeature({
      name: "",
      email: "",
      title: "",
      details: "",
      priority: "Medium",
    });
  }

  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatMsg, setChatMsg] = React.useState("");

  function onSendChat() {
    const msg = chatMsg.trim();
    if (!msg) return;
    toast.success("Message sent! Our support team will respond shortly.");
    setChatMsg("");
  }

  return (
    <div className="flex flex-col gap-8 mt-10">
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl font-semibold text-primary-100">
          Help & Support
        </h2>
        <p className="text-light-100/95 max-w-3xl">
          Search answers, browse documentation, watch tutorials, or contact
          support. Designed for a fast, dark dashboard experience.
        </p>
      </header>

      {/* Top grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-border">
          <div className="card p-6 h-full">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-primary-100">
                    Search help articles
                  </h3>
                  <p className="text-light-100 mt-1">
                    Find answers instantly using keywords and categories.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="help-search">Search</Label>
                  <Input
                    id="help-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. microphone, transcript, billing…"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="help-category">Category</Label>
                  <select
                    id="help-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="bg-dark-200/60 border border-input rounded-full min-h-12 px-5 text-light-100 outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="All">All</option>
                    <option value="Getting Started">Getting Started</option>
                    <option value="Account">Account</option>
                    <option value="Billing">Billing</option>
                    <option value="Interviews">Interviews</option>
                    <option value="Troubleshooting">Troubleshooting</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-light-100 text-sm">
                  Showing{" "}
                  <span className="font-semibold">{filtered.length}</span>{" "}
                  result{filtered.length === 1 ? "" : "s"}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                >
                  Reset
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {filtered.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl border border-border/60 bg-card/70 p-4 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-primary-100">
                        {a.title}
                      </p>
                      <span className="text-xs px-3 py-1 rounded-full bg-dark-200/60 border border-border/40 text-light-100">
                        {a.category}
                      </span>
                    </div>
                    <p className="text-light-100/95">{a.summary}</p>
                    <div className="flex gap-3 items-center">
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.message(
                            "Article reference copied to clipboard.",
                          );
                        }}
                        className="text-sm text-primary-100/90 underline underline-offset-4 hover:text-primary-100"
                      >
                        Read article
                      </Link>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-border/60 bg-card/70 p-6 text-light-100">
                    No articles match your search. Try different keywords.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="card-border">
          <div className="card p-6 h-full flex flex-col gap-4">
            <h3 className="text-2xl font-semibold text-primary-100">
              Contact support
            </h3>
            <p className="text-light-100/95">
              Get help from our team. Use live chat for quick questions or send
              an email for detailed requests.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={() => setChatOpen(true)}
                className="min-h-12"
              >
                Live chat
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  window.location.href =
                    "mailto:pragatipandey454@gmail.com?subject=Help%20Support";
                }}
              >
                Email support
              </Button>
            </div>

            <div className="rounded-2xl border border-border/60 bg-dark-200/30 p-4">
              <p className="text-sm text-light-100/90">
                <span className="font-semibold text-primary-100">
                  Support hours:
                </span>{" "}
                Mon–Fri, 9am–6pm (UTC)
              </p>
              <p className="text-sm text-light-100/90 mt-2">
                <span className="font-semibold text-primary-100">
                  Typical response:
                </span>{" "}
                within 24 hours
              </p>
            </div>

            {chatOpen ? (
              <div className="rounded-2xl border border-border/60 bg-card/70 p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary-100">
                      Live Support Chat
                    </p>
                    <p className="text-sm text-light-100/90">
                      We’ll show a toast when you send a message.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setChatOpen(false)}
                  >
                    Close
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    placeholder="Type your message…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSendChat();
                    }}
                  />
                  <Button type="button" onClick={onSendChat}>
                    Send
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* FAQ + docs/video */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-border lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-2xl font-semibold text-primary-100">FAQ</h3>
            <p className="text-light-100 mt-1">
              Quick answers to common questions.
            </p>
            <div className="mt-4">
              <Accordion items={faqs} />
            </div>
          </div>
        </div>

        <div className="card-border lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h3 className="text-2xl font-semibold text-primary-100">
                Documentation & Tutorials
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    toast.message("Documentation reference loaded.")
                  }
                >
                  Browse all
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
                <p className="font-semibold text-primary-100">Documentation</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {[
                    "Getting started",
                    "Interview workflow",
                    "Transcripts",
                    "Account & settings",
                    "Troubleshooting",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-light-100">{t}</span>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.message("Opening documentation guide.");
                        }}
                        className="text-sm text-primary-100/90 underline underline-offset-4 hover:text-primary-100"
                      >
                        Open
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
                <p className="font-semibold text-primary-100">
                  Video tutorials
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {[
                    { title: "First interview in 5 minutes", duration: "6:42" },
                    { title: "Perfecting your answers", duration: "9:18" },
                    {
                      title: "Fixing microphone permissions",
                      duration: "4:55",
                    },
                  ].map((v) => (
                    <div
                      key={v.title}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex flex-col">
                        <span className="text-light-100 font-medium">
                          {v.title}
                        </span>
                        <span className="text-xs text-light-100/70">
                          {v.duration}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        type="button"
                        onClick={() =>
                          toast.message(
                            "Opening interactive tutorial.",
                          )
                        }
                      >
                        Watch
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-dark-200/30 p-4 flex flex-col gap-2">
              <p className="font-semibold text-primary-100">Need help fast?</p>
              <p className="text-light-100/95">
                Use live chat for real-time guidance, or submit your issue via
                the bug/feature forms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bug + Feature */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-border">
          <div className="card p-6">
            <h3 className="text-2xl font-semibold text-primary-100">
              Report a bug
            </h3>
            <p className="text-light-100 mt-1">
              Help us reproduce and fix issues quickly.
            </p>

            <form onSubmit={onBugSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bug-name">Name</Label>
                  <Input
                    id="bug-name"
                    value={bug.name}
                    onChange={(e) =>
                      setBug((s) => ({ ...s, name: e.target.value }))
                    }
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bug-email">Email</Label>
                  <Input
                    id="bug-email"
                    value={bug.email}
                    onChange={(e) =>
                      setBug((s) => ({ ...s, email: e.target.value }))
                    }
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="bug-area">Product area</Label>
                <select
                  id="bug-area"
                  value={bug.productArea}
                  onChange={(e) =>
                    setBug((s) => ({
                      ...s,
                      productArea: e.target.value as any,
                    }))
                  }
                  className="bg-dark-200/60 border border-input rounded-full min-h-12 px-5 text-light-100 outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Interviews">Interviews</option>
                  <option value="Login">Login</option>
                  <option value="Settings">Settings</option>
                  <option value="Billing">Billing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="bug-steps">Steps to reproduce</Label>
                <Textarea
                  id="bug-steps"
                  value={bug.steps}
                  onChange={(e) =>
                    setBug((s) => ({ ...s, steps: e.target.value }))
                  }
                  placeholder="1) … 2) … 3) …"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="bug-expected">Expected result</Label>
                <Textarea
                  id="bug-expected"
                  value={bug.expected}
                  onChange={(e) =>
                    setBug((s) => ({ ...s, expected: e.target.value }))
                  }
                  placeholder="What did you expect to happen?"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="bug-actual">Actual result</Label>
                <Textarea
                  id="bug-actual"
                  value={bug.actual}
                  onChange={(e) =>
                    setBug((s) => ({ ...s, actual: e.target.value }))
                  }
                  placeholder="What happened instead?"
                />
              </div>

              <Button type="submit" className="mt-2">
                Submit bug report
              </Button>
            </form>
          </div>
        </div>

        <div className="card-border">
          <div className="card p-6">
            <h3 className="text-2xl font-semibold text-primary-100">
              Feature request
            </h3>
            <p className="text-light-100 mt-1">
              Tell us what you want to build next.
            </p>

            <form
              onSubmit={onFeatureSubmit}
              className="mt-6 flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="feat-name">Name</Label>
                  <Input
                    id="feat-name"
                    value={feature.name}
                    onChange={(e) =>
                      setFeature((s) => ({ ...s, name: e.target.value }))
                    }
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="feat-email">Email</Label>
                  <Input
                    id="feat-email"
                    value={feature.email}
                    onChange={(e) =>
                      setFeature((s) => ({ ...s, email: e.target.value }))
                    }
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="feat-title">Feature title</Label>
                <Input
                  id="feat-title"
                  value={feature.title}
                  onChange={(e) =>
                    setFeature((s) => ({ ...s, title: e.target.value }))
                  }
                  placeholder="e.g. Add export to PDF"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="feat-priority">Priority</Label>
                <select
                  id="feat-priority"
                  value={feature.priority}
                  onChange={(e) =>
                    setFeature((s) => ({
                      ...s,
                      priority: e.target.value as any,
                    }))
                  }
                  className="bg-dark-200/60 border border-input rounded-full min-h-12 px-5 text-light-100 outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="feat-details">Details</Label>
                <Textarea
                  id="feat-details"
                  value={feature.details}
                  onChange={(e) =>
                    setFeature((s) => ({ ...s, details: e.target.value }))
                  }
                  placeholder="Describe the user problem, desired behavior, and any examples."
                />
              </div>

              <Button type="submit" className="mt-2">
                Submit feature request
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="card-border">
        <div className="card p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-2xl font-semibold text-primary-100">
              Recent announcements
            </h3>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                toast.message("You are up to date with the latest platform release.")
              }
            >
              View all
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-border/60 bg-card/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-dark-200/60 border border-border/40 text-light-100">
                    {a.badge ?? "Update"}
                  </span>
                  <span className="text-xs text-light-100/70">{a.date}</span>
                </div>
                <p className="font-semibold text-primary-100 mt-3">{a.title}</p>
                <p className="text-light-100/95 mt-2 text-sm">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email + quick links */}
      <section className="card-border">
        <div className="card p-6 flex flex-col gap-4">
          <h3 className="text-2xl font-semibold text-primary-100">
            Still stuck?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
              <p className="font-semibold text-primary-100">Email support</p>
              <p className="text-light-100/95 mt-2 text-sm">
                support@intervixai.com
              </p>
              <Button
                type="button"
                variant="secondary"
                className="mt-3"
                onClick={() => {
                  window.location.href =
                    "mailto:support@intervixai.com?subject=Help%20Support";
                }}
              >
                Compose email
              </Button>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
              <p className="font-semibold text-primary-100">Documentation</p>
              <p className="text-light-100/95 mt-2 text-sm">
                Search onboarding and workflow guides.
              </p>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toast.message("Opening Intervix API & Platform docs.");
                }}
                className="text-primary-100/90 underline underline-offset-4 hover:text-primary-100 mt-3 inline-block"
              >
                Open docs
              </Link>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
              <p className="font-semibold text-primary-100">Live chat</p>
              <p className="text-light-100/95 mt-2 text-sm">
                Ask a question and get real-time help.
              </p>
              <Button
                type="button"
                className="mt-3"
                onClick={() => setChatOpen(true)}
              >
                Start chat
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
