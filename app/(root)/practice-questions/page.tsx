import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import PracticeQuestionsClient from "@/components/PracticeQuestionsClient";

export const metadata = {
  title: "Practice Questions | Intervix AI",
  description: "Targeted interview practice drills for Frontend, Backend, System Design, Behavioral, and DSA.",
};

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <section className="mt-6">
      <PracticeQuestionsClient user={user} />
    </section>
  );
};

export default Page;
