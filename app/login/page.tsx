import { redirect } from "next/navigation";

import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return <AuthForm type="sign-in" />;
};

export default Page;
