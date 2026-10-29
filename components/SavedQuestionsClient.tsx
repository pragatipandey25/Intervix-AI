"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  Filter,
  Copy,
  Check,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Tag,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuestionItem {
  id: string;
  category: "Frontend" | "Backend" | "System Design" | "Behavioral" | "Algorithms";
  difficulty: "Junior" | "Mid" | "Senior";
  title: string;
  expectedPoints: string[];
  whyAsk: string;
  isCustom?: boolean;
}

const DEFAULT_QUESTIONS: QuestionItem[] = [
  {
    id: "q-1",
    category: "Frontend",
    difficulty: "Mid",
    title: "How does React Fiber differ from the previous stack reconciler?",
    expectedPoints: [
      "Incremental rendering: breaking work into chunks and pausing/resuming work across animation frames.",
      "Priority assignment to updates (e.g. user input gets higher priority than data fetching).",
      "Two-phase processing: render/reconciliation (pure, interruptible) and commit phase (DOM mutations, uninterruptible).",
    ],
    whyAsk: "Assesses deep knowledge of React rendering internals beyond superficial hook usage.",
  },
  {
    id: "q-2",
    category: "System Design",
    difficulty: "Senior",
    title: "Design a distributed rate limiter that handles 100k requests/second.",
    expectedPoints: [
      "Token bucket or Sliding Window Counter algorithm.",
      "Redis cluster with Lua scripts for atomic increments to avoid race conditions.",
      "Local in-memory tier (Guava/memory cache) with batching to minimize Redis network hops.",
      "Graceful degradation when the rate limiter itself is degraded (fail-open vs fail-closed).",
    ],
    whyAsk: "Tests concurrency, low-latency caching, atomic transactions, and fault tolerance at scale.",
  },
  {
    id: "q-3",
    category: "Backend",
    difficulty: "Mid",
    title: "How do you mitigate connection pool exhaustion in high-traffic Node.js or PostgreSQL services?",
    expectedPoints: [
      "Deploy connection poolers such as PgBouncer in transaction-pooling mode.",
      "Enforce aggressive query timeouts and keep transactions minimal in duration.",
      "Leverage read replicas to offload read-heavy reporting queries.",
      "Implement circuit breakers and backpressure on the API gateway layer.",
    ],
    whyAsk: "Crucial for preventing database bottlenecks from taking down the application tier.",
  },
  {
    id: "q-4",
    category: "Behavioral",
    difficulty: "Senior",
    title: "Describe a situation where you had to push back on a critical product requirement with leadership.",
    expectedPoints: [
      "Used the STAR method (Situation, Task, Action, Result).",
      "Quantified the risk with metrics (e.g. security vulnerability, tech debt multiplier, latency degradation).",
      "Offered viable phased alternatives rather than an outright 'no'.",
      "Demonstrated empathy for business milestones while safeguarding system integrity.",
    ],
    whyAsk: "Measures executive communication, strategic trade-off evaluation, and engineering maturity.",
  },
  {
    id: "q-5",
    category: "Frontend",
    difficulty: "Junior",
    title: "What is the difference between client-side routing and server-side navigation?",
    expectedPoints: [
      "Client routing intercepts link clicks and updates history API without full page reloads.",
      "Faster transitions and preserved component state.",
      "Server routing re-requests HTML and assets from scratch for every page boundary.",
    ],
    whyAsk: "Basic web fundamental test for Single Page Applications vs Multi Page Applications.",
  },
  {
    id: "q-6",
    category: "Algorithms",
    difficulty: "Mid",
    title: "How do you detect a cycle in a singly linked list in O(1) space?",
    expectedPoints: [
      "Floyd's Cycle Finding Algorithm (Tortoise and Hare).",
      "Slow pointer moves 1 step; Fast pointer moves 2 steps.",
      "If slow and fast pointers meet, a cycle exists. If fast reaches null, no cycle.",
    ],
    whyAsk: "Evaluates two-pointer technique and spatial complexity optimization.",
  },
];

