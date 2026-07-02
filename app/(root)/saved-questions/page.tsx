import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up");

  return (
    <section className="flex flex-col gap-4 mt-8">
      <h2>Saved Questions</h2>
      <p>
        Your saved questions library will live here. You can wire this page to
        your question-saving flow later.
      </p>
    </section>
  );
};

export default Page;
