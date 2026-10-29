import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import ResumeAnalysisClient from "@/components/ResumeAnalysisClient";

export const metadata = {
  title: "Resume Analysis | Intervix AI",
  description: "AI-powered resume ATS scoring, keyword gap analysis, and tailored interview question extraction.",
};

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <section className="mt-6">
      <ResumeAnalysisClient user={user} />
    </section>
  );
};

export default Page;