export default function SavedQuestionsClient({ user }: { user: User }) {
  const [questions, setQuestions] = useState<QuestionItem[]>(DEFAULT_QUESTIONS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New question form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<QuestionItem["category"]>("Frontend");
  const [newDifficulty, setNewDifficulty] = useState<QuestionItem["difficulty"]>("Mid");
  const [newExpected, setNewExpected] = useState("");
  const [newWhyAsk, setNewWhyAsk] = useState("");

  // Load user saved questions from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`saved_questions_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load saved questions:", e);
    }
  }, [user.id]);

  const saveToStorage = (updated: QuestionItem[]) => {
    setQuestions(updated);
    try {
      localStorage.setItem(`saved_questions_${user.id}`, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write failed:", e);
    }
  };

  const handleCopy = (q: QuestionItem) => {
    const text = `${q.title}\n\nKey Concepts:\n${q.expectedPoints.map((p) => `- ${p}`).join("\n")}\n\nWhy Interviewers Ask This:\n${q.whyAsk}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    toast.success("Question & notes copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a question title.");
      return;
    }

    const newQ: QuestionItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      expectedPoints: newExpected
        ? newExpected.split("\n").filter(Boolean)
        : ["Clear articulation of core concepts", "Practical examples and trade-offs"],
      whyAsk: newWhyAsk || "Targeted practice question.",
      isCustom: true,
    };

    const updated = [newQ, ...questions];
    saveToStorage(updated);
    toast.success("Question saved to your library!");
    setShowAddModal(false);
    setNewTitle("");
    setNewExpected("");
    setNewWhyAsk("");
  };

  const handleDelete = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    saveToStorage(updated);
    toast.info("Question removed from saved library.");
  };

  const categories = ["All", "Frontend", "Backend", "System Design", "Behavioral", "Algorithms"];
  const difficulties = ["All", "Junior", "Mid", "Senior"];

  const filtered = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase()) ||
      q.whyAsk.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || q.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === "All" || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-200/10 text-primary-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Bookmark className="size-3.5" /> Saved Question Bank
          </div>
          <h1 className="text-3xl font-bold text-primary-100">
            Interview Question Library
          </h1>
          <p className="text-sm text-light-100/70 mt-1">
            Bookmark key interview questions, review model answers, and drill targeted prompts before your next interview.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 rounded-xl"
        >
          <Plus className="size-4" /> Add Custom Question
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-border w-full">
        <div className="card p-5 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-light-100/50" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, keyword, or concept..."
              className="pl-9 bg-dark-100 border-white/10"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  selectedCategory === cat
                    ? "bg-primary-200 text-dark-100 font-semibold border-primary-200"
                    : "border-white/10 bg-white/5 text-light-100/70 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-primary-200" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-dark-100 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-light-100 focus:outline-none"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-dark-200">
                  {d === "All" ? "All Levels" : d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((q) => (
          <div key={q.id} className="card-border w-full flex flex-col">
            <div className="card p-6 flex flex-col gap-4 flex-1 justify-between">
              <div className="flex flex-col gap-3">
                {/* Meta Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-primary-200/20 text-primary-200 font-semibold border border-primary-200/30">
                      {q.category}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-light-100/80 border border-white/10">
                      {q.difficulty}
                    </span>
                    {q.isCustom && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                        Custom
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(q)}
                      title="Copy question & notes"
                      className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 text-light-100/70 hover:text-light-100 transition-all"
                    >
                      {copiedId === q.id ? (
                        <Check className="size-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>

                    {q.isCustom && (
                      <button
                        onClick={() => handleDelete(q.id)}
                        title="Delete question"
                        className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-rose-500/30 text-light-100/70 hover:text-rose-400 transition-all"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-primary-100 leading-snug">
                  {q.title}
                </h3>

                {/* Expected Points */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-light-100/60">
                    Key Points to Cover:
                  </p>
                  <ul className="flex flex-col gap-1 text-xs text-light-100/80">
                    {q.expectedPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary-200 mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Why interviewers ask this */}
                <div className="p-3 rounded-xl bg-dark-100 border border-white/5 text-xs text-light-100/70">
                  <span className="font-semibold text-primary-200">Interviewer Intent: </span>
                  {q.whyAsk}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-light-100/50">Ready to test yourself?</span>
                <Button asChild className="btn-primary h-8 px-4 text-xs rounded-lg">
                  <Link href="/interview">
                    <Sparkles className="size-3.5 mr-1.5" /> Practice in Mock
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center flex flex-col items-center justify-center gap-3">
            <BookOpen className="size-10 text-light-100/30" />
            <p className="text-light-100/70 text-sm">
              No questions found matching your search and filters.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSelectedDifficulty("All");
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Add Custom Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="card-border w-full max-w-lg">
            <div className="card p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary-100 flex items-center gap-2">
                  <Plus className="size-5 text-primary-200" /> Add Custom Question
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-light-100/60 hover:text-light-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddQuestion} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-light-100">Question Title</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Explain how the Event Loop works in Node.js"
                    className="bg-dark-100 border-white/10 text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-light-100">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="bg-dark-100 border border-white/10 rounded-lg p-2 text-xs text-light-100"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="System Design">System Design</option>
                      <option value="Behavioral">Behavioral</option>
                      <option value="Algorithms">Algorithms</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-light-100">Difficulty</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as any)}
                      className="bg-dark-100 border border-white/10 rounded-lg p-2 text-xs text-light-100"
                    >
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid-Level</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-light-100">
                    Key Points to Cover (One per line)
                  </label>
                  <textarea
                    value={newExpected}
                    onChange={(e) => setNewExpected(e.target.value)}
                    placeholder="Call stack, Callback queue, Microtask queue..."
                    className="w-full min-h-20 p-2.5 rounded-lg bg-dark-100 border border-white/10 text-xs text-light-100"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-light-100">
                    Interviewer Intent / Notes
                  </label>
                  <Input
                    value={newWhyAsk}
                    onChange={(e) => setNewWhyAsk(e.target.value)}
                    placeholder="Tests concurrency and async execution model."
                    className="bg-dark-100 border-white/10 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary text-xs">
                    Save to Bank
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
