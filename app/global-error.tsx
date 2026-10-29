"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#020408] text-white flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="p-8 rounded-2xl border border-white/10 bg-[#27282f] max-w-md flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-[#dddfff]">Something went wrong</h2>
          <p className="text-sm text-slate-300">
            An unexpected error occurred. You can retry the operation.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#cac5fe] text-black font-semibold text-sm hover:opacity-90 transition-all"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
