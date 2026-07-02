import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import AccountMenu from "@/components/AccountMenu";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up");

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="MockMate Logo"
            width={38}
            height={32}
            className="h-auto w-auto"
          />
          <h2 className="text-primary-100">IntervixAI</h2>
        </Link>

        <AccountMenu
          name={user.name}
          email={user.email}
          avatarUrl={user.avatarUrl}
        />
      </nav>

      {children}
    </div>
  );
};

export default Layout;
