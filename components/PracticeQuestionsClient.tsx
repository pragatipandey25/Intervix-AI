"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquareText,
  Sparkles,
  Code2,
  Database,
  Network,
  Users,
  Binary,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Track {
  id: string;
  title: string;
  icon: any;
  description: string;
  recommendedRole: string;
  recommendedTechs: string[];
  questions: {
    q: string;
    level: string;
    hint: string;
    answerOutline: string[];
  }[];
}

const TRACKS: Track[] = [
  {
    id: "frontend",
    title: "Frontend Mastery",
    icon: Code2,
    description: "Deep dive into React, state architecture, rendering optimization, and modern web standards.",
    recommendedRole: "Frontend Developer",
    recommendedTechs: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    questions: [
      {
        q: "How does React manage component re-renders, and when should you reach for useMemo vs useCallback?",
        level: "Mid",
        hint: "Think about reference equality of props and expensive calculations vs micro-optimizations.",
        answerOutline: [
          "React re-renders when state or props change, cascading to children by default.",
          "useMemo caches computed values across renders when dependency array items don't mutate.",
          "useCallback memoizes function instance references to prevent breaking React.memo on child components.",
          "Avoid premature optimization; profiling with React DevTools is always step one.",
        ],
      },
      {
        q: "What are Core Web Vitals (LCP, INP, CLS) and how do you diagnose and fix poor scores?",
        level: "Senior",
        hint: "Discuss image priority, layout shifts without dimensions, and main-thread blocking scripts.",
        answerOutline: [
          "Largest Contentful Paint (LCP): Preload hero images, optimize server response time (TTFB), CDN caching.",
          "Interaction to Next Paint (INP): Break long tasks into microtasks (requestIdleCallback), debounce inputs.",
          "Cumulative Layout Shift (CLS): Explicit width/height on media, reserve layout space for ads/dynamic slots.",
        ],
      },
    ],
  },
  {
    id: "backend",
    title: "Backend & Systems",
    icon: Database,
    description: "High-throughput APIs, database indexing, caching strategies, and resilient transactions.",
    recommendedRole: "Backend Engineer",
    recommendedTechs: ["Node.js", "Python", "PostgreSQL", "Redis", "Docker"],
    questions: [
      {
        q: "How do you handle race conditions during high-volume inventory reservations or payment checkouts?",
        level: "Senior",
        hint: "Discuss pessimistic vs optimistic locking, database transaction isolation levels, and idempotency keys.",
        answerOutline: [
          "Optimistic locking using version columns (UPDATE ... WHERE id = x AND version = v).",
          "Pessimistic locking with SELECT ... FOR UPDATE when contention is extremely high.",
          "Distributed locks in Redis (Redlock) or atomic decrement operations (DECRBY) with rollback queue.",
          "Enforce idempotency keys with unique database constraints to prevent double charges.",
        ],
      },
      {
        q: "Explain database indexing internals and when composite index column order matters.",
        level: "Mid",
        hint: "Leftmost prefix rule in B-Tree indexes.",
        answerOutline: [
          "B-Trees maintain sorted balance for O(log n) lookups, range scans, and sorting.",
          "Leftmost prefix rule: An index on (A, B, C) can satisfy queries on (A), (A, B), and (A, B, C), but not (B, C) alone.",
          "Place equality filter columns first and range filter columns last in composite indexes.",
        ],
      },
    ],
  },
  {
    id: "system-design",
    title: "System Design",
    icon: Network,
    description: "Architecting large-scale distributed systems, load balancing, sharding, and fault tolerance.",
    recommendedRole: "System Architect",
    recommendedTechs: ["System Design", "AWS", "Kafka", "Redis", "Docker"],
    questions: [
      {
        q: "Design a notification service supporting push notifications, SMS, and email with rate limits.",
        level: "Senior",
        hint: "Decouple delivery workers via message queues, prioritize critical alerts, and deduplicate.",
        answerOutline: [
          "API Gateway routes notification requests and validates user preferences.",
          "Kafka or RabbitMQ topics partitioned by notification priority (Transactional vs Promotional).",
          "Worker consumers with exponential backoff retry policies and Dead Letter Queues (DLQ).",
          "Redis sliding-window rate limiters per recipient to avoid spamming users.",
        ],
      },
    ],
  },
  {
    id: "behavioral",
    title: "Behavioral & Leadership",
    icon: Users,
    description: "Master the STAR method for cultural fit, executive communication, and resolving friction.",
    recommendedRole: "Engineering Team Lead",
    recommendedTechs: ["Agile", "Mentorship", "Architecture"],
    questions: [
      {
        q: "Tell me about a time when you strongly disagreed with an architectural decision made by leadership.",
        level: "Lead",
        hint: "Disagree and commit: present data, suggest proof-of-concept, and commit once decided.",
        answerOutline: [
          "Situation: Leadership wanted to adopt a shiny new database that lacked production maturity.",
          "Action: Built a rapid benchmark measuring latency and recovery time under failure; presented objective metrics.",
          "Result: The team selected the proven alternative, saving weeks of migration headaches.",
          "Takeaway: Ground disagreements in data and user impact, not personal ego.",
        ],
      },
    ],
  },
  {
    id: "algorithms",
    title: "DSA & Coding Patterns",
    icon: Binary,
    description: "Algorithmic thinking, time/space trade-offs, two pointers, graphs, and dynamic programming.",
    recommendedRole: "Full Stack Engineer",
    recommendedTechs: ["TypeScript", "Python"],
    questions: [
      {
        q: "How do you identify whether a coding problem requires Dynamic Programming versus Greedy approach?",
        level: "Mid",
        hint: "Overlapping subproblems + optimal substructure vs greedy choice property.",
        answerOutline: [
          "Greedy works when a locally optimal choice guarantees the globally optimal solution (e.g. Dijkstra, Huffman coding).",
          "Dynamic Programming is required when current choices depend on previous subproblem outcomes (overlapping subproblems).",
          "Top-down (memoization) vs Bottom-up (tabulation) trade-offs in call stack recursion depth.",
        ],
      },
    ],
  },
];

