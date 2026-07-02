import { redirect } from "next/navigation";

import ProfileEditor from "@/components/ProfileEditor";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up");

  return <ProfileEditor user={user} />;
};

export default Page;
