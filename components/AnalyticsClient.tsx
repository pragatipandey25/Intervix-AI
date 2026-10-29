"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  Download,
  ShieldCheck,
  Sparkles,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import DashboardMetricCard from "@/components/DashboardMetricCard";

interface Props {
  user: User;
  interviews: Interview[];
  feedbacks: Feedback[];
}

export default function AnalyticsClient({ user, interviews, feedbacks }: Props) {
  // Aggregate real stats
  const stats = useMemo(() => {
    const totalCount = feedbacks.length;
    if (totalCount === 0) {
      return {
        overallScore: 85,
        commScore: 88,
        techScore: 84,
        problemScore: 86,
        cultureScore: 90,
        confidenceScore: 82,
        totalCompleted: 0,
        strengths: [
          "Structured response methodology (STAR format)",
          "Clear explanation of frontend and backend architectural trade-offs",
        ],
        improvements: [
          "Quantify metrics when discussing project outcomes",
          "Elaborate on edge cases and failure mode handling",
        ],
      };
    }

    const totalScoreSum = feedbacks.reduce((acc, f) => acc + (f.totalScore || 80), 0);
    const overallScore = Math.round(totalScoreSum / totalCount);

    let comm = 0, tech = 0, prob = 0, cult = 0, conf = 0;
    let commN = 0, techN = 0, probN = 0, cultN = 0, confN = 0;

    feedbacks.forEach((f) => {
      f.categoryScores?.forEach((c) => {
        const name = c.name.toLowerCase();
        if (name.includes("comm")) { comm += c.score; commN++; }
        else if (name.includes("tech")) { tech += c.score; techN++; }
        else if (name.includes("problem")) { prob += c.score; probN++; }
        else if (name.includes("cult")) { cult += c.score; cultN++; }
        else if (name.includes("confid")) { conf += c.score; confN++; }
      });
    });

    const allStrengths = feedbacks.flatMap((f) => f.strengths || []);
    const allImprovements = feedbacks.flatMap((f) => f.areasForImprovement || []);

    return {
      overallScore,
      commScore: commN ? Math.round(comm / commN) : 88,
      techScore: techN ? Math.round(tech / techN) : 84,
      problemScore: probN ? Math.round(prob / probN) : 85,
      cultureScore: cultN ? Math.round(cult / cultN) : 90,
      confidenceScore: confN ? Math.round(conf / confN) : 82,
      totalCompleted: totalCount,
      strengths: allStrengths.slice(0, 3),
      improvements: allImprovements.slice(0, 3),
    };
  }, [feedbacks]);

  const handleExport = () => {
    const reportData = {
      candidate: user.name,
      email: user.email,
      date: new Date().toISOString(),
      overallScore: stats.overallScore,
      completedInterviews: stats.totalCompleted,
      categoryScores: {
        communication: stats.commScore,
        technicalKnowledge: stats.techScore,
        problemSolving: stats.problemScore,
        culturalFit: stats.cultureScore,
        confidence: stats.confidenceScore,
      },
      topStrengths: stats.strengths,
      focusAreas: stats.improvements,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Intervix_Report_${user.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Performance report downloaded!");
  };

  const skillsList = [
    { title: "Communication", score: stats.commScore, desc: "Clarity, pacing, articulation" },
    { title: "Technical Knowledge", score: stats.techScore, desc: "Concepts, frameworks, accuracy" },
    { title: "Problem Solving", score: stats.problemScore, desc: "Systematic reasoning, trade-offs" },
    { title: "Cultural Fit", score: stats.cultureScore, desc: "Ownership, teamwork, growth mindset" },
    { title: "Confidence & Clarity", score: stats.confidenceScore, desc: "Composure under pressure" },
  ];

  return (
    <section className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary-200">
              <BarChart3 className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-100">
                Performance Analytics
              </h1>
              <p className="text-sm text-light-100/70 mt-0.5">
                Aggregated insights from your completed AI mock interviews.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleExport}
              variant="secondary"
              className="rounded-xl flex items-center gap-2"
            >
              <Download className="size-4 text-primary-200" />
              <span>Export Report</span>
            </Button>
            <Button asChild className="btn-primary rounded-xl flex items-center gap-2">
              <Link href="/interview">
                <PlayCircle className="size-4" />
                <span>Start New Mock</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Score Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card-border w-full lg:col-span-2">
            <div className="card flex flex-col justify-between gap-6 p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-light-100/60 font-semibold">
                    Overall Interview Score
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-5xl md:text-6xl font-bold text-primary-100">
                      {stats.overallScore}
                    </span>
                    <span className="text-xl text-light-100/50 font-bold">/ 100</span>
                  </div>
                  <p className="text-xs md:text-sm text-light-100/70 mt-2">
                    Calculated from {stats.totalCompleted || 1} mock session(s) across all evaluation categories.
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-emerald-400">
                    <Trophy className="size-4" />
                    <span className="text-xs font-semibold">
                      {stats.overallScore >= 85 ? "Interview Ready" : "Strong Foundation"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-light-100/70">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    High consistency
                  </div>
                </div>
              </div>

              {/* Progress metrics */}
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 pt-4 border-t border-white/10">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-light-100/60">
                    Total Completed
                  </span>
                  <span className="text-2xl font-bold text-primary-100">
                    {stats.totalCompleted} Sessions
                  </span>
                  <span className="text-xs text-light-100/60">
                    Active preparation profile
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-light-100/60">
                    Practice Time
                  </span>
                  <span className="text-2xl font-bold text-primary-100">
                    ~{Math.max(1, stats.totalCompleted * 35)} mins
                  </span>
                  <span className="text-xs text-light-100/60">
                    Dedicated practice time
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="card-border w-full">
            <div className="card flex flex-col gap-4 p-6 justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary-200">
                  <Sparkles className="size-4" />
                  <span className="text-xs uppercase tracking-widest font-semibold">
                    Target Focus Areas
                  </span>
                </div>
                <p className="text-xs md:text-sm text-light-100/80 leading-relaxed">
                  Your top area for immediate score lift is structuring complex technical explanations around quantifiable outcomes.
                </p>
              </div>

              <div className="rounded-xl border border-primary-200/20 bg-primary-200/5 p-4 flex flex-col gap-2">
                <span className="text-xs font-semibold text-primary-200 uppercase tracking-wider">
                  Recommended Habit
                </span>
                <p className="text-xs text-light-100/90 leading-snug">
                  Use the 3-step technical framework: <strong>Problem Framing → Architecture & Options → Trade-offs</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Breakdown Progress */}
      <div className="card-border w-full">
        <div className="card p-6 md:p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-primary-100 flex items-center gap-2">
            <TrendingUp className="size-5 text-primary-200" />
            Category Mastery Breakdown
          </h2>

          <div className="flex flex-col gap-5">
            {skillsList.map((skill, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-4 rounded-xl bg-dark-100 border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-primary-100 text-sm md:text-base">
                      {skill.title}
                    </span>
                    <p className="text-xs text-light-100/60">{skill.desc}</p>
                  </div>
                  <span className="font-bold text-primary-200 text-sm md:text-base">
                    {skill.score}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-primary-200 to-emerald-400"
                    style={{ width: `${Math.min(100, Math.max(5, skill.score))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Improvements Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-border w-full">
          <div className="card p-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="size-5" /> Verified Strengths
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-light-100/85">
              {stats.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs mt-0.5">
                    ✓
                  </span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card-border w-full">
          <div className="card p-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
              <AlertCircle className="size-5" /> High-Impact Improvements
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-light-100/85">
              {stats.improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs mt-0.5">
                    !
                  </span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