export default function PracticeQuestionsClient({ user }: { user: User }) {
  const [activeTrack, setActiveTrack] = useState<string>("frontend");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const currentTrack = TRACKS.find((t) => t.id === activeTrack) || TRACKS[0];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-16">
      {/* Hero */}
      <div className="card-border w-full">
        <div className="card flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-200/20 text-primary-200 border border-primary-200/30">
              <MessageSquareText className="size-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-light-100/60 font-semibold">
                Focused Practice Drills
              </p>
              <h1 className="text-3xl font-bold text-primary-100 mt-1">
                Interactive Practice Arena
              </h1>
              <p className="text-sm text-light-100/70 mt-1 max-w-xl">
                Drill high-yield interview questions across key engineering domains. Review hints, explore model answers, and launch targeted mock interview sessions.
              </p>
            </div>
          </div>

          <Button asChild className="btn-primary rounded-xl px-6 py-6 font-semibold shrink-0">
            <Link href="/interview">
              <Sparkles className="size-4 mr-2" /> Start Custom Interview
            </Link>
          </Button>
        </div>
      </div>

      {/* Track Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TRACKS.map((track) => {
          const Icon = track.icon;
          const isActive = activeTrack === track.id;
          return (
            <button
              key={track.id}
              onClick={() => {
                setActiveTrack(track.id);
                setExpandedIndex(0);
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary-200 text-dark-100 font-semibold border-primary-200 shadow-md"
                  : "bg-dark-200 border-white/10 text-light-100/70 hover:border-white/20 hover:text-light-100"
              }`}
            >
              <Icon className="size-4" />
              <span>{track.title}</span>
            </button>
          );
        })}
      </div>

      {/* Track Header & Quick Launch */}
      <div className="card-border w-full">
        <div className="card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary-100 flex items-center gap-2">
              {currentTrack.title}
            </h2>
            <p className="text-xs md:text-sm text-light-100/70 mt-1">
              {currentTrack.description}
            </p>
          </div>

          <Button asChild className="btn-primary text-xs rounded-xl h-10 px-4 shrink-0">
            <Link href={`/interview`}>
              <PlayCircle className="size-4 mr-1.5" />
              <span>Practice {currentTrack.recommendedRole}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Drill Questions Accordion */}
      <div className="flex flex-col gap-4">
        {currentTrack.questions.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div key={idx} className="card-border w-full">
              <div className="card p-6 flex flex-col gap-4">
                {/* Header row */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-200/20 text-primary-200 font-mono text-xs font-bold border border-primary-200/30 mt-0.5">
                      Q{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-100 leading-snug">
                        {item.q}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/5 text-light-100/70 border border-white/10">
                          {item.level} Level
                        </span>
                        <span className="text-xs text-primary-200/90 flex items-center gap-1">
                          <Lightbulb className="size-3" /> Click to view guidance
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="p-1.5 rounded-lg border border-white/10 text-light-100/60 hover:text-light-100">
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-4 border-t border-white/10 flex flex-col gap-4 animate-fadeIn">
                    <div className="p-3.5 rounded-xl bg-primary-200/5 border border-primary-200/20 text-xs text-light-100/80">
                      <span className="font-semibold text-primary-200">
                        Interviewer Hint:{" "}
                      </span>
                      {item.hint}
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-xs uppercase tracking-wider text-light-100/60 font-semibold">
                        Recommended Model Response Structure:
                      </p>
                      <ul className="flex flex-col gap-2 text-xs md:text-sm text-light-100/85">
                        {item.answerOutline.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5">
                            <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button asChild className="btn-primary text-xs h-9 rounded-lg">
                        <Link href="/interview">
                          <span>Practice Answer in Mock Room</span>
                          <ArrowRight className="size-3.5 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
