import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import SavedQuestionsClient from "@/components/SavedQuestionsClient";

export const metadata = {
  title: "Saved Questions | Intervix AI",
  description: "Browse, bookmark, and review essential tech and behavioral interview questions.",
};

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <section className="mt-6">
      <SavedQuestionsClient user={user} />
    </section>
  );
};

export default Page;
