import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Trophy,
  Calendar,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  BarChart2,
} from "lucide-react";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  if (!feedback) {
    return (
      <section className="section-feedback max-w-3xl mx-auto flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary-200/20 text-primary-200 border border-primary-200/30">
          <Sparkles className="size-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-primary-100">No Feedback Recorded Yet</h2>
          <p className="text-light-100/70 max-w-md">
            You haven't completed this interview session yet. Complete the questions to receive an in-depth AI performance analysis.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <Button asChild className="btn-primary px-6 rounded-xl">
            <Link href={`/interview/${id}`}>
              <Sparkles className="size-4 mr-2" /> Start Interview Now
            </Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-xl">
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </section>
    );
  }

  const scoreColor =
    feedback.totalScore >= 85
      ? "text-emerald-400"
      : feedback.totalScore >= 70
        ? "text-primary-200"
        : "text-amber-400";

  return (
    <section className="section-feedback max-w-4xl mx-auto pb-16 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 text-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-200/10 border border-primary-200/20 text-primary-200 text-xs font-semibold uppercase tracking-wider">
          <Trophy className="size-3.5" />
          <span>Evaluation Report</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 capitalize">
          {interview.role} Interview Feedback
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-light-100/80 pt-1">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-200 border border-white/10">
            <Trophy className={`size-4 ${scoreColor}`} />
            <span>Overall Score:</span>
            <span className={`font-bold text-base ${scoreColor}`}>
              {feedback.totalScore}/100
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-200 border border-white/10">
            <Calendar className="size-4 text-primary-200" />
            <span>
              {feedback.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "Recent"}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Assessment */}
      <div className="card-border w-full">
        <div className="card p-6 md:p-8 flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-primary-100 flex items-center gap-2">
            <Sparkles className="size-5 text-primary-200" /> Overall Assessment
          </h3>
          <p className="text-light-100/90 leading-relaxed text-base">
            {feedback.finalAssessment}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card-border w-full">
        <div className="card p-6 md:p-8 flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-primary-100 flex items-center gap-2">
            <BarChart2 className="size-5 text-primary-200" /> Performance Breakdown by Category
          </h3>

          <div className="flex flex-col gap-5">
            {feedback.categoryScores?.map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-4 rounded-xl bg-dark-100 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary-100 text-sm md:text-base">
                    {cat.name}
                  </span>
                  <span className="font-bold text-primary-200 text-sm">
                    {cat.score}/100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-200 to-emerald-400"
                    style={{ width: `${Math.min(100, Math.max(5, cat.score))}%` }}
                  />
                </div>
                <p className="text-xs md:text-sm text-light-100/75 mt-1">
                  {cat.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="card-border w-full">
          <div className="card p-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="size-5" /> Key Strengths
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-light-100/85">
              {feedback.strengths?.map((str, idx) => (
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

        {/* Areas for Improvement */}
        <div className="card-border w-full">
          <div className="card p-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
              <AlertCircle className="size-5" /> Areas for Improvement
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-light-100/85">
              {feedback.areasForImprovement?.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs mt-0.5">
                    !
                  </span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Button asChild variant="secondary" className="px-6 py-6 rounded-xl flex items-center gap-2 text-primary-200">
          <Link href="/">
            <ArrowLeft className="size-4" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>

        <Button asChild className="btn-primary px-8 py-6 rounded-xl flex items-center gap-2 font-semibold">
          <Link href={`/interview/${id}`}>
            <RotateCcw className="size-4" />
            <span>Retake This Interview</span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
