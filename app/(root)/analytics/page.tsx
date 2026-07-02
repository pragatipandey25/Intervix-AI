import { redirect } from "next/navigation";
import {
  BarChart3,
  Download,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up");

  // Placeholder values until the backend provides real analytics.
  const overallInterviewScore = 86;
  const communicationScore = 88;
  const technicalKnowledgeScore = 82;
  const problemSolvingScore = 85;
  const confidenceScore = 84;
  const leadershipScore = 79;

  const weeklyProgressPercent = 12; // +12% week-over-week
  const monthlyProgressPercent = 7; // +7% month-over-month

  const skills = [
    {
      key: "communication",
      title: "Communication",
      value: communicationScore,
      description: "Clarity, structure, and responsiveness.",
    },
    {
      key: "technical",
      title: "Technical Knowledge",
      value: technicalKnowledgeScore,
      description: "Depth of concepts and accuracy.",
    },
    {
      key: "problem",
      title: "Problem Solving",
      value: problemSolvingScore,
      description: "Approach, tradeoffs, and reasoning.",
    },
    {
      key: "confidence",
      title: "Confidence",
      value: confidenceScore,
      description: "Staying composed and answering decisively.",
    },
    {
      key: "leadership",
      title: "Leadership",
      value: leadershipScore,
      description: "Ownership, collaboration, and direction.",
    },
  ];

  return (
    <section className="flex flex-col gap-8 mt-8">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 max-lg:flex-col max-lg:items-start">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <BarChart3 className="size-5 text-primary-200" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate">Performance Analytics</h2>
              <p className="mt-1 text-light-100/75">
                Track your interview performance across skills and time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="rounded-full"
              disabled
              aria-disabled="true"
              title="Export is a placeholder until real data is wired."
            >
              <Download className="mr-2 size-4" />
              Export report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card-border w-full lg:col-span-2">
            <div className="card flex flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                    Overall Interview Score
                  </p>
                  <h3 className="mt-2 text-5xl font-semibold text-primary-100">
                    {overallInterviewScore}%
                  </h3>
                  <p className="mt-2 text-light-100/75">
                    Based on the latest interview feedback across skills.
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                    <Trophy className="size-4 text-primary-200" />
                    <span className="text-sm font-medium text-primary-100">
                      Strong Performance
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-light-100/70">
                    <ShieldCheck className="size-4 text-success-100" />
                    Consistency + structured responses
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                    Weekly Progress
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-primary-100">
                    +{weeklyProgressPercent}%
                  </p>
                  <p className="mt-2 text-sm text-light-100/75">
                    Improved clarity and problem breakdown.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                    Monthly Progress
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-primary-100">
                    +{monthlyProgressPercent}%
                  </p>
                  <p className="mt-2 text-sm text-light-100/75">
                    Stronger technical accuracy over time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-border w-full">
            <div className="card flex flex-col gap-4 p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary-200" />
                <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                  AI Insights
                </p>
              </div>
              <p className="text-sm text-light-100/80">
                Your top strength is technical reasoning. Next gains will come
                from increasing confidence during ambiguity.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                  Focus for this week
                </p>
                <p className="mt-2 text-sm font-medium text-primary-100">
                  Answer with a 3-step structure: Plan → Approach → Tradeoffs
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardMetricCard
          label="Communication"
          value={`${communicationScore}%`}
          description="Clarity & responsiveness"
          icon={Sparkles}
        />
        <DashboardMetricCard
          label="Technical"
          value={`${technicalKnowledgeScore}%`}
          description="Accuracy & depth"
          icon={BarChart3}
        />
        <DashboardMetricCard
          label="Confidence"
          value={`${confidenceScore}%`}
          description="Composure under questions"
          icon={Trophy}
        />
      </section>

      {/* Charts placeholders */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-border w-full lg:col-span-1">
          <div className="card p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                Weekly Progress
              </p>
              <h3 className="mt-2 text-primary-100">Chart placeholder</h3>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-light-100/75 min-h-40 flex items-center justify-center">
              Weekly Progress chart will be rendered here.
            </div>
          </div>
        </div>

        <div className="card-border w-full lg:col-span-1">
          <div className="card p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                Monthly Progress
              </p>
              <h3 className="mt-2 text-primary-100">Chart placeholder</h3>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-light-100/75 min-h-40 flex items-center justify-center">
              Monthly Progress chart will be rendered here.
            </div>
          </div>
        </div>

        <div className="card-border w-full lg:col-span-1">
          <div className="card p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                Skill Breakdown
              </p>
              <h3 className="mt-2 text-primary-100">Chart placeholder</h3>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-light-100/75 min-h-40 flex items-center justify-center">
              Skill Breakdown (radar/bar) chart will be rendered here.
            </div>
          </div>
        </div>
      </section>

      {/* Skills section */}
      <section className="card-border w-full">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-4 max-lg:flex-col max-lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                Skills
              </p>
              <h3 className="mt-2 text-primary-100">Your skill profile</h3>
              <p className="mt-2 text-light-100/75">
                Scores reflect your AI feedback across the most recent
                interview.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-primary-100">{skill.title}</p>
                  <p className="text-sm font-semibold text-primary-200">
                    {skill.value}%
                  </p>
                </div>
                <p className="mt-2 text-sm text-light-100/75">
                  {skill.description}
                </p>

                <div className="mt-4">
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-primary-200 rounded-full"
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-light-100/60">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-generated feedback */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-border w-full lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                  AI-generated feedback
                </p>
                <h3 className="mt-2 text-primary-100">What went well</h3>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                <Sparkles className="size-4 text-primary-200" />
                <span className="text-sm font-medium text-primary-100">
                  Auto summary
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-primary-100">
                  Communication
                </p>
                <p className="mt-2 text-light-100/75 text-sm">
                  You consistently introduced your plan before diving into
                  details. This reduced ambiguity and improved the interviewer’s
                  confidence.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-primary-100">
                  Technical Knowledge
                </p>
                <p className="mt-2 text-light-100/75 text-sm">
                  Your explanations were accurate and included relevant
                  tradeoffs. You also used examples to validate reasoning.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-primary-100">
                  Problem Solving
                </p>
                <p className="mt-2 text-light-100/75 text-sm">
                  You decomposed the problem logically and checked constraints
                  early. Next step: highlight alternatives explicitly.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-primary-100">
                  Confidence
                </p>
                <p className="mt-2 text-light-100/75 text-sm">
                  You recovered well when asked follow-ups. Keep practicing
                  concise summaries to maintain momentum.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-border w-full">
          <div className="card p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                Key takeaway
              </p>
              <h3 className="mt-2 text-primary-100">Next best improvement</h3>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-light-100/80">
                Focus on leadership clarity: end answers by summarizing the
                decision and how it impacts the system.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-success-100">
                <span className="h-2 w-2 rounded-full bg-success-100" />
                Actionable + measurable practice plan
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                Suggested time
              </p>
              <p className="mt-2 text-2xl font-semibold text-primary-100">
                20 minutes/day
              </p>
              <p className="mt-2 text-sm text-light-100/75">
                For the next 7 days, practice structured answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Improvement recommendations */}
      <section className="card-border w-full">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-4 max-lg:flex-col max-lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                Improvement recommendations
              </p>
              <h3 className="mt-2 text-primary-100">
                Targeted actions to raise your score
              </h3>
              <p className="mt-2 text-light-100/75">
                Recommendations are based on the skill gaps most likely to
                improve your overall interview performance.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-medium text-primary-100">
                1) Add explicit tradeoffs
              </p>
              <p className="mt-2 text-sm text-light-100/75">
                When proposing a solution, include 1–2 alternatives and why you
                chose the final approach.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-medium text-primary-100">
                2) Strengthen leadership wrap-up
              </p>
              <p className="mt-2 text-sm text-light-100/75">
                End with a 2-sentence summary: decision + impact on system
                behavior.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-medium text-primary-100">
                3) Confidence via concise structure
              </p>
              <p className="mt-2 text-sm text-light-100/75">
                Use a repeatable answer format: Plan → Approach → Tradeoffs.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-medium text-primary-100">
                4) Validate assumptions early
              </p>
              <p className="mt-2 text-sm text-light-100/75">
                Ask 1 clarifying question before committing to implementation
                details.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                Suggested practice
              </p>
              <p className="mt-2 text-sm text-light-100/75">
                Take 3 practice questions and apply the structured wrap-up on
                each response.
              </p>
            </div>
            <Button className="rounded-full" variant="default" disabled>
              Start recommended practice
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Page;
