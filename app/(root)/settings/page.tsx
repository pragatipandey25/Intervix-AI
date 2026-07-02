import { redirect } from "next/navigation";

import SettingsClient from "@/components/SettingsClient";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up");

  return <SettingsClient user={user} />;
};

export default Page;
