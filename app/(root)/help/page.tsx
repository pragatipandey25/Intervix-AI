import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up");

  return (
    <section className="flex flex-col gap-4 mt-8">
      <h2>Help &amp; Support</h2>
      <p>
        Add your support contact, docs links, or FAQ content here so users can
        get help quickly.
      </p>
    </section>
  );
};

export default Page;
