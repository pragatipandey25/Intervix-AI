import Link from "next/link";
import { redirect } from "next/navigation";
import { FileSearch, Sparkles } from "lucide-react";

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
              <FileSearch className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                Resume Tools
              </p>
              <h2 className="text-3xl text-primary-100">Resume Analysis</h2>
            </div>
          </div>

          <p>
            Upload your resume to get interview-aligned feedback, keyword gaps,
            and suggested improvements.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="btn-primary rounded-full px-5">
              <Link href="/profile">
                <Sparkles className="size-4" />
                Review Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
