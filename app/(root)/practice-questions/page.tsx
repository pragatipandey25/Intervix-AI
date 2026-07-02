import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquareText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up");

  return (
    <section className="mt-8 flex flex-col gap-8">
      <div className="card-border w-full">
        <div className="card flex flex-col gap-6 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary-200 text-dark-100">
              <MessageSquareText className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                Practice Mode
              </p>
              <h2 className="text-3xl text-primary-100">Practice Questions</h2>
            </div>
          </div>

          <p>
            Use this space to drill behavioral, technical, and system design
            prompts before your next interview.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="btn-primary rounded-full px-5">
              <Link href="/interview">
                <Sparkles className="size-4" />
                Start Practice Session
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
