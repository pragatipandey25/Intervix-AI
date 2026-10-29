"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center gap-3">
      <h2 className="text-2xl font-bold text-primary-100">Something went wrong</h2>
      <p className="text-sm text-light-100/70 max-w-md">
        An error occurred while loading this section.
      </p>
      <Button
        onClick={() => reset()}
        className="btn-primary mt-2 rounded-xl text-xs px-5"
      >
        Try Again
      </Button>
    </div>
  );
}
