import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import AccountMenu from "@/components/AccountMenu";
import Footer from "@/components/Footer";
import NavbarNav from "@/components/NavbarNav";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="root-layout flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-4 py-4 max-sm:flex-col max-sm:items-start border-b border-white/5 mb-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.svg"
            alt="Intervix Logo"
            width={38}
            height={32}
            className="h-auto w-auto"
          />
          <h2 className="text-xl font-bold text-primary-100">IntervixAI</h2>
        </Link>

        {/* Center Navigation Links */}
        <NavbarNav />

        {/* Account Menu */}
        <div className="shrink-0">
          <AccountMenu
            name={user.name}
            email={user.email}
            avatarUrl={user.avatarUrl}
          />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
