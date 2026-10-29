import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Sparkles,
  MessageSquareText,
  FileSearch,
  Bookmark,
  History,
  BarChart3,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (allInterview?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Hero CTA */}
      <section className="card-cta">
        <div className="flex flex-col gap-5 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-200/10 text-primary-200 text-xs font-semibold uppercase tracking-wider w-fit">
            <Sparkles className="size-3.5" /> Next-Gen AI Preparation
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-100">
            Get Interview-Ready with AI-Powered Practice & Feedback
          </h1>
          <p className="text-base text-light-100/80 leading-relaxed">
            Practice real technical & behavioral interview questions tailored to your exact role, experience level, and tech stack. Receive structured evaluations to land your dream job.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild className="btn-primary max-sm:w-full rounded-xl px-6 py-6 font-semibold shadow-lg">
              <Link href="/interview" className="flex items-center gap-2">
                <Sparkles className="size-4" />
                <span>Start New Interview</span>
              </Link>
            </Button>

            <Button asChild variant="secondary" className="max-sm:w-full rounded-xl px-5 py-6">
              <Link href="/practice-questions" className="flex items-center gap-2">
                <MessageSquareText className="size-4 text-primary-200" />
                <span>Practice Drills</span>
              </Link>
            </Button>
          </div>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          loading="eager"
          className="max-sm:hidden h-auto w-auto drop-shadow-2xl"
        />
      </section>

      {/* Quick Feature Shortcuts */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/interview"
          className="card-border group hover:border-primary-200/40 transition-all"
        >
          <div className="card p-5 flex flex-col gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-200/10 text-primary-200 group-hover:bg-primary-200 group-hover:text-dark-100 transition-all">
              <Sparkles className="size-5" />
            </div>
            <h4 className="font-semibold text-primary-100 text-sm mt-1">AI Mock Interview</h4>
            <p className="text-xs text-light-100/60">Generate role-specific interviews with voice & text.</p>
          </div>
        </Link>

        <Link
          href="/practice-questions"
          className="card-border group hover:border-primary-200/40 transition-all"
        >
          <div className="card p-5 flex flex-col gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-200/10 text-primary-200 group-hover:bg-primary-200 group-hover:text-dark-100 transition-all">
              <MessageSquareText className="size-5" />
            </div>
            <h4 className="font-semibold text-primary-100 text-sm mt-1">Topic Drills</h4>
            <p className="text-xs text-light-100/60">Frontend, Backend, System Design, and Behavioral.</p>
          </div>
        </Link>

        <Link
          href="/resume-analysis"
          className="card-border group hover:border-primary-200/40 transition-all"
        >
          <div className="card p-5 flex flex-col gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-200/10 text-primary-200 group-hover:bg-primary-200 group-hover:text-dark-100 transition-all">
              <FileSearch className="size-5" />
            </div>
            <h4 className="font-semibold text-primary-100 text-sm mt-1">Resume Scanner</h4>
            <p className="text-xs text-light-100/60">ATS scoring, missing keywords, and custom questions.</p>
          </div>
        </Link>

        <Link
          href="/saved-questions"
          className="card-border group hover:border-primary-200/40 transition-all"
        >
          <div className="card p-5 flex flex-col gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-200/10 text-primary-200 group-hover:bg-primary-200 group-hover:text-dark-100 transition-all">
              <Bookmark className="size-5" />
            </div>
            <h4 className="font-semibold text-primary-100 text-sm mt-1">Question Bank</h4>
            <p className="text-xs text-light-100/60">Curated questions, model answers, and custom notes.</p>
          </div>
        </Link>
      </section>

      {/* Your Interviews Section */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-100">Your Interviews</h2>
            <p className="text-xs text-light-100/60 mt-0.5">Your created & completed practice sessions.</p>
          </div>
          {hasPastInterviews && (
            <Link
              href="/interview/history"
              className="text-xs text-primary-200 hover:underline flex items-center gap-1"
            >
              <span>View History</span>
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="card-border w-full">
              <div className="card p-8 flex flex-col items-center justify-center text-center gap-3">
                <Sparkles className="size-8 text-primary-200" />
                <p className="text-sm text-light-100/80 font-medium">You haven&apos;t taken any interviews yet.</p>
                <p className="text-xs text-light-100/60 max-w-sm">
                  Create a custom interview or pick one of the recommended practice interviews below to begin!
                </p>
                <Button asChild className="btn-primary mt-2 rounded-xl text-xs">
                  <Link href="/interview">Create Your First Interview</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Practice Interviews Section */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold text-primary-100">Recommended Practice Interviews</h2>
          <p className="text-xs text-light-100/60 mt-0.5">Explore popular interviews across tech stacks and roles.</p>
        </div>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p className="text-sm text-light-100/60">There are no interviews available.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
