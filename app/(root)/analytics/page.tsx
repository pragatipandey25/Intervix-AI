import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getUserFeedbacks,
} from "@/lib/actions/general.action";
import AnalyticsClient from "@/components/AnalyticsClient";

export const metadata = {
  title: "Performance Analytics | Intervix AI",
  description: "Track candidate performance metrics, skill breakdowns, and interview readiness.",
};

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [interviews, feedbacks] = await Promise.all([
    getInterviewsByUserId(user.id),
    getUserFeedbacks(user.id),
  ]);

  return (
    <section className="mt-6">
      <AnalyticsClient
        user={user}
        interviews={interviews || []}
        feedbacks={feedbacks || []}
      />
    </section>
  );
};

export default Page;
