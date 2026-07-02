"use client";

import { useRouter } from "next/navigation";

import { signOut } from "@/lib/actions/auth.action";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/sign-up");
    router.refresh();
  };

  return (
    <button type="button" className="btn-secondary" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
