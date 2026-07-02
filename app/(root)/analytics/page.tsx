import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up");

  return (
    <section className="flex flex-col gap-4 mt-8">
      <h2>Performance Analytics</h2>
      <p>
        This dashboard area can surface interview trends, scores, and growth
        over time.
      </p>
    </section>
  );
};

export default Page;
