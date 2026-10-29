import { Toaster } from "sonner";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Intervix AI",
  description: "AI-powered interview interaction platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased pattern font-sans">
        {children}

        <Toaster />
      </body>
    </html>
  );
}
