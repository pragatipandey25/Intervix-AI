import dayjs from "dayjs";
import Link from "next/link";
import {
  FileSearch,
  MessageSquareText,
  PlayCircle,
  Sparkles,
  Trophy,
  ShieldCheck,
  Clock3,
  CalendarDays,
  Target,
  BrainCircuit,
} from "lucide-react";
import { redirect } from "next/navigation";

import DashboardHistoryTable from "@/components/DashboardHistoryTable";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import DashboardReminderCard from "@/components/DashboardReminderCard";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up");

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id, limit: 6 }),
  ]);

  const recentInterviews = await Promise.all(
    (userInterviews ?? []).slice(0, 5).map(async (interview) => {
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user.id,
      });

      return {
        ...interview,
        feedback,
      };
    }),
  );

  const totalInterviews = userInterviews?.length ?? 0;
  const scoredInterviews = recentInterviews.filter((item) => item.feedback);
  const averageScore = scoredInterviews.length
    ? Math.round(
        scoredInterviews.reduce(
          (sum, item) => sum + (item.feedback?.totalScore ?? 0),
          0,
        ) / scoredInterviews.length,
      )
    : 0;
  const successRate = totalInterviews
    ? Math.round((scoredInterviews.length / totalInterviews) * 100)
    : 0;
  const practiceHours = totalInterviews ? Math.round(totalInterviews * 1.8) : 0;
  const memberSince = user.createdAt
    ? dayjs(user.createdAt).format("MMM YYYY")
    : "Joined recently";

  const reminderTimes = [
    "Today · 6:00 PM",
    "Tomorrow · 9:30 AM",
    "Fri · 4:00 PM",
  ];
  const reminders = (latestInterviews ?? [])
    .slice(0, 3)
    .map((interview, index) => ({
      title: `${interview.role} prep reminder`,
      time: reminderTimes[index] || reminderTimes[0],
      detail: `Review ${interview.techstack.slice(0, 3).join(", ")} and rehearse concise answers.`,
    }));

  const historyRows = recentInterviews.map((interview) => ({
    id: interview.id,
    role: interview.role,
    type: interview.type,
    date: dayjs(interview.feedback?.createdAt || interview.createdAt).format(
      "MMM D, YYYY",
    ),
    score: interview.feedback
      ? `${interview.feedback.totalScore}/100`
      : "Pending",
    status: interview.feedback ? "Completed" : "In Progress",
  }));

  const recommendedQuestions = [
    {
      title: "Behavioral",
      question:
        "Tell me about a time you had to learn something difficult quickly.",
    },
    {
      title: "System Design",
      question: "How would you design a scalable notification service?",
    },
    {
      title: "Frontend",
      question: "How do you optimize a React app for performance at scale?",
    },
    {
      title: "Leadership",
      question: "How do you handle disagreement with a product manager?",
    },
  ];

  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <DashboardSidebar
        user={user}
        totalInterviews={totalInterviews}
        averageScore={averageScore}
        active="dashboard"
      />

      <main className="flex flex-col gap-8">
        <section className="card-border w-full overflow-hidden">
          <div className="card relative flex flex-col gap-6 overflow-hidden p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-light-100/70">
                <Sparkles className="size-3.5 text-primary-200" />
                AI Interview Dashboard
              </div>

              <h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] leading-tight text-primary-100">
                {greeting}, {user.name}. Your interview training is on track.
              </h2>

              <p className="mt-3 max-w-2xl text-lg text-light-100/80">
                Track performance, review recent interviews, and keep your
                preparation moving with a premium interview workspace.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="btn-primary rounded-full px-5">
                  <Link href="/interview">
                    <PlayCircle className="size-4" />
                    Start Interview
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/practice-questions">
                    <MessageSquareText className="size-4" />
                    Practice Questions
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/resume-analysis">
                    <FileSearch className="size-4" />
                    Resume Analysis
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)] lg:block">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-200 text-dark-100">
                  <Trophy className="size-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-light-100/60">
                    Focus Area
                  </p>
                  <p className="text-sm text-primary-100">
                    Keep practicing structured answers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardMetricCard
            label="Total Interviews"
            value={`${totalInterviews}`}
            description="Completed and in-progress sessions"
            icon={Trophy}
          />
          <DashboardMetricCard
            label="Average Score"
            value={`${averageScore}%`}
            description="From your scored interview feedback"
            icon={ShieldCheck}
          />
          <DashboardMetricCard
            label="Success Rate"
            value={`${successRate}%`}
            description="Interviews with completed feedback"
            icon={Target}
          />
          <DashboardMetricCard
            label="Practice Hours"
            value={`${practiceHours}h`}
            description="Estimated focused practice time"
            icon={Clock3}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
          <DashboardHistoryTable rows={historyRows} />

          <div className="flex flex-col gap-6">
            <DashboardReminderCard reminders={reminders} />

            <div className="card-border w-full">
              <div className="card flex flex-col gap-5 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                    Performance
                  </p>
                  <h3 className="mt-1 text-primary-100">Score trend</h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-44 items-end gap-2">
                    {[34, 45, 52, 61, 58, 72, 84].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-2xl bg-white/6 p-1"
                      >
                        <div
                          className="w-full rounded-t-2xl bg-linear-to-t from-primary-200 to-white/80 transition-all duration-500"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-light-100/60">
                    <span>Last 7 sessions</span>
                    <span>Projection based on recent feedback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="card-border w-full">
            <div className="card flex flex-col gap-5 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                  Recommended Questions
                </p>
                <h3 className="mt-1 text-primary-100">
                  Questions to practice next
                </h3>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {recommendedQuestions.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/8"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-light-100/60">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-primary-100">
                      {item.question}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-border w-full">
            <div className="card flex flex-col gap-5 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                  Account Snapshot
                </p>
                <h3 className="mt-1 text-primary-100">Profile summary</h3>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-light-100/75">Role</span>
                  <span className="text-sm font-medium text-primary-100">
                    {user.role || "AI Interview Candidate"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-light-100/75">Country</span>
                  <span className="text-sm font-medium text-primary-100">
                    {user.country || "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-light-100/75">Time Zone</span>
                  <span className="text-sm font-medium text-primary-100">
                    {user.timeZone || "UTC"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-light-100/75">
                    Member Since
                  </span>
                  <span className="text-sm font-medium text-primary-100">
                    {memberSince}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
