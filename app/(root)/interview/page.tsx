import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import InterviewGeneratorForm from "@/components/InterviewGeneratorForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

export const metadata = {
  title: "Generate AI Interview | Intervix AI",
  description: "Configure role, level, and tech stack to generate tailored AI mock interview questions.",
};

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <section className="flex flex-col gap-8 mt-6 pb-12">
      <div className="flex flex-col gap-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary-200/10 border border-primary-200/20 text-primary-200 text-xs font-semibold uppercase tracking-wider mx-auto">
          <Sparkles className="size-3.5" />
          <span>AI Interview Studio</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100">
          Create Your Custom Mock Interview
        </h1>
        <p className="text-sm md:text-base text-light-100/70">
          Tailor interview questions to your target job, experience level, and tech stack. Practice with interactive voice or text and receive comprehensive AI feedback.
        </p>
      </div>

      <InterviewGeneratorForm user={user} />
    </section>
  );
};

export default Page;
