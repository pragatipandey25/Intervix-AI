import dayjs from "dayjs";
import { redirect } from "next/navigation";

import InterviewHistoryClient from "@/components/InterviewHistoryClient";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewsByUserId,
} from "@/lib/actions/general.action";

const companySeeds = [
  "OpenAI",
  "Notion",
  "Vercel",
  "Stripe",
  "Airbnb",
  "Meta",
  "Google",
  "Shopify",
];

const getDerivedCompany = (role: string, techstack: string[]) => {
  const seed = `${role}-${techstack.join("-")}`;
  const hash = Array.from(seed).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return companySeeds[hash % companySeeds.length];
};

const getDerivedDuration = (level: string, score?: number | null) => {
  const baseDuration = level.toLowerCase().includes("senior")
    ? 45
    : level.toLowerCase().includes("mid")
      ? 35
      : 25;

  if (score && score >= 90) {
    return `${baseDuration + 5} min`;
  }

  return `${baseDuration} min`;
};

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up");

  const interviews = await getInterviewsByUserId(user.id);

  const rows = await Promise.all(
    (interviews ?? []).map(async (interview) => {
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user.id,
      });

      const company =
        interview.company ||
        getDerivedCompany(interview.role, interview.techstack);

      return {
        id: interview.id,
        company,
        position: interview.role,
        interviewType: interview.type,
        date: dayjs(feedback?.createdAt || interview.createdAt).format(
          "MMM D, YYYY",
        ),
        duration:
          interview.duration ||
          getDerivedDuration(interview.level, feedback?.totalScore),
        score: feedback?.totalScore ?? null,
        status: feedback
          ? "Completed"
          : interview.finalized
            ? "In Review"
            : "Pending",
        createdAt: feedback?.createdAt || interview.createdAt,
      };
    }),
  );

  return <InterviewHistoryClient user={user} interviews={rows} />;
};

export default Page;
